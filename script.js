/* =========================================================
   EDWIN KUCHIO OKELLO
   PROFESSIONAL PORTFOLIO
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   QUICK MENU
========================================================= */

const cornerMenu =
    document.getElementById("cornerMenu");

const quickMenu =
    document.getElementById("quickMenu");

const closeQuickMenu =
    document.getElementById("closeQuickMenu");


cornerMenu.addEventListener("click", () => {

    quickMenu.classList.toggle("open");

});


closeQuickMenu.addEventListener("click", () => {

    quickMenu.classList.remove("open");

});


document.addEventListener("click", (event) => {

    if (
        !quickMenu.contains(event.target) &&
        !cornerMenu.contains(event.target)
    ) {

        quickMenu.classList.remove("open");

    }

});


/* Close menu after selecting an item */

document
    .querySelectorAll(".quick-menu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            quickMenu.classList.remove("open");

        });

    });


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

});


document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("open");

        });

    });


/* =========================================================
   PROFILE PHOTO UPLOAD
========================================================= */

const profileUpload =
    document.getElementById("profileUpload");

const profileImage =
    document.getElementById("profileImage");

const photoPlaceholder =
    document.getElementById("photoPlaceholder");

const profileFileName =
    document.getElementById("profileFileName");


profileUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function (event) {

        profileImage.src =
            event.target.result;

        profileImage.style.display =
            "block";

        photoPlaceholder.style.display =
            "none";

    };


    reader.readAsDataURL(file);


    profileFileName.textContent =
        file.name;


    /* Save photo in browser */

    localStorage.setItem(
        "profilePhoto",
        profileFileName.textContent
    );

});


/* =========================================================
   CV UPLOAD
========================================================= */

const cvUpload =
    document.getElementById("cvUpload");

const cvFileName =
    document.getElementById("cvFileName");

const viewCv =
    document.getElementById("viewCv");

const downloadCv =
    document.getElementById("downloadCv");

const cvStatus =
    document.getElementById("cvStatus");


let currentCvUrl = null;


cvUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;


    if (file.type !== "application/pdf") {

        alert("Please select a PDF CV.");

        this.value = "";

        return;
    }


    if (currentCvUrl) {

        URL.revokeObjectURL(currentCvUrl);

    }


    currentCvUrl =
        URL.createObjectURL(file);


    cvFileName.textContent =
        file.name;


    cvStatus.textContent =
        "Your CV is ready to view and download as a PDF.";


    viewCv.href =
        currentCvUrl;

    viewCv.target =
        "_blank";

    viewCv.classList.remove("disabled");


    downloadCv.href =
        currentCvUrl;

    downloadCv.download =
        "Edwin-Kuchio-Okello-CV.pdf";

    downloadCv.classList.remove("disabled");


    /* Store file name */

    localStorage.setItem(
        "cvFileName",
        file.name
    );

});


/* =========================================================
   PICTORIAL UPLOAD
========================================================= */

const pictorialUpload =
    document.getElementById("pictorialUpload");

const pictorialGrid =
    document.getElementById("pictorialGrid");

const pictorialFileName =
    document.getElementById("pictorialFileName");


pictorialUpload.addEventListener("change", function () {

    const files =
        Array.from(this.files);


    if (!files.length) return;


    pictorialGrid.innerHTML = "";


    let validFiles = 0;


    files.forEach(file => {

        if (!file.type.startsWith("image/")) {

            return;
        }


        validFiles++;


        const reader =
            new FileReader();


        reader.onload = function (event) {


            const item =
                document.createElement("div");


            item.className =
                "pictorial-item";


            const image =
                document.createElement("img");


            image.src =
                event.target.result;


            image.alt =
                "Portfolio photograph";


            item.appendChild(image);


            pictorialGrid.appendChild(item);

        };


        reader.readAsDataURL(file);

    });


    pictorialFileName.textContent =
        `${validFiles} photo(s) selected`;

});


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById("backToTop");


window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let current = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================================
   RESTORE BASIC SETTINGS
========================================================= */

window.addEventListener("DOMContentLoaded", () => {


    const savedPhoto =
        localStorage.getItem("profilePhoto");


    if (savedPhoto) {

        profileFileName.textContent =
            savedPhoto;

    }


    const savedCv =
        localStorage.getItem("cvFileName");


    if (savedCv) {

        cvFileName.textContent =
            savedCv;

    }

});
