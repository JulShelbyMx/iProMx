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
    const liveImage = document.querySelector('.live-status-image');
    liveText.textContent = 'iProMx est Chargement...';
    lastLive.textContent = 'Chargement du dernier live';
    liveIndicator.classList.remove('live', 'offline');
    liveText.classList.remove('live', 'offline');
    liveStatus.classList.remove('live', 'active');
    liveImage.classList.remove('active'); // Cacher l'image pendant le chargement
    liveImage.src = ''; // Réinitialiser la source

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
                liveImage.src = '/images/ipromxlive-on.gif'; // Image pour statut en live
                liveImage.classList.add('active');
            } else {
                liveIndicator.classList.add('offline');
                liveText.textContent = 'iProMx n’est pas en live';
                liveText.classList.add('offline');
                liveStatus.classList.remove('live', 'active');
                liveImage.src = '/images/ipromxlive-off.webp'; // Image pour statut hors ligne
                liveImage.classList.add('active');
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
    liveImage.src = '/images/error.png'; // Image pour erreur
    liveImage.classList.add('active');
}

    checkTwitchStatus();
    setInterval(checkTwitchStatus, 60000);

    // GSAP Animations (GTA VI cinématique)
    const isMobile = window.innerWidth <= 768;
    const durations = {
        center: isMobile ? 0.5 : 0.3, // Recentrer
        zoom: isMobile ? 1.5 : 1, // Agrandissement
        dezoom: isMobile ? 4 : 3, // Rétrécissement
        fade: isMobile ? 1 : 0.8,
        pause: isMobile ? 2 : 1.5,
        status: isMobile ? 1 : 0.8,
    };

    // Image plein écran, pas de zoom
    gsap.set(".hero-main-container", {
        scale: 1,
        clearProps: "all", // Reset props
        onComplete: () => console.log('Hero-main-image plein écran, no crop')
    });

    gsap.set(".hero-main-image", {
        scale: 1,
        transform: "none",
        onComplete: () => console.log('Hero-main-image initialisée')
    });

    gsap.to(".overlay", {
        opacity: 0,
        duration: 4,
        ease: "power3.out",
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
        duration: 1,
        ease: "power1.inOut",
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=1500",
            ease: "none",
        },
    });

    // Étape 1 : Grande image + texte "iProMx" à gauche, gros
    tl.set(".hero-main-image", { 
        opacity: 1, 
        zIndex: 2,
        scale: 1,
        transform: "none",
        onComplete: () => console.log('Hero-main-image chargée')
    });
    tl.set(".hero-black-background", { 
        opacity: 0, 
        zIndex: 3, 
        transform: "scale(30)" 
    });
    tl.set(".hero-text-logo-container", { 
        opacity: 1, 
        zIndex: 4, 
        y: 0, 
        left: isMobile ? "10%" : "20%", 
        transform: isMobile ? "translate(-10%, -50%)" : "translate(-20%, -50%)",
        clearProps: "left,transform", // Reset avant
        onComplete: () => console.log('Texte initial à gauche')
    });
    tl.set(".hero-logo", { 
        opacity: 0, 
        scale: 1.4 
    });
    tl.set(".hero-text", { 
        className: "hero-text" 
    });
    tl.set(".hero-1-container", { 
        opacity: 1, 
        display: 'flex' 
    });
    tl.set(".status", { 
        opacity: 0 
    });

    // Étape 1.5 : Recentrer avant zoom
    tl.to(".hero-text-logo-container", {
        left: "42%",
        transform: "translate(-50%, -50%)",
        duration: durations.center,
        ease: "power3.out",
        onStart: () => console.log('Début recentrage texte'),
        onUpdate: () => console.log('Recentrer texte:', document.querySelector('.hero-text-logo-container').style.left),
        onComplete: () => console.log('Texte centré avant zoom')
    });

    // Étape 2 : Zoom (agrandissement à mort)
    tl.to(".hero-text-logo-container", {
        scale: 30,
        opacity: 0,
        duration: durations.zoom,
        ease: "power3.out",
        delay: 0.2,
        onStart: () => console.log('Début zoom'),
        onComplete: () => console.log('Zoom terminé')
    });

    // Étape 3 : Décalage invisible + fond noir + texte transparent dézoom (rétrécissement)
    tl.set(".hero-text-logo-container", { 
        y: 500, 
        left: "42%", 
        transform: "translate(-50%, -50%)" 
    });
    tl.set(".hero-text", { 
        className: "hero-text transparent" 
    });
    tl.to(".hero-text-logo-container", {
        y: 0,
        scale: 1,
        opacity: 1,
        left: "42%",
        top:"50%",
        transform: "translate(-50%, -50%)",
        duration: durations.dezoom,
        ease: "power3.out",
        onStart: () => console.log('Début dézoom'),
        onUpdate: () => console.log('Dézoom:', document.querySelector('.hero-text-logo-container').style.left),
        onComplete: () => console.log('Hero-text-logo-container centré après dézoom')
    }, "<");
    tl.to(".hero-black-background", {
        opacity: 1,
        transform: "scale(1)",
        duration: durations.dezoom,
        ease: "power3.out",
    }, "<");

    // Étape 4 : Image fade out, texte blanc pur, descend, logo pop SYNCHRO
    tl.to(".hero-main-image", {
        opacity: 0,
        duration: durations.fade,
        ease: "power3.out",
    });
    tl.set(".hero-text", { 
        className: "hero-text" 
    });
    tl.to(".hero-text-logo-container", {
        y: 100,
        duration: durations.fade,
        ease: "power3.out",
    }, "<");
    tl.to(".hero-logo", {
        opacity: 1,
        scale: 1,
        duration: durations.fade,
        ease: "power3.out",
    }, "<");

    // Étape 5 : Pause
    tl.to({}, { duration: durations.pause });

    // Étape 6 : Statut
    tl.to(".status", {
        opacity: 1,
        duration: durations.status,
        ease: "power3.out",
    });

    // AOS Init
    AOS.init({
        duration: isMobile ? 2000 : 1500,
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
        speed: isMobile ? 1500 : 1000,
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