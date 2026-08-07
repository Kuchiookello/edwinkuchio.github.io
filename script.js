const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

const links = document.querySelectorAll(".nav-links a");

links.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});
/* =========================
   PROFESSIONAL EXPERIENCE
========================= */

.experience-intro {
    max-width: 800px !important;
    margin-bottom: 55px !important;
}

.professional-timeline {
    position: relative;

    margin-top: 40px;

    padding-left: 55px;
}

.professional-timeline::before {
    content: "";

    position: absolute;

    left: 12px;

    top: 5px;

    bottom: 5px;

    width: 2px;

    background: #dfe5e8;
}

.professional-role {
    position: relative;

    display: grid;

    grid-template-columns: 110px 1fr;

    gap: 35px;

    margin-bottom: 65px;
}

.professional-role::before {
    content: "";

    position: absolute;

    left: -49px;

    top: 6px;

    width: 12px;

    height: 12px;

    border-radius: 50%;

    background: var(--gold);

    border: 4px solid white;

    box-shadow:
        0 0 0 1px var(--gold);
}

.role-date {
    color: var(--emerald);

    font-size: 13px;

    font-weight: bold;

    letter-spacing: 1px;

    padding-top: 3px;
}

.role-content {
    border: 1px solid #e1e6e8;

    padding: 32px;

    background: white;

    transition: 0.25s ease;
}

.role-content:hover {
    border-color: var(--gold);

    transform: translateY(-3px);

    box-shadow:
        0 12px 30px
        rgba(7,27,51,0.07);
}

.role-header {
    display: flex;

    justify-content: space-between;

    align-items: flex-start;

    gap: 20px;

    margin-bottom: 18px;
}

.role-header h3 {
    font-family: Georgia, serif;

    color: var(--navy);

    font-size: 25px;

    line-height: 1.2;

    margin-bottom: 7px;
}

.role-organization {
    color: var(--muted);

    font-size: 13px;

    margin: 0 !important;
}

.role-type {
    flex-shrink: 0;

    padding: 6px 10px;

    background: var(--light);

    color: var(--emerald);

    font-size: 10px;

    font-weight: bold;

    letter-spacing: 1px;

    text-transform: uppercase;
}

.role-description {
    color: var(--muted);

    font-size: 14px;

    margin-bottom: 18px;
}

.role-content ul {
    padding-left: 18px;

    margin-bottom: 22px;
}

.role-content li {
    color: var(--muted);

    font-size: 13px;

    margin-bottom: 8px;

    padding-left: 5px;
}

.role-content li::marker {
    color: var(--gold);
}

.role-skills {
    display: flex;

    flex-wrap: wrap;

    gap: 7px;

    padding-top: 18px;

    border-top: 1px solid #edf0f1;
}

.role-skills span {
    padding: 5px 9px;

    background: #f4f7f6;

    color: var(--emerald);

    font-size: 10px;

    font-weight: bold;
}


/* =========================
   EXPERIENCE VALUE
========================= */

.experience-value {
    margin-top: 20px;

    padding: 40px;

    background: var(--navy);

    color: white;

    display: grid;

    grid-template-columns: 0.8fr 1.2fr;

    gap: 50px;

    align-items: center;
}

.experience-value h3 {
    font-family: Georgia, serif;

    color: white;

    font-size: 28px;

    line-height: 1.25;
}

.experience-value .eyebrow {
    color: var(--gold);
}

.value-grid {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 25px;
}

.value-grid > div {
    border-top:
        1px solid
        rgba(255,255,255,0.18);

    padding-top: 12px;
}

.value-grid strong {
    color: var(--gold);

    font-family: Georgia, serif;

    font-size: 18px;
}

.value-grid p {
    color: #b8c6d0;

    font-size: 12px;

    line-height: 1.6;

    margin-top: 5px;
}


/* =========================
   EXPERIENCE MOBILE
========================= */

@media (max-width: 800px) {

    .professional-timeline {
        padding-left: 30px;
    }

    .professional-timeline::before {
        left: 4px;
    }

    .professional-role {
        grid-template-columns: 1fr;

        gap: 8px;

        margin-bottom: 45px;
    }

    .professional-role::before {
        left: -32px;
    }

    .role-date {
        margin-bottom: 5px;
    }

    .role-header {
        flex-direction: column;

        gap: 12px;
    }

    .role-type {
        align-self: flex-start;
    }

    .experience-value {
        grid-template-columns: 1fr;

        gap: 30px;

        padding: 30px 25px;
    }

}


@media (max-width: 520px) {

    .professional-timeline {
        padding-left: 22px;
    }

    .professional-timeline::before {
        left: 0;
    }

    .professional-role::before {
        left: -28px;
    }

    .role-content {
        padding: 25px 20px;
    }

    .role-header h3 {
        font-size: 22px;
    }

    .value-grid {
        grid-template-columns: 1fr;
    }

}
