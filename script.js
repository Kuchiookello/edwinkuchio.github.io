/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://cueajmzcmawvcbpwuyhi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_hUjTnuPCkxB2ysGoYZq0Mg_uhymAbhb";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   EXACT STORAGE BUCKETS
========================================================= */

const BUCKETS = {

    cv: "CV",

    profile: "Profile",

    pictorial: "Pictorial",

    eko: "eko",

    academic: "Academic Essays and Research",

    professional: "Professional Portfolio"

};


/* =========================================================
   GENERAL HELPERS
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


function slugify(text) {

    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 100);
}


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

    let size = bytes;
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {

        size /= 1024;
        index++;

    }

    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;

}


function getExtension(filename) {

    const parts = String(filename).split(".");

    if (parts.length < 2) {
        return "";
    }

    return parts.pop().toLowerCase();

}


function getFileIcon(filename) {

    const extension = getExtension(filename);

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
        [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp"
        ].includes(extension)
    ) {
        return "fa-file-image";
    }

    if (extension === "txt") {
        return "fa-file-lines";
    }

    return "fa-file";
}


function setStatus(elementId, message, type = "") {

    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className = "upload-status";

    if (type) {
        element.classList.add(type);
    }

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    if (
        !document.querySelector(".modal.active")
    ) {

        document.body.classList.remove("modal-open");

    }

}


function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING BACKGROUND
========================================================= */

document.addEventListener("click", function(event) {

    if (
        event.target.classList.contains("modal")
    ) {

        event.target.classList.remove("active");

        if (
            !document.querySelector(".modal.active")
        ) {
            document.body.classList.remove("modal-open");
        }

    }

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", function(event) {

    if (event.key !== "Escape") {
        return;
    }

    document
        .querySelectorAll(".modal.active")
        .forEach(modal => modal.classList.remove("active"));

    closeAdmin();

    document.body.classList.remove("modal-open");

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function() {

        navLinks.classList.toggle("active");

        const icon =
            menuToggle.querySelector("i");

        if (
            navLinks.classList.contains("active")
        ) {

            icon.className = "fas fa-times";

        } else {

            icon.className = "fas fa-bars";

        }

    });


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function() {

            navLinks.classList.remove("active");

            const icon =
                menuToggle.querySelector("i");

            icon.className = "fas fa-bars";

        });

    });

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById("backToTop");


window.addEventListener("scroll", function() {

    if (!backToTop) {
        return;
    }

    if (window.scrollY > 500) {

        backToTop.classList.add("visible");

    } else {

        backToTop.classList.remove("visible");

    }

});


if (backToTop) {

    backToTop.addEventListener("click", function() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   YEAR
========================================================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   ADMIN PANEL
========================================================= */

const adminLock =
    document.getElementById("adminLock");

const adminPanel =
    document.getElementById("adminPanel");


if (adminLock) {

    adminLock.addEventListener("click", async function() {

        if (!adminPanel) {
            return;
        }

        adminPanel.classList.add("active");

        adminPanel.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("admin-open");

        await checkAdminSession();

    });

}


function closeAdmin() {

    if (!adminPanel) {
        return;
    }

    adminPanel.classList.remove("active");

    adminPanel.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("admin-open");

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

const adminLoginButton =
    document.getElementById("adminLoginButton");


if (adminLoginButton) {

    adminLoginButton.addEventListener(
        "click",
        adminLogin
    );

}


async function adminLogin() {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    const message =
        document.getElementById("adminMessage");

    if (!email || !password) {

        if (message) {

            message.textContent =
                "Please enter your administrator email and password.";

        }

        return;

    }


    if (message) {

        message.textContent =
            "Signing in...";

    }


    const {
        data,
        error
    } = await db.auth.signInWithPassword({

        email: email,

        password: password

    });


    if (error) {

        if (message) {

            message.textContent =
                error.message;

        }

        return;

    }


    if (data && data.user) {

        showAdminDashboard();

        if (message) {

            message.textContent = "";

        }

    }

}


/* =========================================================
   SESSION CHECK
========================================================= */

async function checkAdminSession() {

    const {
        data
    } = await db.auth.getSession();

    if (
        data &&
        data.session &&
        data.session.user
    ) {

        showAdminDashboard();

    } else {

        showLoginArea();

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

db.auth.onAuthStateChange(
    function(event, session) {

        if (session && session.user) {

            showAdminDashboard();

        } else {

            showLoginArea();

        }

    }
);


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
   LOGOUT
========================================================= */

async function adminLogout() {

    await db.auth.signOut();

    showLoginArea();

    const message =
        document.getElementById("adminMessage");

    if (message) {

        message.textContent =
            "You have been signed out.";

    }

}


/* =========================================================
   VERIFY ADMIN SESSION BEFORE UPLOAD
========================================================= */

async function requireAuthenticatedUser() {

    const {
        data,
        error
    } = await db.auth.getUser();

    if (
        error ||
        !data ||
        !data.user
    ) {

        openAdmin();

        throw new Error(
            "Administrator authentication is required."
        );

    }

    return data.user;

}


/* =========================================================
   GENERIC UPLOAD
========================================================= */

async function uploadFile(
    bucket,
    path,
    file,
    options = {}
) {

    await requireAuthenticatedUser();

    const {
        upsert = false
    } = options;


    const {
        error
    } = await db.storage
        .from(bucket)
        .upload(path, file, {

            cacheControl: "3600",

            upsert: upsert,

            contentType:
                file.type || undefined

        });


    if (error) {

        throw error;

    }


    return getPublicUrl(bucket, path);

}


/* =========================================================
   PUBLIC URL
========================================================= */

function getPublicUrl(bucket, path) {

    const {
        data
    } = db.storage
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

    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "cvUploadStatus",
            "Please select a PDF file.",
            "error"
        );

        return;

    }


    const file = input.files[0];

    const safeName =
        `CV-${Date.now()}.pdf`;


    try {

        setStatus(
            "cvUploadStatus",
            "Uploading CV..."
        );


        const url =
            await uploadFile(
                BUCKETS.cv,
                safeName,
                file,
                {
                    upsert: true
                }
            );


        setStatus(
            "cvUploadStatus",
            "CV uploaded successfully.",
            "success"
        );


        await loadCV();

        input.value = "";


    } catch (error) {

        console.error(error);

        setStatus(
            "cvUploadStatus",
            `CV upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD CV
========================================================= */

async function loadCV() {

    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.cv)
        .list("", {

            limit: 100,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    const status =
        document.getElementById("cvStatus");

    const view =
        document.getElementById("viewCV");

    const download =
        document.getElementById("downloadCV");


    if (error) {

        console.error(error);

        if (status) {

            status.textContent =
                "Unable to load CV.";

        }

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        if (status) {

            status.textContent =
                "No CV has been uploaded yet.";

        }

        return;

    }


    const file =
        data
            .filter(item => !item.id ? true : true)
            .sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            )[0];


    const url =
        getPublicUrl(
            BUCKETS.cv,
            file.name
        );


    if (view) {

        view.href = url;

        view.classList.remove(
            "disabled-link"
        );

    }


    if (download) {

        download.href = url;

        download.classList.remove(
            "disabled-link"
        );

    }


    if (status) {

        status.textContent =
            `Current CV: ${file.name}`;

    }

}


/* =========================================================
   PROFILE UPLOAD
========================================================= */

async function uploadProfile() {

    const input =
        document.getElementById("profileFile");

    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "profileUploadStatus",
            "Please select an image.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];

    const extension =
        getExtension(file.name) || "jpg";


    const path =
        `profile-${Date.now()}.${extension}`;


    try {

        setStatus(
            "profileUploadStatus",
            "Uploading profile photograph..."
        );


        await uploadFile(
            BUCKETS.profile,
            path,
            file
        );


        setStatus(
            "profileUploadStatus",
            "Profile photograph uploaded successfully.",
            "success"
        );


        await loadProfile();

        input.value = "";


    } catch (error) {

        console.error(error);

        setStatus(
            "profileUploadStatus",
            `Upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.profile)
        .list("", {

            limit: 100,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        console.error(error);

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        return;

    }


    const file =
        data.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        )[0];


    const url =
        getPublicUrl(
            BUCKETS.profile,
            file.name
        );


    const frame =
        document.getElementById("profileFrame");


    if (!frame) {
        return;
    }


    frame.innerHTML = `

        <img
            src="${escapeHTML(url)}"
            alt="Edwin Kuchio Okello"
        >

    `;

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById("pictorialFile");

    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "pictorialUploadStatus",
            "Please select one or more photographs.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    let successful = 0;


    try {

        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];

            const extension =
                getExtension(file.name) || "jpg";

            const safeName =
                `${Date.now()}-${index}-${slugify(
                    file.name.replace(/\.[^/.]+$/, "")
                )}.${extension}`;


            setStatus(
                "pictorialUploadStatus",
                `Uploading image ${index + 1} of ${files.length}...`
            );


            await uploadFile(
                BUCKETS.pictorial,
                safeName,
                file
            );


            successful++;

        }


        setStatus(
            "pictorialUploadStatus",
            `${successful} image(s) uploaded successfully.`,
            "success"
        );


        input.value = "";

        await loadGallery();


    } catch (error) {

        console.error(error);

        setStatus(
            "pictorialUploadStatus",
            `Upload stopped: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) {
        return;
    }


    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.pictorial)
        .list("", {

            limit: 200,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        console.error(error);

        gallery.innerHTML = `

            <div class="gallery-empty">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>Unable to load pictorial</h3>

                <p>${escapeHTML(error.message)}</p>

            </div>

        `;

        return;

    }


    const files =
        (data || [])
            .filter(file => file.name);


    if (!files.length) {

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


    gallery.innerHTML = "";


    files.forEach(file => {

        const url =
            getPublicUrl(
                BUCKETS.pictorial,
                file.name
            );


        const item =
            document.createElement("div");

        item.className =
            "gallery-item";


        item.innerHTML = `

            <img
                src="${escapeHTML(url)}"
                alt="Portfolio photograph"
                loading="lazy"
            >

        `;


        item.addEventListener(
            "click",
            function() {

                window.open(
                    url,
                    "_blank",
                    "noopener"
                );

            }
        );


        gallery.appendChild(item);

    });

}


/* =========================================================
   EKO PORTFOLIO UPLOAD
========================================================= */

async function uploadEKOPortfolio() {

    const input =
        document.getElementById(
            "ekoPortfolioFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "ekoPortfolioUploadStatus",
            "Please select one or more EKO portfolio files.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    let successful = 0;


    try {

        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];


            const safeName =
                `portfolio/${Date.now()}-${index}-${slugify(file.name)}`;


            setStatus(
                "ekoPortfolioUploadStatus",
                `Uploading EKO portfolio file ${index + 1} of ${files.length}...`
            );


            await uploadFile(
                BUCKETS.eko,
                safeName,
                file
            );


            successful++;

        }


        setStatus(
            "ekoPortfolioUploadStatus",
            `${successful} EKO portfolio file(s) uploaded successfully.`,
            "success"
        );


        input.value = "";

        await loadEKOPortfolio();


    } catch (error) {

        console.error(error);

        setStatus(
            "ekoPortfolioUploadStatus",
            `Upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    const container =
        document.getElementById(
            "ekoPortfolioDocuments"
        );


    if (!container) {
        return;
    }


    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.eko)
        .list("portfolio", {

            limit: 100,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        container.innerHTML = `

            <div class="document-placeholder small">

                <i class="fas fa-triangle-exclamation"></i>

                Unable to load EKO portfolio.

            </div>

        `;

        console.error(error);

        return;

    }


    if (
        !data ||
        !data.length
    ) {

        container.innerHTML = `

            <div class="document-placeholder small">

                <i class="fas fa-folder-open"></i>

                <p>
                    No EKO portfolio files have been uploaded yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    data
        .filter(file => file.name)
        .forEach(file => {

            const url =
                getPublicUrl(
                    BUCKETS.eko,
                    `portfolio/${file.name}`
                );


            container.appendChild(
                createDocumentCard(
                    file,
                    url
                )
            );

        });

}


/* =========================================================
   CREATE EKO PROJECT
========================================================= */

async function uploadNewEKOProject() {

    const number =
        document
            .getElementById("ekoProjectNumber")
            .value
            .trim();


    const title =
        document
            .getElementById("ekoProjectTitle")
            .value
            .trim();


    const description =
        document
            .getElementById("ekoProjectDescription")
            .value
            .trim();


    const category =
        document
            .getElementById("ekoProjectCategory")
            .value
            .trim();


    const filesInput =
        document
            .getElementById("ekoProjectFiles");


    if (!number) {

        setStatus(
            "ekoProjectUploadStatus",
            "Please enter a project number.",
            "error"
        );

        return;

    }


    if (!title) {

        setStatus(
            "ekoProjectUploadStatus",
            "Please enter the project title.",
            "error"
        );

        return;

    }


    if (!filesInput.files.length) {

        setStatus(
            "ekoProjectUploadStatus",
            "Please select at least one project file.",
            "error"
        );

        return;

    }


    const files =
        Array.from(filesInput.files);


    const projectSlug =
        `project-${String(number).padStart(2, "0")}-${slugify(title)}`;


    /*
       The project metadata is stored in a small JSON file
       inside the project folder. This allows the public
       portfolio to reconstruct the project without requiring
       another database table.
    */

    const metadata = {

        number: String(number).padStart(2, "0"),

        title: title,

        description:
            description ||
            "EKO Analytics & Research project.",

        category:
            category ||
            "EKO ANALYTICS & RESEARCH",

        created_at:
            new Date().toISOString()

    };


    try {

        await requireAuthenticatedUser();


        setStatus(
            "ekoProjectUploadStatus",
            "Creating project..."
        );


        /*
           Upload metadata first.
        */

        const metadataBlob =
            new Blob(
                [
                    JSON.stringify(
                        metadata,
                        null,
                        2
                    )
                ],
                {
                    type: "application/json"
                }
            );


        await uploadFile(
            BUCKETS.eko,
            `${projectSlug}/project.json`,
            metadataBlob,
            {
                upsert: true
            }
        );


        let successful = 0;


        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];


            setStatus(
                "ekoProjectUploadStatus",
                `Uploading project file ${index + 1} of ${files.length}...`
            );


            const safeFileName =
                `${index + 1}-${slugify(file.name)}`;


            await uploadFile(
                BUCKETS.eko,
                `${projectSlug}/${safeFileName}`,
                file
            );


            successful++;

        }


        setStatus(
            "ekoProjectUploadStatus",
            `Project ${metadata.number} created successfully with ${successful} file(s).`,
            "success"
        );


        /*
           Clear form.
        */

        document
            .getElementById("ekoProjectNumber")
            .value = "";

        document
            .getElementById("ekoProjectTitle")
            .value = "";

        document
            .getElementById("ekoProjectDescription")
            .value = "";

        document
            .getElementById("ekoProjectCategory")
            .value = "";

        filesInput.value = "";


        /*
           Refresh public EKO library.
        */

        await loadEKOProjects();


    } catch (error) {

        console.error(error);

        setStatus(
            "ekoProjectUploadStatus",
            `EKO project upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    const container =
        document.getElementById(
            "ekoProjects"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>Loading EKO projects...</h3>

        </div>

    `;


    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.eko)
        .list("", {

            limit: 200,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        console.error(error);

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>Unable to load EKO projects</h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

        return;

    }


    /*
       At the root of the bucket we expect folders.
    */

    const folders =
        (data || [])
            .filter(item => item.id === null);


    if (!folders.length) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-folder-open"></i>

                <h3>No additional EKO projects yet</h3>

                <p>
                    New projects uploaded through the Administrator
                    will appear here automatically.
                </p>

            </div>

        `;

        return;

    }


    /*
       Don't display the portfolio folder here.
    */

    const projectFolders =
        folders.filter(
            folder =>
                folder.name !== "portfolio"
        );


    if (!projectFolders.length) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-folder-open"></i>

                <h3>No additional EKO projects yet</h3>

                <p>
                    Upload your next EKO project through the Administrator.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    for (
        const folder of projectFolders
    ) {

        await renderEKOProject(
            folder.name,
            container
        );

    }

}


/* =========================================================
   RENDER ONE EKO PROJECT
========================================================= */

async function renderEKOProject(
    folderName,
    container
) {

    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.eko)
        .list(folderName, {

            limit: 200,

            sortBy: {
                column: "created_at",
                order: "asc"
            }

        });


    if (error) {

        console.error(error);

        return;

    }


    const metadataFile =
        data.find(
            file =>
                file.name === "project.json"
        );


    let metadata = {

        number: "",

        title: folderName,

        description:
            "EKO Analytics & Research project.",

        category:
            "EKO ANALYTICS & RESEARCH"

    };


    if (metadataFile) {

        try {

            const metadataUrl =
                getPublicUrl(
                    BUCKETS.eko,
                    `${folderName}/project.json`
                );


            const response =
                await fetch(metadataUrl);


            if (response.ok) {

                metadata =
                    await response.json();

            }

        } catch (error) {

            console.warn(
                "Could not read project metadata.",
                error
            );

        }

    }


    const projectFiles =
        data.filter(
            file =>
                file.name &&
                file.name !== "project.json"
        );


    const card =
        document.createElement("div");


    card.className =
        "eko-dynamic-project";


    const filesHTML =
        projectFiles.length
            ? projectFiles.map(file => {

                const url =
                    getPublicUrl(
                        BUCKETS.eko,
                        `${folderName}/${file.name}`
                    );


                return `

                    <div class="document-card">

                        <div class="document-main">

                            <div class="document-icon">

                                <i class="fas ${getFileIcon(file.name)}"></i>

                            </div>

                            <div class="document-info">

                                <h4>
                                    ${escapeHTML(file.name)}
                                </h4>

                                <span>
                                    ${escapeHTML(
                                        formatFileSize(file.metadata?.size)
                                    )}
                                </span>

                            </div>

                        </div>

                        <div class="document-actions">

                            <a
                                href="${escapeHTML(url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i class="fas fa-eye"></i>
                                View
                            </a>

                            <a
                                href="${escapeHTML(url)}"
                                download
                                class="download"
                            >
                                <i class="fas fa-download"></i>
                                Download
                            </a>

                        </div>

                    </div>

                `;

            }).join("")

            : `

                <div class="document-placeholder small">

                    <p>
                        No project files found.
                    </p>

                </div>

            `;


    card.innerHTML = `

        <div class="eko-dynamic-project-header">

            <div>

                <span>
                    ${escapeHTML(
                        metadata.category ||
                        "EKO ANALYTICS & RESEARCH"
                    )}
                </span>

                <h3>

                    ${
                        metadata.number
                            ? `Project ${escapeHTML(metadata.number)} — `
                            : ""
                    }

                    ${escapeHTML(metadata.title)}

                </h3>

                <p>
                    ${escapeHTML(metadata.description)}
                </p>

            </div>

            <div>
                <i class="fas fa-folder-open"></i>
            </div>

        </div>

        <div class="eko-dynamic-project-body">

            ${filesHTML}

        </div>

    `;


    container.appendChild(card);

}


/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById(
            "academicFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "academicUploadStatus",
            "Please select one or more academic files.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    let successful = 0;


    try {

        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];


            const path =
                `${Date.now()}-${index}-${slugify(file.name)}`;


            setStatus(
                "academicUploadStatus",
                `Uploading academic file ${index + 1} of ${files.length}...`
            );


            await uploadFile(
                BUCKETS.academic,
                path,
                file
            );


            successful++;

        }


        setStatus(
            "academicUploadStatus",
            `${successful} academic file(s) uploaded successfully.`,
            "success"
        );


        input.value = "";

        await loadAcademicDocuments();


    } catch (error) {

        console.error(error);

        setStatus(
            "academicUploadStatus",
            `Upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD ACADEMIC
========================================================= */

async function loadAcademicDocuments() {

    const container =
        document.getElementById(
            "academicDocuments"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>Loading academic work...</h3>

        </div>

    `;


    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.academic)
        .list("", {

            limit: 200,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>Unable to load academic work</h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

        return;

    }


    if (
        !data ||
        !data.length
    ) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-book-open"></i>

                <h3>No academic work uploaded yet</h3>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    data
        .filter(file => file.name)
        .forEach(file => {

            const url =
                getPublicUrl(
                    BUCKETS.academic,
                    file.name
                );


            container.appendChild(
                createDocumentCard(
                    file,
                    url
                )
            );

        });

}


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById(
            "portfolioFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setStatus(
            "portfolioUploadStatus",
            "Please select one or more portfolio files.",
            "error"
        );

        return;

    }


    const files =
        Array.from(input.files);


    let successful = 0;


    try {

        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];


            const path =
                `${Date.now()}-${index}-${slugify(file.name)}`;


            setStatus(
                "portfolioUploadStatus",
                `Uploading portfolio file ${index + 1} of ${files.length}...`
            );


            await uploadFile(
                BUCKETS.professional,
                path,
                file
            );


            successful++;

        }


        setStatus(
            "portfolioUploadStatus",
            `${successful} professional portfolio file(s) uploaded successfully.`,
            "success"
        );


        input.value = "";

        await loadPortfolioDocuments();


    } catch (error) {

        console.error(error);

        setStatus(
            "portfolioUploadStatus",
            `Upload failed: ${error.message}`,
            "error"
        );

    }

}


/* =========================================================
   LOAD PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    const container =
        document.getElementById(
            "portfolioDocuments"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>Loading portfolio materials...</h3>

        </div>

    `;


    const {
        data,
        error
    } = await db.storage
        .from(BUCKETS.professional)
        .list("", {

            limit: 200,

            sortBy: {
                column: "created_at",
                order: "desc"
            }

        });


    if (error) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>Unable to load portfolio materials</h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

        return;

    }


    if (
        !data ||
        !data.length
    ) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-briefcase"></i>

                <h3>No portfolio materials uploaded yet</h3>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    data
        .filter(file => file.name)
        .forEach(file => {

            const url =
                getPublicUrl(
                    BUCKETS.professional,
                    file.name
                );


            container.appendChild(
                createDocumentCard(
                    file,
                    url
                )
            );

        });

}


/* =========================================================
   GENERIC DOCUMENT CARD
========================================================= */

function createDocumentCard(
    file,
    url
) {

    const card =
        document.createElement("div");


    card.className =
        "document-card";


    const size =
        file.metadata &&
        file.metadata.size
            ? formatFileSize(
                file.metadata.size
            )
            : "";


    card.innerHTML = `

        <div class="document-main">

            <div class="document-icon">

                <i class="fas ${getFileIcon(file.name)}"></i>

            </div>

            <div class="document-info">

                <h4>
                    ${escapeHTML(file.name)}
                </h4>

                <span>
                    ${escapeHTML(size)}
                </span>

            </div>

        </div>

        <div class="document-actions">

            <a
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <i class="fas fa-eye"></i>
                View

            </a>

            <a
                href="${escapeHTML(url)}"
                download
                class="download"
            >

                <i class="fas fa-download"></i>
                Download

            </a>

        </div>

    `;


    return card;

}


/* =========================================================
   INITIAL LOAD
========================================================= */

async function initializePortfolio() {

    console.log(
        "Initializing Edwin Kuchio Okello Portfolio..."
    );


    /*
       Public content.
    */

    await Promise.allSettled([

        loadCV(),

        loadProfile(),

        loadGallery(),

        loadEKOPortfolio()

    ]);


    /*
       Admin state.
    */

    await checkAdminSession();


    console.log(
        "Portfolio initialization complete."
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializePortfolio
);


/* =========================================================
   GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener(
    "unhandledrejection",
    function(event) {

        console.error(
            "Unhandled promise rejection:",
            event.reason
        );

    }
);
