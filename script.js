document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const suggestionsList = document.getElementById('search-suggestions');
    const siteCards = document.querySelectorAll('.site-card');
    const backToTopButton = document.getElementById('back-to-top');
    const hamburger = document.querySelector('.hamburger');
    const navButtons = document.querySelector('.nav-buttons');
    const liveIndicator = document.querySelector('.live-indicator');
    const liveText = document.querySelector('.live-text');
    const liveStatus = document.querySelector('.live-status');

    // Vérification des éléments
    if (!searchBar || !searchButton || !suggestionsList) {
        console.error('Éléments de recherche manquants.');
        return;
    }
    if (!hamburger || !navButtons) {
        console.error('Éléments du menu hamburger manquants.');
        return;
    }
    if (!liveIndicator || !liveText || !liveStatus) {
        console.error('Éléments du statut live manquants.');
        return;
    }

    // Vérifier statut Twitch avec retry
    async function checkTwitchStatus(retryCount = 3, delay = 2000) {
        liveText.textContent = 'iProMx est Chargement...'; // État initial
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
                } else {
                    liveIndicator.classList.add('offline');
                    liveText.textContent = 'iProMx n’est pas en live';
                    liveText.classList.add('offline');
                    liveStatus.classList.remove('live');
                }
                return; // Succès
            } catch (error) {
                console.error(`Tentative ${i + 1}/${retryCount} - Erreur lors de la vérification du statut Twitch:`, error.message);
                if (i < retryCount - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        // Échec après toutes les tentatives
        console.error('Échec de la vérification du statut Twitch après plusieurs tentatives.');
        liveText.textContent = 'Erreur de statut';
        liveIndicator.classList.remove('live', 'offline');
        liveText.classList.remove('live', 'offline');
        liveStatus.classList.remove('live');
        liveIndicator.style.background = '#ff0000'; // Rouge pour erreur
    }

    checkTwitchStatus();
    setInterval(checkTwitchStatus, 60000); // Vérifier toutes les 60s

    // Menu hamburger
    hamburger.addEventListener('click', () => {
        navButtons.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-bars');
        hamburger.querySelector('i').classList.toggle('fa-times');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navButtons.contains(e.target)) {
            navButtons.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        }
    });

    navButtons.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            navButtons.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

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

    // Scroll vers carte
    const scrollToCard = (card) => {
        siteCards.forEach(c => c.classList.remove('highlight'));
        card.classList.add('highlight');

        const carouselContainer = card.closest('.carousel-container');
        const scrollPosition = card.offsetLeft - (carouselContainer.offsetWidth / 2) + (card.offsetWidth / 2);

        carouselContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        const section = card.closest('.categories');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Suggestions de recherche
    const showSuggestions = (searchTerm) => {
        suggestionsList.innerHTML = '';
        if (!searchTerm) {
            suggestionsList.classList.remove('show');
            return;
        }

        const matchingCards = Array.from(siteCards).filter(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const link = card.querySelector('a')?.href.toLowerCase() || '';
            return title.includes(searchTerm) || link.includes(searchTerm);
        });

        if (matchingCards.length === 0) {
            suggestionsList.classList.remove('show');
            return;
        }

        matchingCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent || 'Sans titre';
            const imgSrc = card.querySelector('img')?.src || '';

            const li = document.createElement('li');
            li.innerHTML = `
                ${imgSrc ? `<img src="${imgSrc}" alt="${title}">` : ''}
                <span>${title}</span>
            `;
            li.addEventListener('click', () => {
                scrollToCard(card);
                suggestionsList.classList.remove('show');
                searchBar.value = '';
            });

            suggestionsList.appendChild(li);
        });

        suggestionsList.classList.add('show');
    };

    searchBar.addEventListener('input', () => {
        showSuggestions(searchBar.value.toLowerCase());
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const firstMatch = Array.from(siteCards).find(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const link = card.querySelector('a')?.href.toLowerCase() || '';
            return title.includes(searchTerm) || link.includes(searchTerm);
        });

        if (firstMatch) {
            scrollToCard(firstMatch);
            suggestionsList.classList.remove('show');
            searchBar.value = '';
        } else {
            alert('Aucun résultat trouvé pour "' + searchTerm + '".');
        }
    });

    // Navigation clavier
    let selectedIndex = -1;
    searchBar.addEventListener('keydown', (e) => {
        const suggestions = suggestionsList.querySelectorAll('li');
        if (suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion(suggestions);
            suggestions[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelectedSuggestion(suggestions);
            if (selectedIndex >= 0) suggestions[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            suggestions[selectedIndex].click();
        } else if (e.key === 'Enter' && selectedIndex === -1) {
            e.preventDefault();
            const searchTerm = searchBar.value.toLowerCase();
            const firstMatch = Array.from(siteCards).find(card => {
                const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const link = card.querySelector('a')?.href.toLowerCase() || '';
                return title.includes(searchTerm) || link.includes(searchTerm);
            });

            if (firstMatch) {
                scrollToCard(firstMatch);
                suggestionsList.classList.remove('show');
                searchBar.value = '';
            } else {
                alert('Aucun résultat trouvé pour "' + searchTerm + '".');
            }
        }
    });

    function updateSelectedSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('selected', index === selectedIndex);
        });
    }

    // Cacher suggestions
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.classList.remove('show');
            selectedIndex = -1;
        }
    });

    // Bouton retour en haut
    window.addEventListener('scroll', () => {
        backToTopButton.style.display = window.scrollY > 200 ? 'block' : 'none';
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fade-in animation pour sections
    const sections = document.querySelectorAll('.hero, .chaos-live, .universe-section, .categories');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.2 }); // Augmenté pour déclencher plus tôt

    sections.forEach(section => {
        // Ne pas appliquer opacity: 0 pour .chaos-live
        if (!section.classList.contains('chaos-live')) {
            section.style.opacity = 0;
        }
        observer.observe(section);
    });
});