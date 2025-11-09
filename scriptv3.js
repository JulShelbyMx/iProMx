// ==========================================
// SUPABASE CONFIG
// ==========================================
const SUPABASE_URL = 'https://wijodfkyfwdodwsqnmrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpam9kZmt5Zndkb2R3c3FubXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzY1MjgsImV4cCI6MjA3NzUxMjUyOH0.2ontW2JrSq1udQL9heCwErTb3e2fwZbejYYpfJYDyss';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let currentUser = null;
let isGuest = false;
let player = null;
let currentVideoData = null;
window.userHistory = [];
window.userMyList = [];

// ==========================================
// DONNÉES UNIVERS
// ==========================================
const universesData = {
    flash: {
        name: 'Famille Flash',
        description: 'La saga légendaire qui traverse les générations',
        image: 'images/flash-universe.jpg',
        characters: [
            { 
                id: 'david-flash', 
                name: 'David Flash', 
                description: 'Le fondateur légendaire de la famille Flash. Un homme au passé trouble qui a bâti un empire dans l\'ombre de Los Santos. Sa détermination et son charisme en ont fait une figure respectée et crainte du milieu criminel.', 
                image: 'images/david_flash.jpg', 
                seasons: { 
                    'Saison 1': [
                        { num: 1, title: 'POUR LA PREMIÈRE FOIS JE TESTE GTAV RP', videoId: 'z_H0tafxHAc' },
                        { num: 2, title: 'LA FEMME DE MA VIE OU LE GANG', videoId: 'Eoo3Vpelub4' }
                    ], 
                    'Saison 2': [
                        { num: 1, title: 'LA FEMME DE MA VIE OU LE GANG', videoId: 'Eoo3Vpelub4' }
                    ] 
                } 
            },
            { id: 'john-flash', name: 'John Flash', description: 'Le successeur ambitieux, prêt à tout pour faire honneur au nom des Flash et poursuivre l\'héritage familial.', image: 'images/john_flash.jpg', seasons: {} },
            { id: 'ken-flash', name: 'Ken Flash', description: 'Le stratège de la famille, celui qui pense toujours trois coups à l\'avance et anticipe chaque mouvement des adversaires.', image: 'images/ken_flash.jpg', seasons: {} },
            { id: 'aaron-flash', name: 'Aaron Flash', description: 'Le combattant, le muscle de la famille Flash. Sa force brute et son courage en font un allié précieux.', image: 'images/aaron_flash.jpg', seasons: {} },
            { id: 'david-jr-flash', name: 'David Jr Flash', description: 'La nouvelle génération qui doit prouver sa valeur et montrer qu\'il est digne du nom qu\'il porte.', image: 'images/david_jr_flash.jpg', seasons: {} },
            { id: 'damon-flash', name: 'Damon Flash', description: 'Le mystérieux membre dont personne ne connaît vraiment les intentions. Toujours dans l\'ombre, il tire les ficelles.', image: 'images/damon_flash.jpg', seasons: {} },
            { id: 'kayton-flash', name: 'Kayton Flash', description: 'Le tacticien qui planifie chaque opération dans les moindres détails. Rien n\'est laissé au hasard.', image: 'images/kayton_flash.jpg', seasons: {} },
            { id: 'adrian-flash', name: 'Adrian Flash', description: 'Le loyal, celui sur qui on peut toujours compter. Sa fidélité à la famille est sans faille.', image: 'images/adrian_flash.jpg', seasons: {} },
            { id: 'ned-flash', name: 'Ned/Eden/Eddy Flash', description: 'Les multiples facettes d\'une même personne. Chaque identité a sa propre personnalité et ses propres objectifs.', image: 'images/ned_flash.jpg', seasons: {} },
            { id: 'manda-flash', name: 'Manda Flash', description: 'La protectrice de la famille, celle qui veille sur tous. Son dévouement est sans limite.', image: 'images/manda_flash.jpg', seasons: {} }
        ]
    },
    shade: { name: 'Famille Shade', description: 'Mystère et ombres', image: 'images/shade-universe.jpg', characters: [{ id: 'sylvester-shade', name: 'Sylvester (Silver) Shade', description: 'L\'ombre insaisissable qui opère dans le noir le plus total. Personne ne connaît son vrai visage.', image: 'images/sylvester_shade.jpg', seasons: {} }] },
    winters: { name: 'Famille Winters', description: 'Froid comme l\'hiver', image: 'images/winters-universe.jpg', characters: [{ id: 'oliver-winters', name: 'Oliver Winters', description: 'Le leader froid et calculateur de la famille Winters. Son sang-froid légendaire fait trembler ses ennemis.', image: 'images/oliver_winters.jpg', seasons: {} }, { id: 'jake-winters', name: 'Jake Winters', description: 'Le second, toujours prêt à prendre la relève. Loyal et dévoué à son frère Oliver.', image: 'images/jake_winters.jpg', seasons: {} }] },
    escobar: { name: 'Famille Escobar', description: 'Danger incarné', image: 'images/escobar-universe.jpg', characters: [{ id: 'tom-escobar', name: 'Tom Escobar', description: 'Le chef impitoyable qui règne par la peur. Sa réputation le précède partout où il va.', image: 'images/tom_escobar.jpg', seasons: {} }] },
    kingsley: { name: 'Famille Kingsley', description: 'La royauté criminelle', image: 'images/kingsley-universe.jpg', characters: [{ id: 'zack-kingsley', name: 'Zack Kingsley', description: 'Le roi autoproclamé du crime organisé. Son empire s\'étend sur tout Los Santos.', image: 'images/zack_kingsley.jpg', seasons: {} }] }
};

const socialNetworks = [
    { name: 'YouTube Principal', icon: 'fab fa-youtube', info: '~1.4M abonnés', url: 'https://www.youtube.com/@iProMx', image: 'images/youtube-main.jpg' },
    { name: 'YouTube Secondaire', icon: 'fab fa-youtube', info: 'Bonus', url: 'https://www.youtube.com/@iProMx2', image: 'images/youtube-second.jpg' },
    { name: 'Twitch', icon: 'fab fa-twitch', info: '~271K followers', url: 'https://www.twitch.tv/ipromx', image: 'images/twitch.jpg' },
    { name: 'Discord', icon: 'fab fa-discord', info: 'Communauté', url: 'https://discord.gg/ipromx', image: 'images/discord.jpg' },
    { name: 'TikTok', icon: 'fab fa-tiktok', info: 'Viral', url: 'https://www.tiktok.com/@ipromx__', image: 'images/tiktok.jpg' },
    { name: 'Twitter/X', icon: 'fab fa-twitter', info: 'Updates', url: 'https://x.com/ipromx', image: 'images/twitter.jpg' },
    { name: 'Boutique', icon: 'fas fa-shopping-bag', info: 'Merch', url: 'https://shop.ipromx.com', image: 'images/shop.jpg' },
    { name: 'Tebex', icon: 'fas fa-map-marked-alt', info: 'FiveM', url: 'https://tebex.ipromx.com', image: 'images/tebex.jpg' }
];

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user && localStorage.getItem('ipromx_guest') !== 'true') {
        window.location.href = 'connection.html';
        return;
    }

    if (localStorage.getItem('ipromx_guest') === 'true') {
        isGuest = true;
        currentUser = { id: 'guest', user_metadata: { full_name: 'Invité' } };
        loadLocalData();
        showGuestModal();
    } else if (user) {
        currentUser = user;
        await loadUserData(user);
    }

    showMainContent();
    setupEventListeners();
    displayUniverses();
    displayPopularCarousel();
    displaySocialNetworks();
    checkLiveStatus();
    setupScrollEffects();
    displayHistory();
    displayMyList();
    initFalconEye();
});

// ==========================================
// MODAL INVITÉ
// ==========================================
function showGuestModal() {
    const modal = document.getElementById('guestModal');
    modal.classList.add('active');
}

function closeGuestModal() {
    const modal = document.getElementById('guestModal');
    modal.classList.remove('active');
}

// ==========================================
// DONNÉES
// ==========================================
async function loadUserData(user) {
    const { data } = await supabaseClient
        .from('users_data')
        .select('history, my_list')
        .eq('discord_id', user.id)
        .single();

    if (data) {
        window.userHistory = data.history || [];
        window.userMyList = data.my_list || [];
    } else {
        await supabaseClient.from('users_data').insert({ discord_id: user.id });
        window.userHistory = [];
        window.userMyList = [];
    }
}

function loadLocalData() {
    window.userHistory = JSON.parse(localStorage.getItem('ipromxHistory') || '[]');
    window.userMyList = JSON.parse(localStorage.getItem('ipromxMyList') || '[]');
}

async function saveData() {
    if (isGuest) {
        localStorage.setItem('ipromxHistory', JSON.stringify(window.userHistory));
        localStorage.setItem('ipromxMyList', JSON.stringify(window.userMyList));
    } else {
        await supabaseClient
            .from('users_data')
            .update({ history: window.userHistory, my_list: window.userMyList })
            .eq('discord_id', currentUser.id);
    }
}

// ==========================================
// AFFICHAGE UTILISATEUR
// ==========================================
function showMainContent() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('btnLogout');

    if (isGuest) {
        userName.textContent = 'Invité';
        userAvatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjAwMDAiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFpNMjAgMjJDMTYuMzM1OCAyMiAxMyAyMy4zNDMxIDEzIDI1VjI4SDI3VjI1QzI3IDIzLjM0MzEgMjMuNjY0MiAyMiAyMCAyMloiIGZpbGw9IiNGRkQ3MDAiLz4KPC9zdmc+';
        logoutBtn.style.display = 'none';
    } else {
        userName.textContent = currentUser.user_metadata.full_name || 'Utilisateur';
        userAvatar.src = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.user_metadata.avatar}.png`;
        logoutBtn.style.display = 'block';
    }

    userInfo.style.display = 'flex';
}

document.getElementById('btnLogout')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('ipromx_guest');
    window.location.href = 'connection.html';
});

// ==========================================
// ŒIL DU FAUCON
// ==========================================
function initFalconEye() {
    const pupils = document.querySelectorAll('.pupil-large');
    
    document.addEventListener('mousemove', (e) => {
        pupils.forEach(pupil => {
            const eye = pupil.closest('.eye-inner-large');
            if (!eye) return;
            
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(eyeRect.width * 0.15, 6);
            
            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    });
}

// ==========================================
// AFFICHAGE UNIVERS
// ==========================================
function displayUniverses() {
    const grid = document.getElementById('universesGrid');
    const order = ['zack-kingsley', 'jake-winters', 'ned-flash', 'manda-flash', 'adrian-flash', 'oliver-winters'];
    const allCharacters = [];
    
    for (const [familyId, family] of Object.entries(universesData)) {
        family.characters.forEach(char => allCharacters.push({ ...char, familyId, family }));
    }
    
    const ordered = order.map(id => allCharacters.find(c => c.id === id)).filter(Boolean);
    const remaining = allCharacters.filter(c => !order.includes(c.id));
    const finalList = [...ordered, ...remaining];

    grid.innerHTML = finalList.map(char => `
        <div class="card-cr" data-family="${char.familyId}" onclick="openUniverse('${char.familyId}', '${char.id}')">
            <div class="card-image-cr" style="background-image: url('${char.image}')"></div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${char.name}</h3>
                <p class="card-meta-cr">${char.family.name}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// MODAL PERSONNAGE
// ==========================================
function openUniverse(familyId, charId = null) {
    const family = universesData[familyId];
    const character = family.characters.find(c => c.id === charId) || family.characters[0];

    document.getElementById('seriesHero').style.backgroundImage = `url('${character.image}')`;
    document.getElementById('seriesTitle').textContent = character.name;
    document.getElementById('seriesDescription').textContent = character.description;

    const addBtn = document.getElementById('addToListBtn');
    const inList = window.userMyList.some(i => i.charId === character.id);
    addBtn.innerHTML = inList 
        ? '<i class="fas fa-check"></i> Dans Ma Liste' 
        : '<i class="fas fa-plus"></i> Ajouter à Ma Liste';
    addBtn.onclick = () => toggleMyList(familyId, character.id);

    const startBtn = document.getElementById('startBtn');
    const seasons = Object.keys(character.seasons);
    if (seasons.length > 0 && character.seasons[seasons[0]].length > 0) {
        const firstEpisode = character.seasons[seasons[0]][0];
        startBtn.onclick = () => {
            closeSeriesModal();
            playEpisode(firstEpisode.videoId, character, familyId, seasons[0], 0);
        };
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
    } else {
        startBtn.onclick = null;
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
    }

    const seasonTabs = document.getElementById('seasonTabs');
    const episodesList = document.getElementById('episodesListDetailed');

    if (seasons.length > 0) {
        seasonTabs.innerHTML = seasons.map((s, i) => `
            <button class="season-tab ${i === 0 ? 'active' : ''}" onclick="showSeason('${familyId}', '${character.id}', '${s}', this)">
                ${s}
            </button>
        `).join('');
        showSeason(familyId, character.id, seasons[0]);
    } else {
        seasonTabs.innerHTML = '';
        episodesList.innerHTML = '<p class="no-episodes">Aucun épisode disponible pour le moment.</p>';
    }

    document.getElementById('seriesModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSeason(familyId, charId, season, btn = null) {
    document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const character = universesData[familyId].characters.find(c => c.id === charId);
    const episodes = character.seasons[season] || [];

    document.getElementById('episodesListDetailed').innerHTML = episodes.map((ep, index) => `
        <div class="episode-item-cr" onclick="playEpisode('${ep.videoId}', ${JSON.stringify(character).replace(/"/g, '&quot;')}, '${familyId}', '${season}', ${index}); closeSeriesModal();">
            <div class="episode-thumb" style="background-image: url('https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg')"></div>
            <div class="episode-info">
                <h4>Épisode ${ep.num}</h4>
                <p>${ep.title}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// LECTEUR YOUTUBE API
// ==========================================
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
}

function playEpisode(videoId, character, familyId, season, episodeIndex) {
    currentVideoData = { videoId, character, familyId, season, episodeIndex };
    
    const modal = document.getElementById('playerModal');
    const episodes = character.seasons[season];
    const currentEp = episodes[episodeIndex];
    
    document.getElementById('playerTitle').textContent = character.name;
    document.getElementById('playerEpisode').textContent = `${season} - Épisode ${currentEp.num} : ${currentEp.title}`;
    
    document.getElementById('characterAvatar').src = character.image;
    document.getElementById('characterName').textContent = character.name;
    document.getElementById('characterShortDesc').textContent = universesData[familyId].name;
    document.getElementById('characterFullDesc').textContent = character.description;

    const savedTime = getSavedTime(videoId);
    
    if (player) {
        player.destroy();
    }
    
    player = new YT.Player('youtubePlayerContainer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            start: savedTime,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            fs: 1,
            cc_load_policy: 0,
            iv_load_policy: 3,
            autohide: 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });

    setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = Math.floor(player.getCurrentTime());
            saveProgressTime(videoId, currentTime);
        }
    }, 5000);

    displaySuggestions(character, season, episodeIndex, familyId);

    const inList = window.userMyList.some(i => i.charId === character.id);
    const addListBtn = document.getElementById('addListBtnPlayer');
    addListBtn.innerHTML = inList 
        ? '<i class="fas fa-check"></i><span>Dans Ma Liste</span>' 
        : '<i class="fas fa-plus"></i><span>Ma Liste</span>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    addToHistory(character.name, `${season} - Ép. ${currentEp.num}`, videoId, character.image);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED && currentVideoData) {
        const { character, familyId, season, episodeIndex } = currentVideoData;
        const episodes = character.seasons[season];
        if (episodeIndex + 1 < episodes.length) {
            const nextEp = episodes[episodeIndex + 1];
            playEpisode(nextEp.videoId, character, familyId, season, episodeIndex + 1);
        }
    }
}

function displaySuggestions(character, season, currentIndex, familyId) {
    const episodes = character.seasons[season] || [];
    const suggestionsList = document.getElementById('suggestionsList');
    
    const suggestions = [];
    
    if (currentIndex > 0) {
        suggestions.push({ ...episodes[currentIndex - 1], index: currentIndex - 1 });
    }
    
    for (let i = currentIndex + 1; i < Math.min(currentIndex + 6, episodes.length); i++) {
        suggestions.push({ ...episodes[i], index: i });
    }

    suggestionsList.innerHTML = suggestions.map(ep => `
        <div class="suggestion-item" onclick="playEpisode('${ep.videoId}', ${JSON.stringify(character).replace(/"/g, '&quot;')}, '${familyId}', '${season}', ${ep.index})">
            <div class="suggestion-thumb" style="background-image: url('https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg')"></div>
            <div class="suggestion-info">
                <h4>${ep.title}</h4>
                <p>${character.name}</p>
                <p class="suggestion-meta">Épisode ${ep.num}</p>
            </div>
        </div>
    `).join('');
}

function toggleMyListFromPlayer() {
    if (currentVideoData) {
        const { familyId, character } = currentVideoData;
        toggleMyList(familyId, character.id);
        
        const inList = window.userMyList.some(i => i.charId === character.id);
        const addListBtn = document.getElementById('addListBtnPlayer');
        addListBtn.innerHTML = inList 
            ? '<i class="fas fa-check"></i><span>Dans Ma Liste</span>' 
            : '<i class="fas fa-plus"></i><span>Ma Liste</span>';
    }
}

function saveProgressTime(videoId, time) {
    localStorage.setItem(`progress_${videoId}`, time.toString());
}

function getSavedTime(videoId) {
    return parseInt(localStorage.getItem(`progress_${videoId}`) || '0');
}

function closePlayer() {
    document.getElementById('playerModal').classList.remove('active');
    document.body.style.overflow = '';
    if (player) {
        player.destroy();
        player = null;
    }
    currentVideoData = null;
}

// ==========================================
// RECHERCHE
// ==========================================
function setupEventListeners() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    searchTrigger.onclick = () => searchOverlay.classList.add('active');
    searchClose.onclick = () => searchOverlay.classList.remove('active');
    searchInput.oninput = handleSearch;

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
            document.getElementById('seriesModal').classList.remove('active');
            closePlayer();
        }
    });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const results = document.getElementById('searchResults');
    
    if (!query) {
        results.innerHTML = '';
        return;
    }

    const matches = [];
    for (const [familyId, family] of Object.entries(universesData)) {
        family.characters.forEach(char => {
            if (char.name.toLowerCase().includes(query) || family.name.toLowerCase().includes(query)) {
                matches.push({ ...char, familyId, family });
            }
        });
    }

    results.innerHTML = matches.map(char => `
        <div class="card-cr" onclick="openUniverse('${char.familyId}', '${char.id}'); document.getElementById('searchOverlay').classList.remove('active')">
            <div class="card-image-cr" style="background-image: url('${char.image}')"></div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${char.name}</h3>
                <p class="card-meta-cr">${char.family.name}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// LIVE STATUS TWITCH
// ==========================================
async function checkLiveStatus() {
    const statusEl = document.getElementById('liveStatus');
    const descEl = document.getElementById('liveDescription');
    const viewerEl = document.getElementById('viewerCount');
    const badge = document.getElementById('liveBadge');
    const indicator = document.getElementById('liveIndicatorNav');

    try {
        const response = await fetch('/.netlify/functions/live-on-twitch');
        const data = await response.json();
        
        if (data.status === 'online') {
            statusEl.textContent = 'EN DIRECT';
            descEl.textContent = 'GTA RP - Action intense dans les rues de Los Santos !';
            viewerEl.innerHTML = '<i class="fas fa-eye"></i> En ligne';
            badge.classList.add('online');
            indicator.classList.remove('offline');
        } else {
            statusEl.textContent = 'HORS LIGNE';
            if (data.lastLive) {
                descEl.textContent = `Dernier live : ${data.lastLive}`;
            } else {
                descEl.textContent = 'Le stream reprendra bientôt !';
            }
            viewerEl.innerHTML = '<i class="fas fa-eye"></i> --';
            badge.classList.remove('online');
            indicator.classList.add('offline');
        }
    } catch (err) {
        console.error('Erreur live:', err);
        statusEl.textContent = 'HORS LIGNE';
        descEl.textContent = 'Impossible de vérifier le statut';
        viewerEl.innerHTML = '<i class="fas fa-eye"></i> --';
        badge.classList.remove('online');
        indicator.classList.add('offline');
    }
}

// ==========================================
// CAROUSELS
// ==========================================
function scrollCarousel(type, direction) {
    const ids = { history: 'historyCards', mylist: 'mylistCards', univers: 'universesGrid', popular: 'popularCarousel' };
    const track = document.getElementById(ids[type]);
    const cardWidth = track.querySelector('.card-cr')?.offsetWidth || 240;
    track.scrollBy({ left: direction * (cardWidth + 25), behavior: 'smooth' });
}

function displayPopularCarousel() {
    const track = document.getElementById('popularCarousel');
    const popular = Object.values(universesData)
        .flatMap(f => f.characters.slice(0, 3))
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

    track.innerHTML = popular.map(char => {
        const family = Object.values(universesData).find(f => f.characters.includes(char));
        const familyId = Object.keys(universesData).find(k => universesData[k] === family);
        return `
            <div class="card-cr" onclick="openUniverse('${familyId}', '${char.id}')">
                <div class="card-image-cr" style="background-image: url('${char.image}')"></div>
                <div class="card-content-cr">
                    <h3 class="card-title-cr">${char.name}</h3>
                    <p class="card-meta-cr">Populaire</p>
                </div>
            </div>
        `;
    }).join('');
}

function displaySocialNetworks() {
    document.getElementById('socialGrid').innerHTML = socialNetworks.map(net => `
        <a href="${net.url}" target="_blank" class="social-card-cr">
            <div class="social-image" style="background-image: url('${net.image}')"></div>
            <div class="social-info">
                <h3><i class="${net.icon}"></i> ${net.name}</h3>
                <p>${net.info}</p>
            </div>
        </a>
    `).join('');
}

// ==========================================
// HISTORIQUE
// ==========================================
function addToHistory(title, episode, videoId, image) {
    const entry = { title, episode, videoId, image, timestamp: Date.now() };
    window.userHistory = [entry, ...window.userHistory.filter(h => h.videoId !== videoId)].slice(0, 50);
    displayHistory();
    saveData();
}

function displayHistory() {
    const section = document.getElementById('historique');
    const track = document.getElementById('historyCards');
    
    if (!window.userHistory || window.userHistory.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    track.innerHTML = window.userHistory.map(h => {
        const progress = getSavedTime(h.videoId);
        const progressPercent = progress > 0 ? Math.min((progress / 1800) * 100, 100) : 0;
        
        return `
            <div class="card-cr history-card" onclick="resumeVideo('${h.videoId}')">
                <div class="card-image-cr" style="background-image: url('https://i.ytimg.com/vi/${h.videoId}/hqdefault.jpg')">
                    <i class="fas fa-play-circle play-icon-small"></i>
                    ${progressPercent > 0 ? `<div class="progress-bar-history" style="width: ${progressPercent}%"></div>` : ''}
                </div>
                <div class="card-content-cr">
                    <h3 class="card-title-cr">${h.title}</h3>
                    <p class="card-meta-cr">${h.episode}</p>
                </div>
            </div>
        `;
    }).join('');
}

function resumeVideo(videoId) {
    for (const [familyId, family] of Object.entries(universesData)) {
        for (const char of family.characters) {
            for (const [season, episodes] of Object.entries(char.seasons)) {
                const epIndex = episodes.findIndex(ep => ep.videoId === videoId);
                if (epIndex !== -1) {
                    playEpisode(videoId, char, familyId, season, epIndex);
                    return;
                }
            }
        }
    }
}

function clearHistory() {
    if (confirm('Voulez-vous vraiment effacer tout votre historique ?')) {
        window.userHistory = [];
        displayHistory();
        saveData();
    }
}

// ==========================================
// MA LISTE
// ==========================================
function toggleMyList(familyId, charId) {
    const index = window.userMyList.findIndex(i => i.charId === charId);
    
    if (index > -1) {
        window.userMyList.splice(index, 1);
    } else {
        window.userMyList.push({ familyId, charId });
    }
    
    displayMyList();
    saveData();

    const btn = document.getElementById('addToListBtn');
    if (btn) {
        const inList = window.userMyList.some(i => i.charId === charId);
        btn.innerHTML = inList 
            ? '<i class="fas fa-check"></i> Dans Ma Liste' 
            : '<i class="fas fa-plus"></i> Ajouter à Ma Liste';
    }
}

function displayMyList() {
    const section = document.getElementById('maliste');
    const track = document.getElementById('mylistCards');
    
    if (!window.userMyList || window.userMyList.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    const items = window.userMyList.map(item => {
        const family = universesData[item.familyId];
        const char = family.characters.find(c => c.id === item.charId);
        return { ...char, family, familyId: item.familyId };
    });

    track.innerHTML = items.map(char => `
        <div class="card-cr" onclick="openUniverse('${char.familyId}', '${char.id}')">
            <div class="card-image-cr" style="background-image: url('${char.image}')"></div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${char.name}</h3>
                <p class="card-meta-cr">${char.family.name}</p>
            </div>
        </div>
    `).join('');
}

function clearMyList() {
    if (confirm('Voulez-vous vraiment vider votre liste ?')) {
        window.userMyList = [];
        displayMyList();
        saveData();
    }
}

// ==========================================
// SCROLL & FILTRES
// ==========================================
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        scrollTop.classList.toggle('visible', window.scrollY > 600);
    });

    scrollTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterFamily(family) {
    const cards = document.querySelectorAll('#universesGrid .card-cr');
    cards.forEach(card => {
        card.style.display = family === 'all' || card.dataset.family === family ? 'block' : 'none';
    });

    document.querySelectorAll('.filter-tab').forEach(tab => {
        const isActive = tab.onclick.toString().includes(`'${family}'`);
        tab.classList.toggle('active', isActive);
    });
}

// ==========================================
// FERMETURE MODALS
// ==========================================
function closeSeriesModal() {
    document.getElementById('seriesModal').classList.remove('active');
    document.body.style.overflow = '';
}

window.onclick = function(e) {
    const seriesModal = document.getElementById('seriesModal');
    const playerModal = document.getElementById('playerModal');
    const guestModal = document.getElementById('guestModal');
    
    if (e.target === seriesModal) closeSeriesModal();
    if (e.target === playerModal) closePlayer();
    if (e.target === guestModal) closeGuestModal();
};