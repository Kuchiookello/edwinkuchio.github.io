<script>

/* =========================================================
   SUPABASE
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
   STORAGE BUCKETS
========================================================= */

const CV_BUCKET = "CV";
const PROFILE_BUCKET = "Profile";
const PICTORIAL_BUCKET = "Pictorial";

/*
   IMPORTANT:
   Create this bucket in Supabase Storage:

   Bucket name:
   Projects

   Make the bucket PUBLIC if you want visitors
   to open the uploaded projects.
*/

const PROJECT_BUCKET = "Projects";


/* =========================================================
   PROJECT CATEGORIES
========================================================= */

const PROJECT_CATEGORIES = {

    eko: {
        name: "EKO Analytics & Research",
        folder: "eko"
    },

    academic: {
        name: "Academic Essays & Research",
        folder: "academic"
    },

    portfolio: {
        name: "Professional Portfolio",
        folder: "portfolio"
    }

};


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function() {

        navLinks.classList.toggle("active");

    });

}


document.querySelectorAll(".nav-links a")
.forEach(function(link) {

    link.addEventListener("click", function() {

        if (navLinks) {
            navLinks.classList.remove("active");
        }

    });

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
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    /*
       Automatically refresh project lists
       whenever a project modal is opened.
    */

    if (id === "ekoModal") {

        loadProjects("eko");

    }

    if (id === "academicModal") {

        loadProjects("academic");

    }

    if (id === "portfolioModal") {

        loadProjects("portfolio");

    }

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


document.querySelectorAll(".modal")
.forEach(function(modal) {

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {

            modal.classList.remove("active");

            document.body.style.overflow = "";

        }

    });

});


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document.querySelectorAll(".modal.active")
        .forEach(function(modal) {

            modal.classList.remove("active");

        });

        closeAdmin();

        document.body.style.overflow = "";

    }

});


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", function() {

        if (window.scrollY > 450) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", function() {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =========================================================
   ADMIN PANEL
========================================================= */

const adminLock =
    document.getElementById("adminLock");

const adminPanel =
    document.getElementById("adminPanel");


if (adminLock) {

    adminLock.addEventListener("click", function() {

        adminPanel.classList.add("active");

    });

}


function closeAdmin() {

    if (adminPanel) {

        adminPanel.classList.remove("active");

    }

}


if (adminPanel) {

    adminPanel.addEventListener("click", function(event) {

        if (event.target === adminPanel) {

            closeAdmin();

        }

    });

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

    const email =
        document.getElementById("adminEmail")
        .value
        .trim();

    const password =
        document.getElementById("adminPassword")
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


    const { data, error } =
        await supabaseClient.auth
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

        document.getElementById("loginArea")
            .style.display = "none";

        document.getElementById("adminDashboard")
            .style.display = "block";

        showAdminMessage(
            "Administrator signed in successfully.",
            "success"
        );

        loadAllProjects();

    }

}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        document.getElementById("loginArea")
            .style.display = "none";

        document.getElementById("adminDashboard")
            .style.display = "block";

        loadAllProjects();

    }

}

checkAdminSession();


/* =========================================================
   LOGOUT
========================================================= */

async function adminLogout() {

    await supabaseClient.auth.signOut();


    document.getElementById("loginArea")
        .style.display = "block";


    document.getElementById("adminDashboard")
        .style.display = "none";


    showAdminMessage(
        "You have been signed out.",
        "success"
    );

}


/* =========================================================
   ADMIN MESSAGE
========================================================= */

function showAdminMessage(message, type) {

    const box =
        document.getElementById("adminMessage");

    if (!box) return;

    box.textContent = message;

    box.className =
        "admin-message show " + type;

}


/* =========================================================
   CV UPLOAD
========================================================= */

async function uploadCV() {

    const file =
        document.getElementById("cvFile")
        .files[0];


    if (!file) {

        showAdminMessage(
            "Please select your PDF CV first.",
            "error"
        );

        return;

    }


    if (file.type !== "application/pdf") {

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


    const { error } =
        await supabaseClient.storage
        .from(CV_BUCKET)
        .upload(

            fileName,

            file,

            {

                upsert: true,

                contentType: "application/pdf"

            }

        );


    if (error) {

        showAdminMessage(
            "CV upload failed: " + error.message,
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

    const { data } =
        supabaseClient.storage
        .from(CV_BUCKET)
        .getPublicUrl(
            "Edwin-Kuchio-Okello-CV.pdf"
        );


    if (!data || !data.publicUrl) {

        const status =
            document.getElementById("cvStatus");

        if (status) {

            status.textContent =
                "CV currently unavailable.";

        }

        return;

    }


    const url =
        data.publicUrl +
        "?t=" +
        Date.now();


    const viewCV =
        document.getElementById("viewCV");

    const downloadCV =
        document.getElementById("downloadCV");

    const cvStatus =
        document.getElementById("cvStatus");


    if (viewCV) {

        viewCV.href = url;

    }


    if (downloadCV) {

        downloadCV.href = url;

    }


    if (cvStatus) {

        cvStatus.textContent =
            "CV available for viewing and download.";

    }

}

loadCV();


/* =========================================================
   PROFILE UPLOAD
========================================================= */

async function uploadProfile() {

    const file =
        document.getElementById("profileFile")
        .files[0];


    if (!file) {

        showAdminMessage(
            "Please select a profile picture.",
            "error"
        );

        return;

    }


    if (!file.type.startsWith("image/")) {

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
        "profile." + extension;


    const { error } =
        await supabaseClient.storage
        .from(PROFILE_BUCKET)
        .upload(

            fileName,

            file,

            {

                upsert: true,

                contentType: file.type

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
        document.getElementById("profileFrame");


    if (!frame) return;


    for (const extension of extensions) {

        const { data } =
            supabaseClient.storage
            .from(PROFILE_BUCKET)
            .getPublicUrl(
                "profile." + extension
            );


        if (!data || !data.publicUrl) {

            continue;

        }


        const testImage =
            new Image();


        testImage.onload = function() {

            frame.innerHTML = "";

            testImage.alt =
                "Edwin Kuchio Okello";

            frame.appendChild(testImage);

        };


        testImage.src =
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

    const file =
        document.getElementById("pictorialFile")
        .files[0];


    if (!file) {

        showAdminMessage(
            "Please select an image.",
            "error"
        );

        return;

    }


    if (!file.type.startsWith("image/")) {

        showAdminMessage(
            "Please select an image file.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading pictorial image...",
        "success"
    );


    const extension =
        file.name
        .split(".")
        .pop()
        .toLowerCase();


    const uniqueName =
        "photo-" +
        Date.now() +
        "." +
        extension;


    const { error } =
        await supabaseClient.storage
        .from(PICTORIAL_BUCKET)
        .upload(

            uniqueName,

            file,

            {

                upsert: false,

                contentType: file.type

            }

        );


    if (error) {

        showAdminMessage(
            "Pictorial upload failed: " +
            error.message,
            "error"
        );

        return;

    }


    showAdminMessage(
        "Pictorial image uploaded successfully.",
        "success"
    );


    document.getElementById("pictorialFile").value = "";

    loadGallery();

}


/* =========================================================
   LOAD GALLERY
========================================================= */

async function loadGallery() {

    const gallery =
        document.getElementById("gallery");


    if (!gallery) return;


    const { data, error } =
        await supabaseClient.storage
        .from(PICTORIAL_BUCKET)
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


    if (error || !data || data.length === 0) {

        return;

    }


    gallery.innerHTML = "";


    data.forEach(function(file) {

        if (!file.name) return;


        const { data: urlData } =
            supabaseClient.storage
            .from(PICTORIAL_BUCKET)
            .getPublicUrl(
                file.name
            );


        if (!urlData || !urlData.publicUrl) {

            return;

        }


        const item =
            document.createElement("div");

        item.className =
            "gallery-item";


        const image =
            document.createElement("img");

        image.src =
            urlData.publicUrl;

        image.alt =
            "Edwin Kuchio Okello — portfolio photograph";


        item.appendChild(image);

        gallery.appendChild(item);

    });

}

loadGallery();


/* =========================================================
   =========================================================
   PROJECT MANAGEMENT
   =========================================================
========================================================= */


/*
   The project information is stored in Supabase Storage.

   Every uploaded project gets:

   Category
   Title
   Description
   File
   Date

   The file itself is stored in:

   Projects/eko/
   Projects/academic/
   Projects/portfolio/
*/


/* =========================================================
   CREATE PROJECT UPLOAD INTERFACE
========================================================= */

function createProjectUploadArea() {

    if (
        document.getElementById(
            "projectUploadArea"
        )
    ) {

        return;

    }


    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (!dashboard) return;


    const section =
        document.createElement("div");

    section.className =
        "admin-section";

    section.id =
        "projectUploadArea";


    section.innerHTML = `

        <div class="admin-section-title">

            <i class="fas fa-folder-plus"></i>

            <div>

                <h3>
                    Projects &amp; Written Work
                </h3>

                <p>
                    Upload multiple projects,
                    essays, research papers and
                    portfolio documents.
                </p>

            </div>

        </div>


        <div class="form-group">

            <label for="projectCategory">
                Project Category
            </label>

            <select id="projectCategory">

                <option value="eko">
                    EKO Analytics &amp; Research
                </option>

                <option value="academic">
                    Academic Essays &amp; Research
                </option>

                <option value="portfolio">
                    Professional Portfolio
                </option>

            </select>

        </div>


        <div class="form-group">

            <label for="projectTitle">
                Project Title
            </label>

            <input
                type="text"
                id="projectTitle"
                placeholder="Enter project title"
            >

        </div>


        <div class="form-group">

            <label for="projectDescription">
                Project Description
            </label>

            <textarea
                id="projectDescription"
                rows="4"
                placeholder="Briefly describe this project..."
            ></textarea>

        </div>


        <div class="form-group">

            <label for="projectFile">
                Project File
            </label>

            <input
                type="file"
                id="projectFile"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
            >

        </div>


        <button
            class="admin-action"
            onclick="uploadProject()"
        >

            <i class="fas fa-cloud-arrow-up"></i>

            Upload Project

        </button>


        <div
            id="adminProjectList"
            class="admin-project-list"
        ></div>

    `;


    dashboard.appendChild(section);

}


/* =========================================================
   UPLOAD PROJECT
========================================================= */

async function uploadProject() {

    const category =
        document.getElementById(
            "projectCategory"
        ).value;


    const title =
        document.getElementById(
            "projectTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "projectDescription"
        ).value.trim();


    const file =
        document.getElementById(
            "projectFile"
        ).files[0];


    if (!category) {

        showAdminMessage(
            "Please select a project category.",
            "error"
        );

        return;

    }


    if (!title) {

        showAdminMessage(
            "Please enter a project title.",
            "error"
        );

        return;

    }


    if (!file) {

        showAdminMessage(
            "Please select a project file.",
            "error"
        );

        return;

    }


    const categoryInfo =
        PROJECT_CATEGORIES[category];


    if (!categoryInfo) {

        showAdminMessage(
            "Invalid project category.",
            "error"
        );

        return;

    }


    showAdminMessage(
        "Uploading project...",
        "success"
    );


    /*
       Create a unique filename.
    */

    const extension =
        file.name
        .split(".")
        .pop()
        .toLowerCase();


    const safeTitle =
        title
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 80);


    const uniqueName =
        Date.now() +
        "-" +
        safeTitle +
        "." +
        extension;


    const filePath =
        categoryInfo.folder +
        "/" +
        uniqueName;


    /*
       Upload the actual file.
    */

    const { error } =
        await supabaseClient.storage
        .from(PROJECT_BUCKET)
        .upload(

            filePath,

            file,

            {

                upsert: false,

                contentType:
                    file.type ||
                    "application/octet-stream"

            }

        );


    if (error) {

        showAdminMessage(
            "Project upload failed: " +
            error.message,
            "error"
        );

        return;

    }


    /*
       Store project information in
       browser metadata file.

       NOTE:
       This requires a Supabase database table
       called "projects".

       If the table does not yet exist,
       see the SQL section I provide below.
    */

    const { error: databaseError } =
        await supabaseClient
        .from("projects")
        .insert({

            title: title,

            description: description,

            category: category,

            file_path: filePath,

            file_name: file.name

        });


    if (databaseError) {

        /*
           Delete uploaded file if database
           insertion fails.
        */

        await supabaseClient.storage
            .from(PROJECT_BUCKET)
            .remove([filePath]);


        showAdminMessage(
            "Project information could not be saved: " +
            databaseError.message,
            "error"
        );

        return;

    }


    showAdminMessage(
        "Project uploaded successfully.",
        "success"
    );


    /*
       Clear form.
    */

    document.getElementById(
        "projectTitle"
    ).value = "";


    document.getElementById(
        "projectDescription"
    ).value = "";


    document.getElementById(
        "projectFile"
    ).value = "";


    /*
       Refresh administrator project list.
    */

    loadAdminProjects();

}


/* =========================================================
   GET PROJECT URL
========================================================= */

function getProjectURL(filePath) {

    const { data } =
        supabaseClient.storage
        .from(PROJECT_BUCKET)
        .getPublicUrl(filePath);


    if (!data) {

        return null;

    }


    return data.publicUrl;

}


/* =========================================================
   LOAD PROJECTS
========================================================= */

async function loadProjects(category) {

    const containerId =
        category === "eko"
            ? "ekoProjects"
            : category === "academic"
                ? "academicDocuments"
                : "portfolioProjects";


    const container =
        document.getElementById(
            containerId
        );


    if (!container) return;


    container.innerHTML = `

        <div class="document-placeholder">

            <i class="fas fa-spinner fa-spin"></i>

            <h3>
                Loading projects...
            </h3>

        </div>

    `;


    const { data, error } =
        await supabaseClient
        .from("projects")
        .select("*")
        .eq("category", category)
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-circle-exclamation"></i>

                <h3>
                    Projects could not be loaded
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

        return;

    }


    if (!data || data.length === 0) {

        const categoryName =
            PROJECT_CATEGORIES[category].name;


        container.innerHTML = `

            <div class="document-placeholder">

                <i class="fas fa-folder-open"></i>

                <h3>
                    No projects yet
                </h3>

                <p>
                    Projects uploaded under
                    ${escapeHTML(categoryName)}
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(function(project) {

        const url =
            getProjectURL(
                project.file_path
            );


        const card =
            document.createElement("article");

        card.className =
            "uploaded-project-card";


        card.innerHTML = `

            <div class="uploaded-project-icon">

                <i class="fas fa-file-lines"></i>

            </div>


            <div class="uploaded-project-content">

                <span class="uploaded-project-category">

                    ${escapeHTML(
                        PROJECT_CATEGORIES[
                            category
                        ].name
                    )}

                </span>


                <h3>
                    ${escapeHTML(
                        project.title
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        project.description ||
                        "No description provided."
                    )}
                </p>


                <div class="uploaded-project-actions">

                    ${
                        url
                        ?
                        `
                        <a
                            href="${url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-open-button"
                        >

                            <i class="fas fa-eye"></i>

                            Open Project

                        </a>
                        `
                        :
                        ""
                    }

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================================
   LOAD ALL PROJECTS
========================================================= */

function loadAllProjects() {

    loadProjects("eko");

    loadProjects("academic");

    loadProjects("portfolio");

}


/* =========================================================
   ADMIN PROJECT LIST
========================================================= */

async function loadAdminProjects() {

    const container =
        document.getElementById(
            "adminProjectList"
        );


    if (!container) return;


    container.innerHTML = `

        <p>
            Loading uploaded projects...
        </p>

    `;


    const { data, error } =
        await supabaseClient
        .from("projects")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        container.innerHTML = `

            <p>
                Could not load projects:
                ${escapeHTML(error.message)}
            </p>

        `;

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `

            <p>
                No projects uploaded yet.
            </p>

        `;

        return;

    }


    container.innerHTML = `

        <h4>
            Uploaded Projects
        </h4>

    `;


    data.forEach(function(project) {

        const category =
            PROJECT_CATEGORIES[
                project.category
            ];


        const item =
            document.createElement("div");

        item.className =
            "admin-project-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(
                        project.title
                    )}
                </strong>

                <small>
                    ${
                        category
                        ?
                        escapeHTML(category.name)
                        :
                        "Project"
                    }
                </small>

            </div>


            <button
                class="admin-delete-project"
                onclick="deleteProject('${project.id}', '${escapeAttribute(project.file_path)}')"
            >

                <i class="fas fa-trash"></i>

            </button>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   DELETE PROJECT
========================================================= */

async function deleteProject(
    projectId,
    filePath
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this project?"
        );


    if (!confirmed) {

        return;

    }


    showAdminMessage(
        "Deleting project...",
        "success"
    );


    /*
       Delete file from storage.
    */

    const { error: storageError } =
        await supabaseClient.storage
        .from(PROJECT_BUCKET)
        .remove([filePath]);


    if (storageError) {

        showAdminMessage(
            "Could not delete project file: " +
            storageError.message,
            "error"
        );

        return;

    }


    /*
       Delete database record.
    */

    const { error: databaseError } =
        await supabaseClient
        .from("projects")
        .delete()
        .eq("id", projectId);


    if (databaseError) {

        showAdminMessage(
            "Could not delete project record: " +
            databaseError.message,
            "error"
        );

        return;

    }


    showAdminMessage(
        "Project deleted successfully.",
        "success"
    );


    loadAdminProjects();

    loadAllProjects();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

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
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    if (!value) return "";

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}


/* =========================================================
   INITIALISE PROJECT ADMIN AREA
========================================================= */

createProjectUploadArea();


/*
   Load existing projects when the page starts.
*/

loadAllProjects();


</script>
