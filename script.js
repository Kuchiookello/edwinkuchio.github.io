/* =========================================================
   EDWIN KUCHIO OKELLO
   PORTFOLIO JAVASCRIPT
   ========================================================= */


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle =
    document.getElementById("menu-toggle");

const navMenu =
    document.getElementById("nav-menu");

const navLinks =
    document.querySelectorAll(".nav-link");


menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const icon =
        menuToggle.querySelector("i");

    if (navMenu.classList.contains("open")) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");
    }

});


/* Close mobile menu after clicking */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        const icon =
            menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    });

});


/* =========================
   QUICK THREE-DOT MENU
========================= */

const cornerMenu =
    document.getElementById("corner-menu");

const quickMenu =
    document.getElementById("quick-menu");

const closeQuickMenu =
    document.getElementById("close-quick-menu");


cornerMenu.addEventListener("click", () => {

    quickMenu.classList.toggle("open");

});


closeQuickMenu.addEventListener("click", () => {

    quickMenu.classList.remove("open");

});


/* Close when clicking outside */

document.addEventListener("click", (event) => {

    if (
        !quickMenu.contains(event.target) &&
        !cornerMenu.contains(event.target)
    ) {

        quickMenu.classList.remove("open");

    }

});


/* Close quick menu after selecting link */

quickMenu.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener("click", () => {

            quickMenu.classList.remove("open");

        });

    });


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
    document.querySelectorAll("section[id]");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 130;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================
   HEADER SHADOW
========================= */

const header =
    document.getElementById("header");


window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 8px 30px rgba(11,31,58,.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


/* =========================
   BACK TO TOP
========================= */

const backToTop =
    document.getElementById("back-to-top");


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


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

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


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================
   PICTORIAL IMAGE FALLBACK
========================= */

document
    .querySelectorAll(".pictorial-item img")
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.display = "none";

                const placeholder =
                    image.nextElementSibling;

                if (placeholder) {

                    placeholder.style.display =
                        "flex";

                }

            }
        );

    });


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        quickMenu.classList.remove("open");

        navMenu.classList.remove("open");

    }

});
