 /* =========================================================
   EKO PORTFOLIO — COMPLETE SCRIPT
   Supabase + Admin + Uploads + Project Libraries
========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   2. SUPABASE BUCKET NAMES
   These MUST exactly match your Supabase buckets.
========================================================= */

const BUCKETS = {
    cv: "cv",
    profile: "profile",
    pictorial: "pictorial",
    eko: "eko",
    academic: "academic",
    portfolio: "portfolio"
};


/* =========================================================
   3. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    initializeNavigation();
    initializeBackToTop();
    initializeAdminButton();
    initializeModalSystem();

    document.getElementById("year").textContent =
        new Date().getFullYear();

    await loadProfilePicture();
    await loadCV();
    await loadPictorial();

});


/* =========================================================
   4. NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navLinks.classList.contains("active")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });


    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });

}


/* =========================================================
   5. BACK TO TOP
========================================================= */

function initializeBackToTop() {

    let backToTop = document.getElementById("backToTop");

    /*
       If the HTML button was accidentally removed,
       create it automatically.
    */

    if (!backToTop) {

        backToTop = document.createElement("button");

        backToTop.id = "backToTop";
        backToTop.className = "back-to-top";

        backToTop.innerHTML =
            '<i class="fas fa-arrow-up"></i>';

        backToTop.title = "Back to top";
        backToTop.setAttribute(
            "aria-label",
            "Back to top"
        );

        document.body.appendChild(backToTop);
    }


    function updateBackToTop() {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    updateBackToTop();

}


/* =========================================================
   6. ADMIN BUTTON
========================================================= */

function initializeAdminButton() {

    let adminLock = document.getElementById("adminLock");

    /*
       If admin button is missing from HTML,
       create it automatically.
    */

    if (!adminLock) {

        adminLock = document.createElement("button");

        adminLock.id = "adminLock";
        adminLock.className = "admin-lock";

        adminLock.title = "Administrator";

        adminLock.innerHTML =
            '<i class="fas fa-lock"></i>';

        document.body.appendChild(adminLock);

    }


    adminLock.addEventListener(
        "click",
        openAdmin
    );

}


/* =========================================================
   7. OPEN ADMIN PANEL
========================================================= */

function openAdmin() {

    const panel =
        document.getElementById("adminPanel");

    if (!panel) {

        console.error(
            "adminPanel was not found in the HTML."
        );

        return;

    }

    panel.classList.add("active");

    document.body.classList.add("admin-open");

}


/* =========================================================
   8. CLOSE ADMIN PANEL
========================================================= */

function closeAdmin() {

    const panel =
        document.getElementById("adminPanel");

    if (!panel) return;

    panel.classList.remove("active");

    document.body.classList.remove("admin-open");

}


/* =========================================================
   9. ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    const message =
        document.getElementById("adminMessage");


    if (!email || !password) {

        showAdminMessage(
            "Please enter your administrator email and password.",
            "error"
        );

        return;
    }


    showAdminMessage(
        "Signing in...",
        "loading"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: email,
            password: password

        });


        if (error) {

            throw error;

        }


        if (!data.session) {

            throw new Error(
                "Login succeeded but no active session was returned."
            );

        }


        document.getElementById(
            "loginArea"
        ).style.display = "none";


        document.getElementById(
            "adminDashboard"
        ).style.display = "block";


        showAdminMessage(
            "Administrator access granted.",
            "success"
        );


        await refreshAllLibraries();

    }

    catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        showAdminMessage(
            error.message ||
            "Unable to sign in.",
            "error"
        );

    }

}


/* =========================================================
   10. CHECK EXISTING SESSION
========================================================= */

async function checkAdminSession() {

    try {

        const {
            data
        } = await supabaseClient.auth.getSession();


        if (
            data &&
            data.session
        ) {

            document.getElementById(
                "loginArea"
            ).style.display = "none";


            document.getElementById(
                "adminDashboard"
            ).style.display = "block";

        }

    }

    catch (error) {

        console.error(
            "Session check failed:",
            error
        );

    }

}


/* =========================================================
   11. ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

        document.getElementById(
            "loginArea"
        ).style.display = "block";


        document.getElementById(
            "adminDashboard"
        ).style.display = "none";


        document.getElementById(
            "adminPassword"
        ).value = "";


        showAdminMessage(
            "You have been signed out.",
            "success"
        );

    }

    catch (error) {

        console.error(error);

        showAdminMessage(
            "Unable to sign out.",
            "error"
        );

    }

}


/* =========================================================
   12. ADMIN MESSAGE
========================================================= */

function showAdminMessage(
    text,
    type = "normal"
) {

    const message =
        document.getElementById("adminMessage");

    if (!message) return;

    message.textContent = text;

    message.className =
        "admin-message " + type;

}


/* =========================================================
   13. SECURITY CHECK
========================================================= */

async function requireAdmin() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error || !data.session) {

        showAdminMessage(
            "Please sign in as administrator first.",
            "error"
        );

        return false;

    }

    return true;

}


/* =========================================================
   14. GENERATE UNIQUE FILE PATH
========================================================= */

function generateFilePath(
    bucket,
    file
) {

    const timestamp =
        Date.now();

    const random =
        Math.random()
        .toString(36)
        .substring(2, 10);

    const cleanName =
        file.name
        .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

    return (
        bucket +
        "/" +
        timestamp +
        "_" +
        random +
        "_" +
        cleanName
    );

}


/* =========================================================
   15. UPLOAD GENERIC FILE
========================================================= */

async function uploadFile(
    bucket,
    file
) {

    const path =
        generateFilePath(
            bucket,
            file
        );


    const {
        error
    } =
        await supabaseClient
        .storage
        .from(bucket)
        .upload(
            path,
            file,
            {
                cacheControl: "3600",
                upsert: false
            }
        );


    if (error) {

        throw error;

    }


    return path;

}


/* =========================================================
   16. UPLOAD CV
========================================================= */

async function uploadCV() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById("cvFile");

    const file =
        input.files[0];


    if (!file) {

        showAdminMessage(
            "Please select a PDF CV.",
            "error"
        );

        return;

    }


    if (
        file.type !==
        "application/pdf"
    ) {

        showAdminMessage(
            "The CV must be a PDF.",
            "error"
        );

        return;

    }


    try {

        showAdminMessage(
            "Uploading CV...",
            "loading"
        );


        await uploadFile(
            BUCKETS.cv,
            file
        );


        showAdminMessage(
            "CV uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadCV();

    }

    catch (error) {

        console.error(error);

        showAdminMessage(
            "CV upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   17. LOAD CV
========================================================= */

async function loadCV() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.cv)
            .list("", {

                limit: 100,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        if (!data || data.length === 0) {

            setCVStatus(
                "No CV uploaded yet."
            );

            return;

        }


        const file =
            data.find(
                item =>
                    item.name
                    .toLowerCase()
                    .endsWith(".pdf")
            );


        if (!file) {

            setCVStatus(
                "No PDF CV found."
            );

            return;

        }


        const {
            data: urlData
        } =
            supabaseClient
            .storage
            .from(BUCKETS.cv)
            .getPublicUrl(
                file.name
            );


        const url =
            urlData.publicUrl;


        document.getElementById(
            "viewCV"
        ).href = url;


        document.getElementById(
            "downloadCV"
        ).href = url;


        setCVStatus(
            "CV available."
        );

    }

    catch (error) {

        console.error(
            "CV loading error:",
            error
        );

        setCVStatus(
            "Unable to load CV."
        );

    }

}


/* =========================================================
   18. CV STATUS
========================================================= */

function setCVStatus(text) {

    const status =
        document.getElementById(
            "cvStatus"
        );

    if (status) {

        status.textContent = text;

    }

}


/* =========================================================
   19. PROFILE PICTURE UPLOAD
========================================================= */

async function uploadProfile() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById(
            "profileFile"
        );

    const file =
        input.files[0];


    if (!file) {

        showAdminMessage(
            "Please select a profile photograph.",
            "error"
        );

        return;

    }


    if (!file.type.startsWith("image/")) {

        showAdminMessage(
            "Please select an image.",
            "error"
        );

        return;

    }


    try {

        showAdminMessage(
            "Uploading profile picture...",
            "loading"
        );


        await uploadFile(
            BUCKETS.profile,
            file
        );


        showAdminMessage(
            "Profile picture uploaded.",
            "success"
        );


        input.value = "";


        await loadProfilePicture();

    }

    catch (error) {

        console.error(error);

        showAdminMessage(
            "Profile upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   20. LOAD PROFILE PICTURE
========================================================= */

async function loadProfilePicture() {

    const frame =
        document.getElementById(
            "profileFrame"
        );

    if (!frame) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.profile)
            .list("", {

                limit: 100,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        if (!data || data.length === 0) return;


        const image =
            data.find(
                item =>
                    /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(item.name)
            );


        if (!image) return;


        const {
            data: urlData
        } =
            supabaseClient
            .storage
            .from(BUCKETS.profile)
            .getPublicUrl(
                image.name
            );


        frame.innerHTML = `

            <img
                src="${urlData.publicUrl}"
                alt="Edwin Kuchio Okello"
                class="profile-image"
            >

        `;

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* =========================================================
   21. PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById(
            "pictorialFile"
        );


    const files =
        Array.from(input.files);


    if (files.length === 0) {

        showAdminMessage(
            "Please select one or more images.",
            "error"
        );

        return;

    }


    try {

        let completed = 0;


        for (const file of files) {

            if (!file.type.startsWith("image/")) {
                continue;
            }


            await uploadFile(
                BUCKETS.pictorial,
                file
            );


            completed++;

        }


        showAdminMessage(
            completed +
            " image(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadPictorial();

    }

    catch (error) {

        console.error(error);

        showAdminMessage(
            "Pictorial upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   22. LOAD PICTORIAL
========================================================= */

async function loadPictorial() {

    const gallery =
        document.getElementById(
            "gallery"
        );

    if (!gallery) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.pictorial)
            .list("", {

                limit: 200,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        const images =
            data.filter(
                item =>
                    /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(item.name)
            );


        if (images.length === 0) {

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


        gallery.innerHTML = "";


        images.forEach(function (image) {

            const {
                data: urlData
            } =
                supabaseClient
                .storage
                .from(BUCKETS.pictorial)
                .getPublicUrl(
                    image.name
                );


            const item =
                document.createElement("div");


            item.className =
                "gallery-item";


            item.innerHTML = `

                <img
                    src="${urlData.publicUrl}"
                    alt="Portfolio photograph"
                    loading="lazy"
                >

            `;


            gallery.appendChild(item);

        });

    }

    catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );

    }

}


/* =========================================================
   23. EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById(
            "ekoFile"
        );


    const files =
        Array.from(input.files);


    if (files.length === 0) {

        setUploadStatus(
            "ekoUploadStatus",
            "Please select one or more EKO projects.",
            "error"
        );

        return;

    }


    setUploadStatus(
        "ekoUploadStatus",
        "Uploading EKO projects...",
        "loading"
    );


    try {

        let uploaded = 0;


        for (const file of files) {

            await uploadFile(
                BUCKETS.eko,
                file
            );

            uploaded++;

        }


        setUploadStatus(
            "ekoUploadStatus",
            uploaded +
            " EKO project file(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadEKOProjects();

    }

    catch (error) {

        console.error(error);

        setUploadStatus(
            "ekoUploadStatus",
            "EKO upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   24. LOAD EKO PROJECTS
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


    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.eko)
            .list("", {

                limit: 500,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        if (!data || data.length === 0) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        No additional EKO projects yet
                    </h3>

                    <p>
                        Projects uploaded through the administrator
                        area will appear here.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(function (file) {

            const {
                data: urlData
            } =
                supabaseClient
                .storage
                .from(BUCKETS.eko)
                .getPublicUrl(
                    file.name
                );


            const extension =
                getFileExtension(
                    file.name
                );


            const card =
                createDocumentCard(
                    file,
                    urlData.publicUrl,
                    extension,
                    "EKO Project"
                );


            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "EKO loading error:",
            error
        );


        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load EKO projects
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   25. ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById(
            "academicFile"
        );


    const files =
        Array.from(input.files);


    if (files.length === 0) {

        setUploadStatus(
            "academicUploadStatus",
            "Please select academic files.",
            "error"
        );

        return;

    }


    setUploadStatus(
        "academicUploadStatus",
        "Uploading academic work...",
        "loading"
    );


    try {

        let uploaded = 0;


        for (const file of files) {

            await uploadFile(
                BUCKETS.academic,
                file
            );

            uploaded++;

        }


        setUploadStatus(
            "academicUploadStatus",
            uploaded +
            " academic file(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadAcademicDocuments();

    }

    catch (error) {

        console.error(error);

        setUploadStatus(
            "academicUploadStatus",
            "Academic upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   26. LOAD ACADEMIC DOCUMENTS
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

            <h3>
                Loading academic work...
            </h3>

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.academic)
            .list("", {

                limit: 500,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        if (!data || data.length === 0) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-book-open"></i>

                    <h3>
                        No academic work uploaded yet
                    </h3>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(function (file) {

            const {
                data: urlData
            } =
                supabaseClient
                .storage
                .from(BUCKETS.academic)
                .getPublicUrl(
                    file.name
                );


            container.appendChild(
                createDocumentCard(
                    file,
                    urlData.publicUrl,
                    getFileExtension(file.name),
                    "Academic Work"
                )
            );

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load academic work
                </h3>

            </div>

        `;

    }

}


/* =========================================================
   27. PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    if (!await requireAdmin()) return;


    const input =
        document.getElementById(
            "portfolioFile"
        );


    const files =
        Array.from(input.files);


    if (files.length === 0) {

        setUploadStatus(
            "portfolioUploadStatus",
            "Please select portfolio materials.",
            "error"
        );

        return;

    }


    setUploadStatus(
        "portfolioUploadStatus",
        "Uploading portfolio materials...",
        "loading"
    );


    try {

        let uploaded = 0;


        for (const file of files) {

            await uploadFile(
                BUCKETS.portfolio,
                file
            );

            uploaded++;

        }


        setUploadStatus(
            "portfolioUploadStatus",
            uploaded +
            " portfolio file(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadPortfolioDocuments();

    }

    catch (error) {

        console.error(error);

        setUploadStatus(
            "portfolioUploadStatus",
            "Portfolio upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   28. LOAD PROFESSIONAL PORTFOLIO
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

            <h3>
                Loading portfolio materials...
            </h3>

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
            .storage
            .from(BUCKETS.portfolio)
            .list("", {

                limit: 500,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


        if (error) throw error;


        if (!data || data.length === 0) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-briefcase"></i>

                    <h3>
                        No portfolio materials uploaded yet
                    </h3>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(function (file) {

            const {
                data: urlData
            } =
                supabaseClient
                .storage
                .from(BUCKETS.portfolio)
                .getPublicUrl(
                    file.name
                );


            container.appendChild(
                createDocumentCard(
                    file,
                    urlData.publicUrl,
                    getFileExtension(file.name),
                    "Professional Portfolio"
                )
            );

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load portfolio materials
                </h3>

            </div>

        `;

    }

}


/* =========================================================
   29. DOCUMENT CARD
========================================================= */

function createDocumentCard(
    file,
    url,
    extension,
    category
) {

    const card =
        document.createElement("article");


    card.className =
        "uploaded-document";


    const icon =
        getFileIcon(extension);


    card.innerHTML = `

        <div class="document-icon">

            <i class="${icon}"></i>

        </div>


        <div class="document-info">

            <span class="document-category">
                ${escapeHTML(category)}
            </span>

            <h3>
                ${escapeHTML(file.name)}
            </h3>

            <small>
                ${extension.toUpperCase()}
            </small>

        </div>


        <div class="document-actions">

            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
                class="document-view"
            >

                <i class="fas fa-eye"></i>
                View

            </a>


            <a
                href="${url}"
                download
                class="document-download"
            >

                <i class="fas fa-download"></i>
                Download

            </a>

        </div>

    `;


    return card;

}


/* =========================================================
   30. FILE EXTENSION
========================================================= */

function getFileExtension(
    filename
) {

    const parts =
        filename.split(".");


    if (parts.length < 2) {

        return "file";

    }


    return parts
        .pop()
        .toLowerCase();

}


/* =========================================================
   31. FILE ICON
========================================================= */

function getFileIcon(
    extension
) {

    const icons = {

        pdf:
            "fas fa-file-pdf",

        doc:
            "fas fa-file-word",

        docx:
            "fas fa-file-word",

        ppt:
            "fas fa-file-powerpoint",

        pptx:
            "fas fa-file-powerpoint",

        xls:
            "fas fa-file-excel",

        xlsx:
            "fas fa-file-excel",

        csv:
            "fas fa-file-csv",

        txt:
            "fas fa-file-lines",

        jpg:
            "fas fa-file-image",

        jpeg:
            "fas fa-file-image",

        png:
            "fas fa-file-image",

        webp:
            "fas fa-file-image"

    };


    return (
        icons[extension] ||
        "fas fa-file"
    );

}


/* =========================================================
   32. UPLOAD STATUS
========================================================= */

function setUploadStatus(
    elementId,
    text,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) return;


    element.textContent =
        text;


    element.className =
        "upload-status " +
        type;

}


/* =========================================================
   33. MODAL SYSTEM
========================================================= */

function initializeModalSystem() {

    document
        .querySelectorAll(".modal")
        .forEach(function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeModal(
                            modal.id
                        );

                    }

                }
            );

        });


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(function (modal) {

                        closeModal(
                            modal.id
                        );

                    });


                const adminPanel =
                    document.getElementById(
                        "adminPanel"
                    );


                if (
                    adminPanel &&
                    adminPanel.classList.contains(
                        "active"
                    )
                ) {

                    closeAdmin();

                }

            }

        }
    );

}


/* =========================================================
   34. OPEN MODAL
========================================================= */

function openModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) {

        console.error(
            "Modal not found:",
            modalId
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );


    if (
        modalId === "ekoModal"
    ) {

        loadEKOProjects();

    }


    if (
        modalId === "academicModal"
    ) {

        loadAcademicDocuments();

    }


    if (
        modalId === "portfolioModal"
    ) {

        loadPortfolioDocuments();

    }

}


/* =========================================================
   35. CLOSE MODAL
========================================================= */

function closeModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    if (
        document.querySelectorAll(
            ".modal.active"
        ).length === 0
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   36. PROJECT 01
========================================================= */

function openProject01() {

    closeModal(
        "ekoModal"
    );


    openModal(
        "project01Modal"
    );

}


/* =========================================================
   37. REFRESH EVERYTHING
========================================================= */

async function refreshAllLibraries() {

    await Promise.all([

        loadEKOProjects(),

        loadAcademicDocuments(),

        loadPortfolioDocuments(),

        loadPictorial(),

        loadCV(),

        loadProfilePicture()

    ]);

}


/* =========================================================
   38. ESCAPE HTML
========================================================= */

function escapeHTML(
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
   39. MAKE FUNCTIONS AVAILABLE TO HTML ONCLICK
========================================================= */

window.openAdmin =
    openAdmin;

window.closeAdmin =
    closeAdmin;

window.adminLogin =
    adminLogin;

window.adminLogout =
    adminLogout;

window.uploadCV =
    uploadCV;

window.uploadProfile =
    uploadProfile;

window.uploadPictorial =
    uploadPictorial;

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

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.openProject01 =
    openProject01;


/* =========================================================
   40. INITIAL SESSION CHECK
========================================================= */

checkAdminSession();
