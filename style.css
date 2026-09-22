/* =========================================
   RESET
========================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* =========================================
   BASIC
========================================= */

html {
    scroll-behavior: smooth;
}

body {
    background: #f7f7f7;

    color: #171717;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    line-height: 1.5;
}


/* =========================================
   HEADER
========================================= */

.header {

    position: fixed;

    top: 0;
    left: 0;

    width: 100%;

    height: 72px;

    padding: 0 7.8vw;

    display: flex;

    align-items: center;

    z-index: 1000;

    background: rgba(247, 247, 247, 0.95);

    backdrop-filter: blur(10px);

    opacity: 0;

    transform: translateY(-15px);

    pointer-events: none;

    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}


/*
    Header appears only after
    leaving the initial profile.
*/

body.scrolled .header {

    opacity: 1;

    transform: translateY(0);

    pointer-events: auto;
}


.header-name {

    text-decoration: none;

    color: #171717;

    font-size: 18px;

    font-weight: 600;

    letter-spacing: -0.4px;
}


/* =========================================
   PROFILE / INITIAL SCREEN
========================================= */

.profile {

    min-height: 100vh;

    height: 100vh;

    position: relative;

    display: flex;

    align-items: center;

    justify-content: flex-start;

    padding-left: 8vw;

    padding-right: 8vw;

    background: #f7f7f7;

    overflow: hidden;
}


/*
    Content width is intentionally limited,
    like the reference website.
*/

.profile-content {

    width: 100%;

    max-width: 1050px;

    padding-top: 10px;

    transition:
        opacity 0.7s ease,
        transform 0.9s cubic-bezier(
            0.22,
            0.61,
            0.36,
            1
        );
}


/*
    When scrolling begins,
    the profile moves upward and disappears.
*/

body.scrolled .profile-content {

    opacity: 0;

    transform:
        translateY(-100px);
}


/* =========================================
   NAME
========================================= */

.profile h1 {

    font-size:
        clamp(
            55px,
            6vw,
            82px
        );

    line-height: 0.95;

    font-weight: 700;

    letter-spacing: -4px;

    margin-bottom: 25px;
}


/* =========================================
   BIO
========================================= */

.bio {

    max-width: 1000px;

    font-size:
        clamp(
            20px,
            2vw,
            27px
        );

    line-height: 1.45;

    letter-spacing: -0.5px;

    color: #181818;
}


/* =========================================
   SOCIAL LINKS
========================================= */

.social-links {

    display: flex;

    align-items: center;

    gap: 24px;

    margin-top: 30px;

    margin-bottom: 35px;
}


.social-links a {

    text-decoration: none;

    color: #171717;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 34px;

    height: 34px;

    font-size: 25px;

    transition:
        transform 0.2s ease;
}


.social-links a:hover {

    transform:
        translateY(-3px);
}


.social-links a:last-child {

    font-size: 20px;

    font-weight: 600;
}


/* =========================================
   EXPLORE BUTTON
========================================= */

.explore-button {

    display: inline-flex;

    align-items: center;

    gap: 35px;

    padding:
        17px
        27px;

    background: #dedede;

    color: #171717;

    text-decoration: none;

    border-radius: 10px;

    font-size: 18px;

    transition:
        background 0.25s ease,
        transform 0.25s ease;
}


.explore-button:hover {

    background: #d3d3d3;

    transform:
        translateY(-2px);
}


.button-arrow {

    font-size: 25px;

    line-height: 1;

}


/* =========================================
   SCROLL INDICATOR
========================================= */

.scroll-indicator {

    position: absolute;

    bottom: 35px;

    left: 50%;

    transform:
        translateX(-50%);

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 9px;

    color: #555;

    font-size: 12px;

    transition:
        opacity 0.4s ease;
}


body.scrolled .scroll-indicator {

    opacity: 0;
}


.scroll-line {

    width: 1px;

    height: 40px;

    background: #777;

    animation:
        scrollLine 2s
        infinite;
}


@keyframes scrollLine {

    0% {

        transform:
            scaleY(0);

        transform-origin: top;

    }

    50% {

        transform:
            scaleY(1);

        transform-origin: top;

    }

    51% {

        transform-origin: bottom;

    }

    100% {

        transform:
            scaleY(0);

        transform-origin: bottom;

    }

}


/* =========================================
   CONTENT
========================================= */

main {

    background: #f7f7f7;
}


/* =========================================
   CARDS CONTAINER
========================================= */

.cards-container {

    max-width: 1100px;

    margin: 0 auto;

    padding:
        70px
        7vw
        120px;
}


/*
    First card starts after
    the initial profile.
*/

.section-card {

    position: relative;

    min-height: 210px;

    border-top:
        1px solid #d2d2d2;

    display: grid;

    grid-template-columns:
        70px
        1fr
        60px;

    align-items: center;

    text-decoration: none;

    color: #171717;

    transition:
        padding-left 0.35s ease;
}


.section-card:last-child {

    border-bottom:
        1px solid #d2d2d2;
}


/* =========================================
   CARD NUMBER
========================================= */

.card-number {

    align-self: start;

    padding-top: 32px;

    color: #999;

    font-size: 14px;
}


/* =========================================
   CARD TITLE
========================================= */

.card-title {

    font-size:
        clamp(
            48px,
            6vw,
            78px
        );

    line-height: 1;

    letter-spacing: -4px;

    font-weight: 500;

    transition:
        transform 0.35s ease;
}


/* =========================================
   CARD ARROW
========================================= */

.card-arrow {

    font-size: 42px;

    font-weight: 300;

    text-align: right;

    transition:
        transform 0.35s ease;
}


/* =========================================
   CARD HOVER
========================================= */

.section-card:hover {

    padding-left: 12px;
}


.section-card:hover .card-title {

    transform:
        translateX(8px);
}


.section-card:hover .card-arrow {

    transform:
        translateX(8px);
}


/* =========================================
   FOOTER
========================================= */

footer {

    border-top:
        1px solid #d2d2d2;

    padding:
        35px 8vw;

    display: flex;

    justify-content: space-between;

    color: #777;

    font-size: 12px;
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 700px) {


    .header {

        padding:
            0 25px;

        height: 65px;
    }


    .profile {

        padding:
            40px 25px;

    }


    .profile h1 {

        font-size:
            clamp(
                45px,
                14vw,
                70px
            );

        letter-spacing: -3px;

        margin-bottom: 22px;
    }


    .bio {

        font-size: 19px;

        line-height: 1.5;
    }


    .social-links {

        margin-top: 25px;

        gap: 18px;
    }


    .explore-button {

        padding:
            15px 21px;

        font-size: 16px;

        gap: 25px;
    }


    .cards-container {

        padding:
            30px 25px
            90px;
    }


    .section-card {

        min-height: 160px;

        grid-template-columns:
            40px
            1fr
            35px;
    }


    .card-number {

        padding-top: 25px;

        font-size: 11px;
    }


    .card-title {

        font-size: 43px;

        letter-spacing: -2.5px;
    }


    .card-arrow {

        font-size: 30px;
    }


    footer {

        padding:
            30px 25px;

        flex-direction: column;

        gap: 8px;
    }

}
