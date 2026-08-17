/* =========================================================
   EDWIN KUCHIO OKELLO
   PROFESSIONAL PORTFOLIO
   SCRIPT.JS

   SUPABASE-POWERED PORTFOLIO SYSTEM

   BUCKETS REQUIRED:

   1. cv
   2. profile
   3. pictorial
   4. eko-projects
   5. academic
   6. professional-portfolio

========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

/*
   IMPORTANT:

   Replace the two values below with the values from:

   Supabase
   → Project Settings
   → API

   Project URL:
   https://xxxxxxxx.supabase.co

   Anon public key:
   eyJhbGciOi...
*/

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


/* Create Supabase client */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   BUCKET CONFIGURATION
========================================================= */

const BUCKETS = {

    cv: "cv",

    profile: "profile",

    pictorial: "pictorial",

    eko: "eko-projects",

    academic: "academic",

    portfolio: "professional-portfolio"

};


/* =========================================================
   GLOBAL SETTINGS
========================================================= */

const MAX_FILE_SIZE = 50 * 1024 * 1024;


/*
   Files larger than 50 MB will be rejected.

   You can increase this if your Supabase storage
   configuration allows larger files.
*/


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializePortfolio();

});


async function initializePortfolio() {

    setCurrentYear();

    initializeNavigation();

    initializeBackToTop();

    initializeAdminAccess();

    initializeModalSystem();

    initializeKeyboardControls();

    await loadProfilePicture();

    await loadCV();

    await loadPictorial();

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function setCurrentYear() {

    const yearElement = document.getElementById("year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   MOBILE NAVIGATION
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

        if (!icon) {

            return;

        }


        if (navLinks.classList.contains("active")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    const links =
        navLinks.querySelectorAll("a");


    links.forEach(function (link) {

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

        return;

    }


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
   ADMIN ACCESS
========================================================= */

function initializeAdminAccess() {

    const adminLock =
        document.getElementById("adminLock");


    if (!adminLock) {

        console.warn(
            "Admin lock button was not found."
        );

        return;

    }


    adminLock.addEventListener("click", function () {

        openAdmin();

    });

}


/* =========================================================
   OPEN ADMIN
========================================================= */

function openAdmin() {

    const panel =
        document.getElementById("adminPanel");


    if (!panel) {

        return;

    }


    panel.classList.add("active");

    document.body.classList.add("modal-open");


    checkExistingSession();

}


/* =========================================================
   CLOSE ADMIN
========================================================= */

function closeAdmin() {

    const panel =
        document.getElementById("adminPanel");


    if (!panel) {

        return;

    }


    panel.classList.remove("active");

    document.body.classList.remove("modal-open");

}


window.closeAdmin = closeAdmin;


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

        return;

    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showAdminMessage(
            "Please enter your email and password.",
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
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            throw error;

        }


        if (!data || !data.user) {

            throw new Error(
                "Login failed."
            );

        }


        showAdminDashboard();


        showAdminMessage(
            "Administrator access granted.",
            "success"
        );


    } catch (error) {

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


window.adminLogin = adminLogin;


/* =========================================================
   CHECK EXISTING SESSION
========================================================= */

async function checkExistingSession() {

    try {

        const {
            data
        } =
            await supabaseClient.auth.getSession();


        if (
            data &&
            data.session &&
            data.session.user
        ) {

            showAdminDashboard();

        } else {

            showLoginArea();

        }

    } catch (error) {

        console.error(
            "Session check error:",
            error
        );

        showLoginArea();

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
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

        showLoginArea();

        showAdminMessage(
            "You have been signed out.",
            "success"
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


window.adminLogout = adminLogout;


/* =========================================================
   ADMIN MESSAGE
========================================================= */

function showAdminMessage(
    message,
    type = "normal"
) {

    const element =
        document.getElementById("adminMessage");


    if (!element) {

        return;

    }


    element.textContent = message;

    element.className =
        "admin-message " + type;

}


/* =========================================================
   SECURITY / SESSION CHECK
========================================================= */

async function requireAdmin() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        return false;

    }


    if (
        !data ||
        !data.session ||
        !data.session.user
    ) {

        showAdminMessage(
            "Please sign in as administrator first.",
            "error"
        );

        return false;

    }


    return true;

}


/* =========================================================
   FILE VALIDATION
========================================================= */

function validateFile(file) {

    if (!file) {

        return {
            valid: false,
            message: "Please select a file."
        };

    }


    if (file.size > MAX_FILE_SIZE) {

        return {
            valid: false,
            message:
                "File is too large. Maximum size is 50 MB."
        };

    }


    return {

        valid: true,

        message: ""

    };

}


/* =========================================================
   CREATE SAFE FILE NAME
========================================================= */

function createSafeFileName(file) {

    const originalName =
        file.name;


    const extensionIndex =
        originalName.lastIndexOf(".");


    let extension = "";

    let baseName =
        originalName;


    if (extensionIndex !== -1) {

        extension =
            originalName.substring(
                extensionIndex
            );

        baseName =
            originalName.substring(
                0,
                extensionIndex
            );

    }


    baseName =
        baseName
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            );


    const timestamp =
        Date.now();


    const random =
        Math.random()
            .toString(36)
            .substring(2, 8);


    return (

        timestamp +
        "-" +
        random +
        "-" +
        baseName +
        extension.toLowerCase()

    );

}


/* =========================================================
   UPLOAD GENERIC FILE
========================================================= */

async function uploadFile(
    bucket,
    file,
    folder = ""
) {

    const validation =
        validateFile(file);


    if (!validation.valid) {

        throw new Error(
            validation.message
        );

    }


    const safeName =
        createSafeFileName(file);


    let path =
        safeName;


    if (folder) {

        path =
            folder.replace(
                /\/$/,
                ""
            ) +
            "/" +
            safeName;

    }


    const {
        data,
        error
    } =
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


    return {

        data,

        path

    };

}


/* =========================================================
   GET PUBLIC URL
========================================================= */

function getPublicURL(
    bucket,
    path
) {

    const {
        data
    } =
        supabaseClient.storage
            .from(bucket)
            .getPublicUrl(path);


    if (
        !data ||
        !data.publicUrl
    ) {

        return "";

    }


    return data.publicUrl;

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const fileInput =
        document.getElementById("cvFile");


    const status =
        document.getElementById("adminMessage");


    if (!fileInput || !fileInput.files.length) {

        showAdminMessage(
            "Please select a PDF CV first.",
            "error"
        );

        return;

    }


    const file =
        fileInput.files[0];


    if (
        file.type !==
        "application/pdf"
    ) {

        showAdminMessage(
            "Please select a PDF file.",
            "error"
        );

        return;

    }


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    showAdminMessage(
        "Uploading CV...",
        "loading"
    );


    try {

        /*
           Remove previous CV files first.
           This keeps only the latest CV.
        */

        const {
            data: existingFiles
        } =
            await supabaseClient.storage
                .from(BUCKETS.cv)
                .list();


        if (
            existingFiles &&
            existingFiles.length
        ) {

            const oldFiles =
                existingFiles.map(
                    file => file.name
                );


            await supabaseClient.storage
                .from(BUCKETS.cv)
                .remove(oldFiles);

        }


        const result =
            await uploadFile(
                BUCKETS.cv,
                file
            );


        const url =
            getPublicURL(
                BUCKETS.cv,
                result.path
            );


        if (!url) {

            throw new Error(
                "CV uploaded, but public URL could not be created."
            );

        }


        localStorage.setItem(
            "currentCV",
            result.path
        );


        fileInput.value = "";


        await loadCV();


        showAdminMessage(
            "CV uploaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "CV upload error:",
            error
        );


        showAdminMessage(
            "CV upload failed: " +
            error.message,
            "error"
        );

    }

}


window.uploadCV = uploadCV;


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


    if (!view || !download) {

        return;

    }


    try {

        const {
            data: files,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.cv)
                .list();


        if (error) {

            throw error;

        }


        if (
            !files ||
            files.length === 0
        ) {

            view.style.display = "none";

            download.style.display = "none";


            if (status) {

                status.textContent =
                    "CV currently unavailable.";

            }

            return;

        }


        /*
           Select most recently modified file.
        */

        files.sort(
            function (a, b) {

                return (
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    ) -
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    )
                );

            }
        );


        const file =
            files[0];


        const url =
            getPublicURL(
                BUCKETS.cv,
                file.name
            );


        view.href = url;

        download.href = url;

        view.style.display = "inline-flex";

        download.style.display = "inline-flex";


        if (status) {

            status.textContent =
                "CV available.";

        }


    } catch (error) {

        console.error(
            "Load CV error:",
            error
        );


        if (status) {

            status.textContent =
                "Unable to load CV.";

        }

    }

}


window.loadCV = loadCV;


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


    if (
        !file.type.startsWith("image/")
    ) {

        showAdminMessage(
            "Please select an image.",
            "error"
        );

        return;

    }


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    showAdminMessage(
        "Uploading profile picture...",
        "loading"
    );


    try {

        const {
            data: existing
        } =
            await supabaseClient.storage
                .from(BUCKETS.profile)
                .list();


        if (
            existing &&
            existing.length
        ) {

            await supabaseClient.storage
                .from(BUCKETS.profile)
                .remove(
                    existing.map(
                        file => file.name
                    )
                );

        }


        const result =
            await uploadFile(
                BUCKETS.profile,
                file
            );


        localStorage.setItem(
            "profilePicture",
            result.path
        );


        input.value = "";


        await loadProfilePicture();


        showAdminMessage(
            "Profile picture uploaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Profile upload error:",
            error
        );


        showAdminMessage(
            "Profile upload failed: " +
            error.message,
            "error"
        );

    }

}


window.uploadProfile = uploadProfile;


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
            data: files,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.profile)
                .list();


        if (error) {

            throw error;

        }


        if (
            !files ||
            files.length === 0
        ) {

            return;

        }


        files.sort(
            function (a, b) {

                return (
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    ) -
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    )
                );

            }
        );


        const file =
            files[0];


        const url =
            getPublicURL(
                BUCKETS.profile,
                file.name
            );


        if (!url) {

            return;

        }


        frame.innerHTML = "";


        const image =
            document.createElement("img");


        image.src = url;

        image.alt =
            "Edwin Kuchio Okello";

        image.loading = "lazy";


        frame.appendChild(image);


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


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    const files =
        Array.from(input.files);


    showAdminMessage(
        "Uploading " +
        files.length +
        " image(s)...",
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                failed++;

                continue;

            }


            await uploadFile(
                BUCKETS.pictorial,
                file
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


    await loadPictorial();


    showAdminMessage(

        successful +
        " image(s) uploaded successfully." +

        (
            failed
                ? " " +
                  failed +
                  " failed."
                : ""
        ),

        failed
            ? "error"
            : "success"

    );

}


window.uploadPictorial =
    uploadPictorial;


/* =========================================================
   LOAD PICTORIAL
========================================================= */

async function loadPictorial() {

    const gallery =
        document.getElementById(
            "gallery"
        );


    if (!gallery) {

        return;

    }


    try {

        const {
            data: files,
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

            throw error;

        }


        const imageFiles =
            (files || []).filter(
                file =>
                    file.name &&
                    !file.name.endsWith("/")
            );


        if (!imageFiles.length) {

            gallery.innerHTML = `

                <div class="gallery-empty">

                    <i class="fas fa-images"></i>

                    <h3>
                        Your pictorial will appear here
                    </h3>

                    <p>
                        Images can be added through
                        the administrator area.
                    </p>

                </div>

            `;

            return;

        }


        gallery.innerHTML = "";


        imageFiles.forEach(
            function (file) {

                const url =
                    getPublicURL(
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
                        src="${escapeHTML(url)}"
                        alt="Portfolio photograph"
                        loading="lazy"
                    >

                `;


                gallery.appendChild(item);

            }
        );


    } catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );

    }

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

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


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        "Uploading " +
        files.length +
        " EKO project(s)...",
        "loading"
    );


    let successful = 0;

    let failed = 0;


    /*
       IMPORTANT:

       We DO NOT delete existing EKO files.

       This means you can continue uploading:

       Project 01
       Project 02
       Project 03
       Project 04
       ...
       Project 100

       without replacing previous projects.
    */


    for (const file of files) {

        try {

            await uploadFile(
                BUCKETS.eko,
                file,
                "projects"
            );

            successful++;


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

        successful +
        " EKO project(s) uploaded successfully." +

        (
            failed
                ? " " +
                  failed +
                  " failed."
                : ""
        ),

        failed
            ? "error"
            : "success"

    );


    /*
       If the EKO modal is open,
       refresh it immediately.
    */

}


/* Make globally accessible */

window.uploadEKOProjects =
    uploadEKOProjects;


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

            <h3>
                Loading EKO projects...
            </h3>

        </div>

    `;


    try {

        const {
            data: files,
            error
        } =
            await supabaseClient.storage
                .from(BUCKETS.eko)
                .list(
                    "projects",
                    {

                        limit: 1000,

                        sortBy: {

                            column: "created_at",

                            order: "desc"

                        }

                    }
                );


        if (error) {

            throw error;

        }


        const projectFiles =
            (files || []).filter(
                file =>
                    file.name &&
                    !file.name.endsWith("/")
            );


        if (!projectFiles.length) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        No additional EKO projects yet
                    </h3>

                    <p>
                        Upload projects through
                        the administrator area.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        projectFiles.forEach(
            function (file, index) {

                createDocumentCard(

                    container,

                    file,

                    BUCKETS.eko,

                    "EKO Project",

                    index + 1

                );

            }
        );


    } catch (error) {

        console.error(
            "EKO project loading error:",
            error
        );


        container.innerHTML = `

            <div class="document-placeholder error">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load EKO projects
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


window.loadEKOProjects =
    loadEKOProjects;


/* =========================================================
   ACADEMIC UPLOAD
========================================================= */

async function uploadAcademicDocuments() {

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
            "Please select academic files.",
            "error"
        );

        return;

    }


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        "Uploading academic work...",
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            await uploadFile(
                BUCKETS.academic,
                file
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

        successful +
        " academic document(s) uploaded successfully." +

        (
            failed
                ? " " +
                  failed +
                  " failed."
                : ""
        ),

        failed
            ? "error"
            : "success"

    );

}


window.uploadAcademicDocuments =
    uploadAcademicDocuments;


/* =========================================================
   LOAD ACADEMIC DOCUMENTS
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

            <h3>
                Loading academic work...
            </h3>

        </div>

    `;


    try {

        const {
            data: files,
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

            throw error;

        }


        const documents =
            (files || []).filter(
                file =>
                    file.name &&
                    !file.name.endsWith("/")
            );


        if (!documents.length) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-book-open"></i>

                    <h3>
                        No academic documents yet
                    </h3>

                    <p>
                        Academic essays and research
                        can be uploaded from the
                        administrator area.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        documents.forEach(
            function (file, index) {

                createDocumentCard(

                    container,

                    file,

                    BUCKETS.academic,

                    "Academic Work",

                    index + 1

                );

            }
        );


    } catch (error) {

        console.error(
            "Academic loading error:",
            error
        );


        container.innerHTML = `

            <div class="document-placeholder error">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load academic work
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


window.loadAcademicDocuments =
    loadAcademicDocuments;


/* =========================================================
   PROFESSIONAL PORTFOLIO UPLOAD
========================================================= */

async function uploadPortfolioDocuments() {

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
            "Please select portfolio materials.",
            "error"
        );

        return;

    }


    const authenticated =
        await requireAdmin();


    if (!authenticated) {

        return;

    }


    const files =
        Array.from(input.files);


    setUploadStatus(
        status,
        "Uploading professional portfolio materials...",
        "loading"
    );


    let successful = 0;

    let failed = 0;


    for (const file of files) {

        try {

            await uploadFile(
                BUCKETS.portfolio,
                file
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

        successful +
        " portfolio material(s) uploaded successfully." +

        (
            failed
                ? " " +
                  failed +
                  " failed."
                : ""
        ),

        failed
            ? "error"
            : "success"

    );

}


window.uploadPortfolioDocuments =
    uploadPortfolioDocuments;


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

            <h3>
                Loading portfolio materials...
            </h3>

        </div>

    `;


    try {

        const {
            data: files,
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

            throw error;

        }


        const documents =
            (files || []).filter(
                file =>
                    file.name &&
                    !file.name.endsWith("/")
            );


        if (!documents.length) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-briefcase"></i>

                    <h3>
                        No portfolio materials yet
                    </h3>

                    <p>
                        Professional documents can
                        be uploaded from the
                        administrator area.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        documents.forEach(
            function (file, index) {

                createDocumentCard(

                    container,

                    file,

                    BUCKETS.portfolio,

                    "Professional Portfolio",

                    index + 1

                );

            }
        );


    } catch (error) {

        console.error(
            "Portfolio loading error:",
            error
        );


        container.innerHTML = `

            <div class="document-placeholder error">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load portfolio materials
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


window.loadPortfolioDocuments =
    loadPortfolioDocuments;


/* =========================================================
   CREATE DOCUMENT CARD
========================================================= */

function createDocumentCard(
    container,
    file,
    bucket,
    category,
    number
) {

    const path =
        file.name;


    const url =
        getPublicURL(
            bucket,
            path
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "uploaded-document";


    const extension =
        getFileExtension(
            file.name
        );


    const icon =
        getFileIcon(
            extension
        );


    const title =
        formatFileName(
            file.name
        );


    card.innerHTML = `

        <div class="document-icon">

            <i class="${icon}"></i>

        </div>


        <div class="document-info">

            <span class="document-category">

                ${escapeHTML(category)}

            </span>


            <h3>

                ${escapeHTML(title)}

            </h3>


            <p>

                ${escapeHTML(
                    extension.toUpperCase() +
                    " document"
                )}

            </p>

        </div>


        <div class="document-actions">

            <a

                href="${escapeHTML(url)}"

                target="_blank"

                rel="noopener noreferrer"

                class="document-view"

            >

                <i class="fas fa-eye"></i>

                View

            </a>


            <a

                href="${escapeHTML(url)}"

                download

                class="document-download"

            >

                <i class="fas fa-download"></i>

                Download

            </a>

        </div>

    `;


    container.appendChild(card);

}


/* =========================================================
   FILE EXTENSION
========================================================= */

function getFileExtension(filename) {

    const parts =
        filename.split(".");


    if (parts.length < 2) {

        return "file";

    }


    return parts[
        parts.length - 1
    ].toLowerCase();

}


/* =========================================================
   FILE ICON
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


        case "jpg":

        case "jpeg":

        case "png":

        case "gif":

        case "webp":

            return "fas fa-file-image";


        case "txt":

            return "fas fa-file-lines";


        default:

            return "fas fa-file";

    }

}


/* =========================================================
   FORMAT FILE NAME
========================================================= */

function formatFileName(filename) {

    let name =
        filename;


    /*
       Remove timestamp/random prefix.

       Example:

       1755439823-ab12cd-my-project.pdf

       becomes:

       my project
    */

    name =
        name.replace(
            /^\d+-[a-z0-9]+-/i,
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
       Convert separators to spaces.
    */

    name =
        name
            .replace(
                /[-_]+/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    /*
       Capitalize first letter.
    */

    if (name.length) {

        name =
            name.charAt(0).toUpperCase() +
            name.slice(1);

    }


    return name || "Untitled Document";

}


/* =========================================================
   UPLOAD STATUS
========================================================= */

function setUploadStatus(
    element,
    message,
    type
) {

    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        "upload-status " +
        type;

}


/* =========================================================
   MODAL SYSTEM
========================================================= */

function initializeModalSystem() {

    const modals =
        document.querySelectorAll(
            ".modal"
        );


    modals.forEach(
        function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeModal(
                            modal.id
                        );

                    }

                }
            );

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


    modal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );


    /*
       Automatically load appropriate
       content when opening a modal.
    */

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


window.openModal =
    openModal;


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove("active");


    /*
       Only remove modal-open when no
       other modal remains open.
    */

    const openModals =
        document.querySelectorAll(
            ".modal.active"
        );


    if (!openModals.length) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


window.closeModal =
    closeModal;


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}


window.openProject01 =
    openProject01;


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

function initializeKeyboardControls() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                const openModals =
                    document.querySelectorAll(
                        ".modal.active"
                    );


                openModals.forEach(
                    function (modal) {

                        closeModal(
                            modal.id
                        );

                    }
                );


                closeAdmin();

            }

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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
   SUPABASE AUTH STATE LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Supabase auth event:",
            event
        );


        if (
            event ===
            "SIGNED_IN"
        ) {

            showAdminDashboard();

        }


        if (
            event ===
            "SIGNED_OUT"
        ) {

            showLoginArea();

        }

    }
);


/* =========================================================
   GLOBAL REFRESH FUNCTION
========================================================= */

async function refreshPortfolio() {

    await loadProfilePicture();

    await loadCV();

    await loadPictorial();

    await loadEKOProjects();

    await loadAcademicDocuments();

    await loadPortfolioDocuments();

}


window.refreshPortfolio =
    refreshPortfolio;


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "Edwin Kuchio Okello Portfolio System loaded."
);

console.log(
    "EKO Analytics & Research project library ready."
);

console.log(
    "Academic library ready."
);

console.log(
    "Professional portfolio library ready."
);
