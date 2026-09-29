/* =========================================
   PROJECT PAGES

   "Know more" buttons: each one shows or
   hides the region named in aria-controls.
   Details start visible and are hidden here,
   so the content is never lost without JS.
========================================= */

(function() {

    const buttons = document.querySelectorAll(".more-btn[aria-controls]");

    buttons.forEach(function(button) {

        const region = document.getElementById(button.getAttribute("aria-controls"));
        const label = button.querySelector(".label");

        if (!region) {

            return;

        }

        const set = function(open) {

            region.hidden = !open;
            button.setAttribute("aria-expanded", open ? "true" : "false");

            if (label) {

                label.textContent = open ? "Show less" : "Know more";

            }

        };

        set(false);

        button.addEventListener("click", function() {

            const open = button.getAttribute("aria-expanded") !== "true";

            set(open);

            if (open) {

                region.focus({ preventScroll: true });

            }

        });

    });

    // A link to something inside a closed region opens that region first.
    const openFor = function(hash) {

        if (!hash || hash.length < 2) {

            return;

        }

        const target = document.getElementById(decodeURIComponent(hash.slice(1)));

        if (!target) {

            return;

        }

        const region = target.closest("[id][hidden], .more");

        if (region && region.hidden) {

            const button = document.querySelector('.more-btn[aria-controls="' + region.id + '"]');

            if (button) {

                button.click();

            }

            target.scrollIntoView();

        }

    };

    openFor(window.location.hash);

    window.addEventListener("hashchange", function() { openFor(window.location.hash); });

})();
