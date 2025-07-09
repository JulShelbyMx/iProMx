import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    const liveIndicator = document.querySelector('.live-indicator');
    const liveText = document.querySelector('.live-text');
    const liveStatus = document.querySelector('.live-status');
    const lastLive = document.querySelector('.last-live');

    // Vérification des éléments
    if (!liveIndicator || !liveText || !liveStatus || !lastLive) {
        console.error('Éléments du statut live manquants.');
        return;
    }

    // Vérifier statut Twitch avec retry
    async function checkTwitchStatus(retryCount = 3, delay = 2000) {
        liveText.textContent = 'iProMx est Chargement...';
        lastLive.textContent = 'Chargement du dernier live';
        liveIndicator.classList.remove('live', 'offline');
        liveText.classList.remove('live', 'offline');
        liveStatus.classList.remove('live');

        for (let i = 0; i < retryCount; i++) {
            try {
                const response = await fetch('/.netlify/functions/live-on-twitch');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
                }
                const data = await response.json();
                if (data.status === 'online') {
                    liveIndicator.classList.add('live');
                    liveText.textContent = 'iProMx est en live';
                    liveText.classList.add('live');
                    liveStatus.classList.add('live');
                    lastLive.textContent = 'Dernier live : À l’instant';
                } else {
                    liveIndicator.classList.add('offline');
                    liveText.textContent = 'iProMx n’est pas en live';
                    liveText.classList.add('offline');
                    liveStatus.classList.remove('live');
                    try {
                        const lastLiveResponse = await fetch('/.netlify/functions/live-on-twitch', {
                            headers: { 'X-Last-Live': 'true' }
                        });
                        if (!lastLiveResponse.ok) throw new Error('Erreur dernier live');
                        const lastLiveData = await lastLiveResponse.json();
                        lastLive.textContent = `Dernier live : ${lastLiveData.lastLive || 'Inconnu'} - ${lastLiveData.title || 'Inconnu'}`;
                    } catch (error) {
                        lastLive.textContent = 'Dernier live : Inconnu';
                    }
                }
                return;
            } catch (error) {
                console.error(`Tentative ${i + 1}/${retryCount} - Erreur lors de la vérification du statut Twitch:`, error.message);
                if (i < retryCount - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        console.error('Échec de la vérification du statut Twitch après plusieurs tentatives.');
        liveText.textContent = 'Erreur de statut';
        lastLive.textContent = 'Erreur lors du chargement du dernier live';
        liveIndicator.classList.remove('live', 'offline');
        liveText.classList.remove('live', 'offline');
        liveStatus.classList.remove('live');
        liveIndicator.style.background = '#ff0000';
    }

    checkTwitchStatus();
    setInterval(checkTwitchStatus, 60000);

    // Drag-to-scroll pour carrousels
    carousels.forEach((carouselContainer) => {
        const carousel = carouselContainer.querySelector('.carousel');
        if (!carousel) return;

        let isMouseDown = false;
        let startX, scrollLeft;

        carouselContainer.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - carouselContainer.offsetLeft;
            scrollLeft = carouselContainer.scrollLeft;
            carouselContainer.style.cursor = 'grabbing';
        });

        carouselContainer.addEventListener('mouseleave', () => {
            isMouseDown = false;
            carouselContainer.style.cursor = 'grab';
        });

        carouselContainer.addEventListener('mouseup', () => {
            isMouseDown = false;
            carouselContainer.style.cursor = 'grab';
        });

        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 3;
            carouselContainer.scrollLeft = scrollLeft - walk;
        });
    });

    // Clic sur cartes ou titres
    const siteCards = document.querySelectorAll('.site-card');
    siteCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const link = card.querySelector('a');
            if (link && !e.target.closest('.card-title')) {
                window.open(link.href, '_blank');
            }
        });

        const title = card.querySelector('.card-title');
        if (title) {
            title.addEventListener('click', () => {
                const link = card.querySelector('a');
                if (link) window.open(link.href, '_blank');
            });
        }
    });

    // GSAP Animations
    gsap.from(".hero-main-container", {
        scale: 1.45,
        duration: 2.8,
        ease: "power3.out",
    });

    gsap.to(".overlay", {
        opacity: 0,
        duration: 2.8,
        ease: "power3.out",
        onComplete: () => {
            document.body.style.overflow = "visible";
            document.body.style.overflowX = "hidden";
        },
    });

    const scrollIndicator = document.querySelector(".scroll-indicator");
    const bounceTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
    });

    bounceTimeline.to(scrollIndicator, {
        y: 20,
        opacity: 0.6,
        duration: 0.8,
        ease: "power1.inOut",
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            scrub: 2,
            pin: true,
            start: "top top",
            end: "+=2000",
            ease: "none",
        },
    });

    tl.set(".hero-main-container", {
        scale: 1.25,
    });

    tl.to(".hero-main-container", {
        scale: 1,
        duration: 1,
    });

    tl.to(
        ".hero-main-logo",
        {
            opacity: 0,
            duration: 0.5,
        },
        "<"
    );

    tl.to(
        ".hero-main-image",
        {
            opacity: 0,
            duration: 0.9,
        },
        "<+=0.5"
    );

    tl.to(
        ".hero-main-container",
        {
            backgroundSize: "28vh",
            duration: 1.5,
        },
        "<+=0.2"
    );

    tl.fromTo(
        ".hero-text",
        {
            backgroundImage: `radial-gradient(
                circle at 50% 200vh,
                rgba(255, 214, 135, 0) 0,
                rgba(157, 47, 106, 0.5) 90vh,
                rgba(157, 47, 106, 0.8) 120vh,
                rgba(32, 31, 66, 0) 150vh
            )`,
        },
        {
            backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 213, 133) 0vh,
                rgb(247, 77, 82) 50.011vh,
                rgb(145, 42, 105) 90.0183vh,
                rgba(32, 31, 66, 0) 140.599vh)`,
            duration: 3,
        },
        "<1.2"
    );

    tl.fromTo(
        ".hero-text-logo",
        {
            opacity: 0,
            maskImage: `radial-gradient(circle at 50% 145.835%, rgb(0, 0, 0) 36.11%, rgba(0, 0, 0, 0) 68.055%)`,
        },
        {
            opacity: 1,
            maskImage: `radial-gradient(
                circle at 50% 105.594%,
                rgb(0, 0, 0) 62.9372%,
                rgba(0, 0, 0, 0) 81.4686%
            )`,
            duration: 3,
        },
        "<0.2"
    );

    tl.set(".hero-main-container", { opacity: 0 });

    tl.to(".hero-1-container", { scale: 0.85, duration: 3 }, "<-=3");

    tl.set(
        ".hero-1-container",
        {
            maskImage: `radial-gradient(circle at 50% 16.1137vh, rgb(0, 0, 0) 96.1949vh, rgba(0, 0, 0, 0) 112.065vh)`,
        },
        "<+=2.1"
    );

    tl.to(
        ".hero-1-container",
        {
            maskImage: `radial-gradient(circle at 50% -40vh, rgb(0, 0, 0) 0vh, rgba(0, 0, 0, 0) 80vh)`,
            duration: 2,
        },
        "<+=0.2"
    );

    tl.to(
        ".hero-text-logo",
        {
            opacity: 0,
            duration: 2,
        },
        "<1.5"
    );

    tl.set(".hero-1-container", { opacity: 0 });
    tl.set(".hero-2-container", { visibility: "visible" });

    tl.to(".hero-2-container", { opacity: 1, duration: 3 }, "<+=0.2");

    tl.fromTo(
        ".hero-2-container",
        {
            backgroundImage: `radial-gradient(
                circle at 50% 200vh,
                rgba(255, 214, 135, 0) 0,
                rgba(157, 47, 106, 0.5) 90vh,
                rgba(157, 47, 106, 0.8) 120vh,
                rgba(32, 31, 66, 0) 150vh
            )`,
        },
        {
            backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 213, 133) 0vh,
                rgb(247, 77, 82) 50.011vh,
                rgb(145, 42, 105) 90.0183vh,
                rgba(32, 31, 66, 0) 140.599vh)`,
            duration: 3,
        },
        "<1.2"
    );

    // Fade-in animation pour sections
    const sections = document.querySelectorAll('.categories, .social-footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.style.opacity = 0;
        observer.observe(section);
    });
});