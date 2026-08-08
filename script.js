/* =========================================================
   EDWIN KUCHIO OKELLO — PORTFOLIO JAVASCRIPT
   Works with the current index.html structure
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const cornerMenu = document.getElementById("cornerMenu");
    const quickMenu = document.getElementById("quickMenu");
    const closeQuickMenu = document.getElementById("closeQuickMenu");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const navLinks = document.querySelectorAll(".nav-link");

    const backToTop = document.getElementById("backToTop");

    const adminLoginModal =
        document.getElementById("adminLoginModal");

    const openAdminLogin =
        document.getElementById("openAdminLogin");

    const closeAdminLogin =
        document.getElementById("closeAdminLogin");

    const adminLoginForm =
        document.getElementById("adminLoginForm");

    const adminLoginStatus =
        document.getElementById("adminLoginStatus");

    const adminDashboard =
        document.getElementById("adminDashboard");

    const adminLogout =
        document.getElementById("adminLogout");

    const adminUserEmail =
        document.getElementById("adminUserEmail");

    const profileUpload =
        document.getElementById("profileUpload");

    const profileFileName =
        document.getElementById("profileFileName");

    const uploadProfileButton =
        document.getElementById("uploadProfileButton");

    const profileUploadStatus =
        document.getElementById("profileUploadStatus");

    const profileImage =
        document.getElementById("profileImage");

    const photoPlaceholder =
        document.getElementById("photoPlaceholder");

    const cvUpload =
        document.getElementById("cvUpload");

    const cvFileName =
        document.getElementById("cvFileName");

    const uploadCvButton =
        document.getElementById("uploadCvButton");

    const cvUploadStatus =
        document.getElementById("cvUploadStatus");

    const viewCv =
        document.getElementById("viewCv");

    const downloadCv =
        document.getElementById("downloadCv");

    const cvStatus =
        document.getElementById("cvStatus");

    const pictorialUpload =
        document.getElementById("pictorialUpload");

    const pictorialFileName =
        document.getElementById("pictorialFileName");

    const uploadPictorialButton =
        document.getElementById("uploadPictorialButton");

    const pictorialUploadStatus =
        document.getElementById("pictorialUploadStatus");

    const pictorialGrid =
        document.getElementById("pictorialGrid");

    const pictorialPlaceholder =
        document.getElementById("pictorialPlaceholder");


    /* =====================================================
       QUICK MENU
    ===================================================== */

    if (cornerMenu && quickMenu) {

        cornerMenu.addEventListener("click", () => {

            quickMenu.classList.toggle("show");

        });

    }


    if (closeQuickMenu && quickMenu) {

        closeQuickMenu.addEventListener("click", () => {

            quickMenu.classList.remove("show");

        });

    }


    /* Close quick menu when clicking outside */

    document.addEventListener("click", (event) => {

        if (
            quickMenu &&
            cornerMenu &&
            !quickMenu.contains(event.target) &&
            !cornerMenu.contains(event.target)
        ) {

            quickMenu.classList.remove("show");

        }

    });


    /* Close quick menu when selecting a link */

    if (quickMenu) {

        quickMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                quickMenu.classList.remove("show");

            });

        });

    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("show");

            const icon =
                menuToggle.querySelector("i");

            if (navMenu.classList.contains("show")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    }


    /* Close mobile navigation after selecting link */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (navMenu) {

                navMenu.classList.remove("show");

            }

            if (menuToggle) {

                const icon =
                    menuToggle.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        });

    });


    /* =====================================================
       SMOOTH SCROLLING
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId === "#!"
            ) {

                return;

            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ===================================================== */

    const sections =
        document.querySelectorAll("section[id]");

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === "#" + currentSection) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    updateActiveNav();


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const header =
        document.getElementById("header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader
    );

    updateHeader();


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (backToTop) {

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

    }


    /* =====================================================
       ADMIN LOGIN MODAL
    ===================================================== */

    function openLoginModal() {

        if (!adminLoginModal) return;

        adminLoginModal.classList.add("show");

        adminLoginModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    function closeLoginModal() {

        if (!adminLoginModal) return;

        adminLoginModal.classList.remove("show");

        adminLoginModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }


    if (openAdminLogin) {

        openAdminLogin.addEventListener(
            "click",
            openLoginModal
        );

    }


    if (closeAdminLogin) {

        closeAdminLogin.addEventListener(
            "click",
            closeLoginModal
        );

    }


    /* Close modal by clicking background */

    if (adminLoginModal) {

        adminLoginModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === adminLoginModal
                ) {

                    closeLoginModal();

                }

            }
        );

    }


    /* Escape key */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeLoginModal();

            }

        }
    );


    /* =====================================================
       ADMIN AUTHENTICATION
       
       IMPORTANT:
       This is only front-end protection.
       Real secure authentication requires a backend.
    ===================================================== */

    const ADMIN_EMAIL =
        "edwinokello24@gmail.com";

    const ADMIN_PASSWORD =
        "CHANGE_THIS_PASSWORD";


    function showAdminDashboard(email) {

        if (!adminDashboard) return;

        adminDashboard.hidden = false;

        adminDashboard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (adminUserEmail) {

            adminUserEmail.textContent =
                email;

        }

    }


    if (adminLoginForm) {

        adminLoginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const email =
                    document.getElementById(
                        "adminEmail"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "adminPassword"
                    ).value;


                if (
                    email === ADMIN_EMAIL &&
                    password === ADMIN_PASSWORD
                ) {

                    sessionStorage.setItem(
                        "adminLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "adminEmail",
                        email
                    );

                    if (adminLoginStatus) {

                        adminLoginStatus.textContent =
                            "Login successful.";

                        adminLoginStatus.className =
                            "admin-login-status success";

                    }

                    closeLoginModal();

                    showAdminDashboard(email);

                } else {

                    if (adminLoginStatus) {

                        adminLoginStatus.textContent =
                            "Incorrect email or password.";

                        adminLoginStatus.className =
                            "admin-login-status error";

                    }

                }

            }
        );

    }


    /* =====================================================
       RESTORE ADMIN SESSION
    ===================================================== */

    if (
        sessionStorage.getItem(
            "adminLoggedIn"
        ) === "true"
    ) {

        showAdminDashboard(
            sessionStorage.getItem(
                "adminEmail"
            ) || ADMIN_EMAIL
        );

    }


    /* =====================================================
       ADMIN LOGOUT
    ===================================================== */

    if (adminLogout) {

        adminLogout.addEventListener(
            "click",
            () => {

                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                sessionStorage.removeItem(
                    "adminEmail"
                );

                if (adminDashboard) {

                    adminDashboard.hidden = true;

                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       PROFILE PHOTO — FILE SELECTION
    ===================================================== */

    if (profileUpload) {

        profileUpload.addEventListener(
            "change",
            () => {

                const file =
                    profileUpload.files[0];

                if (!file) {

                    if (profileFileName) {

                        profileFileName.textContent =
                            "No photo selected";

                    }

                    return;

                }


                if (!file.type.startsWith("image/")) {

                    alert(
                        "Please select a valid image file."
                    );

                    profileUpload.value = "";

                    return;

                }


                if (profileFileName) {

                    profileFileName.textContent =
                        file.name;

                }

            }
        );

    }


    /* =====================================================
       PROFILE PHOTO — SAVE
       
       Uses local browser storage.
       This allows the photo to remain available
       on the same browser/device.
    ===================================================== */

    if (uploadProfileButton) {

        uploadProfileButton.addEventListener(
            "click",
            () => {

                const file =
                    profileUpload.files[0];

                if (!file) {

                    showStatus(
                        profileUploadStatus,
                        "Please choose a photo first.",
                        "error"
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload = function(event) {

                    const imageData =
                        event.target.result;

                    localStorage.setItem(
                        "profileImage",
                        imageData
                    );


                    displayProfileImage(
                        imageData
                    );


                    showStatus(
                        profileUploadStatus,
                        "Profile photo saved successfully.",
                        "success"
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       DISPLAY PROFILE PHOTO
    ===================================================== */

    function displayProfileImage(imageData) {

        if (!profileImage) return;

        profileImage.src = imageData;

        profileImage.hidden = false;

        if (photoPlaceholder) {

            photoPlaceholder.style.display =
                "none";

        }

    }


    /* Restore saved profile image */

    const savedProfileImage =
        localStorage.getItem(
            "profileImage"
        );

    if (savedProfileImage) {

        displayProfileImage(
            savedProfileImage
        );

    }


    /* =====================================================
       CV FILE SELECTION
    ===================================================== */

    if (cvUpload) {

        cvUpload.addEventListener(
            "change",
            () => {

                const file =
                    cvUpload.files[0];

                if (!file) {

                    if (cvFileName) {

                        cvFileName.textContent =
                            "No CV selected";

                    }

                    return;

                }


                if (
                    file.type !==
                    "application/pdf"
                ) {

                    alert(
                        "Please select a PDF file."
                    );

                    cvUpload.value = "";

                    return;

                }


                if (cvFileName) {

                    cvFileName.textContent =
                        file.name;

                }

            }
        );

    }


    /* =====================================================
       CV — SAVE
    ===================================================== */

    if (uploadCvButton) {

        uploadCvButton.addEventListener(
            "click",
            () => {

                const file =
                    cvUpload.files[0];

                if (!file) {

                    showStatus(
                        cvUploadStatus,
                        "Please choose your CV PDF first.",
                        "error"
                    );

                    return;

                }


                if (
                    file.type !==
                    "application/pdf"
                ) {

                    showStatus(
                        cvUploadStatus,
                        "Only PDF files are allowed.",
                        "error"
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload = function(event) {

                    const pdfData =
                        event.target.result;


                    try {

                        localStorage.setItem(
                            "portfolioCV",
                            pdfData
                        );


                        localStorage.setItem(
                            "portfolioCVName",
                            file.name
                        );


                        setupCV(
                            pdfData,
                            file.name
                        );


                        showStatus(
                            cvUploadStatus,
                            "CV uploaded and published successfully.",
                            "success"
                        );

                    } catch (error) {

                        showStatus(
                            cvUploadStatus,
                            "The CV is too large for browser storage. Please use a proper file-hosting/backend service.",
                            "error"
                        );

                    }

                };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       SET UP CV
    ===================================================== */

    function setupCV(
        pdfData,
        fileName
    ) {

        if (viewCv) {

            viewCv.href =
                pdfData;

            viewCv.target =
                "_blank";

            viewCv.classList.remove(
                "disabled"
            );

        }


        if (downloadCv) {

            downloadCv.href =
                pdfData;

            downloadCv.download =
                fileName ||
                "Edwin-Kuchio-Okello-CV.pdf";

            downloadCv.classList.remove(
                "disabled"
            );

        }


        if (cvStatus) {

            cvStatus.textContent =
                "My current professional CV is available to view or download below.";

        }

    }


    /* Restore CV */

    const savedCV =
        localStorage.getItem(
            "portfolioCV"
        );

    const savedCVName =
        localStorage.getItem(
            "portfolioCVName"
        );


    if (savedCV) {

        setupCV(
            savedCV,
            savedCVName
        );

    }


    /* =====================================================
       PICTORIAL — FILE SELECTION
    ===================================================== */

    if (pictorialUpload) {

        pictorialUpload.addEventListener(
            "change",
            () => {

                const files =
                    Array.from(
                        pictorialUpload.files
                    );


                if (files.length === 0) {

                    if (pictorialFileName) {

                        pictorialFileName.textContent =
                            "No photos selected";

                    }

                    return;

                }


                if (pictorialFileName) {

                    pictorialFileName.textContent =
                        files.length +
                        " photo(s) selected";

                }

            }
        );

    }


    /* =====================================================
       PICTORIAL — SAVE PHOTOS
    ===================================================== */

    if (uploadPictorialButton) {

        uploadPictorialButton.addEventListener(
            "click",
            () => {

                const files =
                    Array.from(
                        pictorialUpload.files
                    );


                if (files.length === 0) {

                    showStatus(
                        pictorialUploadStatus,
                        "Please choose at least one photo.",
                        "error"
                    );

                    return;

                }


                const imagePromises =
                    files.map(file => {

                        return new Promise(
                            (resolve, reject) => {

                                if (
                                    !file.type.startsWith(
                                        "image/"
                                    )
                                ) {

                                    reject(
                                        new Error(
                                            "Invalid image file."
                                        )
                                    );

                                    return;

                                }


                                const reader =
                                    new FileReader();


                                reader.onload =
                                    event => {

                                        resolve({
                                            name:
                                                file.name,

                                            data:
                                                event.target.result
                                        });

                                    };


                                reader.onerror =
                                    reject;


                                reader.readAsDataURL(
                                    file
                                );

                            }
                        );

                    });


                Promise.all(imagePromises)
                    .then(images => {

                        try {

                            const existing =
                                JSON.parse(
                                    localStorage.getItem(
                                        "pictorialImages"
                                    )
                                ) || [];


                            const updated =
                                existing.concat(
                                    images
                                );


                            localStorage.setItem(
                                "pictorialImages",
                                JSON.stringify(
                                    updated
                                )
                            );


                            renderGallery(
                                updated
                            );


                            showStatus(
                                pictorialUploadStatus,
                                images.length +
                                " photo(s) published successfully.",
                                "success"
                            );


                            pictorialUpload.value = "";


                            if (pictorialFileName) {

                                pictorialFileName.textContent =
                                    "No photos selected";

                            }

                        } catch (error) {

                            showStatus(
                                pictorialUploadStatus,
                                "The photos are too large for browser storage. Please use proper image hosting/backend storage.",
                                "error"
                            );

                        }

                    })
                    .catch(() => {

                        showStatus(
                            pictorialUploadStatus,
                            "One or more files could not be processed.",
                            "error"
                        );

                    });

            }
        );

    }


    /* =====================================================
       RENDER PICTORIAL GALLERY
    ===================================================== */

    function renderGallery(images) {

        if (!pictorialGrid) return;


        pictorialGrid
            .querySelectorAll(
                ".gallery-image-card"
            )
            .forEach(card => card.remove());


        if (
            images.length > 0 &&
            pictorialPlaceholder
        ) {

            pictorialPlaceholder.style.display =
                "none";

        }


        images.forEach(
            (image, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "gallery-image-card";


                const img =
                    document.createElement(
                        "img"
                    );

                img.src =
                    image.data;

                img.alt =
                    image.name ||
                    "Portfolio photograph";


                const caption =
                    document.createElement(
                        "div"
                    );

                caption.className =
                    "gallery-caption";


                caption.textContent =
                    image.name ||
                    "Portfolio photograph";


                card.appendChild(img);

                card.appendChild(caption);


                pictorialGrid.appendChild(
                    card
                );

            }
        );

    }


    /* Restore gallery */

    const savedGallery =
        JSON.parse(
            localStorage.getItem(
                "pictorialImages"
            )
        ) || [];


    if (savedGallery.length > 0) {

        renderGallery(
            savedGallery
        );

    }


    /* =====================================================
       STATUS MESSAGE
    ===================================================== */

    function showStatus(
        element,
        message,
        type
    ) {

        if (!element) return;

        element.textContent =
            message;

        element.className =
            "upload-status " +
            type;


        setTimeout(() => {

            element.textContent = "";

            element.className =
                "upload-status";

        }, 5000);

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section-heading, " +
            ".highlight-card, " +
            ".timeline-item, " +
            ".education-card, " +
            ".skill-card, " +
            ".country, " +
            ".project-card, " +
            ".resource-card, " +
            ".cv-box, " +
            ".contact-card, " +
            ".contact-item"
        );


    revealElements.forEach(
        element => {

            element.classList.add(
                "reveal"
            );

        }
    );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );


    /* =====================================================
       IMAGE LAZY LOADING
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach(img => {

            if (
                !img.hasAttribute(
                    "loading"
                )
            ) {

                img.setAttribute(
                    "loading",
                    "lazy"
                );

            }

        });


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const year =
        document.querySelector(
            ".footer-bottom p"
        );

    if (year) {

        year.innerHTML =
            `© ${new Date().getFullYear()} Edwin Kuchio Okello. All rights reserved.`;

    }


    /* =====================================================
       DISABLE PLACEHOLDER CV BUTTONS
    ===================================================== */

    [viewCv, downloadCv].forEach(
        button => {

            if (!button) return;

            button.addEventListener(
                "click",
                event => {

                    if (
                        button.classList.contains(
                            "disabled"
                        )
                    ) {

                        event.preventDefault();

                    }

                }
            );

        }
    );


    /* =====================================================
       CONTACT / EXTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(link => {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        });


    console.log(
        "Edwin Kuchio Okello Portfolio loaded successfully."
    );

});
