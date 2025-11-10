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
let selectedHistoryItems = new Set();
let selectedListItems = new Set();
window.userHistory = [];
window.userMyList = [];
window.allWatchedEpisodes = []; // Historique complet

// Bannière commune Flash
const FLASH_BANNER = 'images/flash.jpg';

// ==========================================
// DONNÉES UNIVERS
// ==========================================
const universesData = {
    flash: {
        name: 'Famille Flash',
        description: 'La saga légendaire qui traverse les générations',
        image: 'images/flashlogo.webp',
        characters: [
            { 
                id: 'david-flash', 
                name: 'David Flash', 
                description: 'Le fondateur légendaire de la famille Flash. Un homme au passé trouble qui a bâti un empire dans l\'ombre de Los Santos.', 
                image: 'images/david_flash.jpg',
                banner: FLASH_BANNER,
                seasons: { 
                    'Saison 1': [
                        { num: 1, title: 'POUR LA PREMIÈRE FOIS JE TESTE GTAV RP', videoId: 'z_H0tafxHAc' },
                        { num: 2, title: 'Les Débuts', videoId: 'z_H0tafxHAc' }
                    ], 
                    'Saison 2': [
                        { num: 1, title: 'LA FEMME DE MA VIE OU LE GANG', videoId: 'Eoo3Vpelub4' }
                    ] 
                } 
            },
            { 
                id: 'john-flash', 
                name: 'John', 
                description: 'Le fondateur légendaire de la famille Flash. Un homme au passé trouble qui a bâti un empire dans l\'ombre de Los Santos.', 
                image: 'images/john_flash.jpg',
                banner: FLASH_BANNER,
                seasons: { 
                    'Saison 1': [
                        { num: 1, title: 'Je suis gay ! ', videoId: 'z_H0tafxHAc' },
                        { num: 2, title: 'Les Débuts', videoId: 'z_H0tafxHAc' }
                    ], 
                    'Saison 2': [
                        { num: 1, title: 'LA FEMME DE MA VIE OU LE GANG', videoId: 'Eoo3Vpelub4' }
                    ] 
                } 
            },
            { id: 'john-flash', name: 'John Flash', description: 'Le successeur ambitieux', image: 'images/john_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'ken-flash', name: 'Ken Flash', description: 'Le stratège', image: 'images/ken_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'aaron-flash', name: 'Aaron Flash', description: 'Le combattant', image: 'images/aaron_flash.jpg', banner: FLASH_BANNER, hasVideo: true, videoUrl: 'videos/aaron-flash.mp4', seasons: {} },
            { id: 'david-jr-flash', name: 'David Jr Flash', description: 'La nouvelle génération', image: 'images/david_jr_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'damon-flash', name: 'Damon Flash', description: 'Le mystérieux', image: 'images/damon_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'kayton-flash', name: 'Kayton Flash', description: 'Le tacticien', image: 'images/kayton_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'adrian-flash', name: 'Adrian Flash', description: 'Le loyal', image: 'images/adrian_flash.jpg', banner: FLASH_BANNER, seasons: {} },
            { id: 'ned-flash', name: 'Ned/Eden/Eddy Flash', description: 'Les multiples facettes', image: 'images/ned_flash.jpg', banner: FLASH_BANNER, hasVideo: true, videoUrl: 'videos/ned-flash.mp4', subtitlesUrl: 'videos/ned-flash.srt', seasons: {} },
            { id: 'manda-flash', name: 'Manda Flash', description: 'La protectrice', image: 'images/manda_flash.jpg', banner: FLASH_BANNER, seasons: {} }
        ]
    },
    shade: { 
        name: 'Famille Shade', 
        description: 'Mystère et ombres', 
        image: 'images/shade-universe.jpg', 
        characters: [
            { id: 'sylvester-shade', name: 'Sylvester (Silver) Shade', description: 'L\'ombre insaisissable', image: 'images/sylvester_shade.jpg', banner: 'images/shade-banner.jpg', seasons: {} }
        ] 
    },
    winters: { 
        name: 'Famille Winters', 
        description: 'Froid comme l\'hiver', 
        image: 'images/winters-universe.jpg', 
        characters: [
            { id: 'oliver-winters', name: 'Oliver Winters', description: 'Le leader froid', image: 'images/oliver_winters.jpg', banner: 'images/winters-banner.jpg', seasons: {} }, 
            { id: 'jake-winters', name: 'Jake Winters', description: 'Le second', image: 'images/jake_winters.jpg', banner: 'images/winters-banner.jpg', seasons: {} }
        ] 
    },
    escobar: { 
        name: 'Famille Escobar', 
        description: 'Danger incarné', 
        image: 'images/escobar-universe.jpg', 
        characters: [
            { id: 'tom-escobar', name: 'Tom Escobar', description: 'Le chef impitoyable', image: 'images/tom_escobar.jpg', banner: 'images/escobar-banner.jpg', seasons: {} }
        ] 
    },
    kingsley: { 
        name: 'Famille Kingsley', 
        description: 'La royauté criminelle', 
        image: 'images/kingsley-universe.jpg', 
        characters: [
            { id: 'zack-kingsley', name: 'Zack Kingsley', description: 'Le roi', image: 'images/zack_kingsley.jpg', banner: 'images/kingsley-banner.jpg', seasons: {} }
        ] 
    }
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

const legendesVideos = [
    { id: 'leg1', title: 'iProMx IRL - La rencontre', thumbnail: 'images/leg1.jpg', videoId: 'dQw4w9WgXcQ', type: 'irl' },
    { id: 'leg2', title: 'Les coulisses du RP', thumbnail: 'images/leg2.jpg', videoId: 'dQw4w9WgXcQ', type: 'bonus' },
    { id: 'leg3', title: 'Best Of Moments', thumbnail: 'images/leg3.jpg', videoId: 'dQw4w9WgXcQ', type: 'bestof' }
];

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier si redirection depuis mode invité
    const fromGuest = localStorage.getItem('ipromx_redirect_from_guest');
    if (fromGuest === 'true') {
        localStorage.removeItem('ipromx_redirect_from_guest');
        localStorage.removeItem('ipromx_guest');
        // Ne pas continuer l'init, laisser connection.html gérer
        return;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();

    // Si pas connecté ET pas en mode invité → redirection
    if (!user && localStorage.getItem('ipromx_guest') !== 'true') {
        window.location.href = 'connection.html';
        return;
    }

    // MODE INVITÉ
    if (localStorage.getItem('ipromx_guest') === 'true') {
        isGuest = true;
        currentUser = { id: 'guest', user_metadata: { full_name: 'Invité' } };
        loadLocalData();
        setTimeout(() => showGuestModal(), 1000);
    } 
    // MODE DISCORD
    else if (user) {
        currentUser = user;
        await loadUserData(user);
    }

    showMainContent();
    setupEventListeners();
    displayUniverses();
    displayPopularCarousel();
    displayLegendesCarousel();
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

function redirectToConnection() {
    localStorage.setItem('ipromx_redirect_from_guest', 'true');
    window.location.href = 'connection.html';
}

// ==========================================
// DONNÉES
// ==========================================
async function loadUserData(user) {
    const { data } = await supabaseClient
        .from('users_data')
        .select('history, my_list, all_watched')
        .eq('discord_id', user.id)
        .single();

    if (data) {
        window.userHistory = data.history || [];
        window.userMyList = data.my_list || [];
        window.allWatchedEpisodes = data.all_watched || [];
    } else {
        await supabaseClient.from('users_data').insert({ discord_id: user.id });
        window.userHistory = [];
        window.userMyList = [];
        window.allWatchedEpisodes = [];
    }
}

function loadLocalData() {
    window.userHistory = JSON.parse(localStorage.getItem('ipromxHistory') || '[]');
    window.userMyList = JSON.parse(localStorage.getItem('ipromxMyList') || '[]');
    window.allWatchedEpisodes = JSON.parse(localStorage.getItem('ipromxAllWatched') || '[]');
}

async function saveData() {
    if (isGuest) {
        localStorage.setItem('ipromxHistory', JSON.stringify(window.userHistory));
        localStorage.setItem('ipromxMyList', JSON.stringify(window.userMyList));
        localStorage.setItem('ipromxAllWatched', JSON.stringify(window.allWatchedEpisodes));
    } else {
        await supabaseClient
            .from('users_data')
            .update({ 
                history: window.userHistory, 
                my_list: window.userMyList,
                all_watched: window.allWatchedEpisodes
            })
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
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
        logoutBtn.onclick = () => {
            localStorage.setItem('ipromx_redirect_from_guest', 'true');
            window.location.href = 'connection.html';
        };
    } else {
        userName.textContent = currentUser.user_metadata.full_name || 'Utilisateur';
        userAvatar.src = currentUser.user_metadata.avatar_url || 
                         `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.user_metadata.avatar}.png`;
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.onclick = async () => {
            await supabaseClient.auth.signOut();
            localStorage.removeItem('ipromx_guest');
            window.location.href = 'connection.html';
        };
    }

    userInfo.style.display = 'flex';
}

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

    const seriesHero = document.getElementById('seriesHero');
    const heroVideo = document.getElementById('heroVideo');
    const videoControls = document.getElementById('videoControlsHero');

    if (character.hasVideo) {
        seriesHero.style.backgroundImage = 'none';
        heroVideo.src = character.videoUrl;
        heroVideo.style.display = 'block';
        videoControls.style.display = 'flex';
        
        if (character.subtitlesUrl) {
            document.getElementById('videoSubtitles').src = character.subtitlesUrl;
            document.getElementById('subtitlesHero').style.display = 'inline-flex';
        } else {
            document.getElementById('subtitlesHero').style.display = 'none';
        }
        
        setupVideoControls(heroVideo);
        heroVideo.play();
    } else {
        heroVideo.style.display = 'none';
        videoControls.style.display = 'none';
        seriesHero.style.backgroundImage = `url('${character.banner || character.image}')`;
    }

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
        episodesList.innerHTML = '<p class="no-episodes">Aucun épisode disponible.</p>';
    }

    document.getElementById('seriesModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setupVideoControls(video) {
    const playPauseBtn = document.getElementById('playPauseHero');
    const muteBtn = document.getElementById('muteHero');
    const volumeSlider = document.getElementById('volumeSlider');
    const subtitlesBtn = document.getElementById('subtitlesHero');

    playPauseBtn.onclick = () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    muteBtn.onclick = () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    };

    volumeSlider.oninput = (e) => {
        video.volume = e.target.value / 100;
    };

    let subtitlesEnabled = false;
    subtitlesBtn.onclick = () => {
        const track = video.textTracks[0];
        if (track) {
            subtitlesEnabled = !subtitlesEnabled;
            track.mode = subtitlesEnabled ? 'showing' : 'hidden';
            subtitlesBtn.style.color = subtitlesEnabled ? 'var(--hp-gold)' : '#fff';
        }
    };
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
    
    if (player) {
        player.destroy();
    }
    
    player = new YT.Player('youtubePlayerContainer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
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

    displaySuggestions(character, season, episodeIndex, familyId);

    const inList = window.userMyList.some(i => i.charId === character.id);
    const addListBtn = document.getElementById('addListBtnPlayer');
    addListBtn.innerHTML = inList 
        ? '<i class="fas fa-check"></i><span>Dans Ma Liste</span>' 
        : '<i class="fas fa-plus"></i><span>Ma Liste</span>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    addToHistory(character.name, `${season} - Ép. ${currentEp.num}`, videoId, character.image, familyId, character.id, season, episodeIndex);
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
    const lastLiveDateEl = document.getElementById('lastLiveDate');
    const titleEl = document.getElementById('liveTitle');
    const badge = document.getElementById('liveBadge');
    const indicator = document.getElementById('liveIndicatorNav');

    try {
        const response = await fetch('/.netlify/functions/live-on-twitch');
        const data = await response.json();
        
        if (data.status === 'online') {
            statusEl.textContent = 'EN DIRECT';
            titleEl.textContent = data.title || 'iProMx en direct';
            descEl.textContent = 'GTA RP - Action intense !';
            lastLiveDateEl.innerHTML = '<i class="fas fa-calendar"></i> Maintenant';
            badge.classList.add('online');
            indicator.classList.remove('offline', 'error');
            indicator.innerHTML = '<span class="live-dot"></span><span class="live-text">EN LIVE</span>';
        } else {
            statusEl.textContent = 'HORS LIGNE';
            titleEl.textContent = 'iProMx sur Twitch';
            
            const lastLiveResponse = await fetch('/.netlify/functions/live-on-twitch', {
                headers: { 'x-last-live': 'true' }
            });
            const lastLiveData = await lastLiveResponse.json();
            
            if (lastLiveData.lastLive) {
                descEl.textContent = lastLiveData.title || 'Dernier live';
                lastLiveDateEl.innerHTML = `<i class="fas fa-calendar"></i> ${lastLiveData.lastLive}`;
            } else {
                descEl.textContent = 'Le stream reprendra bientôt';
                lastLiveDateEl.innerHTML = '<i class="fas fa-calendar"></i> --';
            }
            
            badge.classList.remove('online');
            indicator.classList.add('offline');
            indicator.classList.remove('error');
            indicator.innerHTML = '<span class="live-dot"></span><span class="live-text">PAS EN LIVE</span>';
        }
    } catch (err) {
        console.error('Erreur live:', err);
        statusEl.textContent = 'ERREUR';
        titleEl.textContent = 'iProMx sur Twitch';
        descEl.textContent = 'Impossible de vérifier le statut';
        lastLiveDateEl.innerHTML = '<i class="fas fa-calendar"></i> --';
        badge.classList.remove('online');
        indicator.classList.add('error');
        indicator.classList.remove('offline');
        indicator.innerHTML = '<span class="live-dot"></span><span class="live-text">ERREUR</span>';
    }
}

// ==========================================
// CAROUSELS
// ==========================================
function scrollCarousel(type, direction) {
    const ids = { 
        history: 'historyCards', 
        mylist: 'mylistCards', 
        univers: 'universesGrid', 
        popular: 'popularCarousel',
        legendes: 'legendesCarousel'
    };
    const track = document.getElementById(ids[type]);
    const cardWidth = track.querySelector('.card-cr, .history-item')?.offsetWidth || 240;
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

function displayLegendesCarousel() {
    const track = document.getElementById('legendesCarousel');
    track.innerHTML = legendesVideos.map(video => `
        <div class="card-cr" onclick="playLegendVideo('${video.videoId}', '${video.title}')">
            <div class="card-image-cr" style="background-image: url('${video.thumbnail}')">
                <div class="play-icon-overlay"><i class="fas fa-play-circle"></i></div>
            </div>
            <div class="card-content-cr">
                <h3 class="card-title-cr">${video.title}</h3>
                <p class="card-meta-cr">${video.type === 'irl' ? 'IRL' : video.type === 'bonus' ? 'Bonus' : 'Best Of'}</p>
            </div>
        </div>
    `).join('');
}

function playLegendVideo(videoId, title) {
    const fakeCharacter = {
        id: 'legend',
        name: 'iProMx',
        description: 'Moments légendaires et contenus exclusifs d\'iProMx',
        image: 'images/logo-ipromx.png'
    };
    
    currentVideoData = { videoId, character: fakeCharacter, familyId: 'legend', season: 'Légendes', episodeIndex: 0 };
    
    const modal = document.getElementById('playerModal');
    document.getElementById('playerTitle').textContent = 'iProMx Légendes';
    document.getElementById('playerEpisode').textContent = title;
    document.getElementById('characterAvatar').src = 'images/logo-ipromx.png';
    document.getElementById('characterName').textContent = 'iProMx';
    document.getElementById('characterShortDesc').textContent = 'Contenu Exclusif';
    document.getElementById('characterFullDesc').textContent = 'Découvrez les moments légendaires, contenus IRL et bonus exclusifs d\'iProMx.';
    
    if (player) player.destroy();
    
    player = new YT.Player('youtubePlayerContainer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            fs: 1
        }
    });

    document.getElementById('suggestionsList').innerHTML = '';
    
    const addListBtn = document.getElementById('addListBtnPlayer');
    addListBtn.style.display = 'none';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
function addToHistory(title, episode, videoId, image, familyId, charId, season, episodeIndex) {
    const entry = { 
        title, 
        episode, 
        videoId, 
        image, 
        familyId,
        charId,
        season,
        episodeIndex,
        timestamp: Date.now() 
    };
    
    // Ajouter à l'historique complet
    window.allWatchedEpisodes = [entry, ...window.allWatchedEpisodes.filter(h => h.videoId !== videoId)].slice(0, 100);
    
    // Pour l'affichage, garder seulement le dernier épisode par personnage
    const existingIndex = window.userHistory.findIndex(h => h.charId === charId);
    if (existingIndex > -1) {
        window.userHistory.splice(existingIndex, 1);
    }
    
    window.userHistory.unshift(entry);
    window.userHistory = window.userHistory.slice(0, 20);
    
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
    track.innerHTML = window.userHistory.map(h => `
        <div class="history-item" onclick="resumeVideo('${h.videoId}', '${h.familyId}', '${h.charId}', '${h.season}', ${h.episodeIndex})">
            <div class="history-thumb" style="background-image: url('https://i.ytimg.com/vi/${h.videoId}/hqdefault.jpg')">
                <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
            </div>
            <div class="history-info">
                <h4>${h.title}</h4>
                <p>${h.episode}</p>
            </div>
        </div>
    `).join('');
}

function resumeVideo(videoId, familyId, charId, season, episodeIndex) {
    const family = universesData[familyId];
    if (!family) return;
    
    const character = family.characters.find(c => c.id === charId);
    if (!character) return;
    
    playEpisode(videoId, character, familyId, season, episodeIndex);
}

function openManageHistory() {
    const modal = document.getElementById('manageHistoryModal');
    const list = document.getElementById('manageHistoryList');
    selectedHistoryItems.clear();
    
    list.innerHTML = window.allWatchedEpisodes.map((h, index) => `
        <div class="manage-item">
            <input type="checkbox" id="hist-${index}" onchange="toggleHistorySelection(${index})">
            <label for="hist-${index}">
                <img src="https://i.ytimg.com/vi/${h.videoId}/default.jpg" alt="">
                <div class="manage-item-info">
                    <h4>${h.title}</h4>
                    <p>${h.episode}</p>
                    <span class="manage-date">${new Date(h.timestamp).toLocaleDateString('fr-FR')}</span>
                </div>
            </label>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function toggleHistorySelection(index) {
    if (selectedHistoryItems.has(index)) {
        selectedHistoryItems.delete(index);
    } else {
        selectedHistoryItems.add(index);
    }
}

function deleteSelectedHistory() {
    if (selectedHistoryItems.size === 0) {
        alert('Veuillez sélectionner au moins un élément');
        return;
    }
    
    if (confirm(`Supprimer ${selectedHistoryItems.size} élément(s) ?`)) {
        const indices = Array.from(selectedHistoryItems).sort((a, b) => b - a);
        indices.forEach(i => {
            const item = window.allWatchedEpisodes[i];
            window.allWatchedEpisodes.splice(i, 1);
            window.userHistory = window.userHistory.filter(h => h.videoId !== item.videoId);
        });
        
        displayHistory();
        saveData();
        closeManageHistory();
    }
}

function deleteAllHistory() {
    if (confirm('Supprimer tout l\'historique ?')) {
        window.allWatchedEpisodes = [];
        window.userHistory = [];
        displayHistory();
        saveData();
        closeManageHistory();
    }
}

function closeManageHistory() {
    document.getElementById('manageHistoryModal').classList.remove('active');
    selectedHistoryItems.clear();
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

function openManageList() {
    const modal = document.getElementById('manageListModal');
    const list = document.getElementById('manageListList');
    selectedListItems.clear();
    
    const items = window.userMyList.map(item => {
        const family = universesData[item.familyId];
        const char = family.characters.find(c => c.id === item.charId);
        return { ...char, ...item };
    });
    
    list.innerHTML = items.map((item, index) => `
        <div class="manage-item">
            <input type="checkbox" id="list-${index}" onchange="toggleListSelection(${index})">
            <label for="list-${index}">
                <img src="${item.image}" alt="">
                <div class="manage-item-info">
                    <h4>${item.name}</h4>
                    <p>${universesData[item.familyId].name}</p>
                </div>
            </label>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function toggleListSelection(index) {
    if (selectedListItems.has(index)) {
        selectedListItems.delete(index);
    } else {
        selectedListItems.add(index);
    }
}

function deleteSelectedList() {
    if (selectedListItems.size === 0) {
        alert('Veuillez sélectionner au moins un élément');
        return;
    }
    
    if (confirm(`Supprimer ${selectedListItems.size} élément(s) ?`)) {
        const indices = Array.from(selectedListItems).sort((a, b) => b - a);
        indices.forEach(i => window.userMyList.splice(i, 1));
        
        displayMyList();
        saveData();
        closeManageList();
    }
}

function deleteAllList() {
    if (confirm('Supprimer toute la liste ?')) {
        window.userMyList = [];
        displayMyList();
        saveData();
        closeManageList();
    }
}

function closeManageList() {
    document.getElementById('manageListModal').classList.remove('active');
    selectedListItems.clear();
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
    const modal = document.getElementById('seriesModal');
    const heroVideo = document.getElementById('heroVideo');
    
    if (heroVideo) {
        heroVideo.pause();
        heroVideo.currentTime = 0;
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

window.onclick = function(e) {
    const seriesModal = document.getElementById('seriesModal');
    const playerModal = document.getElementById('playerModal');
    const guestModal = document.getElementById('guestModal');
    const manageHistoryModal = document.getElementById('manageHistoryModal');
    const manageListModal = document.getElementById('manageListModal');
    
    if (e.target === seriesModal) closeSeriesModal();
    if (e.target === playerModal) closePlayer();
    if (e.target === guestModal) closeGuestModal();
    if (e.target === manageHistoryModal) closeManageHistory();
    if (e.target === manageListModal) closeManageList();
};