/* =========================================
   SCROLL-SPY NAV

   Highlights the nav pill for whichever
   section is currently in view.
========================================= */

(function() {

    const navPills = document.querySelectorAll(".nav-pill[href^='#']");

    if (!navPills.length) {

        return;

    }

    const sections = Array.prototype.map.call(navPills, function(pill) {

        const id = pill.getAttribute("href").slice(1);

        return document.getElementById(id);

    }).filter(Boolean);

    if (!sections.length) {

        return;

    }

    const setActive = function(id) {

        navPills.forEach(function(pill) {

            pill.classList.toggle(
                "active",
                pill.getAttribute("href") === "#" + id
            );

        });

    };

    const observer = new IntersectionObserver(
        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {

                    setActive(entry.target.id);

                }

            });

        },
        {
            rootMargin: "-45% 0px -50% 0px",
            threshold: 0
        }
    );

    sections.forEach(function(section) {

        observer.observe(section);

    });

})();


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

            projectTabs.forEach(function(t) {

                t.setAttribute("aria-selected", t === tab ? "true" : "false");
                t.tabIndex = t === tab ? 0 : -1;

            });

            const targetId = tab.getAttribute("data-target");

            document
                .querySelectorAll(".project-grid")
                .forEach(function(panel) {

                    panel.hidden = panel.id !== targetId;

                });

        });

        // Left / right arrows move between tabs.
        tab.addEventListener("keydown", function(e) {

            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") {

                return;

            }

            const list = Array.prototype.slice.call(projectTabs);
            const next = list[(list.indexOf(tab) + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];

            next.focus();
            next.click();

        });

    });

}


/* =========================================
   THEME TOGGLE
========================================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    const syncPressed = function() {

        themeToggle.setAttribute(
            "aria-pressed",
            document.documentElement.getAttribute("data-theme") === "dark" ? "true" : "false"
        );

    };

    syncPressed();

    themeToggle.addEventListener("click", syncPressed);

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
   VIBRATION PATTERNS

   Shared 10x10 bitmaps — used both by the
   live interactive demo and by the static
   "Example Patterns" thumbnails. Each pattern
   is 10 rows; each row lists the active
   column indexes (0-9) in that row.
========================================= */

const VIBRO_PATTERNS = {

    circle: [
        [4, 5], [2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8], [2, 3, 4, 5, 6, 7], [4, 5]
    ],

    triangle: [
        [4, 5], [4, 5], [3, 4, 5, 6], [3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7], [2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],

    arrow: [
        [], [], [9], [8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [8, 9], [9], [], []
    ],

    heart: [
        [1, 2, 7, 8], [0, 1, 2, 3, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8],
        [2, 3, 4, 5, 6, 7], [3, 4, 5, 6], [4, 5], []
    ]

};


/* =========================================
   PATTERN THUMBNAILS

   Renders small static previews of each
   pattern above (used in "Example Patterns").
========================================= */

document.querySelectorAll(".pattern-thumb-grid[data-pattern]").forEach(function(el) {

    const rows = VIBRO_PATTERNS[el.getAttribute("data-pattern")];

    if (!rows) {

        return;

    }

    for (let r = 0; r < 10; r++) {

        for (let c = 0; c < 10; c++) {

            const dot = document.createElement("div");

            dot.className = "dot" + (rows[r].indexOf(c) !== -1 ? " on" : "");

            el.appendChild(dot);

        }

    }

});


/* =========================================
   VIBROTACTILE INTERACTIVE DEMO

   A working model of the real control panel
   (Pattern / Intensity / Speed / Play / Clear)
   shown in the project's own screenshots —
   not just a cursor-follow effect.
========================================= */

(function() {

    const grid = document.getElementById("vibroGrid");

    if (!grid) {

        return;

    }

    const SIZE = 10;

    const PATTERNS = VIBRO_PATTERNS;

    const patternButtons = document.getElementById("vibroPatternButtons");
    const intensityInput = document.getElementById("vibroIntensity");
    const speedInput = document.getElementById("vibroSpeed");
    const playButton = document.getElementById("vibroPlay");
    const clearButton = document.getElementById("vibroClear");

    // Build the 10x10 grid of cells.
    const cells = [];

    for (let r = 0; r < SIZE; r++) {

        for (let c = 0; c < SIZE; c++) {

            const cell = document.createElement("button");

            cell.type = "button";
            cell.setAttribute("aria-label", "Toggle tactile pixel " + (r + 1) + ", " + (c + 1));

            cell.className = "vibro-cell";

            grid.appendChild(cell);

            cells.push(cell);

            cell.addEventListener("click", function() {
                cell.classList.toggle("active");
                cell.style.setProperty("--cell-opacity", String(0.3 + getIntensity() * 0.7));
            });

        }

    }

    let currentPattern = "heart";

    function getIntensity() {

        return intensityInput ? Number(intensityInput.value) / 100 : 0.8;

    }

    function getSpeed() {

        // Slider is 1 (slow) .. 10 (fast).
        const speed = speedInput ? Number(speedInput.value) : 5;

        return {
            pulseDuration: 2.2 - speed * 0.16,
            stepDelay: 260 - speed * 20
        };

    }

    function clearGrid() {

        cells.forEach(function(cell) {

            cell.classList.remove("active");

            cell.style.removeProperty("--cell-opacity");
            cell.style.removeProperty("--pulse-duration");
            cell.style.removeProperty("--pulse-delay");

        });

    }

    function playPattern() {

        clearGrid();

        const rows = PATTERNS[currentPattern] || PATTERNS.heart;
        const intensity = 0.3 + getIntensity() * 0.7;
        const speed = getSpeed();

        let order = 0;

        rows.forEach(function(cols, r) {

            cols.forEach(function(c) {

                const index = r * SIZE + c;
                const cell = cells[index];

                if (!cell) {

                    return;

                }

                cell.style.setProperty("--cell-opacity", String(intensity));
                cell.style.setProperty("--pulse-duration", speed.pulseDuration + "s");
                cell.style.setProperty("--pulse-delay", (order * speed.stepDelay) + "ms");

                cell.classList.add("active");

                order++;

            });

        });

    }

    function updateLiveIntensity() {

        const intensity = 0.3 + getIntensity() * 0.7;

        cells.forEach(function(cell) {

            if (cell.classList.contains("active")) {

                cell.style.setProperty("--cell-opacity", String(intensity));

            }

        });

    }

    function updateLiveSpeed() {

        const speed = getSpeed();

        cells.forEach(function(cell) {

            if (cell.classList.contains("active")) {

                cell.style.setProperty("--pulse-duration", speed.pulseDuration + "s");

            }

        });

    }

    if (patternButtons) {

        const buttons = patternButtons.querySelectorAll("button");

        buttons.forEach(function(button) {

            button.addEventListener("click", function() {

                buttons.forEach(function(b) {

                    b.classList.remove("active");

                });

                button.classList.add("active");

                currentPattern = button.getAttribute("data-pattern");

                playPattern();

            });

        });

    }

    if (intensityInput) {

        intensityInput.addEventListener("input", updateLiveIntensity);

    }

    if (speedInput) {

        speedInput.addEventListener("input", updateLiveSpeed);

    }

    if (playButton) {

        playButton.addEventListener("click", playPattern);

    }

    if (clearButton) {

        clearButton.addEventListener("click", clearGrid);

    }

    // Start with the default pattern already playing.
    playPattern();

})();
