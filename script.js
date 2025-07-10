document.addEventListener('DOMContentLoaded', () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Top-bar
    const btnBurger = document.querySelector('#burger-menu');
    const nav = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('a[href^="#"]');

    btnBurger.addEventListener('click', () => {
        nav.classList.toggle('active');
        btnBurger.classList.toggle('bx-x');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            nav.classList.remove('active');
            btnBurger.classList.remove('bx-x');
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('scroll', () => {
        nav.classList.remove('active');
        btnBurger.classList.remove('bx-x');
    });

    // Twitch Status
    const liveIndicator = document.querySelector('.live-indicator');
    const liveText = document.querySelector('.live-text');
    const liveStatus = document.querySelector('.live-status');
    const lastLive = document.querySelector('.last-live');

    if (!liveIndicator || !liveText || !liveStatus || !lastLive) {
        console.error('Éléments du statut live manquants.');
        return;
    }

    async function checkTwitchStatus(retryCount = 3, delay = 2000) {
        liveText.textContent = 'iProMx est Chargement...';
        lastLive.textContent = 'Chargement du dernier live';
        liveIndicator.classList.remove('live', 'offline');
        liveText.classList.remove('live', 'offline');
        liveStatus.classList.remove('live', 'active');

        for (let i = 0; i < retryCount; i++) {
            try {
                const response = await fetch('/.netlify/functions/live-on-twitch');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}, Details: ${await response.text()}`);
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
                    liveStatus.classList.remove('live', 'active');
                    try {
                        const lastLiveResponse = await fetch('/.netlify/functions/live-on-twitch', {
                            headers: { 'X-Last-Live': 'true' }
                        });
                        if (!lastLiveResponse.ok) throw new Error('Erreur dernier live');
                        const lastLiveData = await lastLiveResponse.json();
                        lastLive.textContent = `Dernier live : ${lastLiveData.lastLive || 'Inconnu'} - ${lastLiveData.title || 'Inconnu'}`;
                    } catch (error) {
                        console.error('Erreur dernier live:', error.message);
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
        liveStatus.classList.remove('live', 'active');
        liveIndicator.style.background = '#ff0000';
    }

    checkTwitchStatus();
    setInterval(checkTwitchStatus, 60000);

    // GSAP Animations (GTA VI ultime)
    const isMobile = window.innerWidth <= 768;
    const durations = {
        zoom: isMobile ? 0.6 : 0.4, // Plus lent sur mobile
        dezoom: isMobile ? 2 : 1.5,
        fade: isMobile ? 0.6 : 0.4,
        pause: isMobile ? 1.2 : 1,
        status: isMobile ? 0.6 : 0.4,
    };

    gsap.from(".hero-main-container", {
        scale: 1.7,
        duration: 3.5,
        ease: "power4.out",
    });

    gsap.to(".overlay", {
        opacity: 0,
        duration: 3.5,
        ease: "power4.out",
        onComplete: () => {
            document.body.style.overflow = "visible";
            document.body.style.overflowX = "hidden";
        },
    });

    const scrollIndicator = document.querySelector(".scroll-indicator");
    gsap.timeline({
        repeat: -1,
        yoyo: true,
    }).to(scrollIndicator, {
        y: 20,
        opacity: 0.6,
        duration: 0.8,
        ease: "power1.inOut",
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=2000", // Compact pour éviter scroll mort
            ease: "none",
        },
    });

    // Étape 1 : Grande image + texte "iProMx" TRÈS haut, blanc pur
    tl.set(".hero-main-image", { opacity: 1, zIndex: 2 });
    tl.set(".hero-black-background", { opacity: 0, zIndex: 3, transform: "scale(30)" });
    tl.set(".hero-text-logo-container", { opacity: 1, zIndex: 4, y: 0 });
    tl.set(".hero-logo", { opacity: 0, scale: 1.4 });
    tl.set(".hero-text", { className: "hero-text" });
    tl.set(".hero-1-container", { opacity: 1, display: 'flex' });
    tl.set(".status", { opacity: 0 });

    // Étape 2 : Texte s’agrandit à mort (reste centré)
    tl.to(".hero-text-logo-container", {
        scale: 30, // Agrandissement max
        opacity: 0,
        duration: durations.zoom,
        ease: "power4.out",
    });

    // Étape 3 : Décalage invisible + fond noir + texte transparent dézoome
    tl.set(".hero-text-logo-container", { y: 500 }); // Décalage invisible
    tl.set(".hero-text", { className: "hero-text transparent" });
    tl.to(".hero-text-logo-container", {
        y: 0, // Recentré
        scale: 1, // Dézoom
        opacity: 1,
        duration: durations.dezoom,
        ease: "power4.out",
    }, "<");
    tl.to(".hero-black-background", {
        opacity: 1,
        transform: "scale(1)",
        duration: durations.dezoom,
        ease: "power4.out",
    }, "<");

    // Étape 4 : Image fade out, texte blanc pur, descend, logo pop SYNCHRO
    tl.to(".hero-main-image", {
        opacity: 0,
        duration: durations.fade,
        ease: "power4.out",
    });
    tl.set(".hero-text", { className: "hero-text" });
    tl.to(".hero-text-logo-container", {
        y: 100,
        duration: durations.fade,
        ease: "power4.out",
    }, "<");
    tl.to(".hero-logo", {
        opacity: 1,
        scale: 1,
        duration: durations.fade,
        ease: "power4.out",
    }, "<");

    // Étape 5 : Pause
    tl.to({}, { duration: durations.pause });

    // Étape 6 : Statut
    tl.to(".status", {
        opacity: 1,
        duration: durations.status,
        ease: "power4.out",
    });

    // AOS Init
    AOS.init({
        duration: isMobile ? 1800 : 1200, // Plus lent sur mobile
        easing: 'ease-out',
        once: true,
    });

    // Swiper Init
    new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: isMobile ? 1200 : 800, // Plus lent sur mobile
        effect: 'slide',
        slidesPerView: 1,
        spaceBetween: 10,
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });

    // Fade-in sections
    const sections = document.querySelectorAll('.status, .socials, .characters');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        section.style.opacity = 0;
        observer.observe(section);
    });
});