/* =========================================
   SCROLL TRANSITION
========================================= */

const profile = document.getElementById("home");

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
   EXPLORE BUTTON
========================================= */

const exploreButton =
    document.querySelector(
        ".explore-button"
    );


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
