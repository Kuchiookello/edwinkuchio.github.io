/* =========================================================
   EKO PORTFOLIO — MAIN SCRIPT
   Edwin Kuchio Okello
   EKO Analytics & Research
========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   2. SUPABASE BUCKET NAMES
========================================================= */

/*
   IMPORTANT:

   These names MUST match the bucket names in Supabase.

   If your bucket names are different, change them here only.
*/

const BUCKETS = {

    cv: "cv",

    profile: "profile",

    pictorial: "pictorial",

    eko: "eko",

    academic: "academic",

    portfolio: "portfolio"

};


/* =========================================================
   3. GLOBAL VARIABLES
========================================================= */

let currentUser = null;


/* =========================================================
   4. PAGE INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    initializeYear();

    initializeNavigation();

    initializeBackToTop();

    initializeAdminButton();

    initializeModals();

    await checkAdminSession();

    await loadCV();

    await loadProfilePicture();

    await loadGallery();

});


/* =========================================================
   5. CURRENT YEAR
========================================================= */

function initializeYear() {

    const yearElement = document.getElementById("year");

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }

}


/* =========================================================
   6. MOBILE NAVIGATION
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


    const links = navLinks.querySelectorAll("a");


    links.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        });

    });

}


/* =========================================================
   7. BACK TO TOP
========================================================= */

function initializeBackToTop() {

    const button = document.getElementById("backToTop");


    if (!button) return;


    window.addEventListener("scroll", function () {

        if (window.scrollY > 500) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });


    button.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =========================================================
   8. ADMIN LOCK BUTTON
========================================================= */

function initializeAdminButton() {

    const adminLock = document.getElementById("adminLock");


    if (!adminLock) return;


    adminLock.addEventListener("click", function () {

        openAdmin();

    });

}


/* =========================================================
   9. OPEN ADMIN PANEL
========================================================= */

function openAdmin() {

    const panel = document.getElementById("adminPanel");


    if (!panel) return;


    panel.classList.add("active");

    document.body.classList.add("modal-open");


    checkAdminSession();

}


/* =========================================================
   10. CLOSE ADMIN PANEL
========================================================= */

function closeAdmin() {

    const panel = document.getElementById("adminPanel");


    if (!panel) return;


    panel.classList.remove("active");

    document.body.classList.remove("modal-open");

}


/* =========================================================
   11. ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const emailInput = document.getElementById("adminEmail");

    const passwordInput = document.getElementById("adminPassword");

    const message = document.getElementById("adminMessage");


    if (!emailInput || !passwordInput) return;


    const email = emailInput.value.trim();

    const password = passwordInput.value;


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

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            showAdminMessage(
                error.message,
                "error"
            );

            return;

        }


        currentUser = data.user;


        showAdminMessage(
            "Administrator access granted.",
            "success"
        );


        showAdminDashboard();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "An unexpected error occurred while signing in.",
            "error"
        );

    }

}


/* =========================================================
   12. CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(error);

            return;

        }


        if (data && data.session) {

            currentUser = data.session.user;

            showAdminDashboard();

        } else {

            currentUser = null;

            showLoginArea();

        }

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   13. SHOW LOGIN
========================================================= */

function showLoginArea() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById("adminDashboard");


    if (loginArea) {

        loginArea.style.display = "block";

    }


    if (dashboard) {

        dashboard.style.display = "none";

    }

}


/* =========================================================
   14. SHOW ADMIN DASHBOARD
========================================================= */

function showAdminDashboard() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById("adminDashboard");


    if (loginArea) {

        loginArea.style.display = "none";

    }


    if (dashboard) {

        dashboard.style.display = "block";

    }

}


/* =========================================================
   15. ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            showAdminMessage(
                error.message,
                "error"
            );

            return;

        }


        currentUser = null;

        showLoginArea();


        showAdminMessage(
            "You have been signed out.",
            "success"
        );


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   16. ADMIN MESSAGE
========================================================= */

function showAdminMessage(message, type = "") {

    const element =
        document.getElementById("adminMessage");


    if (!element) return;


    element.textContent = message;

    element.className = "admin-message";


    if (type) {

        element.classList.add(type);

    }

}


/* =========================================================
   17. MODAL FUNCTIONS
========================================================= */

function openModal(id) {

    const modal = document.getElementById(id);


    if (!modal) {

        console.warn(
            "Modal not found:",
            id
        );

        return;

    }


    modal.classList.add("active");

    document.body.classList.add("modal-open");


    if (id === "ekoModal") {

        loadEKOProjects();

    }


    if (id === "academicModal") {

        loadAcademicDocuments();

    }


    if (id === "portfolioModal") {

        loadPortfolioDocuments();

    }

}


function closeModal(id) {

    const modal = document.getElementById(id);


    if (!modal) return;


    modal.classList.remove("active");


    const activeModals =
        document.querySelectorAll(".modal.active");


    if (activeModals.length === 0) {

        document.body.classList.remove("modal-open");

    }

}


/* =========================================================
   18. MODAL INITIALISATION
========================================================= */

function initializeModals() {

    const modals =
        document.querySelectorAll(".modal");


    modals.forEach(function (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                modal.classList.remove("active");

                const remaining =
                    document.querySelectorAll(".modal.active");


                if (remaining.length === 0) {

                    document.body.classList.remove(
                        "modal-open"
                    );

                }

            }

        });

    });


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                const active =
                    document.querySelectorAll(
                        ".modal.active"
                    );


                active.forEach(function (modal) {

                    modal.classList.remove("active");

                });


                document.body.classList.remove(
                    "modal-open"
                );

            }

        }
    );

}


/* =========================================================
   19. PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    setTimeout(function () {

        openModal("project01Modal");

    }, 150);

}


/* =========================================================
   20. GENERATE PUBLIC FILE URL
========================================================= */

function getPublicFileURL(bucket, path) {

    const {

        data

    } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(path);


    return data.publicUrl;

}


/* =========================================================
   21. SAFE FILE NAME
========================================================= */

function sanitizeFileName(name) {

    return name
        .replace(/\s+/g, "_")
        .replace(/[^\w.\-]/g, "")
        .toLowerCase();

}


/* =========================================================
   22. CREATE UNIQUE FILE PATH
========================================================= */

function createFilePath(file) {

    const timestamp =
        Date.now();


    const random =
        Math.random()
        .toString(36)
        .substring(2, 9);


    const safeName =
        sanitizeFileName(file.name);


    return `${timestamp}_${random}_${safeName}`;

}


/* =========================================================
   23. VERIFY ADMIN
========================================================= */

async function verifyAdmin() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        return false;

    }


    if (!data.session) {

        showAdminMessage(
            "Administrator login required.",
            "error"
        );

        return false;

    }


    currentUser = data.session.user;

    return true;

}


/* =========================================================
   24. GENERIC UPLOAD FUNCTION
========================================================= */

async function uploadSingleFile(
    file,
    bucket,
    folder = ""
) {

    if (!file) {

        throw new Error(
            "No file selected."
        );

    }


    const filePath =
        folder
            ? `${folder}/${createFilePath(file)}`
            : createFilePath(file);


    const {
        data,
        error
    } = await supabaseClient.storage
        .from(bucket)
        .upload(
            filePath,
            file,
            {
                cacheControl: "3600",

                upsert: false

            }
        );


    if (error) {

        throw error;

    }


    return {

        path: data.path,

        url: getPublicFileURL(
            bucket,
            data.path
        ),

        name: file.name,

        bucket: bucket

    };

}


/* =========================================================
   25. CV UPLOAD
========================================================= */

async function uploadCV() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById("cvFile");


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select a PDF CV first.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    if (
        file.type !==
        "application/pdf"
    ) {

        showAdminMessage(
            "The CV must be a PDF file.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading CV...",
        "loading"
    );


    try {

        /*
           Remove old CV files first.
        */

        const {
            data: oldFiles
        } = await supabaseClient.storage
            .from(BUCKETS.cv)
            .list();


        if (oldFiles && oldFiles.length) {

            const paths =
                oldFiles.map(
                    file => file.name
                );


            await supabaseClient.storage
                .from(BUCKETS.cv)
                .remove(paths);

        }


        await uploadSingleFile(
            file,
            BUCKETS.cv
        );


        showAdminMessage(
            "CV uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadCV();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "CV upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   26. LOAD CV
========================================================= */

async function loadCV() {

    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from(BUCKETS.cv)
            .list();


        if (error) {

            console.error(error);

            return;

        }


        if (!data || !data.length) {

            setCVUnavailable();

            return;

        }


        /*
           Use the newest file.
        */

        const sorted =
            data.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );


        const file =
            sorted[0];


        const url =
            getPublicFileURL(
                BUCKETS.cv,
                file.name
            );


        const view =
            document.getElementById("viewCV");


        const download =
            document.getElementById("downloadCV");


        const status =
            document.getElementById("cvStatus");


        if (view) {

            view.href = url;

        }


        if (download) {

            download.href = url;

        }


        if (status) {

            status.textContent =
                "Current CV available.";

            status.classList.add(
                "available"
            );

        }

    } catch (error) {

        console.error(error);

        setCVUnavailable();

    }

}


/* =========================================================
   27. CV UNAVAILABLE
========================================================= */

function setCVUnavailable() {

    const view =
        document.getElementById("viewCV");


    const download =
        document.getElementById("downloadCV");


    const status =
        document.getElementById("cvStatus");


    if (view) {

        view.removeAttribute("href");

    }


    if (download) {

        download.removeAttribute("href");

    }


    if (status) {

        status.textContent =
            "CV currently unavailable.";

    }

}


/* =========================================================
   28. PROFILE PICTURE UPLOAD
========================================================= */

async function uploadProfile() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById("profileFile");


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select a profile picture.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    if (!file.type.startsWith("image/")) {

        showAdminMessage(
            "Please select an image.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading profile picture...",
        "loading"
    );


    try {

        const {
            data: oldFiles
        } = await supabaseClient.storage
            .from(BUCKETS.profile)
            .list();


        if (oldFiles && oldFiles.length) {

            await supabaseClient.storage
                .from(BUCKETS.profile)
                .remove(
                    oldFiles.map(
                        file => file.name
                    )
                );

        }


        const result =
            await uploadSingleFile(
                file,
                BUCKETS.profile
            );


        displayProfilePicture(
            result.url
        );


        input.value = "";


        showAdminMessage(
            "Profile picture uploaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "Profile picture upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   29. LOAD PROFILE PICTURE
========================================================= */

async function loadProfilePicture() {

    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from(BUCKETS.profile)
            .list();


        if (error) {

            console.error(error);

            return;

        }


        if (!data || !data.length) {

            return;

        }


        const sorted =
            data.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );


        const file =
            sorted[0];


        const url =
            getPublicFileURL(
                BUCKETS.profile,
                file.name
            );


        displayProfilePicture(url);


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   30. DISPLAY PROFILE PICTURE
========================================================= */

function displayProfilePicture(url) {

    const frame =
        document.getElementById("profileFrame");


    if (!frame) return;


    frame.innerHTML = `

        <img
            src="${url}"
            alt="Edwin Kuchio Okello"
            class="profile-image"
        >

    `;

}


/* =========================================================
   31. PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById(
            "pictorialFile"
        );


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select one or more images.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    showAdminMessage(
        `Uploading ${files.length} image(s)...`,
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            if (!file.type.startsWith("image/")) {

                failed++;

                continue;

            }


            await uploadSingleFile(
                file,
                BUCKETS.pictorial
            );


            successful++;


        } catch (error) {

            console.error(
                "Pictorial upload error:",
                error
            );

            failed++;

        }

    }


    input.value = "";


    await loadGallery();


    showAdminMessage(
        `${successful} image(s) uploaded successfully` +
        (failed
            ? `, ${failed} failed.`
            : "."),
        failed ? "error" : "success"
    );

}


/* =========================================================
   32. LOAD GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById(
            "gallery"
        );


    if (!gallery) return;


    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from(BUCKETS.pictorial)
            .list();


        if (error) {

            console.error(error);

            return;

        }


        if (!data || !data.length) {

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


        const images =
            data
                .filter(
                    file =>
                        file.name !== ".emptyFolderPlaceholder"
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                );


        gallery.innerHTML = "";


        images.forEach(function (file) {

            const url =
                getPublicFileURL(
                    BUCKETS.pictorial,
                    file.name
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gallery-item";


            item.innerHTML = `

                <img
                    src="${url}"
                    alt="Portfolio photograph"
                    loading="lazy"
                >

                <button
                    class="gallery-view"
                    type="button"
                    aria-label="View photograph"
                >

                    <i class="fas fa-expand"></i>

                </button>

            `;


            item
                .querySelector(
                    ".gallery-view"
                )
                .addEventListener(
                    "click",
                    function () {

                        openImageViewer(url);

                    }
                );


            gallery.appendChild(item);

        });


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   33. IMAGE VIEWER
========================================================= */

function openImageViewer(url) {

    const viewer =
        document.createElement(
            "div"
        );


    viewer.className =
        "image-viewer";


    viewer.innerHTML = `

        <button
            class="image-viewer-close"
            type="button"
        >
            &times;
        </button>

        <img
            src="${url}"
            alt="Portfolio photograph"
        >

    `;


    document.body.appendChild(
        viewer
    );


    viewer
        .querySelector(
            ".image-viewer-close"
        )
        .addEventListener(
            "click",
            function () {

                viewer.remove();

            }
        );


    viewer.addEventListener(
        "click",
        function (event) {

            if (event.target === viewer) {

                viewer.remove();

            }

        }
    );

}


/* =========================================================
   34. EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById(
            "ekoFile"
        );


    const status =
        document.getElementById(
            "ekoUploadStatus"
        );


    if (!input || !input.files.length) {

        setUploadStatus(
            status,
            "Please select one or more EKO projects.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        `Preparing ${files.length} EKO project(s)...`,
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            await uploadSingleFile(
                file,
                BUCKETS.eko
            );


            successful++;


            setUploadStatus(
                status,
                `Uploaded ${successful} of ${files.length} EKO project(s)...`,
                "loading"
            );


        } catch (error) {

            console.error(
                "EKO upload error:",
                error
            );

            failed++;

        }

    }


    input.value = "";


    await loadEKOProjects();


    setUploadStatus(
        status,
        `${successful} EKO project(s) uploaded successfully` +
        (failed
            ? `. ${failed} file(s) failed.`
            : "."),
        failed ? "error" : "success"
    );


    /*
       If the EKO modal is open,
       refresh the project library.
    */

    if (
        document
            .getElementById("ekoModal")
            ?.classList.contains("active")
    ) {

        await loadEKOProjects();

    }

}


/* =========================================================
   35. LOAD EKO PROJECTS
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
        } = await supabaseClient.storage
            .from(BUCKETS.eko)
            .list();


        if (error) {

            console.error(error);

            renderDocumentError(
                container,
                "Unable to load EKO projects."
            );

            return;

        }


        const files =
            (data || [])
                .filter(
                    file =>
                        file.name !==
                        ".emptyFolderPlaceholder"
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                );


        if (!files.length) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        No additional EKO projects yet
                    </h3>

                    <p>
                        Projects uploaded by the administrator
                        will appear here.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        /*
           Add EKO portfolio entry first.
        */

        renderEKOPortfolioEntry(
            container
        );


        files.forEach(
            function (file, index) {

                renderDocumentCard(
                    container,
                    file,
                    BUCKETS.eko,
                    "EKO PROJECT",
                    index + 1
                );

            }
        );


    } catch (error) {

        console.error(error);

        renderDocumentError(
            container,
            "Unable to load EKO projects."
        );

    }

}


/* =========================================================
   36. EKO PORTFOLIO ITSELF
========================================================= */

function renderEKOPortfolioEntry(container) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "document-card eko-portfolio-entry";


    card.innerHTML = `

        <div class="document-icon eko-document-icon">

            <i class="fas fa-chart-line"></i>

        </div>


        <div class="document-content">

            <span class="document-category">
                EKO ANALYTICS & RESEARCH
            </span>

            <h3>
                EKO Analytics & Research Portfolio
            </h3>

            <p>
                The main professional portfolio of EKO Analytics & Research,
                including its purpose, services, analytical approach,
                professional identity and selected work.
            </p>


            <div class="document-tags">

                <span>Research</span>

                <span>Analytics</span>

                <span>Business Analysis</span>

                <span>Reporting</span>

            </div>


            <div class="document-actions">

                <button
                    type="button"
                    class="document-open-button"
                >

                    <i class="fas fa-eye"></i>

                    View EKO Portfolio

                </button>

            </div>

        </div>

    `;


    card
        .querySelector(
            ".document-open-button"
        )
        .addEventListener(
            "click",
            function () {

                openEKOPortfolio();

            }
        );


    container.appendChild(
        card
    );

}


/* =========================================================
   37. OPEN EKO PORTFOLIO
========================================================= */

function openEKOPortfolio() {

    /*
       This opens the EKO parent section.

       You can later replace this with a dedicated
       EKO portfolio PDF/document if desired.
    */

    const modal =
        document.getElementById(
            "ekoModal"
        );


    if (!modal) return;


    const introduction =
        modal.querySelector(
            ".eko-modal-introduction"
        );


    if (introduction) {

        introduction.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   38. ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById(
            "academicFile"
        );


    const status =
        document.getElementById(
            "academicUploadStatus"
        );


    if (!input || !input.files.length) {

        setUploadStatus(
            status,
            "Please select academic documents.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        `Uploading ${files.length} academic document(s)...`,
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            await uploadSingleFile(
                file,
                BUCKETS.academic
            );


            successful++;


        } catch (error) {

            console.error(
                "Academic upload error:",
                error
            );

            failed++;

        }

    }


    input.value = "";


    await loadAcademicDocuments();


    setUploadStatus(
        status,
        `${successful} academic document(s) uploaded successfully` +
        (failed
            ? `. ${failed} failed.`
            : "."),
        failed ? "error" : "success"
    );

}


/* =========================================================
   39. LOAD ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById(
            "academicDocuments"
        );


    if (!container) return;


    showDocumentLoading(
        container,
        "Loading academic work..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from(BUCKETS.academic)
            .list();


        if (error) {

            console.error(error);

            renderDocumentError(
                container,
                "Unable to load academic work."
            );

            return;

        }


        const files =
            (data || [])
                .filter(
                    file =>
                        file.name !==
                        ".emptyFolderPlaceholder"
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                );


        if (!files.length) {

            renderEmptyDocuments(
                container,
                "No academic work uploaded yet.",
                "Academic essays and research papers uploaded by the administrator will appear here."
            );

            return;

        }


        container.innerHTML = "";


        files.forEach(
            function (file, index) {

                renderDocumentCard(
                    container,
                    file,
                    BUCKETS.academic,
                    "ACADEMIC WORK",
                    index + 1
                );

            }
        );


    } catch (error) {

        console.error(error);

        renderDocumentError(
            container,
            "Unable to load academic work."
        );

    }

}


/* =========================================================
   40. PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    if (!(await verifyAdmin())) return;


    const input =
        document.getElementById(
            "portfolioFile"
        );


    const status =
        document.getElementById(
            "portfolioUploadStatus"
        );


    if (!input || !input.files.length) {

        setUploadStatus(
            status,
            "Please select professional portfolio materials.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        `Uploading ${files.length} portfolio material(s)...`,
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            await uploadSingleFile(
                file,
                BUCKETS.portfolio
            );


            successful++;


        } catch (error) {

            console.error(
                "Portfolio upload error:",
                error
            );

            failed++;

        }

    }


    input.value = "";


    await loadPortfolioDocuments();


    setUploadStatus(
        status,
        `${successful} portfolio material(s) uploaded successfully` +
        (failed
            ? `. ${failed} failed.`
            : "."),
        failed ? "error" : "success"
    );

}


/* =========================================================
   41. LOAD PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById(
            "portfolioDocuments"
        );


    if (!container) return;


    showDocumentLoading(
        container,
        "Loading portfolio materials..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from(BUCKETS.portfolio)
            .list();


        if (error) {

            console.error(error);

            renderDocumentError(
                container,
                "Unable to load portfolio materials."
            );

            return;

        }


        const files =
            (data || [])
                .filter(
                    file =>
                        file.name !==
                        ".emptyFolderPlaceholder"
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                );


        if (!files.length) {

            renderEmptyDocuments(
                container,
                "No portfolio materials uploaded yet.",
                "Professional documents and selected portfolio materials will appear here."
            );

            return;

        }


        container.innerHTML = "";


        files.forEach(
            function (file, index) {

                renderDocumentCard(
                    container,
                    file,
                    BUCKETS.portfolio,
                    "PROFESSIONAL PORTFOLIO",
                    index + 1
                );

            }
        );


    } catch (error) {

        console.error(error);

        renderDocumentError(
            container,
            "Unable to load portfolio materials."
        );

    }

}


/* =========================================================
   42. DOCUMENT CARD
========================================================= */

function renderDocumentCard(
    container,
    file,
    bucket,
    category,
    number
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "document-card";


    const url =
        getPublicFileURL(
            bucket,
            file.name
        );


    const extension =
        getFileExtension(
            file.name
        );


    const icon =
        getFileIcon(
            extension
        );


    const formattedName =
        formatFileName(
            file.name
        );


    const date =
        formatDate(
            file.created_at
        );


    card.innerHTML = `

        <div class="document-icon">

            <i class="${icon}"></i>

        </div>


        <div class="document-content">

            <span class="document-category">
                ${category}
            </span>


            <h3>
                ${escapeHTML(formattedName)}
            </h3>


            <p class="document-meta">

                <span>
                    <i class="fas fa-file"></i>
                    ${extension.toUpperCase() || "FILE"}
                </span>

                <span>
                    <i class="fas fa-calendar"></i>
                    ${date}
                </span>

            </p>


            <div class="document-actions">

                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="document-open-button"
                >

                    <i class="fas fa-eye"></i>

                    View

                </a>


                <a
                    href="${url}"
                    download
                    class="document-download-button"
                >

                    <i class="fas fa-download"></i>

                    Download

                </a>

            </div>

        </div>

    `;


    container.appendChild(
        card
    );

}


/* =========================================================
   43. DOCUMENT LOADING
========================================================= */

function showDocumentLoading(
    container,
    message
) {

    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                ${message}
            </h3>

        </div>

    `;

}


/* =========================================================
   44. EMPTY DOCUMENTS
========================================================= */

function renderEmptyDocuments(
    container,
    title,
    description
) {

    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-folder-open"></i>

            <h3>
                ${title}
            </h3>

            <p>
                ${description}
            </p>

        </div>

    `;

}


/* =========================================================
   45. DOCUMENT ERROR
========================================================= */

function renderDocumentError(
    container,
    message
) {

    container.innerHTML = `

        <div class="document-placeholder error">

            <i class="fas fa-circle-exclamation"></i>

            <h3>
                ${message}
            </h3>

            <p>
                Please try again later.
            </p>

        </div>

    `;

}


/* =========================================================
   46. UPLOAD STATUS
========================================================= */

function setUploadStatus(
    element,
    message,
    type = ""
) {

    if (!element) return;


    element.textContent =
        message;


    element.className =
        "upload-status";


    if (type) {

        element.classList.add(
            type
        );

    }

}


/* =========================================================
   47. FILE EXTENSION
========================================================= */

function getFileExtension(filename) {

    const parts =
        filename.split(".");


    if (parts.length < 2) {

        return "";

    }


    return parts
        .pop()
        .toLowerCase();

}


/* =========================================================
   48. FILE ICON
========================================================= */

function getFileIcon(extension) {

    switch (extension) {

        case "pdf":

            return "fas fa-file-pdf";


        case "doc":

        case "docx":

            return "fas fa-file-word";


        case "xls":

        case "xlsx":

        case "csv":

            return "fas fa-file-excel";


        case "ppt":

        case "pptx":

            return "fas fa-file-powerpoint";


        case "txt":

            return "fas fa-file-lines";


        case "jpg":

        case "jpeg":

        case "png":

        case "gif":

        case "webp":

            return "fas fa-file-image";


        case "zip":

        case "rar":

            return "fas fa-file-zipper";


        default:

            return "fas fa-file";

    }

}


/* =========================================================
   49. FORMAT FILE NAME
========================================================= */

function formatFileName(filename) {

    let name =
        filename;


    /*
       Remove timestamp/random prefix.
    */

    name =
        name.replace(
            /^\d+_[a-z0-9]+_/i,
            ""
        );


    /*
       Remove extension.
    */

    name =
        name.replace(
            /\.[^/.]+$/,
            ""
        );


    /*
       Replace underscores.
    */

    name =
        name.replace(
            /_/g,
            " "
        );


    /*
       Capitalise words.
    */

    name =
        name.replace(
            /\b\w/g,
            char => char.toUpperCase()
        );


    return name;

}


/* =========================================================
   50. FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    if (isNaN(date)) {

        return "";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",

            month: "short",

            year: "numeric"

        }
    );

}


/* =========================================================
   51. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

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
   52. DELETE FILE
========================================================= */

/*
   This function is available for the admin dashboard.

   If you later add a Delete button to document cards,
   call:

   deleteFile(bucket, filename)

*/

async function deleteFile(
    bucket,
    filename
) {

    if (!(await verifyAdmin())) {

        return false;

    }


    const confirmed =
        window.confirm(
            `Delete "${filename}"?`
        );


    if (!confirmed) {

        return false;

    }


    try {

        const {
            error
        } = await supabaseClient.storage
            .from(bucket)
            .remove([
                filename
            ]);


        if (error) {

            throw error;

        }


        showAdminMessage(
            "File deleted successfully.",
            "success"
        );


        /*
           Refresh relevant section.
        */

        if (bucket === BUCKETS.eko) {

            await loadEKOProjects();

        }


        if (
            bucket ===
            BUCKETS.academic
        ) {

            await loadAcademicDocuments();

        }


        if (
            bucket ===
            BUCKETS.portfolio
        ) {

            await loadPortfolioDocuments();

        }


        if (
            bucket ===
            BUCKETS.pictorial
        ) {

            await loadGallery();

        }


        if (
            bucket ===
            BUCKETS.cv
        ) {

            await loadCV();

        }


        if (
            bucket ===
            BUCKETS.profile
        ) {

            await loadProfilePicture();

        }


        return true;


    } catch (error) {

        console.error(error);


        showAdminMessage(
            "Unable to delete file: " +
            error.message,
            "error"
        );


        return false;

    }

}


/* =========================================================
   53. REAL-TIME AUTH STATE
========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (session) {

            currentUser =
                session.user;

            showAdminDashboard();

        } else {

            currentUser = null;

            showLoginArea();

        }

    }
);


/* =========================================================
   54. GLOBAL FUNCTIONS
========================================================= */

/*
   These make the functions accessible to
   onclick="" attributes in your HTML.
*/

window.openModal =
    openModal;


window.closeModal =
    closeModal;


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


window.openProject01 =
    openProject01;


window.deleteFile =
    deleteFile;


/* =========================================================
   END OF SCRIPT
========================================================= */
