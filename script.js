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

    const REELS_TRIGGER_DISTANCE = 1100;
    const BACKGROUND_PARTICLES_TRIGGER_DISTANCE = 1300;

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
     * IMPORTANT :
     *
     * On ne pause PAS immédiatement les vidéos.
     * On leur laisse 1 seconde pour disparaître.
     *
     * Cela évite le saut d'image visible lorsque
     * currentTime est remis à zéro pendant le fondu.
     */

    if (particlesLoopA) {
        particlesLoopA.style.opacity = "0";
    }

    if (particlesLoopB) {
        particlesLoopB.style.opacity = "0";
    }


    /*
     * Une fois que les particules sont totalement
     * invisibles, seulement à ce moment-là :
     *
     * - pause
     * - retour à 0
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


    /*
     * Si une disparition progressive est encore
     * en cours, on l'annule immédiatement.
     */

    clearTimeout(topParticlesTimer);
    clearTimeout(topParticlesStopTimer);

    topParticlesTimer = null;
    topParticlesStopTimer = null;

    topParticlesRunning = true;


    /*
     * Maintenant que les vidéos sont invisibles,
     * il est possible de les remettre à zéro
     * sans provoquer de saut visible.
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
}/* =========================================================
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
     * La prochaine vidéo commence à 0 s
     * pendant que l'actuelle termine son cycle.
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
     * Après 1 seconde, l'ancienne vidéo est
     * totalement invisible.
     *
     * On peut alors la mettre en pause et la
     * remettre à 0 sans aucun à-coup visible.
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
     * Nouveau cycle :
     *
     * 6 secondes de lecture
     * + 1 seconde de crossfade
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
       
       Même système de crossfade que les particules du haut,
       mais leur lecture est contrôlée par le scroll.
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
 *
 * IMPORTANT :
 * aucune remise à zéro du currentTime.
 * aucune modification d'opacité.
 * aucun crossfade.
 *
 * On gèle simplement les deux vidéos dans leur état
 * actuel.
 */

function stopBottomParticles() {

    bottomParticlesRunning = false;

    clearTimeout(bottomParticlesTimer);
    clearTimeout(bottomParticlesStopTimer);

    bottomParticlesTimer = null;
    bottomParticlesStopTimer = null;


    /*
     * Les deux instances sont simplement mises en pause.
     */

    pauseBottomParticlesVideo(
        backgroundParticles1
    );

    pauseBottomParticlesVideo(
        backgroundParticles2
    );
}


/*
 * Reprise du lazy playback.
 *
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
     *
     * AUCUN currentTime = 0.
     */

    bottomParticlesActive
        .play()
        .catch(() => {});


    /*
     * Si la deuxième vidéo était déjà en train
     * de participer à un crossfade lorsque le
     * lazy playback s'est déclenché, elle reprend
     * également là où elle était.
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
     * On recalcule le temps restant avant le
     * prochain crossfade à partir du currentTime
     * réel de la vidéo active.
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
     * Préparation de la prochaine vidéo.
     *
     * On la remet au début uniquement ici,
     * au moment d'un véritable nouveau crossfade.
     *
     * Ce n'est PAS exécuté lors du lazy pause.
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
     * Crossfade sur 1 seconde.
     */

    requestAnimationFrame(() => {

        if (!bottomParticlesRunning) {
            return;
        }

        current.style.opacity = "0";

        next.style.opacity = "1";
    });


    /*
     * Lorsque le crossfade est terminé,
     * l'ancienne vidéo peut être arrêtée et
     * remise à zéro.
     *
     * Elle est invisible à ce moment-là.
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
       3 — LAZY PLAYBACK DES REELS
       
       Les reels restent en pause tant que la distance
       avec le bas de la page est supérieure à 1080 px.
       ========================================================= */

    let reelsArePlaying = false;


    function updateReelsPlayback() {

        const distanceFromBottom =
            document.documentElement.scrollHeight -
            (
                window.scrollY +
                window.innerHeight
            );


        const shouldPlay =
            distanceFromBottom <=
            REELS_TRIGGER_DISTANCE;


        if (shouldPlay === reelsArePlaying) {
            return;
        }


        reelsArePlaying = shouldPlay;


        reelVideos.forEach(video => {

            if (shouldPlay) {

                video
                    .play()
                    .catch(() => {});

            } else {

                video.pause();
            }

        });
    }


    /* =========================================================
       4 — LAZY PLAYBACK DES PARTICULES DU BAS
       
       Au-dessus de 1300 px du bas :
       arrêt complet.

       À 1300 px ou moins :
       lecture + crossfade.
       ========================================================= */

    let bottomParticlesVisibilityState =
        false;


    function updateBottomParticlesPlayback() {

        const distanceFromBottom =
            document.documentElement.scrollHeight -
            (
                window.scrollY +
                window.innerHeight
            );


        const shouldPlay =
            distanceFromBottom <=
            BACKGROUND_PARTICLES_TRIGGER_DISTANCE;


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
   VIDÉO DE FOND — ARRÊT FLUIDE À 5 SECONDES
   ========================================================= */

let backgroundStopRequested = false;

let backgroundStopCompleted = false;

let backgroundWaitingForNextLoop = false;


/*
 * Demande d'arrêt à 5 secondes.
 *
 * Deux cas :
 *
 * 1. La vidéo est entre 0 et 5 s :
 *    → elle continue jusqu'à 5 s.
 *
 * 2. La vidéo est entre 5 et 10 s :
 *    → elle continue jusqu'à la fin,
 *      revient à 0,
 *      puis continue jusqu'à 5 s.
 */

function stopBackgroundAtFiveSeconds() {

    if (!backgroundVideo) {
        return;
    }


    backgroundStopRequested = true;

    backgroundStopCompleted = false;


    /*
     * On désactive temporairement la boucle native.
     *
     * Cela permet à "ended" de nous signaler
     * précisément le passage de 10 s → 0 s.
     */

    backgroundVideo.loop = false;


    /*
     * CAS 1 :
     * La vidéo est actuellement entre 0 et 5 secondes.
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
     *
     * SURTOUT :
     * on ne la met PAS en pause ici.
     *
     * On attend sa fin naturelle.
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


    /*
     * Si nous sommes encore dans la boucle actuelle
     * et que nous sommes sous 5 secondes :
     *
     * → arrêt naturel à 5 secondes.
     */

    if (
        !backgroundWaitingForNextLoop &&
        backgroundVideo.currentTime >=
        BACKGROUND_STOP_TIME
    ) {

        backgroundVideo.pause();

        backgroundStopCompleted = true;

        return;
    }


    /*
     * Si backgroundWaitingForNextLoop === true,
     * on NE FAIT RIEN ici.
     *
     * La vidéo doit continuer jusqu'à 10 secondes.
     */
}


/*
 * La vidéo de fond vient d'atteindre 10 secondes.
 */

function handleBackgroundEnded() {

    if (!backgroundVideo) {
        return;
    }


    /*
     * Aucun arrêt demandé :
     *
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
     * Nous étions dans la deuxième partie
     * de la boucle (5 → 10 s).
     *
     * On vient donc d'arriver naturellement
     * à la fin de la boucle.
     *
     * On repart à 0 et on attend maintenant
     * les 5 secondes de la nouvelle boucle.
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
     * Sécurité :
     * si l'événement "ended" intervient alors
     * qu'on attendait simplement 5 secondes,
     * on repart normalement.
     */

    backgroundVideo.currentTime = 0;

    backgroundVideo
        .play()
        .catch(() => {});
}


/*
 * La vidéo principale est remise en pause.
 *
 * Toute demande d'arrêt à 5 secondes est annulée.
 *
 * Le background reprend exactement à sa position
 * actuelle.
 */

function resumeBackgroundVideo() {

    if (!backgroundVideo) {
        return;
    }


    /*
     * Annulation complète de la logique
     * d'arrêt à 5 secondes.
     */

    backgroundStopRequested = false;

    backgroundStopCompleted = false;

    backgroundWaitingForNextLoop = false;


    /*
     * Retour à la boucle normale.
     */

    backgroundVideo.loop = true;


    /*
     * Aucun changement de currentTime.
     *
     * La vidéo reprend exactement là où elle
     * se trouve.
     */

    backgroundVideo
        .play()
        .catch(() => {});
}


    /* =========================================================
       6 — ÉTAT DE LA VIDÉO PRINCIPALE
       
       C'est le seul endroit qui orchestre :
       - zoom de la carte
       - sweep
       - particules du haut
       - vidéo de fond
       ========================================================= */

    function mainVideoPlaying() {

        /*
         * Zoom identique au hover CSS.
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
         * Particules du haut invisibles
         * et arrêtées.
         */

        stopTopParticles();


        /*
         * Vidéo de fond :
         * demande d'arrêt exactement à 5 s.
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
         * elles reprennent leur cycle complet.
         */

        startTopParticles();


        /*
         * Vidéo de fond :
         * elle reprend normalement.
         */

        resumeBackgroundVideo();
    }


    /* =========================================================
       7 — ÉVÉNEMENTS VIDÉO PRINCIPALE
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
       8 — ÉVÉNEMENTS VIDÉO DE FOND
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
       9 — SCROLL
       
       Un seul listener de scroll.
       Il met à jour les deux systèmes de lazy playback.
       ========================================================= */

    function handleScroll() {

        updateReelsPlayback();

        updateBottomParticlesPlayback();
    }


    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );


    /* =========================================================
       10 — ÉTAT INITIAL
       ========================================================= */

    /*
     * Les reels ne doivent pas jouer au chargement.
     */

    reelVideos.forEach(video => {
        video.pause();
    });


    /*
     * Les particules du bas ne doivent pas jouer
     * au chargement si elles sont hors seuil.
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
     * État initial des reels et des particules du bas.
     */

    updateReelsPlayback();

    updateBottomParticlesPlayback();

});