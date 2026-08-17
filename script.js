 /* ============================================================
   EDWIN KUCHIO OKELLO
   PROFESSIONAL PORTFOLIO
   SCRIPT.JS

   FEATURES
   ------------------------------------------------------------
   1. Supabase connection
   2. Admin authentication
   3. Admin lock button
   4. Admin dashboard
   5. CV upload
   6. Profile picture upload
   7. Multiple pictorial uploads
   8. Multiple EKO project uploads
   9. EKO Portfolio uploads
   10. Multiple academic uploads
   11. Multiple professional portfolio uploads
   12. Dynamic document libraries
   13. EKO Project 01
   14. Modal management
   15. Back-to-top button
   16. Mobile navigation
   17. Automatic copyright year
   18. Upload status messages
   ============================================================ */


/* ============================================================
   SUPABASE CONFIGURATION
   ============================================================ */

/*
   IMPORTANT:
   Replace these two values with the values from:

   Supabase
   → Project Settings
   → API

   Project URL:
   https://xxxxxxxx.supabase.co

   Anon public key:
   eyJ...
*/

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


/* Create Supabase client */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* ============================================================
   BUCKET NAMES
   ============================================================

   IMPORTANT:
   These MUST exactly match the bucket names in Supabase.

   Change them only if your actual bucket names are different.
   ============================================================ */

const BUCKETS = {

    cv: "cv",

    profile: "profile",

    pictorial: "pictorial",

    eko: "eko",

    academic: "academic",

    portfolio: "portfolio"

};


/* ============================================================
   DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    initializePortfolio();

});


/* ============================================================
   INITIALIZE PORTFOLIO
   ============================================================ */

async function initializePortfolio() {

    setupNavigation();

    setupBackToTop();

    setupAdminLock();

    setupModalSystem();

    setupCopyrightYear();

    await loadProfilePicture();

    await loadCV();

    await loadPictorial();

}


/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

function setupNavigation() {

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


        if (
            navLinks.classList.contains("active")
        ) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    /* Close mobile menu after clicking a link */

    navLinks
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove("active");

                    const icon =
                        menuToggle.querySelector("i");

                    icon.classList.remove("fa-xmark");

                    icon.classList.add("fa-bars");

                }
            );

        });

}


/* ============================================================
   BACK TO TOP
   ============================================================ */

function setupBackToTop() {

    const backToTop =
        document.getElementById("backToTop");


    if (!backToTop) {
        console.warn(
            "Back-to-top button not found."
        );
        return;
    }


    /* Initially hidden */

    backToTop.classList.remove("show");


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 400) {

                backToTop.classList.add("show");

            } else {

                backToTop.classList.remove("show");

            }

        }
    );


    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ============================================================
   ADMIN LOCK
   ============================================================ */

function setupAdminLock() {

    const adminLock =
        document.getElementById("adminLock");


    if (!adminLock) {

        console.warn(
            "Admin lock button not found."
        );

        return;

    }


    adminLock.addEventListener(
        "click",
        function () {

            openAdmin();

        }
    );

}


/* ============================================================
   OPEN ADMIN
   ============================================================ */

function openAdmin() {

    const adminPanel =
        document.getElementById("adminPanel");


    if (!adminPanel) {
        return;
    }


    adminPanel.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );


    checkExistingSession();

}


/* ============================================================
   CLOSE ADMIN
   ============================================================ */

function closeAdmin() {

    const adminPanel =
        document.getElementById("adminPanel");


    if (!adminPanel) {
        return;
    }


    adminPanel.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );

}


/* ============================================================
   CHECK EXISTING SUPABASE SESSION
   ============================================================ */

async function checkExistingSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        if (
            data &&
            data.session
        ) {

            showAdminDashboard();

        } else {

            showLoginArea();

        }

    } catch (error) {

        console.error(
            "Session check failed:",
            error
        );

    }

}


/* ============================================================
   ADMIN LOGIN
   ============================================================ */

async function adminLogin() {

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const message =
        document.getElementById("adminMessage");


    if (
        !emailInput ||
        !passwordInput
    ) {

        return;

    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


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
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        if (error) {

            console.error(
                "Login error:",
                error
            );

            showAdminMessage(
                error.message ||
                "Unable to sign in.",
                "error"
            );

            return;

        }


        if (data && data.session) {

            showAdminMessage(
                "Administrator access granted.",
                "success"
            );

            showAdminDashboard();

        }

    } catch (error) {

        console.error(
            "Login failed:",
            error
        );

        showAdminMessage(
            "An unexpected login error occurred.",
            "error"
        );

    }

}


/* ============================================================
   SHOW LOGIN AREA
   ============================================================ */

function showLoginArea() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (loginArea) {

        loginArea.style.display =
            "block";

    }


    if (dashboard) {

        dashboard.style.display =
            "none";

    }

}


/* ============================================================
   SHOW ADMIN DASHBOARD
   ============================================================ */

function showAdminDashboard() {

    const loginArea =
        document.getElementById("loginArea");

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (loginArea) {

        loginArea.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.style.display =
            "block";

    }

}


/* ============================================================
   ADMIN LOGOUT
   ============================================================ */

async function adminLogout() {

    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

            showAdminMessage(
                "Unable to sign out.",
                "error"
            );

            return;

        }


        showLoginArea();


        showAdminMessage(
            "You have been signed out.",
            "success"
        );


    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    }

}


/* ============================================================
   ADMIN MESSAGE
   ============================================================ */

function showAdminMessage(
    text,
    type = "info"
) {

    const message =
        document.getElementById(
            "adminMessage"
        );


    if (!message) {
        return;
    }


    message.textContent = text;

    message.className =
        "admin-message " + type;


    clearTimeout(
        window.adminMessageTimer
    );


    window.adminMessageTimer =
        setTimeout(
            function () {

                message.textContent =
                    "";

                message.className =
                    "admin-message";

            },
            6000
        );

}


/* ============================================================
   GENERIC UPLOAD FUNCTION
   ============================================================ */

async function uploadFileToBucket(
    file,
    bucketName,
    folder = ""
) {

    if (!file) {

        throw new Error(
            "No file selected."
        );

    }


    const safeName =
        sanitizeFileName(
            file.name
        );


    const uniqueName =
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9) +
        "_" +
        safeName;


    let filePath =
        uniqueName;


    if (folder) {

        filePath =
            folder.replace(
                /^\/|\/$/g,
                ""
            ) +
            "/" +
            uniqueName;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(bucketName)
            .upload(
                filePath,
                file,
                {

                    cacheControl:
                        "3600",

                    upsert:
                        false

                }
            );


    if (error) {

        throw error;

    }


    return {

        path: data.path,

        file: file

    };

}


/* ============================================================
   SANITIZE FILE NAME
   ============================================================ */

function sanitizeFileName(
    fileName
) {

    return fileName
        .normalize("NFKD")
        .replace(
            /[^\w.\- ]+/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        )
        .toLowerCase();

}


/* ============================================================
   PUBLIC FILE URL
   ============================================================ */

function getPublicFileUrl(
    bucketName,
    filePath
) {

    const {
        data
    } =
        supabaseClient
            .storage
            .from(bucketName)
            .getPublicUrl(
                filePath
            );


    return data.publicUrl;

}


/* ============================================================
   CV UPLOAD
   ============================================================ */

async function uploadCV() {

    const input =
        document.getElementById(
            "cvFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        showAdminMessage(
            "Please select a PDF CV.",
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
           Remove previous CV files
           so only the current CV remains.
        */

        const {
            data: existingFiles
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.cv
                )
                .list();


        if (
            existingFiles &&
            existingFiles.length
        ) {

            const oldFiles =
                existingFiles.map(
                    file =>
                        file.name
                );


            await supabaseClient
                .storage
                .from(
                    BUCKETS.cv
                )
                .remove(
                    oldFiles
                );

        }


        const result =
            await uploadFileToBucket(
                file,
                BUCKETS.cv
            );


        const publicUrl =
            getPublicFileUrl(
                BUCKETS.cv,
                result.path
            );


        localStorage.setItem(
            "currentCVPath",
            result.path
        );


        localStorage.setItem(
            "currentCVUrl",
            publicUrl
        );


        setCVLinks(
            publicUrl
        );


        showAdminMessage(
            "CV uploaded successfully.",
            "success"
        );


        input.value = "";


    } catch (error) {

        console.error(
            "CV upload error:",
            error
        );


        showAdminMessage(
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD CV
   ============================================================ */

async function loadCV() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.cv
                )
                .list(
                    "",
                    {

                        limit: 100,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "CV list error:",
                error
            );

            setCVStatus(
                "CV is currently unavailable."
            );

            return;

        }


        if (
            !data ||
            !data.length
        ) {

            setCVStatus(
                "CV will appear here once uploaded."
            );

            return;

        }


        const latest =
            data[0];


        const url =
            getPublicFileUrl(
                BUCKETS.cv,
                latest.name
            );


        setCVLinks(url);

        setCVStatus(
            "CV available for viewing and download."
        );


    } catch (error) {

        console.error(
            "Load CV error:",
            error
        );

    }

}


/* ============================================================
   SET CV LINKS
   ============================================================ */

function setCVLinks(url) {

    const view =
        document.getElementById(
            "viewCV"
        );

    const download =
        document.getElementById(
            "downloadCV"
        );


    if (view) {

        view.href = url;

    }


    if (download) {

        download.href = url;

    }

}


/* ============================================================
   CV STATUS
   ============================================================ */

function setCVStatus(
    text
) {

    const status =
        document.getElementById(
            "cvStatus"
        );


    if (status) {

        status.textContent =
            text;

    }

}


/* ============================================================
   PROFILE PICTURE UPLOAD
   ============================================================ */

async function uploadProfile() {

    const input =
        document.getElementById(
            "profileFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        showAdminMessage(
            "Please select a profile photograph.",
            "error"
        );

        return;

    }


    const file =
        input.files[0];


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showAdminMessage(
            "Please select an image file.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading profile photograph...",
        "loading"
    );


    try {

        const {
            data: oldFiles
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.profile
                )
                .list();


        if (
            oldFiles &&
            oldFiles.length
        ) {

            await supabaseClient
                .storage
                .from(
                    BUCKETS.profile
                )
                .remove(
                    oldFiles.map(
                        file =>
                            file.name
                    )
                );

        }


        const result =
            await uploadFileToBucket(
                file,
                BUCKETS.profile
            );


        const url =
            getPublicFileUrl(
                BUCKETS.profile,
                result.path
            );


        displayProfilePicture(
            url
        );


        showAdminMessage(
            "Profile picture uploaded successfully.",
            "success"
        );


        input.value = "";


    } catch (error) {

        console.error(
            "Profile upload error:",
            error
        );


        showAdminMessage(
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD PROFILE PICTURE
   ============================================================ */

async function loadProfilePicture() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.profile
                )
                .list(
                    "",
                    {

                        limit: 100,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "Profile list error:",
                error
            );

            return;

        }


        if (
            !data ||
            !data.length
        ) {

            return;

        }


        const latest =
            data[0];


        const url =
            getPublicFileUrl(
                BUCKETS.profile,
                latest.name
            );


        displayProfilePicture(
            url
        );


    } catch (error) {

        console.error(
            "Profile load error:",
            error
        );

    }

}


/* ============================================================
   DISPLAY PROFILE PICTURE
   ============================================================ */

function displayProfilePicture(
    url
) {

    const frame =
        document.getElementById(
            "profileFrame"
        );


    if (!frame) {
        return;
    }


    frame.innerHTML = `

        <img
            src="${escapeAttribute(url)}"
            alt="Edwin Kuchio Okello"
            class="profile-image"
        >

    `;

}


/* ============================================================
   PICTORIAL UPLOAD
   ============================================================ */

async function uploadPictorial() {

    const input =
        document.getElementById(
            "pictorialFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        showAdminMessage(
            "Please select one or more photographs.",
            "error"
        );

        return;

    }


    const files =
        Array.from(
            input.files
        );


    showAdminMessage(
        "Uploading photographs...",
        "loading"
    );


    let uploaded =
        0;


    try {

        for (
            const file of files
        ) {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                continue;

            }


            await uploadFileToBucket(
                file,
                BUCKETS.pictorial
            );


            uploaded++;

        }


        showAdminMessage(
            uploaded +
            " photograph(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadPictorial();


    } catch (error) {

        console.error(
            "Pictorial upload error:",
            error
        );


        showAdminMessage(
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD PICTORIAL
   ============================================================ */

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
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.pictorial
                )
                .list(
                    "",
                    {

                        limit: 500,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "Gallery error:",
                error
            );

            return;

        }


        const images =
            (data || [])
                .filter(
                    file =>
                        isImageFile(
                            file.name
                        )
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
            "";


        images.forEach(
            function (file) {

                const url =
                    getPublicFileUrl(
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
                        src="${escapeAttribute(url)}"
                        alt="Portfolio photograph"
                        loading="lazy"
                    >

                    <div class="gallery-overlay">

                        <i class="fas fa-expand"></i>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    function () {

                        openImageViewer(
                            url
                        );

                    }
                );


                gallery.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Gallery loading failed:",
            error
        );

    }

}


/* ============================================================
   EKO PROJECT UPLOADS
   ============================================================ */

/*
   THIS IS THE IMPORTANT PART.

   You can select MULTIPLE files in the EKO upload box.

   Example:

   Project 01
   Project 02
   Project 03
   Project 04
   Project 05
   EKO Dashboard
   EKO Report
   EKO Research
   etc.

   They all go into the EKO bucket.
*/

async function uploadEKOProjects() {

    const input =
        document.getElementById(
            "ekoFile"
        );


    const status =
        document.getElementById(
            "ekoUploadStatus"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setUploadStatus(
            status,
            "Please select one or more EKO projects.",
            "error"
        );

        return;

    }


    const files =
        Array.from(
            input.files
        );


    setUploadStatus(
        status,
        "Uploading " +
        files.length +
        " EKO project(s)...",
        "loading"
    );


    let successful =
        0;


    const failures =
        [];


    try {

        for (
            const file of files
        ) {

            try {

                await uploadFileToBucket(
                    file,
                    BUCKETS.eko
                );


                successful++;


            } catch (error) {

                console.error(
                    "EKO file error:",
                    file.name,
                    error
                );


                failures.push(
                    file.name
                );

            }

        }


        if (
            failures.length
        ) {

            setUploadStatus(
                status,

                successful +
                " uploaded. " +
                failures.length +
                " failed.",

                "error"
            );

        } else {

            setUploadStatus(
                status,

                successful +
                " EKO project(s) uploaded successfully.",

                "success"
            );

        }


        input.value = "";


        /*
           Refresh the EKO library immediately.
        */

        await loadEKOProjects();


    } catch (error) {

        console.error(
            "EKO upload error:",
            error
        );


        setUploadStatus(
            status,
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD EKO PROJECTS
   ============================================================ */

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
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.eko
                )
                .list(
                    "",
                    {

                        limit: 500,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "EKO list error:",
                error
            );


            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-circle-exclamation"></i>

                    <h3>
                        Unable to load EKO projects.
                    </h3>

                    <p>
                        Check the Supabase EKO bucket and storage policies.
                    </p>

                </div>

            `;


            return;

        }


        const files =
            (data || [])
                .filter(
                    file =>
                        file.name
                );


        if (!files.length) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        No additional EKO projects yet.
                    </h3>

                    <p>
                        Upload projects through the administrator area.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            "";


        files.forEach(
            function (file, index) {

                const url =
                    getPublicFileUrl(
                        BUCKETS.eko,
                        file.name
                    );


                const card =
                    createDocumentCard(
                        file,
                        url,
                        "EKO PROJECT",
                        index + 1
                    );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "EKO loading failed:",
            error
        );

    }

}


/* ============================================================
   EKO PORTFOLIO
   ============================================================ */

/*
   EKO Portfolio is kept inside the EKO ecosystem.

   To keep the structure clear:

   EKO Analytics & Research
   │
   ├── EKO Portfolio
   │
   ├── Project 01
   ├── Project 02
   ├── Project 03
   ├── Project 04
   └── Future Projects

   The EKO bucket stores all EKO project files.

   If your HTML has an EKO Portfolio button/container,
   these functions can be connected directly to it.
*/


async function loadEKOPortfolio() {

    const container =
        document.getElementById(
            "ekoPortfolioDocuments"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading EKO portfolio...
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
                .from(
                    BUCKETS.eko
                )
                .list(
                    "portfolio",
                    {

                        limit: 500,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "EKO portfolio error:",
                error
            );


            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-circle-exclamation"></i>

                    <h3>
                        Unable to load EKO Portfolio.
                    </h3>

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

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        EKO Portfolio is empty.
                    </h3>

                    <p>
                        Upload EKO Portfolio materials from the administrator area.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            "";


        data.forEach(
            function (file, index) {

                const path =
                    "portfolio/" +
                    file.name;


                const url =
                    getPublicFileUrl(
                        BUCKETS.eko,
                        path
                    );


                const card =
                    createDocumentCard(
                        file,
                        url,
                        "EKO PORTFOLIO",
                        index + 1
                    );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "EKO Portfolio loading error:",
            error
        );

    }

}


/* ============================================================
   UPLOAD EKO PORTFOLIO MATERIAL
   ============================================================ */

async function uploadEKOPortfolio() {

    const input =
        document.getElementById(
            "ekoPortfolioFile"
        );


    const status =
        document.getElementById(
            "ekoPortfolioUploadStatus"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setUploadStatus(
            status,
            "Please select EKO Portfolio materials.",
            "error"
        );

        return;

    }


    const files =
        Array.from(
            input.files
        );


    setUploadStatus(
        status,
        "Uploading EKO Portfolio materials...",
        "loading"
    );


    let successful =
        0;


    try {

        for (
            const file of files
        ) {

            await uploadFileToBucket(
                file,
                BUCKETS.eko,
                "portfolio"
            );


            successful++;

        }


        setUploadStatus(
            status,
            successful +
            " EKO Portfolio file(s) uploaded.",
            "success"
        );


        input.value = "";


        await loadEKOPortfolio();


    } catch (error) {

        console.error(
            "EKO Portfolio upload error:",
            error
        );


        setUploadStatus(
            status,
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   ACADEMIC DOCUMENT UPLOAD
   ============================================================ */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById(
            "academicFile"
        );


    const status =
        document.getElementById(
            "academicUploadStatus"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setUploadStatus(
            status,
            "Please select academic documents.",
            "error"
        );

        return;

    }


    const files =
        Array.from(
            input.files
        );


    setUploadStatus(
        status,
        "Uploading academic work...",
        "loading"
    );


    let successful =
        0;


    try {

        for (
            const file of files
        ) {

            await uploadFileToBucket(
                file,
                BUCKETS.academic
            );


            successful++;

        }


        setUploadStatus(
            status,
            successful +
            " academic document(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadAcademicDocuments();


    } catch (error) {

        console.error(
            "Academic upload error:",
            error
        );


        setUploadStatus(
            status,
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD ACADEMIC DOCUMENTS
   ============================================================ */

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
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.academic
                )
                .list(
                    "",
                    {

                        limit: 500,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "Academic list error:",
                error
            );


            renderEmptyDocumentState(
                container,
                "Unable to load academic work."
            );


            return;

        }


        if (
            !data ||
            !data.length
        ) {

            renderEmptyDocumentState(
                container,
                "No academic work has been uploaded yet."
            );


            return;

        }


        container.innerHTML =
            "";


        data.forEach(
            function (file, index) {

                const url =
                    getPublicFileUrl(
                        BUCKETS.academic,
                        file.name
                    );


                container.appendChild(
                    createDocumentCard(
                        file,
                        url,
                        "ACADEMIC WORK",
                        index + 1
                    )
                );

            }
        );


    } catch (error) {

        console.error(
            "Academic loading failed:",
            error
        );

    }

}


/* ============================================================
   PROFESSIONAL PORTFOLIO UPLOAD
   ============================================================ */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById(
            "portfolioFile"
        );


    const status =
        document.getElementById(
            "portfolioUploadStatus"
        );


    if (
        !input ||
        !input.files.length
    ) {

        setUploadStatus(
            status,
            "Please select portfolio materials.",
            "error"
        );

        return;

    }


    const files =
        Array.from(
            input.files
        );


    setUploadStatus(
        status,
        "Uploading professional portfolio materials...",
        "loading"
    );


    let successful =
        0;


    try {

        for (
            const file of files
        ) {

            await uploadFileToBucket(
                file,
                BUCKETS.portfolio
            );


            successful++;

        }


        setUploadStatus(
            status,
            successful +
            " professional portfolio file(s) uploaded successfully.",
            "success"
        );


        input.value = "";


        await loadPortfolioDocuments();


    } catch (error) {

        console.error(
            "Portfolio upload error:",
            error
        );


        setUploadStatus(
            status,
            getFriendlyStorageError(
                error
            ),
            "error"
        );

    }

}


/* ============================================================
   LOAD PROFESSIONAL PORTFOLIO
   ============================================================ */

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
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKETS.portfolio
                )
                .list(
                    "",
                    {

                        limit: 500,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"

                        }

                    }
                );


        if (error) {

            console.error(
                "Portfolio list error:",
                error
            );


            renderEmptyDocumentState(
                container,
                "Unable to load portfolio materials."
            );


            return;

        }


        if (
            !data ||
            !data.length
        ) {

            renderEmptyDocumentState(
                container,
                "No professional portfolio materials have been uploaded yet."
            );


            return;

        }


        container.innerHTML =
            "";


        data.forEach(
            function (file, index) {

                const url =
                    getPublicFileUrl(
                        BUCKETS.portfolio,
                        file.name
                    );


                container.appendChild(
                    createDocumentCard(
                        file,
                        url,
                        "PROFESSIONAL PORTFOLIO",
                        index + 1
                    )
                );

            }
        );


    } catch (error) {

        console.error(
            "Portfolio loading failed:",
            error
        );

    }

}


/* ============================================================
   CREATE DOCUMENT CARD
   ============================================================ */

function createDocumentCard(
    file,
    url,
    category,
    number
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "uploaded-document";


    const icon =
        getFileIcon(
            file.name
        );


    const fileSize =
        formatFileSize(
            file.metadata &&
            file.metadata.size
                ? file.metadata.size
                : 0
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
                ${escapeHtml(category)}
            </span>

            <h3>
                ${escapeHtml(title)}
            </h3>

            <p>
                ${fileSize}
            </p>

        </div>


        <div class="document-actions">

            <a
                href="${escapeAttribute(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="document-view"
            >

                <i class="fas fa-eye"></i>

                View

            </a>


            <a
                href="${escapeAttribute(url)}"
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


/* ============================================================
   EMPTY DOCUMENT STATE
   ============================================================ */

function renderEmptyDocumentState(
    container,
    message
) {

    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-folder-open"></i>

            <h3>
                ${escapeHtml(message)}
            </h3>

        </div>

    `;

}


/* ============================================================
   FILE ICON
   ============================================================ */

function getFileIcon(
    fileName
) {

    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    if (
        extension === "pdf"
    ) {

        return "fas fa-file-pdf";

    }


    if (
        ["doc", "docx"]
            .includes(
                extension
            )
    ) {

        return "fas fa-file-word";

    }


    if (
        ["xls", "xlsx", "csv"]
            .includes(
                extension
            )
    ) {

        return "fas fa-file-excel";

    }


    if (
        ["ppt", "pptx"]
            .includes(
                extension
            )
    ) {

        return "fas fa-file-powerpoint";

    }


    if (
        [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp"
        ]
            .includes(
                extension
            )
    ) {

        return "fas fa-file-image";

    }


    if (
        ["txt", "md"]
            .includes(
                extension
            )
    ) {

        return "fas fa-file-lines";

    }


    return "fas fa-file";

}


/* ============================================================
   FILE SIZE
   ============================================================ */

function formatFileSize(
    bytes
) {

    if (
        !bytes ||
        bytes <= 0
    ) {

        return "File";

    }


    const units = [
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
            Math.pow(
                1024,
                index
            ) *
            10
        ) / 10
    ) +
    " " +
    units[index];

}


/* ============================================================
   FORMAT FILE NAME
   ============================================================ */

function formatFileName(
    fileName
) {

    return fileName
        .replace(
            /^\d+_[a-z0-9]+_/i,
            ""
        )
        .replace(
            /\.[^/.]+$/,
            ""
        )
        .replace(
            /[-_]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


/* ============================================================
   IMAGE FILE CHECK
   ============================================================ */

function isImageFile(
    fileName
) {

    return /\.(jpg|jpeg|png|gif|webp|avif)$/i
        .test(
            fileName
        );

}


/* ============================================================
   UPLOAD STATUS
   ============================================================ */

function setUploadStatus(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        "upload-status " +
        type;

}


/* ============================================================
   MODAL SYSTEM
   ============================================================ */

function setupModalSystem() {

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
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


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(
                        function (modal) {

                            closeModal(
                                modal.id
                            );

                        }
                    );

            }

        }
    );

}


/* ============================================================
   OPEN MODAL
   ============================================================ */

function openModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) {

        console.warn(
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


    /*
       Automatically refresh relevant
       document libraries.
    */

    if (
        modalId ===
        "ekoModal"
    ) {

        loadEKOProjects();

        loadEKOPortfolio();

    }


    if (
        modalId ===
        "academicModal"
    ) {

        loadAcademicDocuments();

    }


    if (
        modalId ===
        "portfolioModal"
    ) {

        loadPortfolioDocuments();

    }

}


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    if (
        !document.querySelector(
            ".modal.active"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* ============================================================
   PROJECT 01
   ============================================================ */

function openProject01() {

    closeModal(
        "ekoModal"
    );


    setTimeout(
        function () {

            openModal(
                "project01Modal"
            );

        },
        150
    );

}


/* ============================================================
   IMAGE VIEWER
   ============================================================ */

function openImageViewer(
    url
) {

    const viewer =
        document.createElement(
            "div"
        );


    viewer.className =
        "image-viewer";


    viewer.innerHTML = `

        <button
            class="image-viewer-close"
            aria-label="Close image"
        >
            &times;
        </button>

        <img
            src="${escapeAttribute(url)}"
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

            if (
                event.target ===
                viewer
            ) {

                viewer.remove();

            }

        }
    );

}


/* ============================================================
   COPYRIGHT YEAR
   ============================================================ */

function setupCopyrightYear() {

    const year =
        document.getElementById(
            "year"
        );


    if (year) {

        year.textContent =
            new Date()
                .getFullYear();

    }

}


/* ============================================================
   FRIENDLY SUPABASE ERROR
   ============================================================ */

function getFriendlyStorageError(
    error
) {

    if (!error) {

        return "An unknown error occurred.";

    }


    const message =
        error.message ||
        "";


    if (
        message
            .toLowerCase()
            .includes(
                "row-level security"
            )
    ) {

        return (
            "Supabase storage permissions are blocking this upload. " +
            "Check the storage policies for the bucket."
        );

    }


    if (
        message
            .toLowerCase()
            .includes(
                "bucket"
            )
    ) {

        return (
            "The Supabase storage bucket could not be accessed. " +
            "Check that the bucket name is correct."
        );

    }


    if (
        message
            .toLowerCase()
            .includes(
                "permission"
            )
    ) {

        return (
            "Permission denied. Check your Supabase Storage policies."
        );

    }


    return message;

}


/* ============================================================
   HTML ESCAPING
   ============================================================ */

function escapeHtml(
    value
) {

    return String(
        value
    )
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


/* ============================================================
   ATTRIBUTE ESCAPING
   ============================================================ */

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* ============================================================
   SUPABASE AUTH STATE LISTENER
   ============================================================ */

supabaseClient
    .auth
    .onAuthStateChange(
        function (
            event,
            session
        ) {

            if (
                session
            ) {

                showAdminDashboard();

            } else {

                showLoginArea();

            }

        }
    );


/* ============================================================
   GLOBAL FUNCTIONS
   ============================================================

   These make the functions accessible to buttons using:

   onclick="functionName()"

   ============================================================ */

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

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.openProject01 =
    openProject01;


/* ============================================================
   END SCRIPT
   ============================================================ */
