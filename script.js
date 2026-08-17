/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://cueajmzcmawvcbpwuyhi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hUjTnuPCkxB2ysGoYZq0Mg_uhymAbhb";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   BUCKETS
========================================================= */

const BUCKETS = {
    eko: "eko",
    academic: "Academic Essays and Research",
    professional: "Professional Portfolio",
    pictorial: "Pictorial",
    profile: "Profile",
    cv: "CV"
};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("year").textContent =
        new Date().getFullYear();

    setupNavigation();
    setupBackToTop();
    setupAdminLock();

    await loadProfile();
    await loadGallery();
    await loadCV();

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (session) {
        showAdminDashboard();
    }

});


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

        });

    });

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("active");

            document.body.style.overflow = "";

        }

    });

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document.querySelectorAll(".modal.active")
            .forEach(modal => modal.classList.remove("active"));

        document.body.style.overflow = "";

    }

});


/* =========================================================
   BACK TO TOP
========================================================= */

function setupBackToTop() {

    const button =
        document.getElementById("backToTop");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            button.classList.add("visible");

        } else {

            button.classList.remove("visible");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   ADMIN LOCK
========================================================= */

function setupAdminLock() {

    const button =
        document.getElementById("adminLock");

    if (!button) return;

    button.addEventListener("click", () => {

        const panel =
            document.getElementById("adminPanel");

        panel.classList.add("active");

        document.body.style.overflow = "hidden";

    });

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
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    const message =
        document.getElementById("adminMessage");

    if (!email || !password) {

        message.textContent =
            "Please enter your administrator email and password.";

        return;
    }

    message.textContent = "Signing in...";

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {

        message.textContent =
            "Login failed: " + error.message;

        return;
    }

    if (!data.session) {

        message.textContent =
            "Login was not completed.";

        return;
    }

    message.textContent = "";

    showAdminDashboard();

}


function showAdminDashboard() {

    document.getElementById("loginArea")
        .style.display = "none";

    document.getElementById("adminDashboard")
        .style.display = "block";

}


async function adminLogout() {

    await supabaseClient.auth.signOut();

    document.getElementById("loginArea")
        .style.display = "block";

    document.getElementById("adminDashboard")
        .style.display = "none";

    document.getElementById("adminEmail").value = "";
    document.getElementById("adminPassword").value = "";

}


/* =========================================================
   FILE UTILITIES
========================================================= */

function getFileIcon(filename) {

    const ext =
        filename.split(".").pop().toLowerCase();

    if (["pdf"].includes(ext))
        return "fa-file-pdf";

    if (["doc", "docx"].includes(ext))
        return "fa-file-word";

    if (["xls", "xlsx", "csv"].includes(ext))
        return "fa-file-excel";

    if (["ppt", "pptx"].includes(ext))
        return "fa-file-powerpoint";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
        return "fa-file-image";

    if (["txt"].includes(ext))
        return "fa-file-lines";

    return "fa-file";
}


function getPublicUrl(bucket, path) {

    const {
        data
    } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}


function escapeHTML(value) {

    return String(value)
        .replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

}


/* =========================================================
   DOCUMENT CARD
========================================================= */

function createDocumentCard(
    bucket,
    file,
    type = ""
) {

    const path =
        file.fullPath || file.name;

    const url =
        getPublicUrl(bucket, path);

    const name =
        file.name;

    const icon =
        getFileIcon(name);

    const ekoClass =
        type === "eko" ? "eko-document" : "";

    return `
        <article class="document-card ${ekoClass}">

            <div class="document-top">

                <div class="file-icon">
                    <i class="fas ${icon}"></i>
                </div>

                <div>

                    <h4>
                        ${escapeHTML(name)}
                    </h4>

                    <small>
                        ${escapeHTML(type || "Portfolio document")}
                    </small>

                </div>

            </div>

            <div class="document-actions">

                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-btn"
                    aria-label="View ${escapeHTML(name)}">

                    <i class="fas fa-eye"></i>
                    View
                </a>

                <a
                    href="${url}"
                    download="${escapeHTML(name)}"
                    class="download-btn"
                    aria-label="Download ${escapeHTML(name)}">

                    <i class="fas fa-download"></i>
                    Download
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   LIST FILES
========================================================= */

async function listFiles(bucket, folder = "") {

    const {
        data,
        error
    } = await supabaseClient.storage
        .from(bucket)
        .list(folder, {
            limit: 100,
            offset: 0,
            sortBy: {
                column: "created_at",
                order: "desc"
            }
        });

    if (error) {

        console.error(
            `Error listing ${bucket}/${folder}:`,
            error
        );

        return [];

    }

    return (data || [])
        .filter(file => file.name !== ".emptyFolderPlaceholder")
        .map(file => {

            return {
                ...file,
                fullPath: folder
                    ? `${folder}/${file.name}`
                    : file.name
            };

        });

}


/* =========================================================
   EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        document.getElementById(
            "ekoPortfolioDocuments"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading EKO Portfolio...
        </div>
    `;

    const files =
        await listFiles(
            BUCKETS.eko,
            "portfolio"
        );

    if (!files.length) {

        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-briefcase"></i>
                <h3>EKO Portfolio</h3>
                <p>
                    The EKO Analytics & Research portfolio
                    will appear here once uploaded.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        files.map(file =>
            createDocumentCard(
                BUCKETS.eko,
                file,
                "EKO Portfolio"
            )
        ).join("");

}


/* =========================================================
   EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        document.getElementById("ekoProjects");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading EKO Projects...
        </div>
    `;

    const files =
        await listFiles(
            BUCKETS.eko,
            "projects"
        );

    if (!files.length) {

        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-folder-open"></i>
                <h3>No additional projects yet</h3>
                <p>
                    Future EKO projects uploaded through
                    the Administrator area will automatically
                    appear here.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        files.map(file =>
            createDocumentCard(
                BUCKETS.eko,
                file,
                "EKO Project"
            )
        ).join("");

}


async function loadEKOContent() {

    await loadEKOPortfolio();
    await loadEKOProjects();

}


/* =========================================================
   ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById(
            "academicDocuments"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading academic work...
        </div>
    `;

    const files =
        await listFiles(
            BUCKETS.academic
        );

    if (!files.length) {

        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-book-open"></i>
                <h3>No academic documents yet</h3>
                <p>
                    Uploaded essays and research papers
                    will appear here.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        files.map(file =>
            createDocumentCard(
                BUCKETS.academic,
                file,
                "Academic Essay / Research"
            )
        ).join("");

}


/* =========================================================
   PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById(
            "portfolioDocuments"
        );

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading professional portfolio...
        </div>
    `;

    const files =
        await listFiles(
            BUCKETS.professional
        );

    if (!files.length) {

        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-briefcase"></i>
                <h3>No professional materials yet</h3>
                <p>
                    Uploaded professional portfolio
                    materials will appear here.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        files.map(file =>
            createDocumentCard(
                BUCKETS.professional,
                file,
                "Professional Portfolio"
            )
        ).join("");

}


/* =========================================================
   CV
========================================================= */

async function loadCV() {

    const status =
        document.getElementById("cvStatus");

    const view =
        document.getElementById("viewCV");

    const download =
        document.getElementById("downloadCV");

    if (!status) return;

    const files =
        await listFiles(BUCKETS.cv);

    if (!files.length) {

        status.textContent =
            "CV currently unavailable.";

        return;
    }

    const file = files[0];

    const url =
        getPublicUrl(
            BUCKETS.cv,
            file.fullPath
        );

    view.href = url;
    download.href = url;

    view.classList.remove("disabled");
    download.classList.remove("disabled");

    status.textContent =
        "Current CV available for viewing and download.";

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    const frame =
        document.getElementById("profileFrame");

    if (!frame) return;

    const files =
        await listFiles(BUCKETS.profile);

    if (!files.length) return;

    const file = files[0];

    const url =
        getPublicUrl(
            BUCKETS.profile,
            file.fullPath
        );

    frame.innerHTML = `
        <img
            src="${url}"
            alt="Edwin Kuchio Okello profile photograph">
    `;

}


/* =========================================================
   GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) return;

    const files =
        await listFiles(BUCKETS.pictorial);

    if (!files.length) {

        gallery.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-images"></i>
                <h3>Your pictorial will appear here</h3>
                <p>
                    Images can be uploaded through
                    the Administrator area.
                </p>
            </div>
        `;

        return;
    }

    gallery.innerHTML =
        files.map(file => {

            const url =
                getPublicUrl(
                    BUCKETS.pictorial,
                    file.fullPath
                );

            return `
                <img
                    src="${url}"
                    alt="Portfolio photograph"
                    loading="lazy"
                    onclick="window.open('${url}','_blank')">
            `;

        }).join("");

}


/* =========================================================
   UPLOAD HELPER
========================================================= */

async function uploadFiles(
    bucket,
    files,
    folder,
    statusElement
) {

    if (!files || !files.length) {

        statusElement.textContent =
            "Please select one or more files.";

        return;

    }

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        statusElement.textContent =
            "Administrator login required.";

        return;

    }

    statusElement.textContent =
        `Uploading ${files.length} file(s)...`;

    let success = 0;

    for (const file of files) {

        const safeName =
            file.name.replace(/[^\w.\-() ]/g, "_");

        const uniqueName =
            `${Date.now()}_${Math.random()
                .toString(36)
                .substring(2,8)}_${safeName}`;

        const path =
            folder
                ? `${folder}/${uniqueName}`
                : uniqueName;

        const {
            error
        } = await supabaseClient.storage
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

            console.error(error);

            statusElement.textContent =
                `Upload error: ${error.message}`;

            continue;

        }

        success++;

    }

    statusElement.textContent =
        `${success} of ${files.length} file(s) uploaded successfully.`;

}


/* =========================================================
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    const input =
        document.getElementById(
            "ekoPortfolioFile"
        );

    const status =
        document.getElementById(
            "ekoPortfolioStatus"
        );

    await uploadFiles(
        BUCKETS.eko,
        input.files,
        "portfolio",
        status
    );

    input.value = "";

    await loadEKOPortfolio();

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    const input =
        document.getElementById(
            "ekoProjectFiles"
        );

    const status =
        document.getElementById(
            "ekoProjectStatus"
        );

    await uploadFiles(
        BUCKETS.eko,
        input.files,
        "projects",
        status
    );

    input.value = "";

    await loadEKOProjects();

}


/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById(
            "academicFiles"
        );

    const status =
        document.getElementById(
            "academicStatus"
        );

    await uploadFiles(
        BUCKETS.academic,
        input.files,
        "",
        status
    );

    input.value = "";

    await loadAcademicDocuments();

}


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById(
            "portfolioFiles"
        );

    const status =
        document.getElementById(
            "portfolioStatus"
        );

    await uploadFiles(
        BUCKETS.professional,
        input.files,
        "",
        status
    );

    input.value = "";

    await loadPortfolioDocuments();

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const input =
        document.getElementById("cvFile");

    const status =
        document.getElementById(
            "cvUploadStatus"
        );

    const files = input.files;

    if (!files.length) {

        status.textContent =
            "Please select a PDF.";

        return;

    }

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        status.textContent =
            "Administrator login required.";

        return;

    }

    status.textContent =
        "Uploading CV...";

    const file = files[0];

    const {
        error
    } = await supabaseClient.storage
        .from(BUCKETS.cv)
        .upload(
            `${Date.now()}_${file.name}`,
            file,
            {
                cacheControl: "3600",
                upsert: false
            }
        );

    if (error) {

        status.textContent =
            error.message;

        return;

    }

    status.textContent =
        "CV uploaded successfully.";

    input.value = "";

    await loadCV();

}


/* =========================================================
   PROFILE UPLOAD
========================================================= */

async function uploadProfile() {

    const input =
        document.getElementById(
            "profileFile"
        );

    const status =
        document.getElementById(
            "profileUploadStatus"
        );

    if (!input.files.length) {

        status.textContent =
            "Please select an image.";

        return;

    }

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        status.textContent =
            "Administrator login required.";

        return;

    }

    const file =
        input.files[0];

    status.textContent =
        "Uploading profile photograph...";

    const {
        error
    } = await supabaseClient.storage
        .from(BUCKETS.profile)
        .upload(
            `${Date.now()}_${file.name}`,
            file,
            {
                cacheControl: "3600",
                upsert: false
            }
        );

    if (error) {

        status.textContent =
            error.message;

        return;

    }

    status.textContent =
        "Profile photograph uploaded.";

    input.value = "";

    await loadProfile();

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById(
            "pictorialFiles"
        );

    const status =
        document.getElementById(
            "pictorialStatus"
        );

    await uploadFiles(
        BUCKETS.pictorial,
        input.files,
        "",
        status
    );

    input.value = "";

    await loadGallery();

}


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    openModal("project01Modal");

}


/* =========================================================
   GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "Portfolio error:",
            event.error
        );

    }
);
