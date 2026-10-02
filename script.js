
/* =============================================================
   BOUTON CONTACT
   ============================================================= */

const contactButton =
    document.querySelector(".contact-button");

const contactAnimation =
    document.querySelector(".contact-animation");


let contactAnimationInterval = null;


/* =============================================================
   LECTURE ANIMATION BOUTON
   ============================================================= */

function playContactAnimation() {

    contactAnimation.pause();

    contactAnimation.currentTime = 0;

    contactAnimation.play().catch(() => {});

}


/* =============================================================
   SURVOL BOUTON
   ============================================================= */

contactButton.addEventListener("mouseenter", () => {

    playContactAnimation();

    clearInterval(contactAnimationInterval);

    contactAnimationInterval = setInterval(() => {

        playContactAnimation();

    }, 1500);

});


/* =============================================================
   SORTIE DU BOUTON
   ============================================================= */

contactButton.addEventListener("mouseleave", () => {

    clearInterval(contactAnimationInterval);

    contactAnimationInterval = null;

});


/* =============================================================
   AVIS CLIENTS
   ============================================================= */

const testimonials =
    document.querySelectorAll(".testimonial-image");

const testimonialDots =
    document.querySelectorAll(".testimonial-dot");

const testimonialPrevious =
    document.querySelector(".testimonial-arrow-left");

const testimonialNext =
    document.querySelector(".testimonial-arrow-right");


let currentTestimonial = 0;

let testimonialTimer;


function showTestimonial(index) {

    testimonials[currentTestimonial]
        .classList.remove("active");

    testimonialDots.forEach(dot => {

        dot.classList.remove("active");

    });

    currentTestimonial = index;

    testimonials[currentTestimonial]
        .classList.add("active");

    testimonialDots[currentTestimonial]
        .classList.add("active");

}


function resetTestimonialTimer() {

    clearInterval(testimonialTimer);

    testimonialTimer =
        setInterval(
            nextTestimonial,
            10000
        );

}


function nextTestimonial() {

    const nextIndex =
        (currentTestimonial + 1) %
        testimonials.length;

    showTestimonial(nextIndex);

    resetTestimonialTimer();

}


function previousTestimonial() {

    const previousIndex =
        (
            currentTestimonial - 1 +
            testimonials.length
        ) %
        testimonials.length;

    showTestimonial(previousIndex);

    resetTestimonialTimer();

}


testimonialPrevious.addEventListener(
    "click",
    previousTestimonial
);


testimonialNext.addEventListener(
    "click",
    nextTestimonial
);


testimonialDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showTestimonial(index);

        resetTestimonialTimer();

    });

});


resetTestimonialTimer();


/* =============================================================
   VAGUE DES ICÔNES
   ============================================================= */

const floatingIcons =
    document.querySelectorAll(".floating-icon");


function playContactWave() {

    floatingIcons.forEach((icon, index) => {

        setTimeout(() => {

            icon.classList.add("wave");

            icon.addEventListener(
                "animationend",
                () => {

                    icon.classList.remove("wave");

                },
                {
                    once: true
                }
            );

        }, index * 100);

    });

}


/* Première vague */

setTimeout(() => {

    playContactWave();

    setInterval(
        playContactWave,
        20000
    );

}, 5000);


/* =============================================================
   BOUTON EMAIL
   ============================================================= */

const emailButton =
    document.querySelector(".email-button");

const emailCopiedMessage =
    document.querySelector(".email-copied-message");

const emailAddress =
    "kaloyan.petkov.contact@gmail.com";


let emailMessageTimer = null;


/* =============================================================
   CLIC SUR LE BOUTON EMAIL
   ============================================================= */

if (emailButton) {

    emailButton.addEventListener("click", async (event) => {

        /*
            Empêche le mailto de se déclencher
            immédiatement.
        */

        event.preventDefault();


        /*
            Copie l'adresse e-mail.
        */

        try {

            await navigator.clipboard.writeText(emailAddress);

        } catch (error) {

            /*
                Solution de secours pour les navigateurs
                qui bloquent Clipboard API.
            */

            const temporaryInput =
                document.createElement("textarea");

            temporaryInput.value =
                emailAddress;

            temporaryInput.style.position =
                "fixed";

            temporaryInput.style.opacity =
                "0";

            document.body.appendChild(
                temporaryInput
            );

            temporaryInput.select();

            document.execCommand("copy");

            temporaryInput.remove();

        }


        /*
            Affiche "E-mail copié !"
        */

        if (emailCopiedMessage) {

            emailCopiedMessage.classList.add(
                "visible"
            );


            /*
                Réinitialise le délai
                si l'utilisateur reclique.
            */

            clearTimeout(
                emailMessageTimer
            );


            /*
                Cache le message après 2 secondes.
            */

            emailMessageTimer =
                setTimeout(() => {

                    emailCopiedMessage.classList.remove(
                        "visible"
                    );

                }, 2000);

        }


        /*
            Ouvre ensuite l'application e-mail
            configurée sur l'ordinateur.

            Si aucune application n'est configurée,
            rien ne se passe, mais l'adresse a quand
            même été copiée.
        */

        window.location.href =
            "mailto:" + emailAddress;

    });

}


document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       RÉFÉRENCES VIDÉOS
       ========================================================= */

    const mainVideo =
        document.querySelector(".main-video");

    const videoCardMain =
        document.querySelector(".video-card-main");

    const edgeSweepVideo =
        document.querySelector(".edge-sweep-video");

    const backgroundVideo =
        document.querySelector(".background-video");

    const particlesLoopA =
        document.querySelector(".particles-loop-a");

    const particlesLoopB =
        document.querySelector(".particles-loop-b");

    const backgroundParticles1 =
        document.querySelector(".background-particles-1");

    const backgroundParticles2 =
        document.querySelector(".background-particles-2");

    const reelVideos =
        document.querySelectorAll(".reel-video");


    /* =========================================================
       PARAMÈTRES GÉNÉRAUX
       ========================================================= */

    const PARTICLES_DURATION = 7000;

    const PARTICLES_CROSSFADE = 1000;

    const BACKGROUND_STOP_TIME = 5;


    /* =========================================================
       SÉCURITÉ : ON VÉRIFIE QUE LES ÉLÉMENTS EXISTENT
       ========================================================= */

    if (!mainVideo) {

        return;

    }


    /* =========================================================
       1 — PARTICULES DU HAUT

       A et B utilisent la même vidéo source.
       Une seule est visible à la fois, avec crossfade
       sur la dernière seconde.
       ========================================================= */

    let topParticlesActive =
        particlesLoopA;

    let topParticlesInactive =
        particlesLoopB;

    let topParticlesTimer = null;

    let topParticlesStopTimer = null;

    let topParticlesRunning = false;


    function resetTopParticlesVideo(video) {

        if (!video) {

            return;

        }

        video.pause();

        video.currentTime = 0;

        video.style.opacity = "0";

    }


    function stopTopParticles() {

        topParticlesRunning = false;

        clearTimeout(topParticlesTimer);

        clearTimeout(topParticlesStopTimer);

        topParticlesTimer = null;

        topParticlesStopTimer = null;


        /*
         * Les deux vidéos deviennent immédiatement
         * invisibles.
         */

        if (particlesLoopA) {

            particlesLoopA.style.opacity = "0";

        }

        if (particlesLoopB) {

            particlesLoopB.style.opacity = "0";

        }


        /*
         * On attend la fin du fondu avant de
         * remettre les vidéos à zéro.
         */

        topParticlesStopTimer =
            setTimeout(() => {

                resetTopParticlesVideo(
                    particlesLoopA
                );

                resetTopParticlesVideo(
                    particlesLoopB
                );

                topParticlesStopTimer = null;

            }, PARTICLES_CROSSFADE);

    }


    function startTopParticles() {

        if (
            !particlesLoopA ||
            !particlesLoopB
        ) {

            return;

        }


        clearTimeout(topParticlesTimer);

        clearTimeout(topParticlesStopTimer);

        topParticlesTimer = null;

        topParticlesStopTimer = null;

        topParticlesRunning = true;


        /*
         * Les deux vidéos sont invisibles à ce moment.
         * On peut donc les remettre à zéro.
         */

        particlesLoopA.pause();

        particlesLoopB.pause();

        particlesLoopA.currentTime = 0;

        particlesLoopB.currentTime = 0;


        /*
         * A devient la vidéo active.
         */

        particlesLoopA.style.opacity = "1";

        particlesLoopB.style.opacity = "0";

        topParticlesActive =
            particlesLoopA;

        topParticlesInactive =
            particlesLoopB;


        /*
         * Lecture de A.
         */

        topParticlesActive
            .play()
            .catch(() => {});


        /*
         * Premier crossfade après 6 secondes.
         */

        topParticlesTimer =
            setTimeout(
                crossfadeTopParticles,
                PARTICLES_DURATION -
                PARTICLES_CROSSFADE
            );

    }


    /* =========================================================
       CROSSFADE PARTICULES DU HAUT
       ========================================================= */

    function crossfadeTopParticles() {

        if (
            !topParticlesRunning ||
            !topParticlesActive ||
            !topParticlesInactive
        ) {

            return;

        }


        const current =
            topParticlesActive;

        const next =
            topParticlesInactive;


        /*
         * Prépare la prochaine vidéo.
         */

        next.pause();

        next.currentTime = 0;

        next.style.opacity = "0";


        /*
         * La prochaine vidéo démarre.
         */

        next
            .play()
            .catch(() => {});


        /*
         * Début du crossfade.
         */

        requestAnimationFrame(() => {

            if (!topParticlesRunning) {

                return;

            }

            current.style.opacity = "0";

            next.style.opacity = "1";

        });


        /*
         * Lorsque le crossfade est terminé,
         * l'ancienne vidéo est arrêtée et remise à zéro.
         */

        clearTimeout(topParticlesStopTimer);

        topParticlesStopTimer =
            setTimeout(() => {

                current.pause();

                current.currentTime = 0;

                current.style.opacity = "0";

            }, PARTICLES_CROSSFADE);


        /*
         * Inversion des rôles.
         */

        topParticlesActive =
            next;

        topParticlesInactive =
            current;


        /*
         * Nouveau cycle.
         */

        clearTimeout(topParticlesTimer);

        topParticlesTimer =
            setTimeout(
                crossfadeTopParticles,
                PARTICLES_DURATION -
                PARTICLES_CROSSFADE
            );

    }


    /* =========================================================
       2 — PARTICULES DU BAS

       Les particules du bas utilisent le même système
       de crossfade, mais leur lecture est contrôlée
       par leur visibilité dans le viewport.
       ========================================================= */

    let bottomParticlesActive =
        backgroundParticles1;

    let bottomParticlesInactive =
        backgroundParticles2;

    let bottomParticlesTimer = null;

    let bottomParticlesStopTimer = null;

    let bottomParticlesRunning = false;


    function pauseBottomParticlesVideo(video) {

        if (!video) {

            return;

        }

        video.pause();

    }


    /*
     * Arrêt du lazy playback.

     * IMPORTANT :
     * aucune remise à zéro du currentTime.
     * aucune modification d'opacité.
     * aucun nouveau crossfade.

     * On gèle simplement les deux vidéos
     * dans leur état actuel.
     */

    function stopBottomParticles() {

        bottomParticlesRunning = false;

        clearTimeout(bottomParticlesTimer);

        clearTimeout(bottomParticlesStopTimer);

        bottomParticlesTimer = null;

        bottomParticlesStopTimer = null;


        pauseBottomParticlesVideo(
            backgroundParticles1
        );

        pauseBottomParticlesVideo(
            backgroundParticles2
        );

    }


    /*
     * Reprise du lazy playback.

     * Les vidéos reprennent exactement à leur
     * currentTime précédent.
     */

    function startBottomParticles() {

        if (
            !backgroundParticles1 ||
            !backgroundParticles2
        ) {

            return;

        }


        if (bottomParticlesRunning) {

            return;

        }


        bottomParticlesRunning = true;


        clearTimeout(bottomParticlesTimer);

        clearTimeout(bottomParticlesStopTimer);

        bottomParticlesTimer = null;

        bottomParticlesStopTimer = null;


        /*
         * Reprise de la vidéo actuellement active.

         * Aucun currentTime = 0.
         */

        bottomParticlesActive
            .play()
            .catch(() => {});


        /*
         * Si la deuxième vidéo participait déjà
         * à un crossfade, elle reprend également.
         */

        if (
            bottomParticlesInactive &&
            bottomParticlesInactive.currentTime > 0
        ) {

            bottomParticlesInactive
                .play()
                .catch(() => {});

        }


        /*
         * Recalcul du temps restant avant
         * le prochain crossfade.
         */

        const remainingTime =
            Math.max(
                0,
                (
                    PARTICLES_DURATION -
                    PARTICLES_CROSSFADE
                ) -
                (
                    bottomParticlesActive.currentTime *
                    1000
                )
            );


        bottomParticlesTimer =
            setTimeout(
                crossfadeBottomParticles,
                remainingTime
            );

    }


    function crossfadeBottomParticles() {

        if (
            !bottomParticlesRunning ||
            !bottomParticlesActive ||
            !bottomParticlesInactive
        ) {

            return;

        }


        const current =
            bottomParticlesActive;

        const next =
            bottomParticlesInactive;


        /*
         * Prépare la prochaine vidéo.
         */

        next.pause();

        next.currentTime = 0;

        next.style.opacity = "0";


        /*
         * La prochaine vidéo démarre.
         */

        next
            .play()
            .catch(() => {});


        /*
         * Crossfade.
         */

        requestAnimationFrame(() => {

            if (!bottomParticlesRunning) {

                return;

            }

            current.style.opacity = "0";

            next.style.opacity = "1";

        });


        /*
         * Une fois le crossfade terminé,
         * l'ancienne vidéo est arrêtée et remise à zéro.
         */

        clearTimeout(bottomParticlesStopTimer);

        bottomParticlesStopTimer =
            setTimeout(() => {

                current.pause();

                current.currentTime = 0;

                current.style.opacity = "0";

            }, PARTICLES_CROSSFADE);


        /*
         * Inversion des rôles.
         */

        bottomParticlesActive =
            next;

        bottomParticlesInactive =
            current;


        /*
         * Nouveau cycle.
         */

        clearTimeout(bottomParticlesTimer);

        bottomParticlesTimer =
            setTimeout(
                crossfadeBottomParticles,
                PARTICLES_DURATION -
                PARTICLES_CROSSFADE
            );

    }


    /* =========================================================
       3 — DÉTECTION DE VISIBILITÉ

       Une vidéo est considérée comme visible dès qu'une
       partie de sa surface se trouve dans le viewport.

       Il n'y a plus aucune distance fixe en pixels.
       ========================================================= */

    function isVideoVisibleInViewport(video) {

        if (!video) {

            return false;

        }


        const rect =
            video.getBoundingClientRect();


        return (
            rect.bottom > 0 &&
            rect.top < window.innerHeight
        );

    }


    /* =========================================================
       4 — LAZY PLAYBACK DES REELS

       Chaque reel est évalué individuellement.

       Si une partie du reel est visible :
       → lecture

       Si le reel est complètement hors écran :
       → pause

       La position de lecture est conservée.
       ========================================================= */

    function updateReelsPlayback() {

        reelVideos.forEach(video => {

            const shouldPlay =
                isVideoVisibleInViewport(video);


            if (shouldPlay) {

                if (video.paused) {

                    video
                        .play()
                        .catch(() => {});

                }

            } else {

                if (!video.paused) {

                    video.pause();

                }

            }

        });

    }


    /* =========================================================
       5 — LAZY PLAYBACK DES PARTICULES DU BAS

       Les deux vidéos sont superposées et occupent
       la même zone.

       On utilise donc la première vidéo comme référence
       géométrique.

       Visible :
       → lecture + crossfade

       Hors écran :
       → pause à la frame actuelle
       ========================================================= */

    let bottomParticlesVisibilityState =
        false;


    function updateBottomParticlesPlayback() {

        const referenceVideo =
            backgroundParticles1 ||
            backgroundParticles2;


        const shouldPlay =
            isVideoVisibleInViewport(
                referenceVideo
            );


        if (
            shouldPlay ===
            bottomParticlesVisibilityState
        ) {

            return;

        }


        bottomParticlesVisibilityState =
            shouldPlay;


        if (shouldPlay) {

            startBottomParticles();

        } else {

            stopBottomParticles();

        }

    }


    /* =========================================================
       6 — VIDÉO DE FOND — ARRÊT FLUIDE À 5 SECONDES
       ========================================================= */

    let backgroundStopRequested = false;

    let backgroundStopCompleted = false;

    let backgroundWaitingForNextLoop = false;


    /*
     * Demande d'arrêt à 5 secondes.
     */

    function stopBackgroundAtFiveSeconds() {

        if (!backgroundVideo) {

            return;

        }


        backgroundStopRequested = true;

        backgroundStopCompleted = false;

        backgroundVideo.loop = false;


        /*
         * CAS 1 :
         * La vidéo est entre 0 et 5 secondes.
         */

        if (
            backgroundVideo.currentTime <
            BACKGROUND_STOP_TIME
        ) {

            backgroundWaitingForNextLoop = false;


            if (backgroundVideo.paused) {

                backgroundVideo
                    .play()
                    .catch(() => {});

            }

            return;

        }


        /*
         * CAS 2 :
         * La vidéo est déjà entre 5 et 10 secondes.

         * On la laisse terminer sa boucle.
         */

        backgroundWaitingForNextLoop = true;


        if (backgroundVideo.paused) {

            backgroundVideo
                .play()
                .catch(() => {});

        }

    }


    /*
     * Surveillance de l'arrivée à 5 secondes.
     */

    function handleBackgroundTimeUpdate() {

        if (!backgroundVideo) {

            return;

        }


        if (!backgroundStopRequested) {

            return;

        }


        if (backgroundStopCompleted) {

            return;

        }


        if (
            !backgroundWaitingForNextLoop &&
            backgroundVideo.currentTime >=
            BACKGROUND_STOP_TIME
        ) {

            backgroundVideo.pause();

            backgroundStopCompleted = true;

            return;

        }

    }


    /*
     * La vidéo de fond vient d'atteindre sa fin.
     */

    function handleBackgroundEnded() {

        if (!backgroundVideo) {

            return;

        }


        /*
         * Aucun arrêt demandé :
         * fonctionnement normal de la boucle.
         */

        if (!backgroundStopRequested) {

            backgroundVideo.currentTime = 0;

            backgroundVideo
                .play()
                .catch(() => {});

            return;

        }


        /*
         * On attendait la fin de la boucle 5 → 10 s.
         */

        if (backgroundWaitingForNextLoop) {

            backgroundWaitingForNextLoop = false;

            backgroundVideo.currentTime = 0;

            backgroundVideo
                .play()
                .catch(() => {});

            return;

        }


        /*
         * Sécurité.
         */

        backgroundVideo.currentTime = 0;

        backgroundVideo
            .play()
            .catch(() => {});

    }


    /*
     * La vidéo principale est remise en pause.
     */

    function resumeBackgroundVideo() {

        if (!backgroundVideo) {

            return;

        }


        backgroundStopRequested = false;

        backgroundStopCompleted = false;

        backgroundWaitingForNextLoop = false;

        backgroundVideo.loop = true;


        /*
         * Aucun changement de currentTime.
         */

        backgroundVideo
            .play()
            .catch(() => {});

    }


    /* =========================================================
       7 — ÉTAT DE LA VIDÉO PRINCIPALE
       ========================================================= */

    function mainVideoPlaying() {

        /*
         * Zoom.
         */

        if (videoCardMain) {

            videoCardMain.classList.add(
                "video-playing"
            );

        }


        /*
         * Sweep invisible.
         */

        if (edgeSweepVideo) {

            edgeSweepVideo.style.opacity = "0";

        }


        /*
         * Particules du haut arrêtées.
         */

        stopTopParticles();


        /*
         * Vidéo de fond :
         * arrêt exactement à 5 secondes.
         */

        stopBackgroundAtFiveSeconds();

    }


    function mainVideoPaused() {

        /*
         * Retour au zoom normal.
         */

        if (videoCardMain) {

            videoCardMain.classList.remove(
                "video-playing"
            );

        }


        /*
         * Sweep visible.
         */

        if (edgeSweepVideo) {

            edgeSweepVideo.style.opacity = "1";

        }


        /*
         * Particules du haut :
         * reprise de leur cycle complet.
         */

        startTopParticles();


        /*
         * Vidéo de fond :
         * reprise normale.
         */

        resumeBackgroundVideo();

    }


    /* =========================================================
       8 — ÉVÉNEMENTS VIDÉO PRINCIPALE
       ========================================================= */

    mainVideo.addEventListener(
        "play",
        mainVideoPlaying
    );


    mainVideo.addEventListener(
        "pause",
        mainVideoPaused
    );


    mainVideo.addEventListener(
        "ended",
        mainVideoPaused
    );


    /* =========================================================
       9 — ÉVÉNEMENTS VIDÉO DE FOND
       ========================================================= */

    if (backgroundVideo) {

        backgroundVideo.addEventListener(
            "timeupdate",
            handleBackgroundTimeUpdate
        );


        backgroundVideo.addEventListener(
            "ended",
            handleBackgroundEnded
        );

    }


    /* =========================================================
       10 — SCROLL

       Un seul listener de scroll pour les deux systèmes
       de lazy playback.
       ========================================================= */

    function handleScroll() {

        updateReelsPlayback();

        updateBottomParticlesPlayback();

    }


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    /*
     * Si le viewport change de taille :
     * - rotation du téléphone
     * - redimensionnement de la fenêtre
     * - changement de responsive

     * on recalcule immédiatement la visibilité.
     */

    window.addEventListener(
        "resize",
        handleScroll,
        {
            passive: true
        }
    );


    window.addEventListener(
        "orientationchange",
        handleScroll,
        {
            passive: true
        }
    );


    /* =========================================================
       11 — ÉTAT INITIAL
       ========================================================= */

    /*
     * Les reels commencent en pause.
     * updateReelsPlayback() détermine ensuite
     * lesquels sont réellement visibles.
     */

    reelVideos.forEach(video => {

        video.pause();

    });


    /*
     * Les particules du bas commencent en pause.
     * updateBottomParticlesPlayback() détermine ensuite
     * si leur zone est visible.
     */

    stopBottomParticles();


    /*
     * Les particules du haut sont visibles uniquement
     * si la vidéo principale est actuellement en pause.
     */

    if (mainVideo.paused) {

        mainVideoPaused();

    } else {

        mainVideoPlaying();

    }


    /*
     * État initial du lazy playback.
     */

    updateReelsPlayback();

    updateBottomParticlesPlayback();

});

