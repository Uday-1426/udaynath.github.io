/* =========================================
   SCROLL TRANSITION
========================================= */

const profile = document.getElementById("home");

const sectionsEl = document.getElementById("sections");

const transitionPoint =
    window.innerHeight * 0.12;


function handleScroll() {

    if (window.scrollY > transitionPoint) {

        document.body.classList.add(
            "scrolled"
        );

    } else {

        document.body.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    handleScroll,
    {
        passive: true
    }
);


/* =========================================
   ONE-SCROLL JUMP (both directions)

   Near the seam between the profile view and
   the sections below, a single wheel tick or
   swipe snaps fully across instead of needing
   several scroll ticks to clear it. Scrolling
   through the middle of either section (deep
   in the profile, or deep in the card list)
   is left untouched.
========================================= */

if (profile && sectionsEl) {

    let jumping = false;

    const DOWN_ZONE = 0.5;
    const UP_ZONE = 1.6;
    const RESET_LOW = 0.1;
    const RESET_HIGH = UP_ZONE;

    const jumpTo = function(target) {

        if (jumping) {

            return;

        }

        jumping = true;

        target.scrollIntoView({
            behavior: "smooth"
        });

    };


    window.addEventListener(
        "scroll",
        function() {

            const y = window.scrollY;

            const vh = window.innerHeight;

            if (y < vh * RESET_LOW || y > vh * RESET_HIGH) {

                jumping = false;

            }

        },
        {
            passive: true
        }
    );


    const handleDelta = function(deltaY, event) {

        const y = window.scrollY;

        const vh = window.innerHeight;

        if (deltaY > 0 && y < vh * DOWN_ZONE) {

            event.preventDefault();

            jumpTo(sectionsEl);

        } else if (deltaY < 0 && y >= vh * DOWN_ZONE && y < vh * UP_ZONE) {

            event.preventDefault();

            jumpTo(profile);

        }

    };


    window.addEventListener(
        "wheel",
        function(event) {

            handleDelta(event.deltaY, event);

        },
        {
            passive: false
        }
    );


    let touchStartY = 0;

    window.addEventListener(
        "touchstart",
        function(event) {

            touchStartY = event.touches[0].clientY;

        },
        {
            passive: true
        }
    );

    window.addEventListener(
        "touchmove",
        function(event) {

            const deltaY = touchStartY - event.touches[0].clientY;

            if (Math.abs(deltaY) > 40) {

                handleDelta(deltaY, event);

            }

        },
        {
            passive: false
        }
    );

}


/* =========================================
   EXPLORE BUTTON
========================================= */

const exploreButton =
    document.querySelector(
        ".explore-button"
    );


if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            document
                .getElementById("sections")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================
   PROJECT TABS
   (Ongoing / Past Projects)
========================================= */

const projectTabs = document.querySelectorAll(".project-tab");

if (projectTabs.length) {

    projectTabs.forEach(function(tab) {

        tab.addEventListener("click", function() {

            projectTabs.forEach(function(t) {

                t.classList.remove("active");

            });

            tab.classList.add("active");

            const targetId = tab.getAttribute("data-target");

            document
                .querySelectorAll(".project-grid")
                .forEach(function(panel) {

                    panel.hidden = panel.id !== targetId;

                });

        });

    });

}


/* =========================================
   THEME TOGGLE
========================================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function() {

            const current =
                document.documentElement.getAttribute("data-theme") === "dark"
                    ? "dark"
                    : "light";

            const next = current === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", next);

            try {

                localStorage.setItem("theme", next);

            } catch (e) {}

        }
    );

}


/* =========================================
   KEEP TRANSITION CORRECT
   AFTER WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    function() {

        handleScroll();

    }
);