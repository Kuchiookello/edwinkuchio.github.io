/* =========================================================
   EDWIN KUCHIO OKELLO
   PROFESSIONAL PORTFOLIO
   SUPABASE CONTROL SCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://cueajmzcmawvcbpwuyhi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_hUjTnuPCkxB2ysGoYZq0Mg_uhymAbhb";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   BUCKET NAMES
========================================================= */

const BUCKETS = {

    cv: "CV",

    profile: "Profile",

    pictorial: "Pictorial",

    academic: "Academic Essays and Research",

    professional: "Professional Portfolio",

    eko: "eko"

};


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentSession = null;


/* =========================================================
   PAGE INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    initializeNavigation();

    initializeBackToTop();

    initializeAdminLock();

    initializeModalSystem();

    document.getElementById("year").textContent =
        new Date().getFullYear();

    await checkAdminSession();

    await loadCV();

    await loadProfilePicture();

    await loadPictorial();

});


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const icon =
            menuToggle.querySelector("i");

        if (icon) {

            if (navLinks.classList.contains("active")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });


    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            const icon =
                menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    });

}


/* =========================================================
   BACK TO TOP
========================================================= */

function initializeBackToTop() {

    const button =
        document.getElementById("backToTop");

    if (!button) {
        console.warn("Back to top button not found.");
        return;
    }

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {

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
   ADMIN LOCK BUTTON
========================================================= */

function initializeAdminLock() {

    const adminLock =
        document.getElementById("adminLock");

    if (!adminLock) {

        console.warn("Admin lock button not found.");

        return;

    }

    adminLock.addEventListener("click", function () {

        openAdmin();

    });

}


/* =========================================================
   ADMIN PANEL
========================================================= */

function openAdmin() {

    const panel =
        document.getElementById("adminPanel");

    if (!panel) {
        return;
    }

    panel.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeAdmin() {

    const panel =
        document.getElementById("adminPanel");

    if (!panel) {
        return;
    }

    panel.classList.remove("active");

    document.body.classList.remove("modal-open");

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const message =
        document.getElementById("adminMessage");

    if (!emailInput || !passwordInput) {

        showAdminMessage(
            "Administrator login form could not be found.",
            "error"
        );

        return;

    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        showAdminMessage(
            "Please enter both your administrator email and password.",
            "error"
        );

        return;

    }

    showAdminMessage(
        "Signing in...",
        "info"
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
                "Login failed: " + error.message,
                "error"
            );

            return;

        }


        currentSession =
            data.session;


        showAdminMessage(
            "Administrator access granted.",
            "success"
        );


        showAdminDashboard();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "An unexpected error occurred during login.",
            "error"
        );

    }

}


/* =========================================================
   CHECK EXISTING SESSION
========================================================= */

async function checkAdminSession() {

    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();


        currentSession =
            session;


        if (session) {

            showAdminDashboard();

        }

    } catch (error) {

        console.error(
            "Could not check administrator session.",
            error
        );

    }

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function showAdminDashboard() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById("adminDashboard");

    if (loginArea) {

        loginArea.style.display =
            "none";

    }

    if (dashboard) {

        dashboard.style.display =
            "block";

    }

}


function showLoginArea() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById("adminDashboard");

    if (loginArea) {

        loginArea.style.display =
            "block";

    }

    if (dashboard) {

        dashboard.style.display =
            "none";

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

        currentSession =
            null;

        showLoginArea();

        showAdminMessage(
            "You have been signed out.",
            "success"
        );

    } catch (error) {

        console.error(error);

        showAdminMessage(
            "Could not sign out.",
            "error"
        );

    }

}


/* =========================================================
   ADMIN MESSAGES
========================================================= */

function showAdminMessage(message, type = "info") {

    const element =
        document.getElementById("adminMessage");

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "admin-message " + type;

}


/* =========================================================
   AUTHENTICATION CHECK
========================================================= */

async function requireAdmin() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        showAdminMessage(
            "Please sign in as administrator first.",
            "error"
        );

        return false;

    }

    currentSession =
        session;

    return true;

}


/* =========================================================
   FILE NAME SANITISATION
========================================================= */

function cleanFileName(name) {

    return name
        .replace(/[^\w.\- ]+/g, "")
        .replace(/\s+/g, "_");

}


/* =========================================================
   UNIQUE STORAGE NAME
========================================================= */

function createStorageName(file) {

    const timestamp =
        Date.now();

    const random =
        Math.random()
            .toString(36)
            .substring(2, 9);

    return (
        timestamp +
        "_" +
        random +
        "_" +
        cleanFileName(file.name)
    );

}


/* =========================================================
   GENERIC FILE UPLOAD
========================================================= */

async function uploadFile(
    bucket,
    path,
    file
) {

    const { error } =
        await supabaseClient.storage
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


    return getPublicURL(
        bucket,
        path
    );

}


/* =========================================================
   PUBLIC URL
========================================================= */

function getPublicURL(bucket, path) {

    const {
        data
    } =
        supabaseClient.storage
            .from(bucket)
            .getPublicUrl(path);


    return data.publicUrl;

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    if (!await requireAdmin()) {
        return;
    }

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


    if (file.type !== "application/pdf") {

        showAdminMessage(
            "The CV must be a PDF file.",
            "error"
        );

        return;

    }


    try {

        showAdminMessage(
            "Uploading CV...",
            "info"
        );


        const fileName =
            createStorageName(file);


        await uploadFile(
            BUCKETS.cv,
            fileName,
            file
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
   LOAD CV
========================================================= */

async function loadCV() {

    const viewButton =
        document.getElementById("viewCV");

    const downloadButton =
        document.getElementById("downloadCV");

    const status =
        document.getElementById("cvStatus");


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.cv)
                .list(
                    "",
                    {
                        limit: 100,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    }
                );


        if (error) {
            throw error;
        }


        const pdfs =
            data.filter(function (file) {

                return file.name
                    .toLowerCase()
                    .endsWith(".pdf");

            });


        if (!pdfs.length) {

            if (status) {

                status.textContent =
                    "No CV has been uploaded yet.";

            }

            disableButton(viewButton);
            disableButton(downloadButton);

            return;

        }


        const latest =
            pdfs[0];


        const url =
            getPublicURL(
                BUCKETS.cv,
                latest.name
            );


        activateViewButton(
            viewButton,
            url
        );


        activateDownloadButton(
            downloadButton,
            url,
            latest.name
        );


        if (status) {

            status.textContent =
                "CV available.";

        }


    } catch (error) {

        console.error(
            "CV loading error:",
            error
        );

        if (status) {

            status.textContent =
                "Unable to load CV.";

        }

    }

}


/* =========================================================
   PROFILE PICTURE UPLOAD
========================================================= */

async function uploadProfile() {

    if (!await requireAdmin()) {
        return;
    }

    const input =
        document.getElementById("profileFile");


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select a profile photograph.",
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


    try {

        showAdminMessage(
            "Uploading profile photograph...",
            "info"
        );


        const fileName =
            createStorageName(file);


        await uploadFile(
            BUCKETS.profile,
            fileName,
            file
        );


        showAdminMessage(
            "Profile photograph uploaded.",
            "success"
        );


        input.value = "";

        await loadProfilePicture();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "Profile upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   LOAD PROFILE PICTURE
========================================================= */

async function loadProfilePicture() {

    const frame =
        document.getElementById("profileFrame");

    if (!frame) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.profile)
                .list(
                    "",
                    {
                        limit: 100,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    }
                );


        if (error) {
            throw error;
        }


        const images =
            data.filter(function (file) {

                return /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(file.name);

            });


        if (!images.length) {
            return;
        }


        const latest =
            images[0];


        const url =
            getPublicURL(
                BUCKETS.profile,
                latest.name
            );


        frame.innerHTML = `
            <img
                src="${url}"
                alt="Edwin Kuchio Okello"
                class="profile-image"
            >
        `;


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    if (!await requireAdmin()) {
        return;
    }


    const input =
        document.getElementById("pictorialFile");


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select one or more photographs.",
            "error"
        );

        return;

    }


    try {

        showAdminMessage(
            "Uploading photographs...",
            "info"
        );


        const files =
            Array.from(input.files);


        for (const file of files) {

            if (!file.type.startsWith("image/")) {
                continue;
            }


            const fileName =
                createStorageName(file);


            await uploadFile(
                BUCKETS.pictorial,
                fileName,
                file
            );

        }


        showAdminMessage(
            files.length +
            " pictorial image(s) uploaded successfully.",
            "success"
        );


        input.value = "";

        await loadPictorial();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            "Pictorial upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   LOAD PICTORIAL
========================================================= */

async function loadPictorial() {

    const gallery =
        document.getElementById("gallery");


    if (!gallery) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.pictorial)
                .list(
                    "",
                    {
                        limit: 200,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    }
                );


        if (error) {
            throw error;
        }


        const images =
            data.filter(function (file) {

                return /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(file.name);

            });


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
            images.map(function (image) {

                const url =
                    getPublicURL(
                        BUCKETS.pictorial,
                        image.name
                    );


                return `
                    <div class="gallery-item">

                        <img
                            src="${url}"
                            alt="Portfolio photograph"
                            loading="lazy"
                        >

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );

    }

}


/* =========================================================
   GENERIC DOCUMENT UPLOAD
========================================================= */

async function uploadDocuments(
    inputId,
    bucket,
    statusId,
    folder = ""
) {

    if (!await requireAdmin()) {
        return;
    }


    const input =
        document.getElementById(inputId);

    const status =
        document.getElementById(statusId);


    if (!input || !input.files.length) {

        if (status) {

            status.textContent =
                "Please select one or more files.";

        }

        return;

    }


    const files =
        Array.from(input.files);


    try {

        if (status) {

            status.textContent =
                "Uploading " +
                files.length +
                " file(s)...";

        }


        let uploaded =
            0;


        for (const file of files) {

            const storageName =
                createStorageName(file);


            const path =
                folder
                    ? folder + "/" + storageName
                    : storageName;


            await uploadFile(
                bucket,
                path,
                file
            );


            uploaded++;

        }


        if (status) {

            status.textContent =
                uploaded +
                " file(s) uploaded successfully.";

        }


        input.value = "";


    } catch (error) {

        console.error(error);


        if (status) {

            status.textContent =
                "Upload failed: " +
                error.message;

        }

    }

}


/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    await uploadDocuments(

        "academicFile",

        BUCKETS.academic,

        "academicUploadStatus"

    );


    await loadAcademicDocuments();

}


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    await uploadDocuments(

        "portfolioFile",

        BUCKETS.professional,

        "portfolioUploadStatus"

    );


    await loadPortfolioDocuments();

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    await uploadDocuments(

        "ekoFile",

        BUCKETS.eko,

        "ekoUploadStatus",

        "projects"

    );


    await loadEKOProjects();

}


/* =========================================================
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    await uploadDocuments(

        "ekoPortfolioFile",

        BUCKETS.eko,

        "ekoPortfolioUploadStatus",

        "portfolio"

    );


    await loadEKOPortfolio();

}


/* =========================================================
   STORAGE LISTING
========================================================= */

async function listAllFiles(
    bucket,
    folder = ""
) {

    const allFiles = [];

    let offset = 0;

    const limit = 100;


    while (true) {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(bucket)
                .list(
                    folder,
                    {
                        limit: limit,
                        offset: offset,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    }
                );


        if (error) {
            throw error;
        }


        if (!data || !data.length) {
            break;
        }


        allFiles.push(
            ...data
        );


        if (data.length < limit) {
            break;
        }


        offset += limit;

    }


    return allFiles;

}


/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(name) {

    const extension =
        name
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf") {

        return "fa-file-pdf";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "fa-file-word";

    }


    if (
        extension === "xls" ||
        extension === "xlsx" ||
        extension === "csv"
    ) {

        return "fa-file-excel";

    }


    if (
        extension === "ppt" ||
        extension === "pptx"
    ) {

        return "fa-file-powerpoint";

    }


    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "webp" ||
        extension === "gif"
    ) {

        return "fa-file-image";

    }


    return "fa-file";

}


/* =========================================================
   DOCUMENT CARD
========================================================= */

function createDocumentCard(
    file,
    bucket,
    path
) {

    const url =
        getPublicURL(
            bucket,
            path
        );


    const safeName =
        escapeHTML(file.name);


    return `
        <article class="uploaded-document">

            <div class="document-icon">

                <i class="fas ${getFileIcon(file.name)}"></i>

            </div>


            <div class="document-info">

                <h4>
                    ${safeName}
                </h4>

                <span>
                    ${bucket}
                </span>

            </div>


            <div class="document-actions">

                <button
                    type="button"
                    class="document-view-btn"
                    onclick="viewFile('${escapeAttribute(url)}')">

                    <i class="fas fa-eye"></i>

                    VIEW

                </button>


                <button
                    type="button"
                    class="document-download-btn"
                    onclick="downloadFile(
                        '${escapeAttribute(url)}',
                        '${escapeAttribute(file.name)}'
                    )">

                    <i class="fas fa-download"></i>

                    DOWNLOAD

                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById(
            "academicDocuments"
        );


    if (!container) {
        return;
    }


    try {

        const files =
            await listAllFiles(
                BUCKETS.academic
            );


        if (!files.length) {

            showEmptyDocuments(
                container,
                "No academic documents have been uploaded yet."
            );

            return;

        }


        container.innerHTML =
            files.map(function (file) {

                return createDocumentCard(
                    file,
                    BUCKETS.academic,
                    file.name
                );

            }).join("");


    } catch (error) {

        console.error(error);

        showDocumentError(
            container
        );

    }

}


/* =========================================================
   PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById(
            "portfolioDocuments"
        );


    if (!container) {
        return;
    }


    try {

        const files =
            await listAllFiles(
                BUCKETS.professional
            );


        if (!files.length) {

            showEmptyDocuments(
                container,
                "No professional portfolio materials have been uploaded yet."
            );

            return;

        }


        container.innerHTML =
            files.map(function (file) {

                return createDocumentCard(
                    file,
                    BUCKETS.professional,
                    file.name
                );

            }).join("");


    } catch (error) {

        console.error(error);

        showDocumentError(
            container
        );

    }

}


/* =========================================================
   EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        document.getElementById(
            "ekoProjects"
        );


    if (!container) {
        return;
    }


    try {

        const files =
            await listAllFiles(
                BUCKETS.eko,
                "projects"
            );


        if (!files.length) {

            showEmptyDocuments(
                container,
                "No additional EKO projects have been uploaded yet."
            );

            return;

        }


        container.innerHTML =
            files.map(function (file) {

                const path =
                    "projects/" +
                    file.name;


                return createDocumentCard(
                    file,
                    BUCKETS.eko,
                    path
                );

            }).join("");


    } catch (error) {

        console.error(error);

        showDocumentError(
            container
        );

    }

}


/* =========================================================
   EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        document.getElementById(
            "ekoPortfolioDocuments"
        );


    if (!container) {
        return;
    }


    try {

        const files =
            await listAllFiles(
                BUCKETS.eko,
                "portfolio"
            );


        if (!files.length) {

            showEmptyDocuments(
                container,
                "No EKO portfolio materials have been uploaded yet."
            );

            return;

        }


        container.innerHTML =
            files.map(function (file) {

                const path =
                    "portfolio/" +
                    file.name;


                return createDocumentCard(
                    file,
                    BUCKETS.eko,
                    path
                );

            }).join("");


    } catch (error) {

        console.error(error);

        showDocumentError(
            container
        );

    }

}


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}


/* =========================================================
   VIEW FILE
========================================================= */

function viewFile(url) {

    if (!url) {

        alert(
            "The file could not be opened."
        );

        return;

    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   DOWNLOAD FILE
========================================================= */

async function downloadFile(
    url,
    filename
) {

    if (!url) {

        alert(
            "The file could not be downloaded."
        );

        return;

    }


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to retrieve the file."
            );

        }


        const blob =
            await response.blob();


        const blobURL =
            window.URL.createObjectURL(
                blob
            );


        const anchor =
            document.createElement("a");


        anchor.href =
            blobURL;

        anchor.download =
            filename || "download";


        document.body.appendChild(
            anchor
        );


        anchor.click();


        anchor.remove();


        window.URL.revokeObjectURL(
            blobURL
        );


    } catch (error) {

        console.error(
            "Download error:",
            error
        );


        /*
         * Fallback:
         * open the file if the browser blocks
         * cross-origin downloading.
         */

        const anchor =
            document.createElement("a");


        anchor.href =
            url;

        anchor.target =
            "_blank";

        anchor.rel =
            "noopener noreferrer";


        document.body.appendChild(
            anchor
        );


        anchor.click();


        anchor.remove();

    }

}


/* =========================================================
   DIRECT CV VIEW
========================================================= */

function viewCV() {

    const button =
        document.getElementById(
            "viewCV"
        );


    if (!button || !button.href) {

        return;

    }


    window.open(
        button.href,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   DIRECT CV DOWNLOAD
========================================================= */

function downloadCV() {

    const button =
        document.getElementById(
            "downloadCV"
        );


    if (!button || !button.href) {

        return;

    }


    downloadFile(
        button.href,
        "Edwin_Kuchio_Okello_CV.pdf"
    );

}


/* =========================================================
   ACTIVATE VIEW BUTTON
========================================================= */

function activateViewButton(
    button,
    url
) {

    if (!button) {
        return;
    }


    button.disabled =
        false;


    button.removeAttribute(
        "aria-disabled"
    );


    button.href =
        url;


    button.target =
        "_blank";


    button.rel =
        "noopener noreferrer";


    button.onclick =
        function (event) {

            event.preventDefault();

            viewFile(url);

        };

}


/* =========================================================
   ACTIVATE DOWNLOAD BUTTON
========================================================= */

function activateDownloadButton(
    button,
    url,
    filename
) {

    if (!button) {
        return;
    }


    button.disabled =
        false;


    button.removeAttribute(
        "aria-disabled"
    );


    button.href =
        url;


    button.removeAttribute(
        "target"
    );


    button.onclick =
        function (event) {

            event.preventDefault();

            downloadFile(
                url,
                filename
            );

        };

}


/* =========================================================
   DISABLE BUTTON
========================================================= */

function disableButton(button) {

    if (!button) {
        return;
    }


    button.disabled =
        true;


    button.setAttribute(
        "aria-disabled",
        "true"
    );


    button.removeAttribute(
        "href"
    );


    button.onclick =
        null;

}


/* =========================================================
   MODAL SYSTEM
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


                closeAdmin();

            }

        }
    );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        console.warn(
            "Modal not found:",
            id
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );


    if (id === "ekoModal") {

        loadEKOProjects();

        loadEKOPortfolio();

    }


    if (id === "academicModal") {

        loadAcademicDocuments();

    }


    if (id === "portfolioModal") {

        loadPortfolioDocuments();

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   EMPTY DOCUMENT STATE
========================================================= */

function showEmptyDocuments(
    container,
    message
) {

    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-folder-open"></i>

            <h3>
                Nothing uploaded yet
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   DOCUMENT ERROR
========================================================= */

function showDocumentError(
    container
) {

    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-triangle-exclamation"></i>

            <h3>
                Unable to load documents
            </h3>

            <p>
                Please try again later.
            </p>

        </div>

    `;

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================================
   GLOBAL FUNCTIONS
   These make inline onclick="" calls work even when
   the script is loaded normally.
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

window.uploadEKOPortfolio =
    uploadEKOPortfolio;

window.uploadAcademicDocuments =
    uploadAcademicDocuments;

window.uploadPortfolioDocuments =
    uploadPortfolioDocuments;

window.loadEKOProjects =
    loadEKOProjects;

window.loadEKOPortfolio =
    loadEKOPortfolio;

window.loadAcademicDocuments =
    loadAcademicDocuments;

window.loadPortfolioDocuments =
    loadPortfolioDocuments;

window.openProject01 =
    openProject01;

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.viewFile =
    viewFile;

window.downloadFile =
    downloadFile;

window.viewCV =
    viewCV;

window.downloadCV =
    downloadCV;


/* =========================================================
   SUPABASE AUTH STATE LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        currentSession =
            session;


        if (session) {

            showAdminDashboard();

        } else {

            showLoginArea();

        }

    }
);
