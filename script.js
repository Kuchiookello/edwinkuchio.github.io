/* =========================================================
   EKO ANALYTICS & RESEARCH
   EDWIN KUCHIO OKELLO PORTFOLIO
   SUPABASE SCRIPT
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
   EXACT SUPABASE BUCKET NAMES
========================================================= */

const BUCKETS = {

    CV:
        "CV",

    PROFILE:
        "Profile",

    PICTORIAL:
        "Pictorial",

    EKO:
        "eko",

    ACADEMIC:
        "Academic Essays and Research",

    PORTFOLIO:
        "Professional Portfolio"

};


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentCVUrl = null;

let currentCVFilename = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeWebsite();

    }
);


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

async function initializeWebsite() {

    setYear();

    setupNavigation();

    setupBackToTop();

    setupAdminLock();

    await loadProfile();

    await loadCV();

    await loadPictorial();

}


/* =========================================================
   YEAR
========================================================= */

function setYear() {

    const year =
        document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");


    if (!menuToggle || !navLinks) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle(
                "active"
            );

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navLinks.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   BACK TO TOP
========================================================= */

function setupBackToTop() {

    const button =
        document.getElementById("backToTop");


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 450) {

                button.classList.add(
                    "show"
                );

            } else {

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
   ADMIN LOCK
========================================================= */

function setupAdminLock() {

    const lock =
        document.getElementById("adminLock");


    if (!lock) {
        return;
    }


    lock.addEventListener(
        "click",
        function () {

            openAdmin();

        }
    );

}


/* =========================================================
   MODAL FUNCTIONS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    document.body.style.overflow =
        "";

}


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    openModal("project01Modal");

}


/* =========================================================
   GENERATE PUBLIC URL
========================================================= */

function getPublicUrl(
    bucket,
    path
) {

    const result =
        supabaseClient
            .storage
            .from(bucket)
            .getPublicUrl(path);


    return result.data.publicUrl;

}


/* =========================================================
   SAFE FILE NAME
========================================================= */

function safeFileName(
    name
) {

    return name
        .replace(/[^\w.\- ]+/g, "")
        .replace(/\s+/g, "_");

}


/* =========================================================
   DOCUMENT ICON
========================================================= */

function getDocumentIcon(
    filename
) {

    const lower =
        filename.toLowerCase();


    if (
        lower.endsWith(".pdf")
    ) {

        return "fa-file-pdf";

    }


    if (
        lower.endsWith(".doc") ||
        lower.endsWith(".docx")
    ) {

        return "fa-file-word";

    }


    if (
        lower.endsWith(".xls") ||
        lower.endsWith(".xlsx") ||
        lower.endsWith(".csv")
    ) {

        return "fa-file-excel";

    }


    if (
        lower.endsWith(".ppt") ||
        lower.endsWith(".pptx")
    ) {

        return "fa-file-powerpoint";

    }


    if (
        lower.match(
            /\.(jpg|jpeg|png|gif|webp)$/i
        )
    ) {

        return "fa-file-image";

    }


    if (
        lower.endsWith(".txt")
    ) {

        return "fa-file-lines";

    }


    return "fa-file";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   DOCUMENT CARD
=========================================================

   VIEW:
   Opens document only.

   DOWNLOAD:
   Explicitly downloads document.

========================================================= */

function createDocumentCard(
    file,
    bucket
) {

    const url =
        getPublicUrl(
            bucket,
            file.name
        );


    const card =
        document.createElement("div");

    card.className =
        "document-card";


    const info =
        document.createElement("div");

    info.className =
        "document-info";


    const icon =
        document.createElement("div");

    icon.className =
        "document-icon";


    icon.innerHTML =
        `<i class="fas ${getDocumentIcon(file.name)}"></i>`;


    const details =
        document.createElement("div");


    const title =
        document.createElement("h4");


    title.textContent =
        file.name;


    const metadata =
        document.createElement("p");


    metadata.textContent =
        formatDate(
            file.created_at
        );


    details.appendChild(title);

    details.appendChild(metadata);


    info.appendChild(icon);

    info.appendChild(details);


    const actions =
        document.createElement("div");

    actions.className =
        "document-actions";


    /* VIEW BUTTON */

    const viewButton =
        document.createElement("button");

    viewButton.type =
        "button";

    viewButton.className =
        "document-view-btn";

    viewButton.innerHTML =
        `<i class="fas fa-eye"></i> View`;


    viewButton.addEventListener(
        "click",
        function () {

            viewDocument(url);

        }
    );


    /* DOWNLOAD BUTTON */

    const downloadButton =
        document.createElement("button");

    downloadButton.type =
        "button";

    downloadButton.className =
        "document-download-btn";

    downloadButton.innerHTML =
        `<i class="fas fa-download"></i> Download`;


    downloadButton.addEventListener(
        "click",
        function () {

            downloadDocument(
                url,
                file.name
            );

        }
    );


    actions.appendChild(
        viewButton
    );

    actions.appendChild(
        downloadButton
    );


    card.appendChild(info);

    card.appendChild(actions);


    return card;

}


/* =========================================================
   VIEW DOCUMENT
========================================================= */

function viewDocument(
    url
) {

    if (!url) {

        alert(
            "This document is currently unavailable."
        );

        return;

    }


    /*
     * IMPORTANT:
     *
     * This function ONLY opens the document.
     *
     * It does NOT fetch the file.
     * It does NOT force a download.
     */

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   DOWNLOAD DOCUMENT
========================================================= */

async function downloadDocument(
    url,
    filename
) {

    if (!url) {

        alert(
            "This document is currently unavailable."
        );

        return;

    }


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Download request failed."
            );

        }


        const blob =
            await response.blob();


        const downloadUrl =
            window.URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href =
            downloadUrl;


        link.download =
            filename || "document";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
            downloadUrl
        );

    }

    catch (error) {

        console.error(
            "Download error:",
            error
        );


        alert(
            "The document could not be downloaded. Please try again."
        );

    }

}


/* =========================================================
   LIST FILES
========================================================= */

async function listBucketFiles(
    bucket
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(bucket)
            .list(
                "",
                {
                    limit: 1000,
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


    return data || [];

}


/* =========================================================
   RENDER DOCUMENT LIBRARY
========================================================= */

async function loadDocumentLibrary(
    bucket,
    containerId,
    emptyMessage
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading...
            </h3>

        </div>

    `;


    try {

        const files =
            await listBucketFiles(
                bucket
            );


        /*
         * Ignore folders.
         */

        const documents =
            files.filter(
                file =>
                    file.name &&
                    !file.name.endsWith("/")
            );


        container.innerHTML =
            "";


        if (
            documents.length === 0
        ) {

            container.innerHTML = `

                <div class="document-placeholder">

                    <i class="fas fa-folder-open"></i>

                    <h3>
                        ${emptyMessage}
                    </h3>

                </div>

            `;

            return;

        }


        documents.forEach(
            function (file) {

                container.appendChild(
                    createDocumentCard(
                        file,
                        bucket
                    )
                );

            }
        );

    }

    catch (error) {

        console.error(
            `Error loading ${bucket}:`,
            error
        );


        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-triangle-exclamation"></i>

                <h3>
                    Unable to load documents.
                </h3>

                <p>
                    Please check the Supabase storage policies.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   EKO PORTFOLIO
========================================================= */

async function loadEKOPortfolio() {

    await loadDocumentLibrary(
        BUCKETS.EKO,
        "ekoPortfolioDocuments",
        "No EKO portfolio materials uploaded yet."
    );

}


/* =========================================================
   EKO PROJECTS
========================================================= */

async function loadEKOProjects() {

    await loadEKOPortfolio();


    await loadDocumentLibrary(
        BUCKETS.EKO,
        "ekoProjects",
        "No additional EKO projects uploaded yet."
    );

}


/* =========================================================
   ACADEMIC DOCUMENTS
========================================================= */

async function loadAcademicDocuments() {

    await loadDocumentLibrary(
        BUCKETS.ACADEMIC,
        "academicDocuments",
        "No academic work uploaded yet."
    );

}


/* =========================================================
   PROFESSIONAL PORTFOLIO
========================================================= */

async function loadPortfolioDocuments() {

    await loadDocumentLibrary(
        BUCKETS.PORTFOLIO,
        "portfolioDocuments",
        "No professional portfolio materials uploaded yet."
    );

}


/* =========================================================
   CV
========================================================= */

async function loadCV() {

    const status =
        document.getElementById(
            "cvStatus"
        );


    const viewButton =
        document.getElementById(
            "viewCV"
        );


    const downloadButton =
        document.getElementById(
            "downloadCV"
        );


    if (
        !status ||
        !viewButton ||
        !downloadButton
    ) {

        return;

    }


    status.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Loading CV...';


    viewButton.disabled =
        true;


    downloadButton.disabled =
        true;


    try {

        const files =
            await listBucketFiles(
                BUCKETS.CV
            );


        const pdfFiles =
            files.filter(
                file =>
                    file.name &&
                    file.name
                        .toLowerCase()
                        .endsWith(".pdf")
            );


        if (
            pdfFiles.length === 0
        ) {

            status.innerHTML =
                '<i class="fas fa-circle-info"></i> No CV has been uploaded yet.';

            return;

        }


        /*
         * list() is sorted newest first.
         */

        const latestCV =
            pdfFiles[0];


        currentCVFilename =
            latestCV.name;


        currentCVUrl =
            getPublicUrl(
                BUCKETS.CV,
                latestCV.name
            );


        viewButton.disabled =
            false;


        downloadButton.disabled =
            false;


        status.innerHTML =
            '<i class="fas fa-circle-check"></i> CV available.';


    }

    catch (error) {

        console.error(
            "CV loading error:",
            error
        );


        status.innerHTML =
            '<i class="fas fa-triangle-exclamation"></i> Unable to load CV.';

    }

}


/* =========================================================
   VIEW CV
========================================================= */

function viewCVDocument() {

    /*
     * ONLY VIEW.
     */

    if (!currentCVUrl) {

        alert(
            "The CV is currently unavailable."
        );

        return;

    }


    window.open(
        currentCVUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   DOWNLOAD CV
========================================================= */

async function downloadCVDocument() {

    if (!currentCVUrl) {

        alert(
            "The CV is currently unavailable."
        );

        return;

    }


    await downloadDocument(
        currentCVUrl,
        currentCVFilename ||
        "Edwin_Kuchio_Okello_CV.pdf"
    );

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    const frame =
        document.getElementById(
            "profileFrame"
        );


    if (!frame) {
        return;
    }


    try {

        const files =
            await listBucketFiles(
                BUCKETS.PROFILE
            );


        const images =
            files.filter(
                file =>
                    file.name &&
                    file.name.match(
                        /\.(jpg|jpeg|png|gif|webp)$/i
                    )
            );


        if (
            images.length === 0
        ) {

            return;

        }


        const latest =
            images[0];


        const url =
            getPublicUrl(
                BUCKETS.PROFILE,
                latest.name
            );


        frame.innerHTML = `

            <img
                src="${url}"
                alt="Edwin Kuchio Okello"
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
   PICTORIAL
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

        const files =
            await listBucketFiles(
                BUCKETS.PICTORIAL
            );


        const images =
            files.filter(
                file =>
                    file.name &&
                    file.name.match(
                        /\.(jpg|jpeg|png|gif|webp)$/i
                    )
            );


        gallery.innerHTML =
            "";


        if (
            images.length === 0
        ) {

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


        images.forEach(
            function (file) {

                const url =
                    getPublicUrl(
                        BUCKETS.PICTORIAL,
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

                `;


                gallery.appendChild(
                    item
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Pictorial loading error:",
            error
        );

    }

}


/* =========================================================
   ADMIN PANEL
========================================================= */

function openAdmin() {

    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    checkAdminSession();

}


function closeAdmin() {

    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    try {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            data &&
            data.session
        ) {

            showAdminDashboard();

        }

        else {

            showLoginArea();

        }

    }

    catch (error) {

        console.error(
            "Session error:",
            error
        );

        showLoginArea();

    }

}


/* =========================================================
   SHOW LOGIN
========================================================= */

function showLoginArea() {

    const login =
        document.getElementById(
            "loginArea"
        );

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (login) {

        login.style.display =
            "block";

    }


    if (dashboard) {

        dashboard.style.display =
            "none";

    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showAdminDashboard() {

    const login =
        document.getElementById(
            "loginArea"
        );

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (login) {

        login.style.display =
            "none";

    }


    if (dashboard) {

        dashboard.style.display =
            "block";

    }

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const email =
        document.getElementById(
            "adminEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "adminPassword"
        ).value;


    const message =
        document.getElementById(
            "adminMessage"
        );


    if (
        !email ||
        !password
    ) {

        if (message) {

            message.textContent =
                "Please enter your administrator email and password.";

        }

        return;

    }


    if (message) {

        message.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            throw error;

        }


        if (message) {

            message.innerHTML =
                '<i class="fas fa-circle-check"></i> Login successful.';

        }


        showAdminDashboard();


    }

    catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        if (message) {

            message.innerHTML =
                `<i class="fas fa-triangle-exclamation"></i> ${escapeHtml(error.message || "Login failed.")}`;

        }

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await supabaseClient
            .auth
            .signOut();


        showLoginArea();


        const message =
            document.getElementById(
                "adminMessage"
            );


        if (message) {

            message.textContent =
                "You have been signed out.";

        }

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


/* =========================================================
   AUTHENTICATION GUARD
========================================================= */

async function ensureAdminAuthenticated() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        !data ||
        !data.session
    ) {

        throw new Error(
            "Administrator authentication required."
        );

    }


    return data.session;

}


/* =========================================================
   GENERIC UPLOAD
========================================================= */

async function uploadFiles(
    bucket,
    files,
    statusElementId
) {

    const status =
        document.getElementById(
            statusElementId
        );


    if (
        !files ||
        files.length === 0
    ) {

        if (status) {

            status.textContent =
                "Please select at least one file.";

        }

        return;

    }


    try {

        await ensureAdminAuthenticated();


        if (status) {

            status.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        }


        let successful =
            0;


        for (
            const file of files
        ) {

            const filename =
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .substring(2,8) +
                "_" +
                safeFileName(
                    file.name
                );


            const {
                error
            } =
                await supabaseClient
                    .storage
                    .from(bucket)
                    .upload(
                        filename,
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
                    `Upload failed for ${file.name}:`,
                    error
                );

                continue;

            }


            successful++;

        }


        if (status) {

            status.innerHTML = `

                <i class="fas fa-circle-check"></i>

                ${successful} file(s) uploaded successfully.

            `;

        }

    }

    catch (error) {

        console.error(
            "Upload error:",
            error
        );


        if (status) {

            status.innerHTML = `

                <i class="fas fa-triangle-exclamation"></i>

                ${escapeHtml(error.message || "Upload failed.")}

            `;

        }

    }

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const input =
        document.getElementById(
            "cvFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        alert(
            "Please select a PDF CV."
        );

        return;

    }


    if (
        !input.files[0].name
            .toLowerCase()
            .endsWith(".pdf")
    ) {

        alert(
            "The CV must be a PDF."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.CV,
        [input.files[0]],
        "cvUploadStatus"
    );


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


    if (
        !input ||
        !input.files.length
    ) {

        alert(
            "Please select a profile photograph."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.PROFILE,
        [input.files[0]],
        "profileUploadStatus"
    );


    await loadProfile();

}


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById(
            "pictorialFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        alert(
            "Please select one or more photographs."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.PICTORIAL,
        Array.from(
            input.files
        ),
        "pictorialUploadStatus"
    );


    await loadPictorial();

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

        alert(
            "Please select EKO portfolio file(s)."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.EKO,
        Array.from(
            input.files
        ),
        "ekoPortfolioUploadStatus"
    );


    await loadEKOPortfolio();

}


/* =========================================================
   EKO PROJECT UPLOAD
========================================================= */

async function uploadEKOProjects() {

    const input =
        document.getElementById(
            "ekoFile"
        );


    if (
        !input ||
        !input.files.length
    ) {

        alert(
            "Please select one or more EKO projects."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.EKO,
        Array.from(
            input.files
        ),
        "ekoUploadStatus"
    );


    await loadEKOProjects();

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

        alert(
            "Please select academic document(s)."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.ACADEMIC,
        Array.from(
            input.files
        ),
        "academicUploadStatus"
    );


    await loadAcademicDocuments();

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

        alert(
            "Please select portfolio file(s)."
        );

        return;

    }


    await uploadFiles(
        BUCKETS.PORTFOLIO,
        Array.from(
            input.files
        ),
        "portfolioUploadStatus"
    );


    await loadPortfolioDocuments();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================================================
   ESC CLOSE FOR MODALS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal.active"
            )
            .forEach(
                function (modal) {

                    modal.classList.remove(
                        "active"
                    );

                }
            );


        const admin =
            document.getElementById(
                "adminPanel"
            );


        if (
            admin &&
            admin.classList.contains(
                "active"
            )
        ) {

            closeAdmin();

        }


        document.body.style.overflow =
            "";

    }
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

        }

    }
);
