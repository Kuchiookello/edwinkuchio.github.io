/* =========================================================
   EKO ANALYTICS & RESEARCH
   EDWIN KUCHIO OKELLO
   MAIN PORTFOLIO SCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   SUPABASE BUCKET NAMES
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
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeBackToTop();

    initializeAdminLock();

    initializeModals();

    initializeYear();

    loadProfilePicture();

    loadCV();

    loadPictorial();

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

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


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

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

    const backToTop = document.getElementById("backToTop");

    if (!backToTop) return;


    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("visible");

        } else {

            backToTop.classList.remove("visible");

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function initializeYear() {

    const year = document.getElementById("year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

}


/* =========================================================
   MODAL SYSTEM
========================================================= */

function initializeModals() {

    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {

                modal.classList.remove("active");

                document.body.classList.remove("modal-open");

            }

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            document.querySelectorAll(".modal.active").forEach(modal => {

                modal.classList.remove("active");

            });

            document.body.classList.remove("modal-open");

        }

    });

}


function openModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}


/* =========================================================
   ADMIN LOCK BUTTON
========================================================= */

function initializeAdminLock() {

    const adminLock = document.getElementById("adminLock");

    if (!adminLock) {

        console.warn("Admin lock button not found.");

        return;

    }


    adminLock.addEventListener("click", () => {

        openAdmin();

    });

}


function openAdmin() {

    const panel = document.getElementById("adminPanel");

    if (!panel) return;

    panel.classList.add("active");

    document.body.classList.add("admin-open");


    const session = getStoredSession();

    if (session) {

        showAdminDashboard();

    } else {

        showLoginArea();

    }

}


function closeAdmin() {

    const panel = document.getElementById("adminPanel");

    if (!panel) return;

    panel.classList.remove("active");

    document.body.classList.remove("admin-open");

}


/* =========================================================
   ADMIN LOGIN
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
                "Login failed. Please check your credentials.",
                "error"
            );

            return;

        }


        if (data.session) {

            localStorage.setItem(
                "eko_admin_session",
                "authenticated"
            );


            showAdminMessage(
                "Administrator access granted.",
                "success"
            );


            setTimeout(() => {

                showAdminDashboard();

            }, 500);

        }

    } catch (error) {

        console.error(error);

        showAdminMessage(
            "An unexpected error occurred during login.",
            "error"
        );

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

    } catch (error) {

        console.error(error);

    }


    localStorage.removeItem("eko_admin_session");

    showLoginArea();

    showAdminMessage(
        "You have been signed out.",
        "info"
    );

}


/* =========================================================
   SESSION CHECK
========================================================= */

function getStoredSession() {

    return localStorage.getItem(
        "eko_admin_session"
    );

}


/* =========================================================
   SHOW LOGIN
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
   SHOW ADMIN DASHBOARD
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
   ADMIN MESSAGES
========================================================= */

function showAdminMessage(message, type = "info") {

    const element =
        document.getElementById("adminMessage");

    if (!element) return;


    element.textContent = message;

    element.className =
        "admin-message " + type;

}


/* =========================================================
   UPLOAD STATUS
========================================================= */

function setUploadStatus(id, message, type = "info") {

    const element =
        document.getElementById(id);

    if (!element) return;


    element.textContent = message;

    element.className =
        "upload-status " + type;

}


/* =========================================================
   SAFE FILE NAME
========================================================= */

function createSafeFileName(file) {

    const originalName =
        file.name;

    const extension =
        originalName.includes(".")
            ? "." + originalName.split(".").pop()
            : "";

    const base =
        originalName
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .toLowerCase();


    const timestamp =
        Date.now();


    const random =
        Math.random()
            .toString(36)
            .substring(2, 8);


    return `${base}-${timestamp}-${random}${extension}`;

}


/* =========================================================
   GENERIC FILE UPLOAD
========================================================= */

async function uploadFileToBucket(
    file,
    bucket,
    folder = ""
) {

    if (!file) {

        throw new Error(
            "No file selected."
        );

    }


    const safeName =
        createSafeFileName(file);


    const path =
        folder
            ? `${folder}/${safeName}`
            : safeName;


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


    return path;

}


/* =========================================================
   PUBLIC FILE URL
========================================================= */

function getPublicFileUrl(bucket, path) {

    const { data } =
        supabaseClient.storage
            .from(bucket)
            .getPublicUrl(path);


    return data.publicUrl;

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const input =
        document.getElementById("cvFile");


    if (!input || !input.files.length) {

        showAdminMessage(
            "Please select a PDF CV.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        showAdminMessage(
            "The CV must be a PDF file.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading CV...",
        "info"
    );


    try {

        /*
         * CV is placed in the CV bucket.
         */

        const path =
            await uploadFileToBucket(
                file,
                BUCKETS.cv
            );


        /*
         * Store a simple reference
         * in localStorage so the
         * public page knows the
         * current CV.
         */

        localStorage.setItem(
            "eko_cv_path",
            path
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

    const view =
        document.getElementById("viewCV");

    const download =
        document.getElementById("downloadCV");

    const status =
        document.getElementById("cvStatus");


    if (!view || !download) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.cv)
                .list("", {
                    limit: 100,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || data.length === 0) {

            view.href = "#";

            download.href = "#";


            if (status) {

                status.textContent =
                    "No CV uploaded yet.";

            }

            return;

        }


        const pdfFiles =
            data.filter(file =>
                file.name
                    .toLowerCase()
                    .endsWith(".pdf")
            );


        if (!pdfFiles.length) {

            if (status) {

                status.textContent =
                    "No PDF CV found.";

            }

            return;

        }


        const latest =
            pdfFiles[0];


        const url =
            getPublicFileUrl(
                BUCKETS.cv,
                latest.name
            );


        view.href = url;

        download.href = url;


        if (status) {

            status.textContent =
                "CV available.";

        }

    } catch (error) {

        console.error(error);

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


    showAdminMessage(
        "Uploading profile picture...",
        "info"
    );


    try {

        const path =
            await uploadFileToBucket(
                file,
                BUCKETS.profile
            );


        localStorage.setItem(
            "eko_profile_path",
            path
        );


        showAdminMessage(
            "Profile picture uploaded successfully.",
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

    if (!frame) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.profile)
                .list("", {
                    limit: 100,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) return;


        const images =
            data.filter(file =>
                /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(file.name)
            );


        if (!images.length) return;


        const latest =
            images[0];


        const url =
            getPublicFileUrl(
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
            "Profile image error:",
            error
        );

    }

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById("pictorialFile");


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
        "info"
    );


    let uploaded = 0;


    try {

        for (const file of files) {

            await uploadFileToBucket(
                file,
                BUCKETS.pictorial
            );

            uploaded++;

        }


        input.value = "";


        showAdminMessage(
            `${uploaded} image(s) uploaded successfully.`,
            "success"
        );


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


    if (!gallery) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.pictorial)
                .list("", {
                    limit: 200,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) {

            gallery.innerHTML = `
                <div class="gallery-empty">
                    <i class="fas fa-images"></i>
                    <h3>Your pictorial will appear here</h3>
                    <p>
                        Images can be added through the administrator area.
                    </p>
                </div>
            `;

            return;

        }


        const images =
            data.filter(file =>
                /\.(jpg|jpeg|png|webp|gif)$/i
                    .test(file.name)
            );


        if (!images.length) return;


        gallery.innerHTML = "";


        images.forEach(file => {

            const url =
                getPublicFileUrl(
                    BUCKETS.pictorial,
                    file.name
                );


            const item =
                document.createElement("div");


            item.className =
                "gallery-item";


            item.innerHTML = `
                <img
                    src="${url}"
                    alt="Portfolio photograph"
                    loading="lazy"
                >
            `;


            gallery.appendChild(item);

        });


    } catch (error) {

        console.error(
            "Gallery error:",
            error
        );

    }

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

/*
 * IMPORTANT:
 *
 * EKO is the parent collection.
 *
 * You can upload:
 *
 * Project 01
 * Project 02
 * Project 03
 * Project 04
 * ...
 *
 * and as many projects as you want.
 *
 * The EKO PORTFOLIO can also be uploaded
 * separately through the dedicated function.
 */

async function uploadEKOProjects() {

    const input =
        document.getElementById("ekoFile");


    if (!input || !input.files.length) {

        setUploadStatus(
            "ekoUploadStatus",
            "Please select one or more EKO project files.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        "ekoUploadStatus",
        `Uploading ${files.length} EKO project(s)...`,
        "info"
    );


    let successful = 0;


    try {

        for (const file of files) {

            await uploadFileToBucket(
                file,
                BUCKETS.eko,
                "projects"
            );

            successful++;

        }


        input.value = "";


        setUploadStatus(
            "ekoUploadStatus",
            `${successful} EKO project(s) uploaded successfully.`,
            "success"
        );


        await loadEKOProjects();


    } catch (error) {

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
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    const input =
        document.getElementById("ekoPortfolioFile");


    if (!input || !input.files.length) {

        setUploadStatus(
            "ekoPortfolioUploadStatus",
            "Please select an EKO portfolio file.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    try {

        for (const file of files) {

            await uploadFileToBucket(
                file,
                BUCKETS.eko,
                "portfolio"
            );

        }


        input.value = "";


        setUploadStatus(
            "ekoPortfolioUploadStatus",
            `${files.length} EKO portfolio file(s) uploaded successfully.`,
            "success"
        );


        await loadEKOPortfolio();


    } catch (error) {

        console.error(error);

        setUploadStatus(
            "ekoPortfolioUploadStatus",
            "EKO portfolio upload failed: " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   LOAD EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        document.getElementById("ekoProjects");


    if (!container) return;


    container.innerHTML = `
        <div class="document-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Loading EKO projects...</h3>
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.eko)
                .list("projects", {
                    limit: 200,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) {

            container.innerHTML = `
                <div class="document-placeholder">
                    <i class="fas fa-folder-open"></i>
                    <h3>No additional EKO projects yet.</h3>
                    <p>
                        Projects uploaded by the administrator
                        will appear here.
                    </p>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach((file, index) => {

            const path =
                `projects/${file.name}`;


            const url =
                getPublicFileUrl(
                    BUCKETS.eko,
                    path
                );


            const card =
                createDocumentCard(
                    file,
                    url,
                    `EKO Project ${index + 1}`
                );


            container.appendChild(card);

        });


        await loadEKOPortfolio();


    } catch (error) {

        console.error(
            "EKO project loading error:",
            error
        );


        container.innerHTML = `
            <div class="document-placeholder">
                <i class="fas fa-triangle-exclamation"></i>
                <h3>Unable to load EKO projects.</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;

    }

}


/* =========================================================
   LOAD EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        document.getElementById("ekoPortfolioDocuments");


    if (!container) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.eko)
                .list("portfolio", {
                    limit: 200,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) {

            container.innerHTML = `
                <div class="document-placeholder">
                    <i class="fas fa-briefcase"></i>
                    <h3>EKO Portfolio</h3>
                    <p>
                        The EKO professional portfolio will appear here.
                    </p>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach(file => {

            const path =
                `portfolio/${file.name}`;


            const url =
                getPublicFileUrl(
                    BUCKETS.eko,
                    path
                );


            const card =
                createDocumentCard(
                    file,
                    url,
                    "EKO Portfolio"
                );


            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "EKO portfolio error:",
            error
        );

    }

}


/* =========================================================
   ACADEMIC DOCUMENT UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById("academicFile");


    if (!input || !input.files.length) {

        setUploadStatus(
            "academicUploadStatus",
            "Please select academic documents.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        "academicUploadStatus",
        `Uploading ${files.length} academic document(s)...`,
        "info"
    );


    let successful = 0;


    try {

        for (const file of files) {

            await uploadFileToBucket(
                file,
                BUCKETS.academic
            );

            successful++;

        }


        input.value = "";


        setUploadStatus(
            "academicUploadStatus",
            `${successful} academic document(s) uploaded successfully.`,
            "success"
        );


        await loadAcademicDocuments();


    } catch (error) {

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
   LOAD ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById("academicDocuments");


    if (!container) return;


    container.innerHTML = `
        <div class="document-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Loading academic work...</h3>
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.academic)
                .list("", {
                    limit: 200,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) {

            container.innerHTML = `
                <div class="document-placeholder">
                    <i class="fas fa-book-open"></i>
                    <h3>No academic work uploaded yet.</h3>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach((file, index) => {

            const url =
                getPublicFileUrl(
                    BUCKETS.academic,
                    file.name
                );


            const card =
                createDocumentCard(
                    file,
                    url,
                    `Academic Work ${index + 1}`
                );


            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="document-placeholder">
                <i class="fas fa-triangle-exclamation"></i>
                <h3>Unable to load academic work.</h3>
            </div>
        `;

    }

}


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById("portfolioFile");


    if (!input || !input.files.length) {

        setUploadStatus(
            "portfolioUploadStatus",
            "Please select portfolio materials.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        "portfolioUploadStatus",
        `Uploading ${files.length} portfolio file(s)...`,
        "info"
    );


    let successful = 0;


    try {

        for (const file of files) {

            await uploadFileToBucket(
                file,
                BUCKETS.portfolio
            );

            successful++;

        }


        input.value = "";


        setUploadStatus(
            "portfolioUploadStatus",
            `${successful} portfolio file(s) uploaded successfully.`,
            "success"
        );


        await loadPortfolioDocuments();


    } catch (error) {

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
   LOAD PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById("portfolioDocuments");


    if (!container) return;


    container.innerHTML = `
        <div class="document-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Loading portfolio materials...</h3>
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.portfolio)
                .list("", {
                    limit: 200,
                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data || !data.length) {

            container.innerHTML = `
                <div class="document-placeholder">
                    <i class="fas fa-briefcase"></i>
                    <h3>No portfolio materials uploaded yet.</h3>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.forEach((file, index) => {

            const url =
                getPublicFileUrl(
                    BUCKETS.portfolio,
                    file.name
                );


            const card =
                createDocumentCard(
                    file,
                    url,
                    `Portfolio Material ${index + 1}`
                );


            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="document-placeholder">
                <i class="fas fa-triangle-exclamation"></i>
                <h3>Unable to load portfolio materials.</h3>
            </div>
        `;

    }

}


/* =========================================================
   DOCUMENT CARD
========================================================= */

function createDocumentCard(
    file,
    url,
    category
) {

    const card =
        document.createElement("article");


    card.className =
        "uploaded-document";


    const icon =
        getFileIcon(file.name);


    const formattedName =
        formatFileName(file.name);


    card.innerHTML = `

        <div class="document-icon">

            <i class="${icon}"></i>

        </div>


        <div class="document-information">

            <span class="document-category">
                ${escapeHTML(category)}
            </span>

            <h3>
                ${escapeHTML(formattedName)}
            </h3>

            <p>
                ${formatFileSize(file.metadata?.size)}
            </p>

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
   FILE ICON
========================================================= */

function getFileIcon(filename) {

    const extension =
        filename
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf") {

        return "fas fa-file-pdf";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "fas fa-file-word";

    }


    if (
        extension === "xls" ||
        extension === "xlsx" ||
        extension === "csv"
    ) {

        return "fas fa-file-excel";

    }


    if (
        extension === "ppt" ||
        extension === "pptx"
    ) {

        return "fas fa-file-powerpoint";

    }


    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "webp" ||
        extension === "gif"
    ) {

        return "fas fa-file-image";

    }


    if (extension === "txt") {

        return "fas fa-file-lines";

    }


    return "fas fa-file";

}


/* =========================================================
   FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    if (!bytes) {

        return "";

    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    let size =
        Number(bytes);


    let index = 0;


    while (
        size >= 1024 &&
        index < units.length - 1
    ) {

        size /= 1024;

        index++;

    }


    return `${size.toFixed(1)} ${units[index]}`;

}


/* =========================================================
   FILE NAME FORMATTING
========================================================= */

function formatFileName(filename) {

    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   AUTOMATIC EKO LOADING
========================================================= */

window.loadEKOProjects =
    loadEKOProjects;


/* =========================================================
   AUTOMATIC ACADEMIC LOADING
========================================================= */

window.loadAcademicDocuments =
    loadAcademicDocuments;


/* =========================================================
   AUTOMATIC PORTFOLIO LOADING
========================================================= */

window.loadPortfolioDocuments =
    loadPortfolioDocuments;


/* =========================================================
   EXPOSE FUNCTIONS TO HTML
========================================================= */

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.openProject01 =
    openProject01;

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


/* =========================================================
   SUPABASE AUTH STATE
========================================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        if (session) {

            localStorage.setItem(
                "eko_admin_session",
                "authenticated"
            );

        } else {

            localStorage.removeItem(
                "eko_admin_session"
            );

        }

    }
);


/* =========================================================
   OPTIONAL: LOAD PROJECT LIBRARIES
   WHEN THEIR MODALS ARE OPENED
========================================================= */

document.addEventListener("click", event => {

    const button =
        event.target.closest("button");


    if (!button) return;


    const text =
        button.textContent
            .trim()
            .toLowerCase();


    if (
        text.includes("explore eko") ||
        text.includes("refresh eko")
    ) {

        loadEKOProjects();

    }


    if (
        text.includes("academic")
    ) {

        loadAcademicDocuments();

    }


    if (
        text.includes("portfolio")
    ) {

        loadPortfolioDocuments();

    }

});


/* =========================================================
   INITIAL EKO PRELOAD
========================================================= */

setTimeout(() => {

    loadEKOProjects();

}, 1000);


/* =========================================================
   END OF SCRIPT
========================================================= */
