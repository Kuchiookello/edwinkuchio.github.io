    /* =========================================================
   SUPABASE CONNECTION
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
   SUPABASE BUCKETS
========================================================= */

const CV_BUCKET =
    "CV";

const PROFILE_BUCKET =
    "Profile";

const PICTORIAL_BUCKET =
    "Pictorial";

const EKO_BUCKET =
    "eko";

const ACADEMIC_BUCKET =
    "Academic Essays and Research";

const PORTFOLIO_BUCKET =
    "Professional Portfolio";


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("active");

        }
    );

}


document
    .querySelectorAll(".nav-links a")
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.classList.remove("active");

            }
        );

    });


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
   MODAL SYSTEM
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");

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
   CLOSE MODAL WHEN CLICKING BACKDROP
========================================================= */

document
    .querySelectorAll(".modal")
    .forEach(function (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

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

            }
        );

    });


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        document
            .querySelectorAll(".modal.active")
            .forEach(function (modal) {

                modal.classList.remove(
                    "active"
                );

            });

        closeAdmin();

        document.body.classList.remove(
            "modal-open"
        );

    }
);


/* =========================================================
   PROJECT 01
========================================================= */

function openProject01() {

    closeModal("ekoModal");

    setTimeout(
        function () {

            openModal(
                "project01Modal"
            );

        },
        150
    );

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById(
        "backToTop"
    );


window.addEventListener(
    "scroll",
    function () {

        if (
            window.scrollY > 450
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

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


/* =========================================================
   ADMIN PANEL
========================================================= */

const adminLock =
    document.getElementById(
        "adminLock"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );


adminLock.addEventListener(
    "click",
    function () {

        adminPanel.classList.add(
            "active"
        );

    }
);


function closeAdmin() {

    adminPanel.classList.remove(
        "active"
    );

}


adminPanel.addEventListener(
    "click",
    function (event) {

        if (
            event.target === adminPanel
        ) {

            closeAdmin();

        }

    }
);


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const email =
        document
            .getElementById(
                "adminEmail"
            )
            .value
            .trim();

    const password =
        document
            .getElementById(
                "adminPassword"
            )
            .value;


    if (!email || !password) {

        showAdminMessage(
            "Please enter your email and password.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Signing in...",
        "success"
    );


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

        showAdminMessage(
            error.message,
            "error"
        );

        return;

    }


    if (data.session) {

        document
            .getElementById(
                "loginArea"
            )
            .style.display =
            "none";


        document
            .getElementById(
                "adminDashboard"
            )
            .style.display =
            "block";


        showAdminMessage(
            "Administrator signed in successfully.",
            "success"
        );

    }

}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    if (data.session) {

        document
            .getElementById(
                "loginArea"
            )
            .style.display =
            "none";


        document
            .getElementById(
                "adminDashboard"
            )
            .style.display =
            "block";

    }

}


checkAdminSession();


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    await supabaseClient
        .auth
        .signOut();


    document
        .getElementById(
            "loginArea"
        )
        .style.display =
        "block";


    document
        .getElementById(
            "adminDashboard"
        )
        .style.display =
        "none";


    showAdminMessage(
        "You have been signed out.",
        "success"
    );

}


/* =========================================================
   ADMIN MESSAGE
========================================================= */

function showAdminMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "adminMessage"
        );


    box.textContent =
        message;


    box.className =
        "admin-message show " +
        type;

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const file =
        document
            .getElementById(
                "cvFile"
            )
            .files[0];


    if (!file) {

        showAdminMessage(
            "Please select your PDF CV first.",
            "error"
        );

        return;

    }


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
        "success"
    );


    const fileName =
        "Edwin-Kuchio-Okello-CV.pdf";


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(CV_BUCKET)
            .upload(
                fileName,
                file,
                {
                    upsert: true,
                    contentType:
                        "application/pdf"
                }
            );


    if (error) {

        showAdminMessage(
            "CV upload failed: " +
            error.message,
            "error"
        );

        return;

    }


    showAdminMessage(
        "CV uploaded successfully.",
        "success"
    );


    loadCV();

}


/* =========================================================
   LOAD CV
========================================================= */

async function loadCV() {

    const {
        data
    } =
        supabaseClient
            .storage
            .from(CV_BUCKET)
            .getPublicUrl(
                "Edwin-Kuchio-Okello-CV.pdf"
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        document
            .getElementById(
                "cvStatus"
            )
            .textContent =
            "CV currently unavailable.";

        return;

    }


    const url =
        data.publicUrl +
        "?t=" +
        Date.now();


    document
        .getElementById(
            "viewCV"
        )
        .href =
        url;


    document
        .getElementById(
            "downloadCV"
        )
        .href =
        url;


    document
        .getElementById(
            "cvStatus"
        )
        .textContent =
        "CV available for viewing and download.";

}


loadCV();


/* =========================================================
   PROFILE UPLOAD
========================================================= */

async function uploadProfile() {

    const file =
        document
            .getElementById(
                "profileFile"
            )
            .files[0];


    if (!file) {

        showAdminMessage(
            "Please select a profile picture.",
            "error"
        );

        return;

    }


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
        "Uploading profile picture...",
        "success"
    );


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "profile." +
        extension;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(PROFILE_BUCKET)
            .upload(
                fileName,
                file,
                {
                    upsert: true,
                    contentType:
                        file.type
                }
            );


    if (error) {

        showAdminMessage(
            "Profile upload failed: " +
            error.message,
            "error"
        );

        return;

    }


    showAdminMessage(
        "Profile picture uploaded successfully.",
        "success"
    );


    loadProfile();

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const extensions = [
        "jpg",
        "jpeg",
        "png",
        "webp"
    ];


    const frame =
        document.getElementById(
            "profileFrame"
        );


    for (
        const extension
        of extensions
    ) {

        const {
            data
        } =
            supabaseClient
                .storage
                .from(PROFILE_BUCKET)
                .getPublicUrl(
                    "profile." +
                    extension
                );


        if (
            !data ||
            !data.publicUrl
        ) {

            continue;

        }


        const image =
            new Image();


        image.onload =
            function () {

                frame.innerHTML =
                    "";

                image.alt =
                    "Edwin Kuchio Okello";

                frame.appendChild(
                    image
                );

            };


        image.src =
            data.publicUrl +
            "?t=" +
            Date.now();

    }

}


loadProfile();


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

async function uploadPictorial() {

    const input =
        document.getElementById(
            "pictorialFile"
        );


    const files =
        input.files;


    if (
        !files ||
        files.length === 0
    ) {

        showAdminMessage(
            "Please select at least one image.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading pictorial images...",
        "success"
    );


    let uploaded = 0;


    for (
        const file
        of files
    ) {

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            continue;

        }


        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        const uniqueName =
            "photo-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2,8) +
            "." +
            extension;


        const {
            error
        } =
            await supabaseClient
                .storage
                .from(PICTORIAL_BUCKET)
                .upload(
                    uniqueName,
                    file,
                    {
                        upsert: false,
                        contentType:
                            file.type
                    }
                );


        if (!error) {

            uploaded++;

        }

    }


    input.value =
        "";


    showAdminMessage(
        uploaded +
        " pictorial image(s) uploaded successfully.",
        "success"
    );


    loadGallery();

}


/* =========================================================
   LOAD GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById(
            "gallery"
        );


    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(PICTORIAL_BUCKET)
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


    if (
        error ||
        !data ||
        data.length === 0
    ) {

        return;

    }


    gallery.innerHTML =
        "";


    data.forEach(
        function (file) {

            if (!file.name) {
                return;
            }


            const {
                data:
                    urlData
            } =
                supabaseClient
                    .storage
                    .from(
                        PICTORIAL_BUCKET
                    )
                    .getPublicUrl(
                        file.name
                    );


            if (
                !urlData ||
                !urlData.publicUrl
            ) {

                return;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gallery-item";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                urlData.publicUrl;


            image.alt =
                "Edwin Kuchio Okello — portfolio photograph";


            image.loading =
                "lazy";


            item.appendChild(
                image
            );


            gallery.appendChild(
                item
            );

        }
    );

}


loadGallery();


/* =========================================================
   FILE NAME
========================================================= */

function cleanFileName(
    fileName
) {

    return fileName
        .replace(
            /\.[^/.]+$/,
            ""
        )
        .replace(
            /[-_]+/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(
    fileName
) {

    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    if (
        extension ===
        "pdf"
    ) {

        return "fa-file-pdf";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "fa-file-word";

    }


    if (
        extension === "ppt" ||
        extension === "pptx"
    ) {

        return "fa-file-powerpoint";

    }


    if (
        extension === "xls" ||
        extension === "xlsx" ||
        extension === "csv"
    ) {

        return "fa-file-excel";

    }


    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "webp"
    ) {

        return "fa-file-image";

    }


    return "fa-file-lines";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   GET BUCKET FILES
========================================================= */

async function getBucketFiles(
    bucketName
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(bucketName)
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
            "Bucket error:",
            bucketName,
            error
        );

        return [];

    }


    return (
        data || []
    )
        .filter(
            function (file) {

                return (
                    file.name &&
                    !file.name.endsWith(
                        "/"
                    )
                );

            }
        )
        .map(
            function (file) {

                return {

                    ...file,

                    bucket:
                        bucketName

                };

            }
        );

}


/* =========================================================
   DISPLAY DOCUMENTS
========================================================= */

function displayUploadedDocuments(
    containerId,
    files,
    emptyMessage
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        !files ||
        files.length === 0
    ) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-folder-open"></i>

                <h3>
                    No additional files uploaded yet
                </h3>

                <p>
                    ${escapeHTML(
                        emptyMessage
                    )}
                </p>

            </div>

        `;

        return;

    }


    files.forEach(
        function (file) {

            if (!file.name) {
                return;
            }


            const {
                data
            } =
                supabaseClient
                    .storage
                    .from(
                        file.bucket
                    )
                    .getPublicUrl(
                        file.name
                    );


            if (
                !data ||
                !data.publicUrl
            ) {

                return;

            }


            const url =
                data.publicUrl;


            const title =
                cleanFileName(
                    file.name
                );


            const icon =
                getFileIcon(
                    file.name
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "uploaded-document";


            card.innerHTML = `

                <div class="uploaded-document-icon">

                    <i class="fas ${icon}"></i>

                </div>


                <div class="uploaded-document-info">

                    <h3>
                        ${escapeHTML(
                            title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            file.name
                        )}
                    </p>

                </div>


                <div class="uploaded-document-actions">

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


            container.appendChild(
                card
            );

        }
    );

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

            <h3>
                Loading EKO project library...
            </h3>

            <p>
                Retrieving projects from EKO Analytics & Research.
            </p>

        </div>

    `;


    const files =
        await getBucketFiles(
            EKO_BUCKET
        );


    displayUploadedDocuments(

        "ekoProjects",

        files,

        "Future EKO projects uploaded through the administrator area will appear here."

    );

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

            <h3>
                Loading academic work...
            </h3>

        </div>

    `;


    const files =
        await getBucketFiles(
            ACADEMIC_BUCKET
        );


    displayUploadedDocuments(

        "academicDocuments",

        files,

        "Academic essays and research papers will appear here after they are uploaded."

    );

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

            <h3>
                Loading portfolio materials...
            </h3>

        </div>

    `;


    const files =
        await getBucketFiles(
            PORTFOLIO_BUCKET
        );


    displayUploadedDocuments(

        "portfolioDocuments",

        files,

        "Professional portfolio materials will appear here after they are uploaded."

    );

}


/* =========================================================
   GENERIC FILE NAME
========================================================= */

function createUniqueFileName(
    originalName
) {

    const safeName =
        originalName
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "-"
            );


    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2,8) +
        "-" +
        safeName
    );

}


/* =========================================================
   UPLOAD EKO PROJECTS
========================================================= */

async function uploadEKOProjects() {

    const input =
        document.getElementById(
            "ekoFile"
        );


    const files =
        input.files;


    if (
        !files ||
        files.length === 0
    ) {

        showAdminMessage(
            "Please select at least one EKO project.",
            "error"
        );

        return;

    }


    const status =
        document.getElementById(
            "ekoUploadStatus"
        );


    status.textContent =
        "Uploading EKO project(s)...";


    let uploaded = 0;

    let failed = 0;


    for (
        const file
        of files
    ) {

        const uniqueName =
            createUniqueFileName(
                file.name
            );


        const {
            error
        } =
            await supabaseClient
                .storage
                .from(EKO_BUCKET)
                .upload(
                    uniqueName,
                    file,
                    {
                        upsert: false,

                        contentType:
                            file.type ||
                            "application/octet-stream"
                    }
                );


        if (error) {

            console.error(
                "EKO upload error:",
                error
            );

            failed++;

        } else {

            uploaded++;

        }

    }


    input.value =
        "";


    status.textContent =
        uploaded +
        " EKO project(s) uploaded successfully." +
        (
            failed > 0
                ? " " +
                  failed +
                  " failed."
                : ""
        );


    showAdminMessage(

        uploaded +
        " EKO project(s) uploaded successfully.",

        failed > 0
            ? "error"
            : "success"

    );


    loadEKOProjects();

}


/* =========================================================
   UPLOAD ACADEMIC
========================================================= */

async function uploadAcademicDocuments() {

    const input =
        document.getElementById(
            "academicFile"
        );


    const files =
        input.files;


    if (
        !files ||
        files.length === 0
    ) {

        showAdminMessage(
            "Please select at least one academic document.",
            "error"
        );

        return;

    }


    const status =
        document.getElementById(
            "academicUploadStatus"
        );


    status.textContent =
        "Uploading academic documents...";


    let uploaded = 0;

    let failed = 0;


    for (
        const file
        of files
    ) {

        const uniqueName =
            createUniqueFileName(
                file.name
            );


        const {
            error
        } =
            await supabaseClient
                .storage
                .from(
                    ACADEMIC_BUCKET
                )
                .upload(
                    uniqueName,
                    file,
                    {
                        upsert: false,

                        contentType:
                            file.type ||
                            "application/octet-stream"
                    }
                );


        if (error) {

            console.error(
                "Academic upload error:",
                error
            );

            failed++;

        } else {

            uploaded++;

        }

    }


    input.value =
        "";


    status.textContent =
        uploaded +
        " academic document(s) uploaded successfully.";


    showAdminMessage(

        uploaded +
        " academic document(s) uploaded successfully.",

        failed > 0
            ? "error"
            : "success"

    );


    loadAcademicDocuments();

}


/* =========================================================
   UPLOAD PORTFOLIO
========================================================= */

async function uploadPortfolioDocuments() {

    const input =
        document.getElementById(
            "portfolioFile"
        );


    const files =
        input.files;


    if (
        !files ||
        files.length === 0
    ) {

        showAdminMessage(
            "Please select at least one portfolio file.",
            "error"
        );

        return;

    }


    const status =
        document.getElementById(
            "portfolioUploadStatus"
        );


    status.textContent =
        "Uploading portfolio materials...";


    let uploaded = 0;

    let failed = 0;


    for (
        const file
        of files
    ) {

        const uniqueName =
            createUniqueFileName(
                file.name
            );


        const {
            error
        } =
            await supabaseClient
                .storage
                .from(
                    PORTFOLIO_BUCKET
                )
                .upload(
                    uniqueName,
                    file,
                    {
                        upsert: false,

                        contentType:
                            file.type ||
                            "application/octet-stream"
                    }
                );


        if (error) {

            console.error(
                "Portfolio upload error:",
                error
            );

            failed++;

        } else {

            uploaded++;

        }

    }


    input.value =
        "";


    status.textContent =
        uploaded +
        " portfolio file(s) uploaded successfully.";


    showAdminMessage(

        uploaded +
        " portfolio material(s) uploaded successfully.",

        failed > 0
            ? "error"
            : "success"

    );


    loadPortfolioDocuments();

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

supabaseClient
    .auth
    .onAuthStateChange(
        function (
            event,
            session
        ) {

            const loginArea =
                document.getElementById(
                    "loginArea"
                );

            const dashboard =
                document.getElementById(
                    "adminDashboard"
                );


            if (
                session
            ) {

                loginArea.style.display =
                    "none";

                dashboard.style.display =
                    "block";

            } else {

                loginArea.style.display =
                    "block";

                dashboard.style.display =
                    "none";

            }

        }
    );
