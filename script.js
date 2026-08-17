/* =========================================================
   EKO / EDWIN KUCHIO OKELLO PORTFOLIO
   SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
    "https://cueajmzcmawvcbpwuyhi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_hUjTnuPCkxB2ysGoYZq0Mg_uhymAbhb";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   BUCKET NAMES
========================================================= */

const BUCKETS = {

    CV: "CV",

    PROFILE: "Profile",

    PICTORIAL: "Pictorial",

    EKO: "eko",

    EKO_PORTFOLIO: "eko",

    ACADEMIC: "Academic Essays and Research",

    PROFESSIONAL: "Professional Portfolio"

};


/* =========================================================
   GENERAL HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showMessage(message, type = "info") {

    const box = $("adminMessage");

    if (!box) return;

    box.textContent = message;

    box.style.color =
        type === "error"
            ? "#8b1e2d"
            : type === "success"
                ? "#08704b"
                : "#0b1f3a";

}


function setStatus(id, message, type = "info") {

    const element = $(id);

    if (!element) return;

    element.textContent = message;

    element.style.color =
        type === "error"
            ? "#8b1e2d"
            : type === "success"
                ? "#08704b"
                : "#687482";

}


function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


function getFileIcon(fileName) {

    const extension =
        fileName
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
        extension === "gif" ||
        extension === "webp"
    ) {
        return "fa-file-image";
    }

    return "fa-file-lines";

}


/* =========================================================
   PUBLIC FILE URL
========================================================= */

function publicFileUrl(bucket, path) {

    const result =
        db.storage
          .from(bucket)
          .getPublicUrl(path);

    return result.data.publicUrl;

}


/* =========================================================
   DOWNLOAD URL
========================================================= */

function downloadFileUrl(bucket, path) {

    const publicUrl =
        publicFileUrl(bucket, path);

    return publicUrl +
        "?download=" +
        encodeURIComponent(
            path.split("/").pop()
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

const menuToggle = $("menuToggle");
const navLinks = $("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("open");

            const icon =
                menuToggle.querySelector("i");

            if (navLinks.classList.contains("open")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }
    );


    navLinks.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove("open");

                    const icon =
                        menuToggle.querySelector("i");

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }
            );

        });

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


document.querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    modal.classList.remove("active");

                    document.body.classList.remove("modal-open");

                }

            }
        );

    });


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            document.querySelectorAll(".modal.active")
                .forEach(modal => {
                    modal.classList.remove("active");
                });

            document.body.classList.remove("modal-open");

        }

    }
);


function openEKO() {

    openModal("ekoModal");

    loadEKOPortfolio();

    loadEKOProjects();

}


function openAcademic() {

    openModal("academicModal");

    loadAcademicDocuments();

}


function openProfessional() {

    openModal("portfolioModal");

    loadPortfolioDocuments();

}


function openProject01() {

    openModal("project01Modal");

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop = $("backToTop");


function handleBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 450) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

}


window.addEventListener(
    "scroll",
    handleBackToTop,
    { passive: true }
);


if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}

handleBackToTop();


/* =========================================================
   YEAR
========================================================= */

if ($("year")) {

    $("year").textContent =
        new Date().getFullYear();

}


/* =========================================================
   ADMIN PANEL
========================================================= */

const adminLock = $("adminLock");
const adminPanel = $("adminPanel");


if (adminLock) {

    adminLock.addEventListener(
        "click",
        openAdmin
    );

}


function openAdmin() {

    if (!adminPanel) return;

    adminPanel.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeAdmin() {

    if (!adminPanel) return;

    adminPanel.classList.remove("active");

    document.body.classList.remove("modal-open");

}


if (adminPanel) {

    adminPanel.addEventListener(
        "click",
        event => {

            if (event.target === adminPanel) {

                closeAdmin();

            }

        }
    );

}


/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

async function adminLogin() {

    const email =
        $("adminEmail").value.trim();

    const password =
        $("adminPassword").value;

    if (!email || !password) {

        showMessage(
            "Please enter your administrator email and password.",
            "error"
        );

        return;

    }

    showMessage(
        "Signing in...",
        "info"
    );


    try {

        const { data, error } =
            await db.auth.signInWithPassword({
                email,
                password
            });


        if (error) {

            throw error;

        }


        if (!data.user) {

            throw new Error(
                "Administrator account could not be verified."
            );

        }


        $("loginArea").style.display = "none";

        $("adminDashboard").style.display = "block";

        showMessage(
            "Administrator access granted.",
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "Login failed: " + error.message,
            "error"
        );

    }

}


/* =========================================================
   RESTORE EXISTING SESSION
========================================================= */

async function restoreAdminSession() {

    try {

        const { data } =
            await db.auth.getSession();

        if (data.session) {

            $("loginArea").style.display = "none";

            $("adminDashboard").style.display = "block";

        }

    } catch (error) {

        console.error(
            "Session restore error:",
            error
        );

    }

}


restoreAdminSession();


/* =========================================================
   LOGOUT
========================================================= */

async function adminLogout() {

    await db.auth.signOut();

    $("loginArea").style.display = "block";

    $("adminDashboard").style.display = "none";

    $("adminEmail").value = "";
    $("adminPassword").value = "";

    showMessage(
        "You have been signed out.",
        "success"
    );

}


/* =========================================================
   REQUIRE ADMIN
========================================================= */

async function requireAdmin() {

    const { data, error } =
        await db.auth.getSession();

    if (error || !data.session) {

        showMessage(
            "Please sign in as administrator first.",
            "error"
        );

        return null;

    }

    return data.session.user;

}


/* =========================================================
   GENERIC MULTI-FILE UPLOAD
========================================================= */

async function uploadFiles(
    inputId,
    bucket,
    statusId,
    folder = ""
) {

    const user =
        await requireAdmin();

    if (!user) return;


    const input = $(inputId);

    if (!input || !input.files.length) {

        setStatus(
            statusId,
            "Please select one or more files.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);

    let successCount = 0;

    let errors = [];


    setStatus(
        statusId,
        `Uploading ${files.length} file(s)...`
    );


    for (const file of files) {

        try {

            const safeName =
                file.name
                    .replace(/[^\w.\-() ]+/g, "_")
                    .replace(/\s+/g, "_");


            const uniqueName =
                `${Date.now()}_${Math.random()
                    .toString(36)
                    .substring(2, 9)}_${safeName}`;


            const path =
                folder
                    ? `${folder}/${uniqueName}`
                    : uniqueName;


            const { error } =
                await db.storage
                    .from(bucket)
                    .upload(
                        path,
                        file,
                        {
                            cacheControl: "3600",
                            upsert: false,
                            contentType:
                                file.type || undefined
                        }
                    );


            if (error) {

                throw error;

            }


            successCount++;

        } catch (error) {

            console.error(error);

            errors.push(
                `${file.name}: ${error.message}`
            );

        }

    }


    input.value = "";


    if (errors.length === 0) {

        setStatus(
            statusId,
            `Successfully uploaded ${successCount} file(s).`,
            "success"
        );

    } else {

        setStatus(
            statusId,
            `Uploaded ${successCount} file(s). ${errors.length} failed.`,
            "error"
        );

        console.error(errors);

    }


    await refreshAllPublicContent();

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const user =
        await requireAdmin();

    if (!user) return;


    const input =
        $("cvFile");

    if (!input.files.length) {

        setStatus(
            "cvUploadStatus",
            "Please select a PDF CV.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    try {

        setStatus(
            "cvUploadStatus",
            "Uploading CV..."
        );


        const fileName =
            `${Date.now()}_${file.name
                .replace(/[^\w.\-]+/g, "_")}`;


        const { error } =
            await db.storage
                .from(BUCKETS.CV)
                .upload(
                    fileName,
                    file,
                    {
                        upsert: false,
                        cacheControl: "3600",
                        contentType:
                            "application/pdf"
                    }
                );


        if (error) throw error;


        input.value = "";


        setStatus(
            "cvUploadStatus",
            "CV uploaded successfully.",
            "success"
        );


        await loadCV();

    } catch (error) {

        console.error(error);

        setStatus(
            "cvUploadStatus",
            error.message,
            "error"
        );

    }

}


/* =========================================================
   PROFILE UPLOAD
========================================================= */

async function uploadProfile() {

    const user =
        await requireAdmin();

    if (!user) return;


    const input =
        $("profileFile");

    if (!input.files.length) {

        setStatus(
            "profileUploadStatus",
            "Please select a photograph.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    try {

        setStatus(
            "profileUploadStatus",
            "Uploading profile photograph..."
        );


        const fileName =
            `${Date.now()}_${file.name
                .replace(/[^\w.\-]+/g, "_")}`;


        const { error } =
            await db.storage
                .from(BUCKETS.PROFILE)
                .upload(
                    fileName,
                    file,
                    {
                        upsert: false,
                        cacheControl: "3600",
                        contentType:
                            file.type
                    }
                );


        if (error) throw error;


        input.value = "";


        setStatus(
            "profileUploadStatus",
            "Profile photograph uploaded.",
            "success"
        );


        await loadProfile();

    } catch (error) {

        console.error(error);

        setStatus(
            "profileUploadStatus",
            error.message,
            "error"
        );

    }

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    await uploadFiles(
        "pictorialFile",
        BUCKETS.PICTORIAL,
        "pictorialUploadStatus"
    );

}


/* =========================================================
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    await uploadFiles(
        "ekoPortfolioFile",
        BUCKETS.EKO_PORTFOLIO,
        "ekoPortfolioUploadStatus",
        "eko-portfolio"
    );

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    await uploadFiles(
        "ekoFile",
        BUCKETS.EKO,
        "ekoUploadStatus",
        "projects"
    );

}


/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    await uploadFiles(
        "academicFile",
        BUCKETS.ACADEMIC,
        "academicUploadStatus"
    );

}


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    await uploadFiles(
        "portfolioFile",
        BUCKETS.PROFESSIONAL,
        "portfolioUploadStatus"
    );

}


/* =========================================================
   LIST BUCKET FILES
========================================================= */

async function listFiles(
    bucket,
    folder = ""
) {

    try {

        const { data, error } =
            await db.storage
                .from(bucket)
                .list(
                    folder,
                    {
                        limit: 100,
                        offset: 0,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    }
                );


        if (error) {

            throw error;

        }


        return (data || [])
            .filter(
                item =>
                    item.name &&
                    !item.name.startsWith(".")
            );

    } catch (error) {

        console.error(
            `Error loading ${bucket}:`,
            error
        );

        return [];

    }

}


/* =========================================================
   DOCUMENT CARD
========================================================= */

function documentCard(
    bucket,
    item,
    folder = ""
) {

    const path =
        folder
            ? `${folder}/${item.name}`
            : item.name;


    const viewUrl =
        publicFileUrl(
            bucket,
            path
        );


    const downloadUrl =
        downloadFileUrl(
            bucket,
            path
        );


    const icon =
        getFileIcon(item.name);


    const created =
        formatDate(
            item.created_at
        );


    return `

        <article class="document-card">

            <div class="document-info">

                <div class="document-icon">

                    <i class="fas ${icon}"></i>

                </div>

                <div>

                    <div class="document-name">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="document-date">
                        ${created}
                    </div>

                </div>

            </div>


            <div class="document-actions">

                <a
                    class="view-btn"
                    href="${viewUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View file">

                    <i class="fas fa-eye"></i>
                    VIEW

                </a>


                <a
                    class="download-btn"
                    href="${downloadUrl}"
                    download="${escapeHTML(item.name)}"
                    title="Download file">

                    <i class="fas fa-download"></i>
                    DOWNLOAD

                </a>

            </div>

        </article>

    `;

}


/* =========================================================
   EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        $("ekoPortfolioDocuments");

    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>Loading EKO portfolio...</h3>

        </div>

    `;


    const files =
        await listFiles(
            BUCKETS.EKO_PORTFOLIO,
            "eko-portfolio"
        );


    if (!files.length) {

        container.innerHTML = `

            <div class="document-empty">

                <i class="fas fa-folder-open"></i>

                <h3>
                    EKO portfolio coming soon
                </h3>

                <p>
                    The administrator can upload the EKO portfolio
                    through the administrator area.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        files
            .map(
                file =>
                    documentCard(
                        BUCKETS.EKO_PORTFOLIO,
                        file,
                        "eko-portfolio"
                    )
            )
            .join("");

}


/* =========================================================
   EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        $("ekoProjects");

    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading EKO projects...
            </h3>

        </div>

    `;


    const files =
        await listFiles(
            BUCKETS.EKO,
            "projects"
        );


    if (!files.length) {

        container.innerHTML = `

            <div class="document-empty">

                <i class="fas fa-folder-open"></i>

                <h3>
                    No additional EKO projects yet
                </h3>

                <p>
                    New EKO projects uploaded by the administrator
                    will automatically appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        files
            .map(
                file =>
                    documentCard(
                        BUCKETS.EKO,
                        file,
                        "projects"
                    )
            )
            .join("");

}


/* =========================================================
   ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        $("academicDocuments");

    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading academic work...
            </h3>

        </div>

    `;


    const files =
        await listFiles(
            BUCKETS.ACADEMIC
        );


    if (!files.length) {

        container.innerHTML = `

            <div class="document-empty">

                <i class="fas fa-book-open"></i>

                <h3>
                    No academic documents yet
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML =
        files
            .map(
                file =>
                    documentCard(
                        BUCKETS.ACADEMIC,
                        file
                    )
            )
            .join("");

}


/* =========================================================
   PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        $("portfolioDocuments");

    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading professional portfolio...
            </h3>

        </div>

    `;


    const files =
        await listFiles(
            BUCKETS.PROFESSIONAL
        );


    if (!files.length) {

        container.innerHTML = `

            <div class="document-empty">

                <i class="fas fa-briefcase"></i>

                <h3>
                    No professional materials yet
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML =
        files
            .map(
                file =>
                    documentCard(
                        BUCKETS.PROFESSIONAL,
                        file
                    )
            )
            .join("");

}


/* =========================================================
   CV
========================================================= */

async function loadCV() {

    const view =
        $("viewCV");

    const download =
        $("downloadCV");

    const status =
        $("cvStatus");


    if (!view || !download) return;


    if (status) {

        status.textContent =
            "Loading CV...";

    }


    const files =
        await listFiles(
            BUCKETS.CV
        );


    if (!files.length) {

        view.href = "#";
        download.href = "#";

        view.classList.add(
            "disabled-link"
        );

        download.classList.add(
            "disabled-link"
        );

        if (status) {

            status.textContent =
                "CV is currently unavailable.";

        }

        return;

    }


    /*
       The newest CV is treated as the current CV.
    */

    const latest =
        files[0];


    const viewUrl =
        publicFileUrl(
            BUCKETS.CV,
            latest.name
        );


    const downloadUrl =
        downloadFileUrl(
            BUCKETS.CV,
            latest.name
        );


    view.href = viewUrl;

    download.href = downloadUrl;

    download.setAttribute(
        "download",
        latest.name
    );


    view.classList.remove(
        "disabled-link"
    );

    download.classList.remove(
        "disabled-link"
    );


    if (status) {

        status.textContent =
            `Current CV: ${latest.name}`;

    }

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    const frame =
        $("profileFrame");

    if (!frame) return;


    const files =
        await listFiles(
            BUCKETS.PROFILE
        );


    if (!files.length) return;


    const latest =
        files[0];


    const url =
        publicFileUrl(
            BUCKETS.PROFILE,
            latest.name
        );


    frame.innerHTML = `

        <img
            src="${url}"
            alt="Edwin Kuchio Okello profile photograph">

    `;

}


/* =========================================================
   PICTORIAL
========================================================= */

async function loadGallery() {

    const gallery =
        $("gallery");

    if (!gallery) return;


    const files =
        await listFiles(
            BUCKETS.PICTORIAL
        );


    if (!files.length) {

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
        files
            .map(file => {

                const url =
                    publicFileUrl(
                        BUCKETS.PICTORIAL,
                        file.name
                    );


                return `

                    <div class="gallery-item">

                        <img
                            src="${url}"
                            alt="${escapeHTML(file.name)}"
                            loading="lazy">

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   LOAD ALL PUBLIC CONTENT
========================================================= */

async function refreshAllPublicContent() {

    await Promise.all([
        loadCV(),
        loadProfile(),
        loadGallery()
    ]);

}


/* =========================================================
   INITIALISE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Edwin Kuchio Okello Portfolio initialising..."
        );

        await refreshAllPublicContent();

    }
);


/* =========================================================
   EXPOSE FUNCTIONS TO HTML
========================================================= */

window.openModal = openModal;
window.closeModal = closeModal;

window.openAdmin = openAdmin;
window.closeAdmin = closeAdmin;

window.adminLogin = adminLogin;
window.adminLogout = adminLogout;

window.uploadCV = uploadCV;
window.uploadProfile = uploadProfile;
window.uploadPictorial = uploadPictorial;

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

window.loadEKOPortfolio =
    loadEKOPortfolio;

window.loadAcademicDocuments =
    loadAcademicDocuments;

window.loadPortfolioDocuments =
    loadPortfolioDocuments;

window.openEKO = openEKO;
window.openAcademic = openAcademic;
window.openProfessional = openProfessional;

window.openProject01 =
    openProject01;
