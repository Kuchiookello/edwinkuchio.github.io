 /* =========================================================
   EKO / EDWIN KUCHIO OKELLO PORTFOLIO
   SUPABASE + ADMIN + STORAGE SYSTEM
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
=========================================================

   IMPORTANT:
   Replace the two values below with your own Supabase
   Project URL and ANON/PUBLIC KEY.

========================================================= */

const SUPABASE_URL =
    "YOUR_SUPABASE_PROJECT_URL";


const SUPABASE_ANON_KEY =
    "YOUR_SUPABASE_ANON_KEY";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );



/* =========================================================
   STORAGE BUCKETS
========================================================= */

const BUCKETS = {

    cv:
        "cv",

    profile:
        "profile",

    pictorial:
        "pictorial",

    eko:
        "eko-projects",

    academic:
        "academic-work",

    portfolio:
        "professional-portfolio"

};



/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        document.getElementById("year").textContent =
            new Date().getFullYear();


        initializeNavigation();

        initializeBackToTop();

        initializeAdminLock();

        initializeModalBehaviour();


        await loadProfile();

        await loadCV();

        await loadGallery();

    }
);



/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");


    if (!menuToggle || !navLinks) return;


    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("active");

        }
    );


    navLinks.querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove("active");

                }
            );

        });

}



/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}



/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

function initializeModalBehaviour() {

    document.querySelectorAll(".modal")
        .forEach(function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (event.target === modal) {

                        modal.classList.remove("active");

                        document.body.style.overflow = "";

                    }

                }
            );

        });


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                document.querySelectorAll(".modal.active")
                    .forEach(function (modal) {

                        modal.classList.remove("active");

                    });

                document.body.style.overflow = "";

            }

        }
    );

}



/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}



/* =========================================================
   ADMIN LOCK
========================================================= */

function initializeAdminLock() {

    const lock =
        document.getElementById("adminLock");

    if (!lock) return;


    lock.addEventListener(
        "click",
        async function () {

            openAdmin();

            await checkExistingSession();

        }
    );

}



function openAdmin() {

    document
        .getElementById("adminPanel")
        .classList.add("active");

    document.body.style.overflow = "hidden";

}



function closeAdmin() {

    document
        .getElementById("adminPanel")
        .classList.remove("active");

    document.body.style.overflow = "";

}



/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const email =
        document
            .getElementById("adminEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("adminPassword")
            .value;


    const message =
        document.getElementById("adminMessage");


    if (!email || !password) {

        showAdminMessage(
            "Please enter your email and password.",
            true
        );

        return;

    }


    showAdminMessage(
        "Signing in...",
        false
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email:
                email,

            password:
                password

        });


    if (error) {

        showAdminMessage(
            error.message,
            true
        );

        return;

    }


    if (data.session) {

        showDashboard();

        showAdminMessage(
            "Administrator login successful.",
            false
        );

    }

}



/* =========================================================
   SESSION CHECK
========================================================= */

async function checkExistingSession() {

    const {
        data
    } =
        await supabaseClient.auth.getSession();


    if (data &&
        data.session) {

        showDashboard();

    }

}



/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    document
        .getElementById("loginArea")
        .style.display = "none";


    document
        .getElementById("adminDashboard")
        .style.display = "block";

}



/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    await supabaseClient.auth.signOut();


    document
        .getElementById("adminDashboard")
        .style.display = "none";


    document
        .getElementById("loginArea")
        .style.display = "block";


    document
        .getElementById("adminPassword")
        .value = "";


    showAdminMessage(
        "You have been signed out.",
        false
    );

}



/* =========================================================
   ADMIN MESSAGE
========================================================= */

function showAdminMessage(
    message,
    error = false
) {

    const element =
        document.getElementById("adminMessage");


    if (!element) return;


    element.textContent =
        message;


    element.className =
        "admin-message " +
        (error
            ? "status-error"
            : "status-success");

}



/* =========================================================
   UPLOAD HELPER
========================================================= */

async function uploadFilesToBucket(
    files,
    bucket,
    statusElement,
    prefix = ""
) {

    if (!files ||
        files.length === 0) {

        setStatus(
            statusElement,
            "Please select at least one file.",
            true
        );

        return [];

    }


    const {
        data: sessionData
    } =
        await supabaseClient.auth.getSession();


    if (!sessionData.session) {

        setStatus(
            statusElement,
            "Administrator login required.",
            true
        );

        return [];

    }


    let uploaded = 0;

    let failed = 0;


    setStatus(
        statusElement,
        `Preparing ${files.length} file(s)...`,
        false
    );


    for (const file of files) {

        try {

            const safeName =
                sanitizeFilename(file.name);


            const timestamp =
                Date.now();


            const random =
                Math.random()
                    .toString(36)
                    .substring(2, 9);


            const path =
                `${prefix}${timestamp}_${random}_${safeName}`;


            const {
                error
            } =
                await supabaseClient.storage
                    .from(bucket)
                    .upload(
                        path,
                        file,
                        {
                            cacheControl:
                                "3600",

                            upsert:
                                false
                        }
                    );


            if (error) {

                console.error(
                    "Upload error:",
                    error
                );

                failed++;

                continue;

            }


            uploaded++;


            setStatus(
                statusElement,
                `Uploaded ${uploaded} of ${files.length} file(s)...`,
                false
            );

        }
        catch (error) {

            console.error(error);

            failed++;

        }

    }


    if (failed === 0) {

        setStatus(
            statusElement,
            `Successfully uploaded ${uploaded} file(s).`,
            false
        );

    }
    else {

        setStatus(
            statusElement,
            `${uploaded} uploaded. ${failed} failed.`,
            true
        );

    }


    return uploaded;

}



/* =========================================================
   SANITIZE FILE NAME
========================================================= */

function sanitizeFilename(
    filename
) {

    return filename
        .normalize("NFKD")
        .replace(
            /[^\w.\- ]+/g,
            ""
        )
        .replace(
            /\s+/g,
            "_"
        );

}



/* =========================================================
   STATUS
========================================================= */

function setStatus(
    elementId,
    message,
    error = false
) {

    const element =
        typeof elementId === "string"
            ? document.getElementById(elementId)
            : elementId;


    if (!element) return;


    element.textContent =
        message;


    element.className =
        "upload-status " +
        (error
            ? "status-error"
            : "status-success");

}



/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const input =
        document.getElementById("cvFile");


    const files =
        input.files;


    if (!files.length) {

        setStatus(
            "cvUploadStatus",
            "Please select a PDF file.",
            true
        );

        return;

    }


    /*
       Delete previous CV first so that the website
       always displays the latest CV.
    */

    const {
        data: oldFiles
    } =
        await supabaseClient.storage
            .from(BUCKETS.cv)
            .list();


    if (oldFiles &&
        oldFiles.length) {

        const paths =
            oldFiles.map(
                file => file.name
            );


        await supabaseClient.storage
            .from(BUCKETS.cv)
            .remove(paths);

    }


    await uploadFilesToBucket(
        files,
        BUCKETS.cv,
        "cvUploadStatus"
    );


    await loadCV();


    input.value = "";

}



/* =========================================================
   PROFILE PICTURE
========================================================= */

async function uploadProfile() {

    const input =
        document.getElementById("profileFile");


    const files =
        input.files;


    if (!files.length) {

        setStatus(
            "profileUploadStatus",
            "Please select an image.",
            true
        );

        return;

    }


    const {
        data: oldFiles
    } =
        await supabaseClient.storage
            .from(BUCKETS.profile)
            .list();


    if (oldFiles &&
        oldFiles.length) {

        const paths =
            oldFiles.map(
                file => file.name
            );


        await supabaseClient.storage
            .from(BUCKETS.profile)
            .remove(paths);

    }


    await uploadFilesToBucket(
        files,
        BUCKETS.profile,
        "profileUploadStatus"
    );


    await loadProfile();


    input.value = "";

}



/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById("pictorialFile");


    const files =
        input.files;


    const uploaded =
        await uploadFilesToBucket(
            files,
            BUCKETS.pictorial,
            "pictorialUploadStatus"
        );


    if (uploaded > 0) {

        await loadGallery();

        input.value = "";

    }

}



/* =========================================================
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    const input =
        document.getElementById(
            "ekoPortfolioFile"
        );


    const files =
        input.files;


    if (!files.length) {

        setStatus(
            "ekoPortfolioUploadStatus",
            "Please select the EKO Portfolio file.",
            true
        );

        return;

    }


    /*
       The EKO portfolio is deliberately stored in the
       SAME eko-projects bucket but gets a special prefix.

       This means you don't need another Supabase bucket.
    */

    const {
        data: oldFiles
    } =
        await supabaseClient.storage
            .from(BUCKETS.eko)
            .list();


    if (oldFiles &&
        oldFiles.length) {

        const portfolioFiles =
            oldFiles
                .filter(
                    file =>
                        file.name.startsWith(
                            "EKO_PORTFOLIO__"
                        )
                )
                .map(
                    file =>
                        file.name
                );


        if (portfolioFiles.length) {

            await supabaseClient.storage
                .from(BUCKETS.eko)
                .remove(
                    portfolioFiles
                );

        }

    }


    await uploadFilesToBucket(
        files,
        BUCKETS.eko,
        "ekoPortfolioUploadStatus",
        "EKO_PORTFOLIO__"
    );


    await loadEKOPortfolio();


    input.value = "";

}



/* =========================================================
   MULTIPLE EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    const input =
        document.getElementById(
            "ekoFile"
        );


    const files =
        input.files;


    const uploaded =
        await uploadFilesToBucket(
            files,
            BUCKETS.eko,
            "ekoUploadStatus",
            "EKO_PROJECT__"
        );


    if (uploaded > 0) {

        await loadEKOProjects();

        input.value = "";

    }

}



/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById(
            "academicFile"
        );


    const files =
        input.files;


    const uploaded =
        await uploadFilesToBucket(
            files,
            BUCKETS.academic,
            "academicUploadStatus",
            "ACADEMIC__"
        );


    if (uploaded > 0) {

        await loadAcademicDocuments();

        input.value = "";

    }

}



/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById(
            "portfolioFile"
        );


    const files =
        input.files;


    const uploaded =
        await uploadFilesToBucket(
            files,
            BUCKETS.portfolio,
            "portfolioUploadStatus",
            "PORTFOLIO__"
        );


    if (uploaded > 0) {

        await loadPortfolioDocuments();

        input.value = "";

    }

}



/* =========================================================
   GET PUBLIC URL
========================================================= */

function getPublicUrl(
    bucket,
    path
) {

    const {
        data
    } =
        supabaseClient.storage
            .from(bucket)
            .getPublicUrl(path);


    return data.publicUrl;

}



/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.profile)
            .list();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return;

    }


    if (!data ||
        !data.length) {

        return;

    }


    const image =
        data[data.length - 1];


    const url =
        getPublicUrl(
            BUCKETS.profile,
            image.name
        );


    const frame =
        document.getElementById(
            "profileFrame"
        );


    if (!frame) return;


    frame.innerHTML = `

        <img
            src="${escapeHtml(url)}"
            alt="Edwin Kuchio Okello profile photograph"
        >

    `;

}



/* =========================================================
   LOAD CV
========================================================= */

async function loadCV() {

    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.cv)
            .list();


    const view =
        document.getElementById(
            "viewCV"
        );


    const download =
        document.getElementById(
            "downloadCV"
        );


    const status =
        document.getElementById(
            "cvStatus"
        );


    if (error) {

        console.error(error);

        if (status)
            status.textContent =
                "CV could not be loaded.";

        return;

    }


    if (!data ||
        !data.length) {

        if (status)
            status.textContent =
                "CV is currently unavailable.";

        return;

    }


    const file =
        data[data.length - 1];


    const url =
        getPublicUrl(
            BUCKETS.cv,
            file.name
        );


    view.href =
        url;


    download.href =
        url;


    view.classList.remove(
        "disabled-link"
    );


    download.classList.remove(
        "disabled-link"
    );


    if (status)
        status.textContent =
            "Current CV available.";

}



/* =========================================================
   LOAD GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById(
            "gallery"
        );


    if (!gallery) return;


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.pictorial)
            .list(
                "",
                {
                    limit: 1000,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


    if (error) {

        console.error(error);

        gallery.innerHTML = `

            <div class="gallery-empty">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load pictorial
                </h3>

                <p>
                    Please check the Supabase bucket configuration.
                </p>

            </div>

        `;

        return;

    }


    const images =
        (data || [])
            .filter(
                file =>
                    /\.(jpg|jpeg|png|gif|webp)$/i
                        .test(file.name)
            );


    if (!images.length) {

        gallery.innerHTML = `

            <div class="gallery-empty">

                <i class="fas fa-images"></i>

                <h3>
                    Your pictorial will appear here
                </h3>

                <p>
                    Images can be added through the administrator area.
                </p>

            </div>

        `;

        return;

    }


    gallery.innerHTML =
        images.map(
            function (image) {

                const url =
                    getPublicUrl(
                        BUCKETS.pictorial,
                        image.name
                    );


                return `

                    <div class="gallery-item">

                        <img
                            src="${escapeHtml(url)}"
                            alt="Portfolio photograph"
                            loading="lazy"
                        >

                    </div>

                `;

            }
        ).join("");

}



/* =========================================================
   LOAD EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        document.getElementById(
            "ekoPortfolioDocument"
        );


    if (!container) return;


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.eko)
            .list(
                "",
                {
                    limit: 1000
                }
            );


    if (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                Unable to load EKO portfolio.

            </div>

        `;

        return;

    }


    const files =
        (data || [])
            .filter(
                file =>
                    file.name.startsWith(
                        "EKO_PORTFOLIO__"
                    )
            );


    if (!files.length) {

        container.innerHTML = `

            <div class="document-placeholder small">

                <i class="fas fa-folder-open"></i>

                <span>
                    EKO Portfolio has not yet been uploaded.
                </span>

            </div>

        `;

        return;

    }


    const latest =
        files[files.length - 1];


    container.innerHTML =
        createDocumentCard(
            BUCKETS.eko,
            latest,
            "EKO Portfolio"
        );

}



/* =========================================================
   LOAD ALL EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        document.getElementById(
            "ekoProjects"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading EKO projects...
            </h3>

        </div>

    `;


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.eko)
            .list(
                "",
                {
                    limit: 1000,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


    if (error) {

        console.error(
            "EKO projects error:",
            error
        );


        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load EKO projects
                </h3>

                <p>
                    Check the eko-projects bucket and its policies.
                </p>

            </div>

        `;

        return;

    }


    const projects =
        (data || [])
            .filter(
                file =>
                    file.name.startsWith(
                        "EKO_PROJECT__"
                    )
            );


    if (!projects.length) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-folder-open"></i>

                <h3>
                    No additional EKO projects yet
                </h3>

                <p>
                    Upload your first project through the Administrator area.
                </p>

            </div>

        `;

        await loadEKOPortfolio();

        return;

    }


    container.innerHTML =
        projects.map(
            function (project, index) {

                return createDocumentCard(
                    BUCKETS.eko,
                    project,
                    `EKO Project ${projects.length - index}`
                );

            }
        ).join("");


    await loadEKOPortfolio();

}



/* =========================================================
   LOAD ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById(
            "academicDocuments"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            Loading academic work...

        </div>

    `;


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.academic)
            .list(
                "",
                {
                    limit: 1000,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


    if (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                Unable to load academic documents.

            </div>

        `;

        return;

    }


    const documents =
        (data || [])
            .filter(
                file =>
                    file.name.startsWith(
                        "ACADEMIC__"
                    )
            );


    if (!documents.length) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-book-open"></i>

                <h3>
                    No academic work uploaded yet
                </h3>

                <p>
                    Academic essays and research papers can be uploaded
                    through the Administrator area.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        documents.map(
            function (document) {

                return createDocumentCard(
                    BUCKETS.academic,
                    document,
                    cleanUploadedName(
                        document.name
                    )
                );

            }
        ).join("");

}



/* =========================================================
   LOAD PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById(
            "portfolioDocuments"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            Loading portfolio materials...

        </div>

    `;


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from(BUCKETS.portfolio)
            .list(
                "",
                {
                    limit: 1000,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


    if (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                Unable to load portfolio materials.

            </div>

        `;

        return;

    }


    const documents =
        (data || [])
            .filter(
                file =>
                    file.name.startsWith(
                        "PORTFOLIO__"
                    )
            );


    if (!documents.length) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-briefcase"></i>

                <h3>
                    No professional materials uploaded yet
                </h3>

                <p>
                    Upload professional documents through
                    the Administrator area.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        documents.map(
            function (document) {

                return createDocumentCard(
                    BUCKETS.portfolio,
                    document,
                    cleanUploadedName(
                        document.name
                    )
                );

            }
        ).join("");

}



/* =========================================================
   DOCUMENT CARD
========================================================= */

function createDocumentCard(
    bucket,
    file,
    customTitle = null
) {

    const url =
        getPublicUrl(
            bucket,
            file.name
        );


    const icon =
        getFileIcon(
            file.name
        );


    const title =
        customTitle ||
        cleanUploadedName(
            file.name
        );


    const size =
        formatFileSize(
            file.metadata?.size
        );


    return `

        <div class="document-card">

            <div class="document-icon">

                <i class="${icon}"></i>

            </div>


            <div class="document-info">

                <h4>
                    ${escapeHtml(title)}
                </h4>

                <span>
                    ${escapeHtml(size)}
                </span>

            </div>


            <div class="document-actions">

                <a
                    href="${escapeHtml(url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open document">

                    <i class="fas fa-eye"></i>

                </a>


                <a
                    href="${escapeHtml(url)}"
                    download
                    title="Download document">

                    <i class="fas fa-download"></i>

                </a>

            </div>

        </div>

    `;

}



/* =========================================================
   CLEAN UPLOADED FILE NAME
========================================================= */

function cleanUploadedName(
    name
) {

    return name

        .replace(
            /^EKO_PROJECT__/,
            ""
        )

        .replace(
            /^EKO_PORTFOLIO__/,
            ""
        )

        .replace(
            /^ACADEMIC__/,
            ""
        )

        .replace(
            /^PORTFOLIO__/,
            ""
        )

        .replace(
            /^\d+_[a-z0-9]+_/i,
            ""
        )

        .replace(
            /_/g,
            " "
        );

}



/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(
    filename
) {

    const extension =
        filename
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf")
        return "fas fa-file-pdf";


    if (
        extension === "doc" ||
        extension === "docx"
    )
        return "fas fa-file-word";


    if (
        extension === "xls" ||
        extension === "xlsx" ||
        extension === "csv"
    )
        return "fas fa-file-excel";


    if (
        extension === "ppt" ||
        extension === "pptx"
    )
        return "fas fa-file-powerpoint";


    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "gif" ||
        extension === "webp"
    )
        return "fas fa-file-image";


    if (extension === "txt")
        return "fas fa-file-lines";


    return "fas fa-file";

}



/* =========================================================
   FILE SIZE
========================================================= */

function formatFileSize(
    bytes
) {

    if (!bytes)
        return "Document";


    const units =
        [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        Math.round(
            bytes /
            Math.pow(1024,index) *
            100
        ) / 100
    ) +
    " " +
    units[index];

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   BACK TO TOP
========================================================= */

function initializeBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );


    if (!button) return;


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 500) {

                button.classList.add(
                    "show"
                );

            }
            else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}



/* =========================================================
   AUTOMATIC REFRESH WHEN EKO MODAL OPENS
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const target =
            event.target.closest(
                "[onclick*='ekoModal']"
            );


        if (target) {

            setTimeout(
                function () {

                    loadEKOProjects();

                },
                300
            );

        }

    }
);



/* =========================================================
   EXPOSE FUNCTIONS TO HTML
========================================================= */

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.openProject01 =
    openProject01;

window.adminLogin =
    adminLogin;

window.adminLogout =
    adminLogout;

window.closeAdmin =
    closeAdmin;

window.uploadCV =
    uploadCV;

window.uploadProfile =
    uploadProfile;

window.uploadPictorial =
    uploadPictorial;

window.uploadEKOPortfolio =
    uploadEKOPortfolio;

window.uploadEKOProjects =
    uploadEKOProjects;

window.uploadAcademicDocuments =
    uploadAcademicDocuments;

window.uploadPortfolioDocuments =
    uploadPortfolioDocuments;

window.loadEKOProjects =
    loadEKOProjects;

window.loadAcademicDocuments =
    loadAcademicDocuments;

window.loadPortfolioDocuments =
    loadPortfolioDocuments;

window.loadEKOPortfolio =
    loadEKOPortfolio;
