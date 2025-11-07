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
window.userHistory = [];
window.userMyList = [];

// ==========================================
// DONNÉES STATIQUES
// ==========================================
const universesData = {
    flash: {
        name: 'Famille Flash',
        icon: 'fas fa-bolt',
        description: 'La saga légendaire qui traverse les générations',
        image: 'images/flash-universe.jpg',
        tags: ['Action', 'Drame', 'Crime'],
        characters: [
            { id: 'david-flash', name: 'David Flash', description: 'Le fondateur légendaire', image: 'images/david_flash.jpg', seasons: { 'Saison 1': [{ num: 1, title: 'POUR LA PREMIÈRE FOIS JE TESTE GTAV RP', videoId: 'z_H0tafxHAc' }], 'Saison 2': [{ num: 1, title: 'LA FEMME DE MA VIE OU LE GANG', videoId: 'Eoo3Vpelub4' }] } },
            { id: 'john-flash', name: 'John Flash', description: 'Le successeur ambitieux', image: 'images/john_flash.jpg', seasons: {} },
            { id: 'ken-flash', name: 'Ken Flash', description: 'Le stratège', image: 'images/ken_flash.jpg', seasons: {} },
            { id: 'aaron-flash', name: 'Aaron Flash', description: 'Le combattant', image: 'images/aaron_flash.jpg', seasons: {} },
            { id: 'david-jr-flash', name: 'David Jr Flash', description: 'La nouvelle génération', image: 'images/david_jr_flash.jpg', seasons: {} },
            { id: 'damon-flash', name: 'Damon Flash', description: 'Le mystérieux', image: 'images/damon_flash.jpg', seasons: {} },
            { id: 'kayton-flash', name: 'Kayton Flash', description: 'Le tacticien', image: 'images/kayton_flash.jpg', seasons: {} },
            { id: 'adrian-flash', name: 'Adrian Flash', description: 'Le loyal', image: 'images/adrian_flash.jpg', seasons: {} },
            { id: 'ned-flash', name: 'Ned/Eden/Eddy Flash', description: 'Les multiples facettes', image: 'images/ned_flash.jpg', seasons: {} },
            { id: 'manda-flash', name: 'Manda Flash', description: 'La protectrice', image: 'images/manda_flash.jpg', seasons: {} }
        ]
    },
    shade: { name: 'Famille Shade', icon: 'fas fa-moon', description: 'Mystère et ombres', image: 'images/shade-universe.jpg', tags: ['Mystère', 'Thriller'], characters: [{ id: 'sylvester-shade', name: 'Sylvester (Silver) Shade', description: 'L\'ombre insaisissable', image: 'images/sylvester_shade.jpg', seasons: {} }] },
    winters: { name: 'Famille Winters', icon: 'fas fa-snowflake', description: 'Froid comme l\'hiver', image: 'images/winters-universe.jpg', tags: ['Drame', 'Action'], characters: [{ id: 'oliver-winters', name: 'Oliver Winters', description: 'Le leader', image: 'images/oliver_winters.jpg', seasons: {} }, { id: 'jake-winters', name: 'Jake Winters', description: 'Le second', image: 'images/jake_winters.jpg', seasons: {} }] },
    escobar: { name: 'Famille Escobar', icon: 'fas fa-mask', description: 'Danger incarné', image: 'images/escobar-universe.jpg', tags: ['Crime', 'Action'], characters: [{ id: 'tom-escobar', name: 'Tom Escobar', description: 'Le chef', image: 'images/tom_escobar.jpg', seasons: {} }] },
    kingsley: { name: 'Famille Kingsley', icon: 'fas fa-crown', description: 'La royauté criminelle', image: 'images/kingsley-universe.jpg', tags: ['Crime', 'Pouvoir'], characters: [{ id: 'zack-kingsley', name: 'Zack Kingsley', description: 'Le roi', image: 'images/zack_kingsley.jpg', seasons: {} }] }
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
// INITIALISATION SÉCURISÉE
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();

    // SI PAS CONNECTÉ NI INVITÉ → REDIRECTION VERS connection.html
    if (!user && localStorage.getItem('ipromx_guest') !== 'true') {
        window.location.href = 'connection.html';
        return;
    }

    // MODE INVITÉ
    if (localStorage.getItem('ipromx_guest') === 'true') {
        isGuest = true;
        currentUser = { id: 'guest', user_metadata: { full_name: 'Invité' } };
        loadLocalData();
    }
    // MODE DISCORD
    else if (user) {
        currentUser = user;
        await loadUserData(user);
    }

    // CHARGER LE SITE
    showMainContent();
    setupEventListeners();
    displayUniverses();
    displayPopularCarousel();
    displaySocialNetworks();
    checkLiveStatus();
    setupScrollEffects();
    displayHistory();
    displayMyList();
});

// ==========================================
// CHARGEMENT DES DONNÉES
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
        userAvatar.src = 'images/guest-avatar.png';
        logoutBtn.style.display = 'none';
    } else {
        userName.textContent = currentUser.user_metadata.full_name || 'Utilisateur';
        userAvatar.src = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.user_metadata.avatar}.png`;
        logoutBtn.style.display = 'block';
    }

    userInfo.style.display = 'flex';
}

// ==========================================
// DÉCONNEXION
// ==========================================
document.getElementById('btnLogout').onclick = async () => {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('ipromx_guest');
    window.location.href = 'connection.html';
};

// ==========================================
// AFFICHAGE UNIVERS
// ==========================================
function displayUniverses() {
    const grid = document.getElementById('universesGrid');
    let html = '';
    const order = ['zack-kingsley', 'jake-winters', 'ned-flash', 'manda-flash', 'adrian-flash', 'oliver-winters'];
    const allCharacters = [];
    for (const [familyId, family] of Object.entries(universesData)) {
        family.characters.forEach(char => allCharacters.push({ ...char, familyId, family }));
    }
    const ordered = order.map(id => allCharacters.find(c => c.id === id)).filter(Boolean);
    const remaining = allCharacters.filter(c => !order.includes(c.id));
    const finalList = [...ordered, ...remaining];

    finalList.forEach(char => {
        html += `
            <div class="card-cr" data-family="${char.familyId}" onclick="openUniverse('${char.familyId}', '${char.id}')">
                <div class="card-image-cr" style="background-image: url('${char.image}')">
                    <i class="${char.family.icon} card-icon-overlay"></i>
                </div>
                <div class="card-content-cr">
                    <h3 class="card-title-cr">${char.name}</h3>
                    <p class="card-meta-cr">${char.family.name}</p>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
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
    addBtn.innerHTML = inList ? '<i class="fas fa-check"></i> Dans Ma Liste' : '<i class="fas fa-plus"></i> Ajouter';
    addBtn.onclick = () => toggleMyList(familyId, character.id);

    const seasons = Object.keys(character.seasons);
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
        episodesList.innerHTML = '<p class="no-episodes">Aucun épisode disponible.</p>';
    }

    document.getElementById('seriesModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSeason(familyId, charId, season, btn = null) {
    document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const character = universesData[familyId].characters.find(c => c.id === charId);
    const episodes = character.seasons[season] || [];

    const list = document.getElementById('episodesListDetailed');
    list.innerHTML = episodes.map(ep => `
        <div class="episode-item-cr" onclick="playEpisode('${ep.videoId}', '${character.name}', '${season} - Ép. ${ep.num}')">
            <div class="episode-thumb" style="background-image: url('https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg')"></div>
            <div class="episode-info">
                <h4>Épisode ${ep.num}</h4>
                <p>${ep.title}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// LECTEUR VIDÉO
// ==========================================
function playEpisode(videoId, title, episode) {
    const modal = document.getElementById('playerModal');
    document.getElementById('playerTitle').textContent = title;
    document.getElementById('playerEpisode').textContent = episode;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

    const container = document.querySelector('.video-placeholder');
    container.innerHTML = '';
    container.appendChild(iframe);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const entry = { title, episode, videoId, timestamp: Date.now() };
    window.userHistory = [entry, ...window.userHistory.filter(h => h.videoId !== videoId)].slice(0, 50);
    displayHistory();
    saveData();
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelector('.video-placeholder').innerHTML = `<i class="fas fa-play"></i>`;
}

function playFirstEpisode() {
    const firstEp = document.querySelector('.episode-item-cr');
    if (firstEp) firstEp.click();
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
    if (!query) { results.innerHTML = ''; return; }

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
            <div class="card-image-cr" style="background-image: url('${char.image}')">
                <i class="${char.family.icon} card-icon-overlay"></i>
            </div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${char.name}</h3>
                <p class="card-meta-cr">${char.family.name}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// LIVE STATUS
// ==========================================
async function checkLiveStatus() {
    const statusEl = document.getElementById('liveStatus');
    const descEl = document.getElementById('liveDescription');
    const viewerEl = document.getElementById('viewerCount');
    const badge = document.getElementById('liveBadge');
    const indicator = document.getElementById('liveIndicatorNav');

    try {
        // Simulation locale
        const isLive = Math.random() > 0.5;
        if (isLive) {
            statusEl.textContent = 'EN DIRECT';
            descEl.textContent = 'iProMx joue à GTA RP !';
            viewerEl.textContent = '12.4K spectateurs';
            badge.classList.add('online');
            indicator.classList.remove('offline');
        } else {
            statusEl.textContent = 'HORS LIGNE';
            descEl.textContent = 'Revenez plus tard pour du live !';
            viewerEl.textContent = '—';
            badge.classList.remove('online');
            indicator.classList.add('offline');
        }
    } catch (err) {
        statusEl.textContent = 'ERREUR';
        descEl.textContent = 'Impossible de vérifier';
    }
}

// ==========================================
// CAROUSELS
// ==========================================
function scrollCarousel(type, direction) {
    const id = { history: 'historyCards', mylist: 'mylistCards', univers: 'universesGrid', popular: 'popularCarousel' }[type];
    const track = document.getElementById(id);
    const cardWidth = track.querySelector('.card-cr')?.offsetWidth || 240;
    track.scrollBy({ left: direction * (cardWidth + 25), behavior: 'smooth' });
}

function displayPopularCarousel() {
    const track = document.getElementById('popularCarousel');
    const popular = Object.values(universesData).flatMap(f => f.characters.slice(0, 3))
        .sort(() => Math.random() - 0.5).slice(0, 8);

    track.innerHTML = popular.map(char => {
        const family = Object.values(universesData).find(f => f.characters.includes(char));
        const familyId = Object.keys(universesData).find(k => universesData[k] === family);
        return `
            <div class="card-cr" onclick="openUniverse('${familyId}', '${char.id}')">
                <div class="card-image-cr" style="background-image: url('${char.image}')">
                    <i class="${family.icon} card-icon-overlay"></i>
                </div>
                <div class="card-content-cr">
                    <h3 class="card-title-cr">${char.name}</h3>
                    <p class="card-meta-cr">Populaire</p>
                </div>
            </div>
        `;
    }).join('');
}

function displaySocialNetworks() {
    const grid = document.getElementById('socialGrid');
    grid.innerHTML = socialNetworks.map(net => `
        <a href="${net.url}" target="_blank" class="social-card-cr">
            <div class="social-image" style="background-image: url('${net.image}')"></div>
            <div class="social-info">
                <h3>${net.name}</h3>
                <p>${net.info}</p>
            </div>
        </a>
    `).join('');
}

// ==========================================
// HISTORIQUE & LISTE
// ==========================================
function displayHistory() {
    const section = document.getElementById('historique');
    const track = document.getElementById('historyCards');
    if (!window.userHistory || window.userHistory.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    track.innerHTML = window.userHistory.map(h => `
        <div class="card-cr" onclick="playEpisode('${h.videoId}', '${h.title}', '${h.episode}')">
            <div class="card-image-cr" style="background-image: url('https://i.ytimg.com/vi/${h.videoId}/hqdefault.jpg')">
                <i class="fas fa-play-circle play-icon-small"></i>
            </div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${h.title}</h3>
                <p class="card-meta-cr">${h.episode}</p>
            </div>
        </div>
    `).join('');
}

function clearHistory() {
    window.userHistory = [];
    displayHistory();
    saveData();
}

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
    const inList = window.userMyList.some(i => i.charId === charId);
    btn.innerHTML = inList ? '<i class="fas fa-check"></i> Dans Ma Liste' : '<i class="fas fa-plus"></i> Ajouter';
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
            <div class="card-image-cr" style="background-image: url('${char.image}')">
                <i class="${char.family.icon} card-icon-overlay"></i>
            </div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${char.name}</h3>
                <p class="card-meta-cr">${char.family.name}</p>
            </div>
        </div>
    `).join('');
}

function clearMyList() {
    window.userMyList = [];
    displayMyList();
    saveData();
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
        tab.classList.toggle('active', tab.onclick.toString().includes(`'${family}'`));
    });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
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
    if (e.target === seriesModal) closeSeriesModal();
    if (e.target === playerModal) closePlayer();
};