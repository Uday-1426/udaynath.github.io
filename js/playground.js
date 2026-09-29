/* =========================================
   TACTILE PLAYGROUND

   A browser model of the vibrotactile surface:
     explore - show study shapes (10x10) or digits (5x3)
     draw    - switch pixels on and off

   Haptics:
     - Android and most other phones: Vibration API.
     - iPhone (iOS 18+): Safari has no Vibration API, but
       toggling a native <input switch> plays a small system
       haptic. It only fires during a tap, not while dragging.
   Browsers never ask permission for vibration; a first tap
   on "Turn on vibration" is enough to unlock it.
========================================= */

(function() {

    const board = document.getElementById("pixels");

    if (!board) {

        return;

    }


    /* ---------- Shapes ---------- */

    function line(r0, c0, r1, c1) {

        const cells = [];
        const steps = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0));

        for (let i = 0; i <= steps; i++) {

            cells.push([
                Math.round(r0 + (r1 - r0) * i / steps),
                Math.round(c0 + (c1 - c0) * i / steps)
            ]);

        }

        return cells;

    }

    function join() {

        return Array.prototype.concat.apply([], arguments);

    }

    // The nine shapes from the 10x10 study (T and inverted T were practice shapes).
    const FIGURES = [
        { id: "t", name: "T", cells: join(line(1, 1, 1, 8), line(2, 4, 8, 4)) },
        { id: "invt", name: "Inverted T", cells: join(line(1, 4, 7, 4), line(8, 1, 8, 8)) },
        { id: "h", name: "H", cells: join(line(1, 1, 8, 1), line(1, 8, 8, 8), line(4, 2, 4, 7)) },
        { id: "hlines", name: "Horizontal lines", cells: join(line(2, 1, 2, 8), line(6, 1, 6, 8)) },
        { id: "square", name: "Square", cells: join(line(2, 2, 2, 7), line(7, 2, 7, 7), line(3, 2, 6, 2), line(3, 7, 6, 7)) },
        { id: "x", name: "Pattern X", cells: join(line(1, 1, 1, 5), line(2, 5, 8, 5), line(8, 6, 8, 9)) },
        { id: "diag", name: "Diagonal lines", cells: join(line(7, 1, 1, 7), line(8, 3, 2, 9)) },
        { id: "y", name: "Pattern Y", cells: join(line(1, 1, 1, 4), line(2, 4, 8, 4), line(8, 5, 8, 8)) },
        { id: "plus", name: "Plus", cells: join(line(4, 1, 4, 8), line(1, 4, 8, 4)) }
    ];

    // Digits on the 5 rows x 3 columns surface of Iteration 1.
    const DIGIT_ROWS = {
        0: ["111", "101", "101", "101", "111"],
        1: ["010", "110", "010", "010", "111"],
        2: ["111", "001", "111", "100", "111"],
        3: ["111", "001", "111", "001", "111"],
        4: ["101", "101", "111", "001", "001"],
        5: ["111", "100", "111", "001", "111"],
        6: ["111", "100", "111", "101", "111"],
        7: ["111", "001", "001", "001", "001"],
        8: ["111", "101", "111", "101", "111"],
        9: ["111", "101", "111", "001", "111"]
    };

    function digitCells(d) {

        const cells = [];

        DIGIT_ROWS[d].forEach(function(row, r) {

            row.split("").forEach(function(bit, c) {

                if (bit === "1") {

                    cells.push([r, c]);

                }

            });

        });

        return cells;

    }


    /* ---------- State ---------- */

    const state = {
        mode: "explore",
        rows: 10,
        cols: 10,
        active: new Set(),
        cursor: null,
        figure: "h",
        digit: 3,
        paint: true
    };

    let pixels = [];
    let lastTouched = null;

    const key = function(r, c) { return r + "," + c; };


    /* ---------- Haptics ---------- */

    const haptics = (function() {

        const hasVibrate = typeof navigator.vibrate === "function";
        const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        let enabled = false;
        let last = 0;
        let iosLabel = null;

        if (!hasVibrate && isIOS) {

            // Hidden native switch; clicking its label plays the iOS haptic tick.
            const input = document.createElement("input");
            const label = document.createElement("label");

            input.type = "checkbox";
            input.setAttribute("switch", "");
            input.id = "hapticSwitch";
            input.tabIndex = -1;
            label.htmlFor = "hapticSwitch";
            label.setAttribute("aria-hidden", "true");
            label.style.cssText = input.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;";
            label.appendChild(input);
            document.body.appendChild(label);
            iosLabel = label;

        }

        // Desktop browsers may expose navigator.vibrate but have no motor.
        const isTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;

        return {
            supported: isTouch && (hasVibrate || !!iosLabel),
            kind: hasVibrate ? "vibrate" : (iosLabel ? "ios" : "none"),
            get enabled() { return enabled; },
            enable: function() { enabled = true; this.pulse(true); },
            disable: function() { enabled = false; },
            // fromTap: true when called inside a tap, which iOS requires.
            pulse: function(fromTap) {

                if (!enabled) {

                    return;

                }

                const now = Date.now();

                if (now - last < 45) {

                    return;

                }

                last = now;

                if (hasVibrate) {

                    navigator.vibrate(28);

                } else if (iosLabel && fromTap) {

                    iosLabel.click();

                }

            }
        };

    })();

    const hapticBtn = document.getElementById("hapticToggle");
    const hapticNote = document.getElementById("hapticNote");
    const vibrateNote = document.getElementById("vibrateNote");

    function updateHapticUI() {

        if (!hapticBtn) {

            return;

        }

        if (!haptics.supported) {

            hapticBtn.disabled = true;
            hapticBtn.textContent = "Vibration works on phones";
            hapticNote.textContent = "Open this page on your phone to feel the pixels buzz. On a computer you can still see them vibrate.";
            vibrateNote.textContent = "Visual only";

            return;

        }

        hapticBtn.setAttribute("aria-pressed", haptics.enabled ? "true" : "false");
        hapticBtn.textContent = haptics.enabled ? "Vibration on · tap to turn off" : "Turn on vibration";
        vibrateNote.textContent = haptics.enabled ? "Vibration on" : "Vibration off";
        hapticNote.textContent = haptics.kind === "ios"
            ? "On iPhone, you’ll feel a small tick each time you tap a vibrating pixel. iPhones don’t allow vibration while dragging."
            : "Slide your finger across the surface. You’ll feel a buzz on every vibrating pixel.";

    }

    if (hapticBtn) {

        hapticBtn.addEventListener("click", function() {

            if (haptics.enabled) {

                haptics.disable();

            } else {

                haptics.enable();

            }

            updateHapticUI();

        });

    }

    updateHapticUI();


    /* ---------- Rendering ---------- */

    function buildBoard(rows, cols) {

        state.rows = rows;
        state.cols = cols;
        state.cursor = null;
        board.innerHTML = "";
        board.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
        board.style.maxWidth = cols === 3 ? "190px" : "100%";

        document.getElementById("boardSize").textContent = rows + " × " + cols;

        pixels = [];

        for (let r = 0; r < rows; r++) {

            for (let c = 0; c < cols; c++) {

                const px = document.createElement("div");

                px.className = "px";
                px.dataset.r = r;
                px.dataset.c = c;
                board.appendChild(px);
                pixels.push(px);

            }

        }

    }

    function pixelAt(r, c) {

        return pixels[r * state.cols + c];

    }

    function setActive(cells) {

        state.active = new Set(cells.map(function(cell) { return key(cell[0], cell[1]); }));

    }

    function render() {

        pixels.forEach(function(px) {

            const r = Number(px.dataset.r);
            const c = Number(px.dataset.c);

            px.classList.toggle("on", state.active.has(key(r, c)));
            px.classList.toggle("cursor", !!state.cursor && state.cursor[0] === r && state.cursor[1] === c);

        });

        if (state.mode === "draw") {

            document.getElementById("drawCount").textContent = state.active.size + " of 100 motors switched on";

        }

    }


    /* ---------- Touching the surface ---------- */

    function ripple(px) {

        const ring = document.createElement("span");

        ring.className = "ripple";
        px.appendChild(ring);
        setTimeout(function() { ring.remove(); }, 650);

    }

    function touch(r, c, fromTap) {

        const px = pixelAt(r, c);

        if (!px) {

            return;

        }

        const k = key(r, c);
        const changed = lastTouched !== k;

        lastTouched = k;

        if (state.mode === "draw") {

            if (fromTap) {

                state.paint = !state.active.has(k);

            }

            if (state.paint) {

                state.active.add(k);

            } else {

                state.active.delete(k);

            }

            render();

            if (state.paint && changed) {

                ripple(px);
                haptics.pulse(fromTap);

            }

            return;

        }

        if (state.active.has(k) && changed) {

            ripple(px);
            haptics.pulse(fromTap);

        }

    }

    function cellFromEvent(e) {

        const el = document.elementFromPoint(e.clientX, e.clientY);
        const px = el && el.closest ? el.closest(".px") : null;

        return px && board.contains(px) ? [Number(px.dataset.r), Number(px.dataset.c)] : null;

    }

    let pointerDown = false;

    board.addEventListener("pointerdown", function(e) {

        pointerDown = true;
        lastTouched = null;

        const cell = cellFromEvent(e);

        if (cell) {

            touch(cell[0], cell[1], true);

        }

    });

    board.addEventListener("pointermove", function(e) {

        if (state.mode === "draw" && !pointerDown) {

            return;

        }

        const cell = cellFromEvent(e);

        if (cell) {

            touch(cell[0], cell[1], false);

        } else {

            lastTouched = null;

        }

    });

    window.addEventListener("pointerup", function() { pointerDown = false; });
    board.addEventListener("pointerleave", function() { lastTouched = null; });

    board.addEventListener("keydown", function(e) {

        const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

        if (moves[e.key]) {

            e.preventDefault();

            const cur = state.cursor || [0, 0];
            const r = Math.min(state.rows - 1, Math.max(0, cur[0] + (state.cursor ? moves[e.key][0] : 0)));
            const c = Math.min(state.cols - 1, Math.max(0, cur[1] + (state.cursor ? moves[e.key][1] : 0)));

            state.cursor = [r, c];
            render();

            if (state.mode === "explore") {

                touch(r, c, true);

                const live = document.getElementById("cellStatus");

                if (live) {

                    live.textContent = "Row " + (r + 1) + ", column " + (c + 1) + ": " +
                        (state.active.has(key(r, c)) ? "vibrating" : "still");

                }

            }

        } else if ((e.key === " " || e.key === "Enter") && state.mode === "draw" && state.cursor) {

            e.preventDefault();
            lastTouched = null;
            touch(state.cursor[0], state.cursor[1], true);

        }

    });


    /* ---------- Explore ---------- */

    const figureChips = document.getElementById("figureChips");
    const sizeChips = document.getElementById("sizeChips");

    function buildFigureChips() {

        figureChips.innerHTML = "";

        const items = state.cols === 3
            ? Object.keys(DIGIT_ROWS).map(function(d) { return { id: d, name: d }; })
            : FIGURES;

        items.forEach(function(item) {

            const b = document.createElement("button");
            const selected = state.cols === 3 ? String(state.digit) === String(item.id) : state.figure === item.id;

            b.type = "button";
            b.textContent = item.name;
            b.setAttribute("aria-pressed", selected ? "true" : "false");

            b.addEventListener("click", function() {

                if (state.cols === 3) {

                    state.digit = Number(item.id);

                } else {

                    state.figure = item.id;

                }

                showExplore();

            });

            figureChips.appendChild(b);

        });

    }

    function showExplore() {

        if (state.cols === 3) {

            setActive(digitCells(state.digit));

        } else {

            setActive(FIGURES.filter(function(f) { return f.id === state.figure; })[0].cells);

        }

        buildFigureChips();
        render();

    }

    sizeChips.querySelectorAll("button").forEach(function(b) {

        b.addEventListener("click", function() {

            sizeChips.querySelectorAll("button").forEach(function(x) {

                x.setAttribute("aria-pressed", x === b ? "true" : "false");

            });

            if (b.dataset.size === "5x3") {

                buildBoard(5, 3);

            } else {

                buildBoard(10, 10);

            }

            showExplore();

        });

    });


    /* ---------- Draw ---------- */

    const drawStart = document.getElementById("drawStart");

    [{ id: "blank", name: "Blank", cells: [] }].concat(FIGURES).forEach(function(f) {

        const b = document.createElement("button");

        b.type = "button";
        b.textContent = f.name;
        b.addEventListener("click", function() {

            setActive(f.cells);
            render();

        });

        drawStart.appendChild(b);

    });

    document.getElementById("clearDraw").addEventListener("click", function() {

        state.active = new Set();
        render();

    });

    document.getElementById("invertDraw").addEventListener("click", function() {

        const next = new Set();

        for (let r = 0; r < 10; r++) {

            for (let c = 0; c < 10; c++) {

                if (!state.active.has(key(r, c))) {

                    next.add(key(r, c));

                }

            }

        }

        state.active = next;
        render();

    });


    /* ---------- Modes ---------- */

    const hint = document.getElementById("boardHint");
    const hints = {
        explore: "Slide your finger or pointer across the pixels.",
        draw: "Tap or drag to switch pixels on and off."
    };

    function setMode(mode) {

        state.mode = mode;

        document.querySelectorAll(".pg-modes button").forEach(function(b) {

            const on = b.dataset.mode === mode;

            b.setAttribute("aria-selected", on ? "true" : "false");
            b.tabIndex = on ? 0 : -1;

        });

        document.querySelectorAll("[data-panel]").forEach(function(p) {

            p.hidden = p.dataset.panel !== mode;

        });

        hint.textContent = hints[mode];

        if (mode === "draw" && state.cols !== 10) {

            buildBoard(10, 10);

            sizeChips.querySelectorAll("button").forEach(function(x) {

                x.setAttribute("aria-pressed", x.dataset.size === "10x10" ? "true" : "false");

            });

        }

        if (mode === "explore") {

            showExplore();

        } else {

            state.active = new Set();
            render();

        }

    }

    const modeButtons = Array.prototype.slice.call(document.querySelectorAll(".pg-modes button"));

    modeButtons.forEach(function(b, i) {

        b.addEventListener("click", function() { setMode(b.dataset.mode); });

        b.addEventListener("keydown", function(e) {

            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {

                const next = modeButtons[(i + (e.key === "ArrowRight" ? 1 : modeButtons.length - 1)) % modeButtons.length];

                next.focus();
                setMode(next.dataset.mode);

            }

        });

    });

    buildBoard(10, 10);
    setMode("explore");

})();
