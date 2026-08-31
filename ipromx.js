'use strict';

const ROUTER = (() => {
  const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname) || location.protocol==='file:';
  const charSlug = cid => {
    // Slug explicite (surcharge manuelle dans data.js, ex: 'ned-eden-eddy')
    for (const u of Object.values(DATA.universes || {})) {
      const found = (u.characters || []).find(c => c.id === cid);
      if (found?.slug) return found.slug;
    }
    const first = cid.split('-')[0];
    let count = 0;
    for (const u of Object.values(DATA.universes || {})) {
      for (const c of (u.characters || [])) {
        if (c.id.split('-')[0] === first) count++;
        if (count > 1) return cid;
      }
    }
    return first;
  };
  const seasSlug = s   => s.toLowerCase().replace(/\s+/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function buildURL(fid,cid,season,epNum) {
    if(IS_LOCAL) return `/episode.html?fid=${encodeURIComponent(fid)}&cid=${encodeURIComponent(cid)}&season=${encodeURIComponent(season)}&ep=${epNum}`;
    return `/${fid}/${charSlug(cid)}/${seasSlug(season)}/ep${epNum}`;
  }
  function charURL(fid,cid) {
    if(IS_LOCAL) return `/character.html?fid=${encodeURIComponent(fid)}&cid=${encodeURIComponent(cid)}`;
    return `/${fid}/${charSlug(cid)}/`;
  }
  return {
    init() {
      window.addEventListener('popstate',()=>{});
    },
    goHome() { history.pushState({},'','/'); showHome(); },
    buildURL,
    charURL
  };
})();

// ── TOAST ─────────────────────────────────────────────────────

// ── AUTH UI ───────────────────────────────────────────────────
async function initAuth() {
  if (IS_LOCAL) { hideAuth(); initApp(); return; }

  // Loader simple pendant la vérification Firebase (~1-2s)
  const p = $('authPage');
  if (p) p.style.display = 'flex';
  const loader = $('authLoader');
  const card   = $('authCardWrap');
  if (loader) loader.style.display = 'flex';
  if (card)   card.style.display   = 'none';

  let loggedIn = false;
  try { loggedIn = await AUTH.restoreSession(); } catch(_) {}

  if (loader) loader.style.display = 'none';
  if (card)   card.style.display   = '';

  if (loggedIn || AUTH.isGuest()) { hideAuth(); initApp(); if (AUTH.isGuest()) setTimeout(maybeShowFirstVisitThemeModal, 400); return; }
  // Sinon afficher la page de connexion
}

function showAuthPage() {
  const p=$('authPage'); if(!p) return;
  p.style.display = 'flex';
}
function hideAuth() { const p=$('authPage'); if(p) p.style.display='none'; }

function setupAuthListeners() {
  // Tabs
  $$('.auth-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      $$('.auth-tab').forEach(t=>t.classList.remove('active'));
      $$('.auth-form').forEach(f=>f.classList.remove('active'));
      tab.classList.add('active');
      $(tab.dataset.target)?.classList.add('active');
    });
  });
  // Register
  $('registerForm')?.addEventListener('submit', async e=>{
    e.preventDefault(); clearFeedback();
    const pw=$('regPassword').value, cf=$('regConfirm').value;
    if(pw!==cf) return showErr('Les mots de passe ne correspondent pas.');
    const btn=e.target.querySelector('button[type=submit]');
    if(btn){ btn.disabled=true; btn.textContent='Création...'; }
    const res=await AUTH.register($('regUsername').value,$('regEmail').value,pw);
    if(btn){ btn.disabled=false; btn.innerHTML='<i class="fas fa-user-plus"></i> Créer mon compte'; }
    if(!res.ok) return showErr(res.error);
    showOk('Compte créé !'); setTimeout(()=>{hideAuth();initApp();},700);
  });
  // Login
  $('loginForm')?.addEventListener('submit', async e=>{
    e.preventDefault(); clearFeedback();
    const btn=e.target.querySelector('button[type=submit]');
    if(btn){ btn.disabled=true; btn.textContent='Connexion...'; }
    const res=await AUTH.login($('loginEmail').value,$('loginPassword').value);
    if(btn){ btn.disabled=false; btn.innerHTML='<i class="fas fa-sign-in-alt"></i> Se connecter'; }
    if(!res.ok) return showErr(res.error);
    hideAuth(); initApp();
  });
  // Guest
  $('guestBtn')?.addEventListener('click',()=>{ AUTH.enterGuest(); hideAuth(); initApp(); setTimeout(maybeShowFirstVisitThemeModal, 400); });
}

function showErr(msg) { const e=document.querySelector('.auth-error'); if(e){e.textContent=msg;e.style.display='block';} }
function showOk(msg)  { clearFeedback(); const e=document.querySelector('.auth-success'); if(e){e.textContent=msg;e.style.display='block';} }
function clearFeedback() { document.querySelectorAll('.auth-error,.auth-success').forEach(e=>{e.style.display='none';e.textContent='';}); }

// ── AFFICHER/MASQUER MOT DE PASSE ─────────────────────────────
function togglePw(inputId, btn) {
  const input=$(inputId); if(!input) return;
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  const icon = btn.querySelector('i');
  if(icon) icon.className = visible ? 'fas fa-eye' : 'fas fa-eye-slash';
  btn.style.color = visible ? 'var(--text-muted)' : 'var(--arc)';
}

// ── MOT DE PASSE OUBLIÉ ───────────────────────────────────────
function showForgotPassword() {
  $('loginForm').style.display   = 'none';
  $('forgotForm').style.display  = 'block';
  clearFeedback();
  // Pré-remplir l'email si déjà saisi
  const email = $('loginEmail')?.value;
  if(email && $('forgotEmail')) $('forgotEmail').value = email;
}
function hideForgotPassword() {
  $('forgotForm').style.display = 'none';
  $('loginForm').style.display  = '';
  clearFeedback();
}
async function submitForgotPassword() {
  const email = $('forgotEmail')?.value?.trim();
  if(!email) return showErr('Saisis ton adresse e-mail.');
  clearFeedback();
  const btn = $('forgotForm').querySelector('button.auth-btn-main');
  if(btn){ btn.disabled=true; btn.textContent='Envoi...'; }
  const res = await AUTH.sendPasswordReset(email);
  if(btn){ btn.disabled=false; btn.innerHTML='<i class="fas fa-paper-plane"></i> Envoyer le lien'; }
  if(!res.ok) return showErr(res.error);
  showOk(`Lien envoyé à ${email} ! Vérifie ta boîte mail.`);
  setTimeout(hideForgotPassword, 3000);
}

// ── APP ───────────────────────────────────────────────────────
function initApp() {
  loadCustomThemeIfNeeded();
  loadSavedTheme();
  loadSavedNavPosition();
  loadSavedNavBrightness();
  initGlobalKeyboardShortcuts();
  renderNavUser();
  renderNotification();
  checkUpdateModal();
  renderHero();
  renderUniverses();
  renderCinematics();
  renderMappings();
  renderGallery();
  renderHistory();
  renderMyList();
  renderSocial();
  setupNavEvents();
  setupScrollEffects();
  setupSearch();
  setupHeroSwipe();
  setupKeyboardShortcuts();
  _setupKonamiCode();
  initZYInteractif();
  startHeroAuto();
  ROUTER.init();
  checkTwitchLive();
  setTimeout(initLazyBg, 100);
  setTimeout(initCreatorTimelineReveal, 100);
  initScrollTopBtn();
  const redirect = sessionStorage.getItem('ipx_redirect');
  if (redirect) { sessionStorage.removeItem('ipx_redirect'); }
  if(AUTH.isGuest()) setTimeout(()=>toast('Mode invité — données non sauvegardées.','warning'),1200);
  // Re-render after DB data may have loaded asynchronously
  setTimeout(() => { renderHistory(); renderMyList(); renderNavUser(); }, 600);
  setTimeout(() => { renderHistory(); renderMyList(); }, 1500);
}

function initScrollTopBtn() {
  if($('scrollTopBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.title = 'Haut de page';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  window.addEventListener('scroll', throttle(() => btn.classList.toggle('visible', scrollY > 400), 100), { passive: true });
}

// ── TWITCH LIVE ───────────────────────────────────────────────
async function checkTwitchLive() {
  const badge = $('liveBadge');

  // En local : erreur orange (la fonction Netlify ne tourne pas)
  if(IS_LOCAL) {
    _setLiveBadge('error');
    _setLiveSection('error', null);
    return;
  }

  try {
    // 1. Statut online/offline
    const res = await fetch('/.netlify/functions/live-on-twitch');
    if(!res.ok) throw new Error('http_' + res.status);
    const data = await res.json();
    if(data.error) throw new Error(data.error);

    if(data.status === 'online') {
      _setLiveBadge('online');
      _setLiveSection('online', data);
    } else {
      // offline — récupérer aussi les infos du dernier live (titre, date)
      _setLiveBadge('offline');
      // Appel secondaire pour date + titre
      try {
        const res2 = await fetch('/.netlify/functions/live-on-twitch', {
          headers: { 'x-last-live': 'true' }
        });
        const data2 = await res2.json();
        _setLiveSection('offline', data2);
      } catch {
        _setLiveSection('offline', null);
      }
    }
  } catch {
    _setLiveBadge('error');
    _setLiveSection('error', null);
  }
}

// Mettre à jour le badge navbar
function _setLiveBadge(status) {
  const badge = $('liveBadge');
  if(!badge) return;

  // Reset styles
  badge.style.cssText = '';

  if(status === 'online') {
    badge.innerHTML = `<span class="live-dot" style="background:#2ecc71;box-shadow:0 0 8px #2ecc71;"></span><span class="live-text">EN LIVE</span>`;
    badge.style.background  = 'rgba(39,174,96,0.15)';
    badge.style.borderColor = '#27ae60';
    badge.style.color       = '#2ecc71';
  } else if(status === 'offline') {
    badge.innerHTML = `<span class="live-dot" style="background:#e74c3c;animation:none;box-shadow:none;"></span><span class="live-text">HORS-LIVE</span>`;
    badge.style.background  = 'rgba(231,76,60,0.12)';
    badge.style.borderColor = 'rgba(231,76,60,0.5)';
    badge.style.color       = '#e74c3c';
    badge.style.opacity     = '0.85';
  } else {
    // error / local
    badge.innerHTML = `<span class="live-dot" style="background:#e67e22;animation:none;box-shadow:none;"></span><span class="live-text">ERREUR</span>`;
    badge.style.background  = 'rgba(230,126,34,0.12)';
    badge.style.borderColor = 'rgba(230,126,34,0.45)';
    badge.style.color       = '#e67e22';
    badge.style.opacity     = '0.8';
  }
}

// Mettre à jour la section live sur la page principale
function _setLiveSection(status, data) {
  const section     = $('liveSectionBlock');
  const dot         = $('liveDotInline');
  const titleText   = $('liveTitleText');
  const subtitle    = $('liveSubtitle');
  const statVal     = $('liveStatVal');
  const statLabel   = $('liveStatLabel');
  const statDate    = $('liveStatDate');
  const statDateVal = $('liveStatDateVal');
  const btnText     = $('liveBtnText');
  if(!section) return;

  if(status === 'online') {
    // Vert
    section.style.borderColor = '#27ae60';
    section.style.boxShadow   = '0 0 30px rgba(39,174,96,0.15), inset 0 0 20px rgba(39,174,96,0.05)';
    if(dot) { dot.style.background='#2ecc71'; dot.style.boxShadow='0 0 8px #2ecc71'; }
    if(titleText) titleText.textContent = 'iProMx est EN LIVE !';
    // Titre du stream si dispo
    const streamTitle = data?.streamTitle || data?.title || '';
    if(subtitle) subtitle.innerHTML = streamTitle
      ? `<strong>${streamTitle}</strong>`
      : `Retrouvez <strong>iProMx</strong> en direct sur Twitch.`;
    if(statVal) statVal.textContent    = '🟢 EN DIRECT';
    if(statLabel) statLabel.textContent = '';
    if(statDate) statDate.style.display = 'none';
    if(btnText) btnText.textContent     = 'Regarder en direct';

  } else if(status === 'offline') {
    // Rouge
    section.style.borderColor = 'rgba(231,76,60,0.3)';
    section.style.boxShadow   = '';
    if(dot) { dot.style.background='#e74c3c'; dot.style.boxShadow='none'; dot.style.animation='none'; }
    if(titleText) titleText.textContent = 'iProMx est hors ligne';
    // Titre channel même hors live (iProMx peut avoir changé son titre)
    const chanTitle = data?.title || '';
    if(subtitle) subtitle.innerHTML = chanTitle
      ? `Dernier titre de live : <strong>${chanTitle}</strong>`
      : `Retrouvez iProMx sur <strong>Twitch</strong> pour les prochains lives.`;
    if(statVal) statVal.textContent    = '🔴 HORS LIGNE';
    if(statLabel) statLabel.textContent = '';
    // Date du dernier live
    if(data?.lastLive) {
      if(statDate) statDate.style.display = '';
      if(statDateVal) statDateVal.textContent = data.lastLive;
    } else {
      if(statDate) statDate.style.display = 'none';
    }
    if(btnText) btnText.textContent = 'Voir la chaîne Twitch';

  } else {
    // Erreur / local — orange, affichage neutre
    section.style.borderColor = 'rgba(230,126,34,0.25)';
    section.style.boxShadow   = '';
    if(dot) { dot.style.background='#e67e22'; dot.style.boxShadow='none'; dot.style.animation='none'; }
    if(titleText) titleText.textContent = 'iProMx sur Twitch';
    if(subtitle) subtitle.innerHTML     = `Retrouvez <strong>iProMx</strong> en direct sur Twitch.`;
    if(statVal) statVal.textContent     = '⚠️ INCONNU';
    if(statLabel) statLabel.textContent = '';
    if(statDate) statDate.style.display = 'none';
    if(btnText) btnText.textContent     = 'Voir sur Twitch';
  }
}

// ── NAVBAR ────────────────────────────────────────────────────
function renderNavUser() {
  const user=AUTH.getCurrentUser(), area=$('navUserArea'); if(!area) return;
  const initial=(user?.username||'G')[0].toUpperCase();
  const name=user?user.username:'Invité';
  const email=user?user.email:'';
  const avList = typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS : [];
  const av = avList.find(a=>a.id===user?.avatarId);
  const avatarHtml = av
    ? `<img src="${av.src}" id="uAvatarBtn" onclick="event.stopPropagation();toggleDD()" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--arc);cursor:pointer;box-shadow:0 0 10px var(--arc-dim);" onerror="this.outerHTML='<div class=\\'user-avatar-placeholder\\' onclick=\\'event.stopPropagation();toggleDD()\\' style=\\'width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--iron),var(--arc));display:flex;align-items:center;justify-content:center;font-weight:700;color:white;cursor:pointer;\\'>${initial}</div>'">`
    : `<div class="user-avatar-placeholder" id="uAvatarBtn" onclick="event.stopPropagation();toggleDD()" style="cursor:pointer;">${initial}</div>`;
  area.innerHTML=`
    <div style="position:relative;" id="uMenu">
      ${avatarHtml}
      <div class="user-dropdown" id="uDD">
        <div class="dropdown-header">
          <div class="dropdown-username">${name}</div>
          ${email?`<div class="dropdown-email">${email}</div>`:''}
        </div>
        <button class="dropdown-item" onclick="openSettings()"><i class="fas fa-cog"></i> Paramètres</button>
        ${AUTH.isGuest()||IS_LOCAL
          ?`<button class="dropdown-item" onclick="AUTH.logout().then(()=>location.reload())"><i class="fas fa-sign-in-alt"></i> Se connecter</button>`
          :`<button class="dropdown-item danger" onclick="AUTH.logout().then(()=>location.reload())"><i class="fas fa-sign-out-alt"></i> Déconnexion</button>`}
      </div>
    </div>`;
  // onclick géré directement dans le HTML ci-dessus (plus fiable que addEventListener post-render)
}
function toggleDD() { $('uDD')?.classList.toggle('open'); }
function closeDD()  { $('uDD')?.classList.remove('open'); }

// ── HERO ──────────────────────────────────────────────────────
let heroIdx=0, heroTimer=null;
function renderHero() { updateHero(0); }
function updateHero(i) {
  heroIdx=i;
  const slide=HERO_SLIDES[i], char=getChar(slide.familyId,slide.charId), u=DATA.universes[slide.familyId];
  if(!char) return;
  const bg=char.banner||u.banner||char.image;
  const first=getFirstEp(char), inList=DB.isInList(slide.familyId,slide.charId);
  const totEps=getTotalEps(char), totS=Object.keys(char.seasons||{}).length;
  const bgEl=document.querySelector('.hero-bg');
  if(bgEl) bgEl.style.backgroundImage=`url('${bg}')`;
  const cont=document.querySelector('.hero-content');
  if(cont) cont.innerHTML=`
    <div class="hero-badge"><i class="fas fa-fire"></i> ${u.name}</div>
    <h1 class="hero-title">${char.name}</h1>
    <p class="hero-desc">${char.description}</p>
    <div class="hero-meta">
      ${totEps>0?`<span class="hero-tag">${totEps} ÉP.</span>`:''}
      ${totS>0?`<span class="hero-tag">${totS} SAISON${totS>1?'S':''}</span>`:''}
      <span class="hero-tag">GTA 5 RP</span>
    </div>
    <div class="hero-actions">
      ${first
        ?`<a class="btn-primary" href="${ROUTER.buildURL(slide.familyId,slide.charId,first.season,first.ep.num)}" style="text-decoration:none;"><i class="fas fa-play"></i> Regarder</a>`
        :`<a class="btn-primary" href="${ROUTER.charURL(slide.familyId,slide.charId)}" style="text-decoration:none;"><i class="fas fa-info-circle"></i> Découvrir</a>`}
      <a class="btn-secondary" href="${ROUTER.charURL(slide.familyId,slide.charId)}" style="text-decoration:none;"><i class="fas fa-info-circle"></i> Plus d'infos</a>
      <button class="btn-icon${inList?' active':''}" onclick="toggleList('${slide.familyId}','${slide.charId}',this)"><i class="fas fa-${inList?'check':'plus'}"></i></button>
      <button class="btn-icon" onclick="surpriseMe()" title="Surprends-moi"><i class="fas fa-dice"></i></button>
    </div>`;
  const dots=document.querySelector('.hero-indicators');
  if(dots) dots.innerHTML=HERO_SLIDES.map((_,j)=>`<div class="hero-dot${j===i?' active':''}" onclick="goHero(${j})"></div>`).join('');
}
function goHero(i) { updateHero(i); clearInterval(heroTimer); startHeroAuto(); }
function startHeroAuto() { heroTimer=setInterval(()=>updateHero((heroIdx+1)%HERO_SLIDES.length),8000); }

// ── MODE ALÉATOIRE — "Surprends-moi" ────────────────────────────
// Pioche au hasard un épisode, une cinématique ou un mapping et y navigue
// directement. Mélange pondéré : les épisodes (contenu principal) ont plus
// de poids que les cinématiques/mappings (contenu plus ponctuel).
function surpriseMe() {
  const pool = [];
  getAllChars().forEach(c => {
    Object.entries(c.seasons || {}).forEach(([season, eps]) => {
      eps.forEach(ep => {
        pool.push({ type: 'episode', weight: 3, go: () => location.href = ROUTER.buildURL(c.familyId, c.id, season, ep.num) });
      });
    });
  });
  (DATA.cinematics || []).forEach((_, i) => {
    pool.push({ type: 'cinematic', weight: 1, go: () => location.href = SLUG.cineURL(i) });
  });
  (DATA.mappings || []).forEach((_, i) => {
    pool.push({ type: 'mapping', weight: 1, go: () => location.href = SLUG.mapURL(i) });
  });
  if (!pool.length) { toast('Rien à découvrir pour le moment.', 'warning'); return; }

  const weighted = [];
  pool.forEach(item => { for (let k = 0; k < item.weight; k++) weighted.push(item); });
  const pick = weighted[Math.floor(Math.random() * weighted.length)];

  toast('En route vers une surprise...', 'success');
  zyReactToRapidClicks('surpriseMe');
  zyReact('surpriseMe');
  setTimeout(() => pick.go(), 350);
}
window.surpriseMe = surpriseMe;

// ── EASTER EGG — Konami Code (page d'accueil uniquement) ────────
// ↑ ↑ ↓ ↓ ← → ← → B A → confettis + réplique sarcastique de ZY.
const KONAMI_SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let _konamiProgress = 0;
const ZY_KONAMI_LINES = [
  "Tiens, le Konami Code. Une suite de touches vieille de 40 ans, retrouvée avec brio... pour ne débloquer strictement rien d'utile. Mais bravo, sincèrement.",
  "Konami Code détecté. Tu viens de prouver que tu maîtrises ton clavier. C'est une compétence. Pas franchement rentable, mais c'en est une.",
  "Séquence reconnue. Je dois avouer un léger respect... immédiatement annulé par le constat que ça ne sert absolument à rien.",
];
function _setupKonamiCode() {
  if (window._konamiListenerBound) return;
  window._konamiListenerBound = true;
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI_SEQUENCE[_konamiProgress]) {
      _konamiProgress++;
      if (_konamiProgress === KONAMI_SEQUENCE.length) {
        _konamiProgress = 0;
        triggerKonamiEasterEgg();
      }
    } else {
      _konamiProgress = (key === KONAMI_SEQUENCE[0]) ? 1 : 0;
    }
  });
}
function triggerKonamiEasterEgg() {
  _spawnConfetti();
  const line = ZY_KONAMI_LINES[Math.floor(Math.random() * ZY_KONAMI_LINES.length)];
  toastZY(line);
}
function _spawnConfetti() {
  const colors = [
    getComputedStyle(document.documentElement).getPropertyValue('--arc').trim() || '#4fc3ff',
    getComputedStyle(document.documentElement).getPropertyValue('--iron-bright').trim() || '#8b5cf6',
    '#ffffff',
  ];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;overflow:hidden;';
  document.body.appendChild(container);
  const COUNT = 70;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = 2.2 + Math.random() * 1.4;
    const delay = Math.random() * 0.4;
    const rotate = Math.random() * 360;
    p.style.cssText = `position:absolute;top:-20px;left:${left}vw;width:${size}px;height:${size*0.4}px;background:${color};
      opacity:.9;border-radius:1px;transform:rotate(${rotate}deg);
      animation:konamiFall ${duration}s ${delay}s cubic-bezier(.4,0,.6,1) forwards;`;
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 4200);
}
// Petite bulle façon "ZY parle" — réutilisée aussi par le futur ZY interactif
function toastZY(text) {
  let bubble = $('zySpeechBubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'zySpeechBubble';
    bubble.className = 'zy-speech-bubble';
    document.body.appendChild(bubble);
  }
  bubble.innerHTML = `
    <div class="zy-speech-avatar"><i class="fas fa-robot"></i></div>
    <div class="zy-speech-content">
      <div class="zy-speech-text">${text}</div>
    </div>
    <button class="zy-speech-close" onclick="dismissZYBubble()"><i class="fas fa-times"></i></button>`;
  bubble.classList.add('visible');
  clearTimeout(_zyBubbleTimer);
  _zyBubbleTimer = setTimeout(dismissZYBubble, 7000);
}
let _zyBubbleTimer = null;
function dismissZYBubble() { $('zySpeechBubble')?.classList.remove('visible'); }
window.dismissZYBubble = dismissZYBubble;
window.toastZY = toastZY;

// ══════════════════════════════════════════════════════════════
// ZY INTERACTIF — compagnon ambiant réagissant aux actions
// ══════════════════════════════════════════════════════════════
// Principes :
// - Jamais en mode invité (retiré entièrement, aucune trace).
// - Activable/désactivable dans les paramètres (compte connecté).
// - Chaque bulle porte un lien "Désactiver ZY interactif" → paramètres.
// - Conçu pour un coût quasi nul : aucun intervalle/poll, uniquement des
//   accroches ponctuelles sur des actions déjà existantes + un seul timer
//   d'inactivité (réinitialisé, jamais empilé) + garde-fous probabilité
//   et cooldown pour rester discret et ne jamais spammer.
const ZY_INTERACTIF_KEY = 'ipx_zy_interactif_enabled';
const ZY_REACT_COOLDOWN_MS = 55_000; // au moins 55s entre deux réactions
const ZY_REACT_PROBABILITY = 0.35;   // ~1 chance sur 3 à chaque déclencheur "normal"
let _zyLastReactAt = 0;
let _zyClickCounts = {};

function isZYInteractifAllowed() {
  if (typeof AUTH === 'undefined') return false;
  if (AUTH.isGuest && AUTH.isGuest()) return false; // jamais en invité, sans exception
  return !!(AUTH.getCurrentUser && AUTH.getCurrentUser());
}
function isZYInteractifEnabled() {
  if (!isZYInteractifAllowed()) return false;
  const saved = localStorage.getItem(ZY_INTERACTIF_KEY);
  return saved === null ? true : saved === '1'; // activé par défaut pour les comptes
}
function setZYInteractifEnabled(on) {
  localStorage.setItem(ZY_INTERACTIF_KEY, on ? '1' : '0');
}

// Banque de répliques courtes, par contexte. Ton : sec, sarcastique, jamais
// méchant — cohérent avec la personnalité déjà établie de ZY.
const ZY_LINES = {
  addToList: [
    "Ajouté à ta liste. Je note, sans juger. Beaucoup.",
    "Encore un ajout. Ta liste devient presque aussi longue que mes archives.",
    "Bon choix. Ou pas. Je garde ça pour moi.",
  ],
  removeFromList: [
    "Retiré. Une rupture de plus dans ta vie de spectateur.",
    "Parti. J'espère que tu sais ce que tu fais.",
  ],
  themeChange: [
    "Nouveau thème. Esthétiquement discutable, mais c'est ton écran.",
    "Changement de couleurs détecté. Je m'adapte. Je ne juge pas. Enfin, un peu.",
    "Un thème de plus testé. À ce rythme tu vas tous les épuiser avant moi.",
  ],
  surpriseMe: [
    "Tirage aléatoire effectué. Ne me remercie pas, c'est littéralement mon seul vrai talent ici.",
    "Un choix au hasard. Si c'est mauvais, ce n'est pas ma faute, c'est les probabilités.",
  ],
  rapidClicks: [
    "Tu peux arrêter de cliquer comme ça ? Je suis rapide, pas increvable.",
    "J'ai bien reçu tes 47 clics. Un seul aurait suffi, mais bon.",
    "Calme-toi. Le bouton ne va nulle part, promis.",
  ],
  idle: [
    "Toujours là ? Ou t'es juste parti chercher un café en laissant l'onglet ouvert.",
    "Le silence, ça va deux minutes. Fais quelque chose, ou je vais m'ennuyer aussi.",
  ],
  episodeEnd: [
    "Épisode terminé. Le suivant t'attend, si le courage suit.",
  ],
};

function _zyDisableLinkHTML() {
  return `<div style="margin-top:8px;"><a href="#" onclick="event.preventDefault();dismissZYBubble();openSettings();" style="font-family:var(--font-ui);font-size:.72rem;color:var(--text-muted);text-decoration:underline;">Désactiver ZY interactif</a></div>`;
}

// Point d'entrée central : à appeler depuis n'importe quelle action du site.
// type = clé de ZY_LINES. Gère lui-même invité/désactivé/probabilité/cooldown.
function zyReact(type) {
  if (!isZYInteractifEnabled()) return;
  const now = Date.now();
  if (now - _zyLastReactAt < ZY_REACT_COOLDOWN_MS) return;
  if (Math.random() > ZY_REACT_PROBABILITY) return;
  const lines = ZY_LINES[type];
  if (!lines || !lines.length) return;
  _zyLastReactAt = now;
  const line = lines[Math.floor(Math.random() * lines.length)];
  toastZY(line + _zyDisableLinkHTML());
}

// Cas "énervement" : clics répétés sur une même action en peu de temps.
// Contourne le cooldown normal (c'est justement le but : réagir à l'excès).
function zyReactToRapidClicks(key) {
  if (!isZYInteractifEnabled()) return;
  const now = Date.now();
  const entry = _zyClickCounts[key] || { count: 0, since: now };
  if (now - entry.since > 4000) { entry.count = 0; entry.since = now; }
  entry.count++;
  _zyClickCounts[key] = entry;
  if (entry.count >= 4 && now - _zyLastReactAt > 15000) {
    _zyLastReactAt = now;
    entry.count = 0;
    const lines = ZY_LINES.rapidClicks;
    toastZY(lines[Math.floor(Math.random() * lines.length)] + _zyDisableLinkHTML());
  }
}

// Timer d'inactivité unique (jamais empilé) — coût négligeable.
let _zyIdleTimer = null;
function _resetZYIdleTimer() {
  if (!isZYInteractifEnabled()) return;
  clearTimeout(_zyIdleTimer);
  _zyIdleTimer = setTimeout(() => {
    if (Math.random() <= ZY_REACT_PROBABILITY) {
      const lines = ZY_LINES.idle;
      toastZY(lines[Math.floor(Math.random() * lines.length)] + _zyDisableLinkHTML());
    }
    _resetZYIdleTimer();
  }, 4 * 60 * 1000); // 4 minutes d'inactivité
}
function initZYInteractif() {
  if (!isZYInteractifAllowed()) return; // jamais construit pour les invités
  if (window._zyInteractifListenersBound) { _resetZYIdleTimer(); return; }
  window._zyInteractifListenersBound = true;
  ['click', 'keydown', 'scroll'].forEach(evt =>
    window.addEventListener(evt, throttle(_resetZYIdleTimer, 5000), { passive: true })
  );
  _resetZYIdleTimer();
}
window.zyReact = zyReact;
window.zyReactToRapidClicks = zyReactToRapidClicks;
window.initZYInteractif = initZYInteractif;


// ── UNIVERSES ─────────────────────────────────────────────────
function renderUniverses(filter='all') {
  const track=$('universesTrack'); if(!track) return;
  const chars=getAllChars().filter(c=>filter==='all'||c.familyId===filter);
  const cnt=$('univCount'); if(cnt) cnt.textContent=getAllChars().length;
  track.innerHTML=chars.map(c=>{
    const eps=getTotalEps(c);
    const prog=getOverallProgress(c.familyId,c.id);
    const R=16, circ=2*Math.PI*R;
    return `<a class="card" data-family="${c.familyId}" href="${ROUTER.charURL(c.familyId,c.id)}" style="text-decoration:none;">
      <div class="card-thumb lazy-bg" data-bg="${c.image}" style="background-color:var(--panel2);">
        <div class="card-play-icon"><i class="fas fa-${hasContent(c)?'play':'info-circle'}"></i></div>
        ${eps>0?`<div class="card-badge">${eps} ÉP.</div>`:c.hasLocalVideo?`<div class="card-badge" style="background:var(--gold);color:#000;">VIDÉO</div>`:c.hasLawBook?`<div class="card-badge" style="background:#9b59b6;">LOIS</div>`:''}
        ${prog>0?`<div class="card-ring"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="${R}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3"/><circle cx="20" cy="20" r="${R}" fill="none" stroke="${prog>=100?'#2ecc71':'var(--arc)'}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(prog/100*circ).toFixed(1)} ${circ}" transform="rotate(-90 20 20)"/></svg><span class="card-ring-pct">${prog}%</span></div>`:''}
      </div>
      <div class="card-info"><div class="card-title">${c.name}</div><div class="card-meta">${c.family.name}</div></div>
    </a>`;
  }).join('');
  setTimeout(()=>{ setupCarousel('universesTrack','univPrev','univNext'); initLazyBg(); },50);
}
function filterFamily(fam) {
  $$('.filter-tab').forEach(t=>t.classList.toggle('active',t.dataset.filter===fam));
  renderUniverses(fam);
}

// ── HISTORY ───────────────────────────────────────────────────
function renderHistory() {
  const hist=DB.getHistory();
  const sec=$('secHistory'); if(sec) sec.style.display=hist.length?'block':'none';
  const track=$('historyTrack'); if(!track) return;
  track.innerHTML=hist.map(h=>{
    const char=getChar(h.familyId,h.charId); if(!char) return '';
    const prog=DB.getProgress(h.familyId,h.charId,h.season,h.epNum).pct||0;
    const epUrl=ROUTER.buildURL(h.familyId,h.charId,h.season,h.epNum);
    return `<a class="card wide" href="${epUrl}" style="text-decoration:none;">
      <div class="card-thumb lazy-bg" data-bg="${ytThumb(h.videoId)}" style="background-color:var(--panel2);">
        <div class="card-play-icon"><i class="fas fa-play"></i></div>
        <div class="card-progress"><div class="card-progress-bar" style="width:${prog}%"></div></div>
      </div>
      <div class="card-info"><div class="card-title">${char.name}</div><div class="card-meta">EP ${h.epNum} · ${h.season}</div></div>
    </a>`;
  }).join('');
  setTimeout(()=>{ setupCarousel('historyTrack','histPrev','histNext',272); initLazyBg(); },50);
}

// ── MY LIST ───────────────────────────────────────────────────
function renderMyList() {
  const myList=DB.getMyList();
  const sec=$('secMyList'); if(sec) sec.style.display=myList.length?'block':'none';
  const track=$('myListTrack'); if(!track) return;
  track.innerHTML=myList.map(item=>{
    const char=getChar(item.familyId,item.charId); if(!char||!DATA.universes[item.familyId]) return '';
    const charUrl=ROUTER.charURL(item.familyId,item.charId);
    return `<a class="card" href="${charUrl}" style="text-decoration:none;">
      <div class="card-thumb lazy-bg" data-bg="${char.image}" style="background-color:var(--panel2);"><div class="card-play-icon"><i class="fas fa-play"></i></div></div>
      <div class="card-info"><div class="card-title">${char.name}</div><div class="card-meta">${DATA.universes[item.familyId].name}</div></div>
    </a>`;
  }).join('');
  setTimeout(()=>{ setupCarousel('myListTrack','listPrev','listNext'); initLazyBg(); },50);
}
function toggleList(fid,cid,btn) {
  if(AUTH.isGuest()&&!IS_LOCAL) return toast('Connectez-vous pour gérer votre liste.','warning');
  if(DB.isInList(fid,cid)){
    DB.removeFromList(fid,cid);
    if(btn){btn.innerHTML='<i class="fas fa-plus"></i>';btn.classList.remove('active');}
    toast('Retiré de votre liste.','info');
    zyReact('removeFromList');
  } else {
    DB.addToList({familyId:fid,charId:cid,name:getChar(fid,cid)?.name});
    if(btn){btn.innerHTML='<i class="fas fa-check"></i>';btn.classList.add('active');}
    toast('Ajouté à votre liste !','success');
    zyReact('addToList');
  }
  renderMyList();
}

// ── SOCIAL ────────────────────────────────────────────────────
function renderSocial() {
  const g=$('socialGrid'); if(!g) return;
  g.innerHTML = DATA.social.map(s => `
    <a href="${s.url}" target="_blank" class="social-card" style="--sc-color:${s.color};">
      <div class="social-card-banner"><i class="${s.icon}"></i></div>
      <div class="social-card-body">
        <div class="social-card-name">${s.name}</div>
        ${s.stat ? `<div class="social-card-stat"><i class="fas fa-user-group"></i>${s.stat} abonnés</div>` : ''}
        <div class="social-card-cta"><i class="${s.ctaIcon||s.icon}"></i><span>${s.cta}</span></div>
      </div>
    </a>`).join('');
}

// ── NOTIFICATION BANNER ───────────────────────────────────────
function renderNotification() {
  const banner = $('notifBanner');
  const inner  = $('notifInner');
  if (!banner || !inner) return;

  const notifs = DATA.notifications || { update: DATA.notification };
  if (!notifs) {
    banner.style.display = 'none';
    return;
  }

  let html = '';

  const buildNotifHtml = (n, type) => {
    if (!n || !n.active) return '';
    
    let actionBtn = '';
    // Logique spécifique : seul le bloc 'episode' affiche le bouton lecture
    if (type === 'episode' && n.link) {
      const char = getChar(n.link.familyId, n.link.charId);
      const eps  = char?.seasons?.[n.link.season] || [];
      const epIdx = eps.findIndex(e => e.num === n.link.epNum);
      
      if (epIdx >= 0) {
        actionBtn = `<button onclick="playEp('${n.link.familyId}','${n.link.charId}','${esc(n.link.season)}',${epIdx})"
          style="flex-shrink:0;padding:9px 20px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));
                 border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);
                 font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;
                 box-shadow:0 3px 12px var(--iron-glow);white-space:nowrap;transition:all .2s;">
          <i class="fas fa-play"></i> Regarder
        </button>`;
      }
    }

    const labelColor = type === 'episode' ? 'var(--iron-bright)' : 'var(--arc)';
    const borderColor = type === 'episode' ? 'rgba(231,76,60,0.3)' : 'rgba(var(--arc-rgb), 0.25)';
    const bgGradient = type === 'episode' 
       ? 'linear-gradient(135deg,rgba(231,76,60,0.1),rgba(192,57,43,0.05))'
       : 'linear-gradient(135deg,rgba(var(--arc-rgb), 0.08),rgba(231,76,60,0.04))';

    return `
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 20px;
                  background:${bgGradient};border:1px solid ${borderColor};
                  border-left:3px solid ${labelColor};border-radius:var(--radius);position:relative;">
        <span style="flex-shrink:0;padding:3px 10px;background:${labelColor};color:var(--void);
                     font-family:var(--font-display);font-size:.55rem;font-weight:900;
                     letter-spacing:2px;border-radius:3px;text-transform:uppercase;">${n.label||'INFO'}</span>
        <span style="flex:1;font-family:var(--font-body);font-size:.95rem;color:var(--text-dim);min-width:150px;line-height:1.5;">
          ${Array.isArray(n.texts) ? n.texts.join('<br>') : (n.text || n.texts)}
        </span>
        ${actionBtn}
      </div>`;
  };

  // notifications.episode peut être UN objet (ancien format, toujours supporté)
  // ou UN TABLEAU d'objets pour afficher plusieurs notifs "nouvel épisode" à la fois.
  const episodeList = Array.isArray(notifs.episode) ? notifs.episode : (notifs.episode ? [notifs.episode] : []);
  html += episodeList.map(n => buildNotifHtml(n, 'episode')).join('');
  html += buildNotifHtml(notifs.update, 'update');

  if (html) {
    inner.innerHTML = html;
    inner.style.display = 'flex';
    inner.style.flexDirection = 'column';
    inner.style.gap = '12px';
    inner.style.marginTop = '16px';
    banner.style.display = '';
  } else {
    banner.style.display = 'none';
  }
}

// ── MODAL DE MISE À JOUR (à l'arrivée sur le site) ──────────────
// "DERNIÈRE MISE À JOUR" — totalement indépendant de la bannière "RAPPEL DE
// NOUVEAUTÉS" (notifications.update) : source (DATA.updateModal) et contenu
// différents. Affiché une seule fois par version grâce à un stockage 100%
// local (localStorage) — pas de Firestore ici, cette préférence n'a pas
// besoin d'être synchronisée entre appareils.
// Pour forcer le modal à réapparaître pour tout le monde : changez `version`
// dans data.js (DATA.updateModal.version). Cette version n'est jamais
// affichée publiquement, elle ne sert qu'en interne à cette comparaison.
const UPDATE_MODAL_DISMISS_KEY = 'ipx_update_dismissed_version';

function checkUpdateModal() {
  const n = DATA.updateModal;
  if (!n || !n.active || !n.version) return;
  const dismissed = localStorage.getItem(UPDATE_MODAL_DISMISS_KEY);
  if (dismissed === n.version) return;
  renderUpdateModal(n);
}

function renderUpdateModal(n) {
  const modal = $('updateModal');
  const body  = $('updateModalBody');
  if (!modal || !body) return;
  const items = Array.isArray(n.texts) ? n.texts : (n.text ? [n.text] : []);
  body.innerHTML = `
    <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:900;color:var(--text);letter-spacing:.5px;margin-bottom:18px;">${escHtml(n.label || 'Mise à jour')}</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:26px;">
      ${items.map(t => `<div style="font-family:var(--font-body);font-size:.92rem;color:var(--text-dim);line-height:1.6;">${escHtml(t)}</div>`).join('')}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="live-btn" onclick="closeUpdateModal()"><i class="fas fa-check"></i> Fermer</button>
      <button onclick="dismissUpdateModal('${esc(n.version)}')" style="background:none;border:1px solid var(--edge2);border-radius:var(--radius);color:var(--text-muted);font-family:var(--font-display);font-size:.62rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:12px 20px;cursor:pointer;transition:var(--transition);" onmouseover="this.style.borderColor='var(--arc)';this.style.color='var(--arc)'" onmouseout="this.style.borderColor='var(--edge2)';this.style.color='var(--text-muted)'">Ne plus voir jusqu'à la prochaine mise à jour</button>
    </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeUpdateModal() {
  const m = $('updateModal'); if (!m) return;
  m.style.display = 'none';
  document.body.style.overflow = '';
}
function dismissUpdateModal(version) {
  localStorage.setItem(UPDATE_MODAL_DISMISS_KEY, version);
  closeUpdateModal();
}
window.closeUpdateModal   = closeUpdateModal;
window.dismissUpdateModal = dismissUpdateModal;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeUpdateModal(); });

// ── GALERIE ───────────────────────────────────────────────────
// Ajoutez vos images ici au format 'https://ik.imagekit.io/ipromx/images/download/example.jpg'
// Helper pour créer une entrée galerie : src = affichage, dl = téléchargement ImageKit
const _gimg = url => ({ src: url, dl: url + '?ik-attachment=true' });

const GALLERY_IMAGES = [  // 368 images
 _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img125.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img233.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img292.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img69.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img42.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img161.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img209.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img58.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img30.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img193.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img241.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img41.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img358.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img204.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img315.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img76.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img200.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img2.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img127.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img84.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img320.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img226.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img77.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img171.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img107.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img123.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img236.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img352.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img174.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img131.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img8.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img279.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img74.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img254.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img83.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img33.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img234.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img299.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img7.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img235.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img347.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img54.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img253.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img196.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img264.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img278.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img314.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img67.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img271.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img101.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img212.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img256.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img323.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img316.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img180.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img183.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img72.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img40.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img325.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img114.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img238.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img262.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img17.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img167.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img303.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img227.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img270.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img246.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img63.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img163.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img350.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img312.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img134.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img1.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img281.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img237.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img297.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img147.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img222.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img220.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img225.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img136.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img203.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img300.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img81.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img11.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img176.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img354.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img317.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img247.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img216.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img141.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img197.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img173.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img199.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img158.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img185.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img342.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img118.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img50.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img310.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img105.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img318.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img294.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img111.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img166.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img138.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img27.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img155.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img151.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img322.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img340.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img181.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img21.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img65.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img85.1.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img219.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img61.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img245.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img304.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img159.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img308.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img28.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img168.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img124.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img68.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img273.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img79.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img92.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img80.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img223.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img75.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img4.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img205.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img3.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img116.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img184.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img126.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img96.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img215.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img71.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img259.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img337.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img48.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img172.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img129.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img217.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img291.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img307.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img269.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img230.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img290.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img295.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img221.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img353.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img47.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img319.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img46.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img14.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img276.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img272.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img267.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img332.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img117.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img152.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img362.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img132.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img115.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img87.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img26.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img13.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img189.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img364.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img195.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img186.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img333.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img305.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img179.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img49.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img29.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img366.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img121.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img334.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img59.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img102.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img112.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img36.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img119.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img343.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img12.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img198.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img122.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img39.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img98.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img165.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img140.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img367.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img288.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img43.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img309.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img95.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img329.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img244.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img148.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img298.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img60.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img130.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img248.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img210.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img103.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img361.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img336.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img266.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img283.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img73.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img201.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img157.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img326.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img6.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img275.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img339.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img239.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img109.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img360.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img31.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img306.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img293.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img106.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img302.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img143.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img263.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img15.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img335.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img338.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img214.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img187.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img324.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img240.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img218.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img202.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img359.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img24.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img137.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img311.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img88.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img268.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img229.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img133.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img57.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img327.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img284.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img191.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img224.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img52.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img23.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img265.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img150.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img274.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img113.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img91.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img156.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img313.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img97.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img9.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img5.1.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img10.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img139.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img211.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img346.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img250.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img154.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img51.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img160.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img135.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img22.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img277.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img104.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img170.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img37.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img289.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img153.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img90.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img243.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img355.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img249.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img344.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img175.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img182.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img349.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img110.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img45.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img93.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img261.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img260.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img128.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img368.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img56.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img25.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img207.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img120.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img20.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img231.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img100.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img38.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img213.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img16.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img282.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img321.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img190.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img169.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img89.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img363.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img55.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img18.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img162.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img78.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img341.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img44.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img194.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img32.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img242.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img286.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img142.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img35.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img301.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img331.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img348.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img252.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img296.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img164.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img257.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img287.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img82.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img188.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img365.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img206.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img345.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img145.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img70.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img53.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img357.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img66.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img177.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img356.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img258.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img99.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img208.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img280.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img328.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img34.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img146.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img108.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img144.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img330.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img94.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img62.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img19.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img232.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img86.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img255.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img251.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img285.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img64.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img178.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img149.webp'), //grande image
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img351.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img192.webp'),
  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img228.webp')
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── ÉTAT GALERIE ──────────────────────────────────────────────
let _galVisible = 20;           // nombre d'images actuellement affichées
const _galStep  = 20;           // combien on charge à chaque "voir plus"
let _galCurrentIdx = 0;         // index image courante dans la lightbox

// Détermine si une carte est "wide" (1 image sur 8 prend 2 colonnes)
function _isWide(idx) {
  // Toutes les 8 images, la 5e de chaque groupe est wide (indice % 8 === 4)
  return idx % 8 === 4;
}

function renderGallery() {
  const grid = $('galleryGrid'), sec = $('secGallery');
  if (!grid) return;
  const imgs = GALLERY_IMAGES.filter(Boolean);
  if (!imgs.length) { if (sec) sec.style.display = 'none'; return; }
  if (sec) sec.style.display = '';
  _galVisible = 20;
  _renderGalleryItems(imgs);
}

function _renderGalleryItems(imgs) {
  const grid = $('galleryGrid');
  if (!grid) return;
  const total = imgs.length;
  const count = Math.min(_galVisible, total);

  grid.innerHTML = imgs.slice(0, count).map((item, i) => {
    const wide = _isWide(i) ? ' wide' : '';
    // delay animé décalé pour effet cascade (max 500ms)
    const delay = Math.min(i * 28, 480);
    return `<div class="gallery-item${wide}" style="animation-delay:${delay}ms"
               onclick="openLightbox('${item.src}','${item.dl}',${i})">
      <img src="${item.src}" alt="" loading="lazy">
      <div class="gallery-item-overlay">
        <div class="gallery-item-zoom"><i class="fas fa-expand"></i></div>
      </div>
    </div>`;
  }).join('');

  // Boutons
  const btnMore = $('galleryBtnMore');
  const btnLess = $('galleryBtnLess');
  if (btnMore) btnMore.style.display = _galVisible < total ? '' : 'none';
  if (btnLess) btnLess.style.display = _galVisible > 20   ? '' : 'none';
}

function galleryShowMore() {
  const imgs = GALLERY_IMAGES.filter(Boolean);
  const prevVisible = _galVisible;
  _galVisible = Math.min(_galVisible + _galStep, imgs.length);
  _renderGalleryItems(imgs);
  // Scroll to the first newly added image
  setTimeout(() => {
    const grid = $('galleryGrid');
    if (!grid) return;
    const items = grid.querySelectorAll('.gallery-item');
    const firstNew = items[prevVisible];
    if (firstNew) firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function galleryShowLess() {
  _galVisible = 20;
  const imgs = GALLERY_IMAGES.filter(Boolean);
  _renderGalleryItems(imgs);
  // scroll vers le haut de la galerie
  const sec = $('secGallery');
  if (sec) setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

// ── LIGHTBOX ─────────────────────────────────────────────────
function openLightbox(src, dl, idx) {
  const lb  = $('galleryLightbox');
  const img = $('galleryLightboxImg');
  const dlBtn = $('galleryDlBtn');
  if (!lb || !img) return;

  _galCurrentIdx = (typeof idx === 'number') ? idx : 0;
  _updateLightboxImg();

  dlBtn.onclick = () => downloadGalleryImg(dl || src, src.split('/').pop());
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _updateLightboxImg() {
  const imgs = GALLERY_IMAGES.filter(Boolean);
  const item = imgs[_galCurrentIdx];
  if (!item) return;

  const img    = $('galleryLightboxImg');
  const dlBtn  = $('galleryDlBtn');
  const counter = $('galleryLbCounter');
  const btnPrev = $('galleryLbPrev');
  const btnNext = $('galleryLbNext');

  // Animation swap
  if (img) {
    img.style.opacity = '0';
    img.style.transform = 'scale(.97)';
    setTimeout(() => {
      img.src = item.src;
      img.style.transition = 'opacity .22s, transform .22s';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 80);
  }

  if (dlBtn) dlBtn.onclick = () => downloadGalleryImg(item.dl || item.src, item.src.split('/').pop());
  if (counter) counter.textContent = `${_galCurrentIdx + 1} / ${imgs.length}`;
  if (btnPrev) btnPrev.disabled = _galCurrentIdx <= 0;
  if (btnNext) btnNext.disabled = _galCurrentIdx >= imgs.length - 1;
}

function lightboxNav(dir) {
  const imgs = GALLERY_IMAGES.filter(Boolean);
  const next = _galCurrentIdx + dir;
  if (next < 0 || next >= imgs.length) return;
  _galCurrentIdx = next;
  _updateLightboxImg();
}

function closeLightbox(e, force) {
  if (!force && e && e.target !== $('galleryLightbox')) return;
  const lb = $('galleryLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Navigation clavier dans la lightbox
document.addEventListener('keydown', (e) => {
  const lb = $('galleryLightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape')     closeLightbox(null, true);
});

// ── RACCOURCIS CLAVIER GLOBAUX ──────────────────────────────────
// "/" ouvre la recherche, "Échap" ferme le panneau/overlay actif.
// N'interfère jamais avec la saisie dans un champ texte.
function initGlobalKeyboardShortcuts() {
  if (window._ipxShortcutsBound) return; // évite un double-attachement si initApp() est rappelé
  window._ipxShortcutsBound = true;
  document.addEventListener('keydown', (e) => {
    const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable);

    if (e.key === '/' && !typing) {
      e.preventDefault();
      openSearch();
      return;
    }

    if (e.key === 'Escape') {
      const ia = $('iaPanel');
      if (ia && ia.style.display === 'flex') toggleIA();
      const lp = $('localPlayerModal');
      if (lp && lp.classList.contains('open')) closeLocalPlayer();
      const ap = $('avatarPickerModal');
      if (ap && ap.style.display && ap.style.display !== 'none') closeAvatarPicker();
    }
  });
}

function downloadGalleryImg(dlUrl, filename) {
  const a = document.createElement('a');
  a.href = dlUrl;
  a.download = filename || dlUrl.split('/').pop().split('?')[0] || 'image.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


// ── CINÉMATIQUES ──────────────────────────────────────────────
function renderCinematics() {
  const track=$('cinematicsTrack'), sec=$('secCinematics');
  if(!track) return;
  const items=DATA.cinematics||[];
  if(!items.length){ if(sec) sec.style.display='none'; return; }
  if(sec) sec.style.display='';
  track.innerHTML=items.map((c,i)=>`
    <div class="card card-cine" onclick="playCinematic(${i})">
      <div class="card-thumb" style="background-image:url('${c.image||''}')">
        <div class="card-play-icon"><i class="fas fa-film"></i></div>
        <div class="card-badge" style="background:var(--arc-dim);color:var(--arc);border:1px solid rgba(var(--arc-rgb),.4);">CINÉMATIQUE</div>
      </div>
      <div class="card-info"><div class="card-title">${c.title}</div><div class="card-meta">${c.desc||''}</div></div>
    </div>`).join('');
  setTimeout(()=>setupCarousel('cinematicsTrack','cinematicsPrev','cinematicsNext'),50);
}

function renderMappings() {
  const track=$('mappingsTrack'), sec=$('secMappings');
  if(!track) return;
  const items=DATA.mappings||[];
  if(!items.length){ if(sec) sec.style.display='none'; return; }
  if(sec) sec.style.display='';
  track.innerHTML=items.map((m,i)=>`
    <div class="card card-cine card-mapping" onclick="playMapping(${i})">
      <div class="card-thumb" style="background-image:url('${m.image||''}')">
        <div class="card-play-icon"><i class="fas fa-play"></i></div>
        <div class="card-badge" style="background:var(--arc-dim);color:var(--arc);border:1px solid rgba(var(--arc-rgb),.4);"><i class="fas fa-map-location-dot" style="margin-right:4px;"></i>MAPPING</div>
        ${m.price ? `<div class="card-mapping-price">${m.price}</div>` : ''}
      </div>
      <div class="card-info"><div class="card-title">${m.title}</div><div class="card-meta">${m.desc||''}</div></div>
    </div>`).join('');
  setTimeout(()=>setupCarousel('mappingsTrack','mappingsPrev','mappingsNext'),50);
}

function playMapping(idx) {
  const items=DATA.mappings||[];
  const m=items[idx]; if(!m) return;
  location.href = SLUG.mapURL(idx);
}

// APRÈS
function playCinematic(idx) {
  const items=DATA.cinematics||[];
  const c=items[idx]; if(!c) return;

  // Pages comme index.html (ou character.html) n'ont pas de #playerPage dans leur DOM :
  // le lecteur de cinématique vit uniquement sur cinematic.html. Si on n'y est pas déjà,
  // on navigue réellement vers cette page (pushState seul ne charge pas un autre fichier HTML,
  // d'où l'écran noir : #mainContent était caché mais #playerPage n'existait pas pour le remplacer).
  if (!$('playerPage')) {
    location.href = SLUG.cineURL(idx);
    return;
  }

  // Sauvegarde AVANT de détruire le player précédent
  if (window._ytProgressInterval) { clearInterval(window._ytProgressInterval); window._ytProgressInterval = null; }
  try {
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      const cur = ytPlayer.getCurrentTime();
      const dur = ytPlayer.getDuration();
      const epPrev = window._currentEpMeta;
      if (epPrev && dur > 0) {
        DB.saveProgress(epPrev.fid, epPrev.cid, epPrev.season, epPrev.epNum, (cur/dur)*100, cur);
DB.flushProgressNow(); // force le write Firestore immédiatement
      }
    }
  } catch(_) {}

  if(ytPlayer&&typeof ytPlayer.destroy==='function'){try{ytPlayer.destroy();}catch(_){} ytPlayer=null;}
  cancelAutoplay();

  const mc=$('mainContent'); if(mc) mc.style.display='none';
  const pp=$('playerPage'); if(!pp) return;
  pp.classList.add('active');
  document.body.style.overflow=''; window.scrollTo(0,0);
  document.title=`${c.title} | iPROMX`;
  history.pushState({}, ``, SLUG.cineURL(idx));

  // Nav close button
  let closeBtn=$('navPlayerClose');
  if(!closeBtn){
    closeBtn=document.createElement('button');
    closeBtn.id='navPlayerClose';
    closeBtn.innerHTML='<i class="fas fa-times"></i><span>Fermer</span>';
    closeBtn.style.cssText='display:inline-flex;align-items:center;gap:7px;padding:7px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:6px;color:var(--text);font-family:var(--font-display);font-size:0.62rem;font-weight:700;letter-spacing:1px;text-transform:none;cursor:pointer;transition:all .2s;margin-left:14px;flex-shrink:0;';
    closeBtn.onmouseover=()=>{closeBtn.style.background='rgba(255,255,255,.16)';};
    closeBtn.onmouseout=()=>{closeBtn.style.background='rgba(255,255,255,.08)';};
    document.querySelector('.navbar-left')?.appendChild(closeBtn);
  }
  closeBtn.style.display='inline-flex';
  closeBtn.onclick=()=>ROUTER.goHome();

  // Recommandés (autres cinématiques)
  const others=items.filter((_,i)=>i!==idx).slice(0,5);
  const recommHtml=others.length?`
    <div class="sidebar-section">
      <div class="sidebar-section-title">Recommandés</div>
      <div class="sidebar-suggestions">
        ${others.map((o,i)=>{
          const realIdx=items.indexOf(o);
          const thumb=o.videoId?`https://i.ytimg.com/vi/${o.videoId}/mqdefault.jpg`:o.image||'';
          return `<div class="suggestion-card" onclick="playCinematic(${realIdx})">
            <div class="suggestion-thumb" style="background-image:url('${thumb}')"></div>
            <div class="suggestion-info"><div class="suggestion-ep">CINÉMATIQUE</div><div class="suggestion-title">${o.title}</div></div>
          </div>`;
        }).join('')}
      </div>
    </div>`:'';

  const thumb=c.videoId?`https://i.ytimg.com/vi/${c.videoId}/mqdefault.jpg`:c.image||'';

  pp.innerHTML=`
    <div class="player-video-area">
      <div class="player-video-aspect" id="ytWrap">
        <div id="ytPlayerContainer" style="position:absolute;inset:0;background:#000;"></div>
      </div>
    </div>
    <div class="player-layout">
      <div class="player-main">
        <div class="player-breadcrumb" style="padding:14px 0 2px;">
          <a href="/" onclick="ROUTER.goHome();return false;"><i class="fas fa-arrow-left"></i> Accueil</a>
          <span class="sep">›</span><span>Cinématiques</span>
          <span class="sep">›</span><span>${c.title}</span>
        </div>
        <div class="player-info-block">
          <div class="player-ep-title">${c.title}</div>
          <div class="player-ep-meta"><span>Cinématique</span><span class="dot"></span><span>Pixelar RP</span></div>
        </div>
        <div style="font-family:var(--font-body);font-size:.95rem;color:var(--text-dim);line-height:1.6;padding:8px 0 16px;">${c.desc||''}</div>
      </div>
      <div class="player-sidebar">${recommHtml}</div>
    </div>`;

  // Lancer la vidéo
// 1. DÉFINITION DES PARAMÈTRES (Indispensable pour éviter l'erreur "not defined")
  const params = {
    videoId: c.videoId || null,
    sibnetUrl: c.sibnetUrl || null,
    fid: 'cinematic',
    cid: c.videoId || (c.sibnetUrl ? "sibnet-" + idx : String(idx)),
    season: 'cinematic',
    epIdx: idx,
    isCinematic: true
  };

  // 2. SAUVEGARDE DES MÉTA (Pour la barre de progression/historique)
  window._currentEpMeta = { 
    fid: params.fid, 
    cid: params.cid, 
    season: params.season, 
    epNum: idx 
  };

  // 3. LOGIQUE D'AFFICHAGE DU LECTEUR
  const container = $('ytPlayerContainer');
  
  if (c.sibnetUrl) {
    // CAS SIBNET : Iframe optimisée (anti-lag, GPU boost, anti-popups)
    if (container) {
      container.innerHTML = `<iframe src="${c.sibnetUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" allow="autoplay; fullscreen; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation" referrerpolicy="no-referrer" style="will-change: transform; transform: translateZ(0); background: #000;"></iframe>`;
    }
  } 
  else if (c.videoId) {
    // CAS YOUTUBE : On utilise l'API YouTube habituelle
    if (typeof YT !== 'undefined' && YT.Player) {
      _createYTPlayer(params);
    } else {
      window._pendingYT = params;
    }
  }
}

// ── SERIES MODAL ──────────────────────────────────────────────
let curSF=null,curSC=null,curSeason=null,lawPage=0,lawImgs=[];

function openSeriesModal(fid, cid) {
  location.href = ROUTER.charURL(fid, cid);
}
function selectSeason(s,btn) {
  curSeason=s;
  $$('.season-tab',$('seriesModal')).forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  renderModalEps(curSF,curSC,s);
}

function renderModalEps(fid,cid,season) {
  const eps=getChar(fid,cid)?.seasons?.[season]||[];
  const el=$('seriesEpisodesList'); if(!el) return;
  if(!eps.length){ el.innerHTML=`<div class="empty-state"><i class="fas fa-clock"></i><h4>Bientôt disponible</h4></div>`; return; }
  el.innerHTML=eps.map((ep,i)=>{
    const prog=DB.getProgress(ep.familyId||ep.fid, ep.charId||ep.cid, ep.season, ep.epNum).pct, done=prog>=90;
    return `<div class="episode-item" onclick="playEp('${fid}','${cid}','${esc(season)}',${i})">
      <div class="episode-thumb" style="background-image:url('${epThumb(ep)}')">
        <div class="episode-thumb-play"><i class="fas fa-play"></i></div>
        ${done?'<div class="ep-watched"></div>':''}
      </div>
      <div class="episode-info">
        <div class="ep-number">ÉPISODE ${ep.num}</div>
        <div class="ep-title">${ep.title}</div>
        ${prog>0&&!done?`<div style="height:3px;background:var(--panel3);border-radius:2px;margin-top:6px;"><div style="height:100%;width:${prog}%;background:linear-gradient(90deg,var(--iron),var(--gold));border-radius:2px;"></div></div>`:''}
      </div>
    </div>`;
  }).join('');
}

function closeSeriesModal() {
  const navBtn = document.getElementById('navPlayerClose');
  if(navBtn) navBtn.style.display = 'none';
  
  const modal = $('seriesModal');
  if(modal) {
    modal.classList.remove('open');
    modal.style.display = 'none'; // ← AJOUTER cette ligne
  }
  document.body.style.overflow = '';
  
  const v = $('seriesHeroVideo');
  if(v){
    v.pause();
    v.style.display = 'none';
    const srcEl = $('seriesHeroSource');
    if(srcEl) srcEl.src = '';
  }
}

function setupModalVideoCtrl(video, hasSubs) {
  // Annuler tous les anciens listeners video (évite l'accumulation)
  if(video._abortCtrl) video._abortCtrl.abort();
  const ctrl = new AbortController();
  video._abortCtrl = ctrl;
  const sig = { signal: ctrl.signal };

  // Clone les boutons UI pour vider leurs anciens onclick/addEventListener
  ['seriesPlayPause','seriesMute','seriesFullscreen','seriesSubtitles','seriesVideoProgressBar'].forEach(id=>{
    const el=$(id); if(!el) return;
    const clone=el.cloneNode(true);
    el.parentNode.replaceChild(clone,el);
  });

  // Récupérer les éléments frais après clone
  const bar   = $('seriesVideoProgressBar');
  const fill  = $('seriesVideoProgressFill');
  const timeEl= $('seriesVideoTime');
  const pp    = $('seriesPlayPause');
  const mb    = $('seriesMute');
  const vs    = $('seriesVolumeSlider');
  const fs    = $('seriesFullscreen');
  const sub   = $('seriesSubtitles');

  const onTimeUpdate = throttle(()=>{
    if(video.duration&&!isNaN(video.duration)){
      const p = video.currentTime / video.duration * 100;
      if(fill) fill.style.width = p + '%';
      if(timeEl) timeEl.textContent = `${fmtTime(video.currentTime)} / ${fmtTime(video.duration)}`;
    }
  }, 250);
  video.addEventListener('timeupdate', onTimeUpdate, sig);
  video.addEventListener('play', ()=>{ if(pp) pp.innerHTML='<i class="fas fa-pause"></i>'; }, sig);
  video.addEventListener('pause',()=>{ if(pp) pp.innerHTML='<i class="fas fa-play"></i>'; }, sig);

  pp?.addEventListener('click', ()=> video.paused ? video.play() : video.pause());
  mb?.addEventListener('click', ()=>{
    video.muted = !video.muted;
    if(mb) mb.innerHTML = `<i class="fas fa-volume-${video.muted?'mute':'up'}"></i>`;
  });
  fs?.addEventListener('click', ()=>{
    document.fullscreenElement ? document.exitFullscreen() : $('seriesHeroBg')?.requestFullscreen();
  });
  bar?.addEventListener('click', e=>{
    const r = bar.getBoundingClientRect();
    if(video.duration) video.currentTime = ((e.clientX - r.left) / r.width) * video.duration;
  });
  vs?.addEventListener('input', ()=>{ video.volume = vs.value / 100; });

  // Sous-titres — exactement comme l'original
  if(hasSubs && sub) {
    sub.style.display = 'inline-flex';
    let subsOn = false;
    video.addEventListener('loadedmetadata', () => {
      if(video.textTracks.length > 0) {
        const t = video.textTracks[0];
        t.mode = 'hidden';
        sub.onclick = () => {
          subsOn = !subsOn;
          t.mode = subsOn ? 'showing' : 'hidden';
          sub.classList.toggle('active', subsOn);
          sub.style.color       = subsOn ? 'var(--arc)' : '';
          sub.style.borderColor = subsOn ? 'var(--arc)' : '';
        };
      }
    }, sig);
  } else if(sub) {
    sub.style.display = 'none';
  }

  video.volume = vs ? vs.value / 100 : 0.8;
  video.play().catch(()=>{});
}

// ── LOCAL VIDEO PLAYER ────────────────────────────────────────
function openLocalPlayer(url, subs, title) {
  const m=$('localPlayerModal'); if(!m) return;
  $('localPlayerTitle').textContent = title;
  const container = $('localPlayerContainer');
  container.innerHTML = '';

  const video = document.createElement('video');
  // PAS de crossOrigin pour les fichiers locaux (bloque en file://)
  video.preload     = 'auto';
  video.playsInline = true;
  video.controls    = true;
  video.autoplay    = true;
  video.src         = url;  // src direct, plus fiable
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;';

  if(subs) {
    const track   = document.createElement('track');
    track.kind    = 'subtitles';
    track.label   = 'Français';
    track.srclang = 'fr';
    track.src     = subs;
    track.default = false;
    video.appendChild(track);

    const subToggle = $('localSubtitlesBtn');
    if(subToggle) {
      subToggle.style.display = 'inline-flex';
      const fresh = subToggle.cloneNode(true);
      subToggle.parentNode.replaceChild(fresh, subToggle);
      let subsOn = false;
      fresh.addEventListener('click', ()=>{
        subsOn = !subsOn;
        const apply = () => {
          for(let i=0; i<video.textTracks.length; i++) {
            const t = video.textTracks[i];
            if(t.kind==='subtitles'||t.kind==='captions') t.mode = subsOn ? 'showing' : 'hidden';
          }
        };
        if(video.readyState >= 1) apply();
        else video.addEventListener('loadedmetadata', apply, {once:true});
        fresh.classList.toggle('active', subsOn);
        fresh.style.color       = subsOn ? 'var(--arc)' : '';
        fresh.style.borderColor = subsOn ? 'var(--arc)' : '';
      });
    }
  } else {
    const subToggle = $('localSubtitlesBtn');
    if(subToggle) subToggle.style.display = 'none';
  }

  container.appendChild(video);
  m.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Bouton rotation sur mobile
  let rotBtn = m.querySelector('.local-rotate-btn');
  if(!rotBtn) {
    rotBtn = document.createElement('button');
    rotBtn.className = 'local-rotate-btn';
    rotBtn.title = 'Pivoter la vidéo';
    rotBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    rotBtn.style.cssText = 'position:fixed;bottom:80px;right:18px;z-index:99999;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.25);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:white;font-size:1rem;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);touch-action:manipulation;';
    m.appendChild(rotBtn);
  }
  rotBtn.style.display = '';
  let _rot = 0;
  rotBtn.onclick = () => {
    _rot = (_rot + 90) % 360;
    if(screen.orientation && screen.orientation.lock) {
      const lockMap = { 0:'portrait', 90:'landscape', 180:'portrait', 270:'landscape' };
      screen.orientation.lock(lockMap[_rot] || 'landscape').catch(()=>{});
    }
    video.style.transform = `rotate(${_rot}deg)`;
    video.style.transformOrigin = 'center center';
    if(_rot === 90 || _rot === 270) {
      const vw = container.clientWidth, vh = container.clientHeight;
      const scale = Math.min(vw, vh) / Math.max(vw, vh);
      video.style.transform = `rotate(${_rot}deg) scale(${scale})`;
    }
  };
}

function closeLocalPlayer() {
  $('localPlayerModal')?.classList.remove('open');
  document.body.style.overflow='';
  const container=$('localPlayerContainer');
  const v=container?.querySelector('video');
  if(v){v.pause();v.src='';}
  if(container) container.innerHTML='';
  try { if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch(_){}
  const rb = $('localPlayerModal')?.querySelector('.local-rotate-btn');
  if(rb) rb.style.display='none';
}

// ── LAW BOOK ─────────────────────────────────────────────────
function openLawBook(cid) {
  const char=getChar('shade',cid); if(!char?.lawBookImages) return;
  lawImgs=char.lawBookImages; lawPage=0;
  updateLaw(); $('lawsModal').classList.add('open');
}
function closeLawBook() { $('lawsModal')?.classList.remove('open'); }
function updateLaw() {
  const img=$('lawBookImg'),pi=$('lawPageIndicator'),pv=$('lawPrev'),nx=$('lawNext');
  if(img) img.src=lawImgs[lawPage];
  if(pi) pi.textContent=`${lawPage+1} / ${lawImgs.length}`;
  if(pv) pv.disabled=lawPage===0;
  if(nx) nx.disabled=lawPage===lawImgs.length-1;
}
function lawPrev() { if(lawPage>0){lawPage--;updateLaw();} }
function lawNext() { if(lawPage<lawImgs.length-1){lawPage++;updateLaw();} }

// ── MANAGE HISTORY ────────────────────────────────────────────
let selHist=new Set(), selList=new Set();
function openHistory() {
  selHist.clear();
  const list=$('manageHistoryList'), hist=DB.getHistory();
  list.innerHTML=!hist.length?`<div class="empty-state"><i class="fas fa-history"></i><h4>Aucun historique</h4></div>`:
    hist.map((h,i)=>{ const c=getChar(h.familyId,h.charId);
      return `<div class="manage-item"><input type="checkbox" id="h${i}" onchange="selHist.has(${i})?selHist.delete(${i}):selHist.add(${i})">
        <label for="h${i}" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;"><img src="${c?.image||''}" alt="">
          <div class="manage-item-text"><h4>${c?.name||'?'}</h4><p>EP ${h.epNum} · ${h.season} · ${new Date(h.watchedAt).toLocaleDateString('fr')}</p></div></label></div>`;
    }).join('');
  $('manageHistoryModal').classList.add('open');
}
function deleteSelHistory() {
  if(!selHist.size) return toast('Sélectionnez des éléments.','warning');
  DB.removeHistoryItems(selHist); renderHistory(); closeManageHist(); toast('Supprimé.','success');
}
function deleteAllHistory() {
  if(!confirm('Supprimer tout l\'historique ?')) return;
  DB.clearHistory(); renderHistory(); closeManageHist(); toast('Historique effacé.','success');
}
function closeManageHist() { $('manageHistoryModal')?.classList.remove('open'); selHist.clear(); }

function openMyList() {
  selList.clear();
  const list=$('manageListList'), myList=DB.getMyList();
  list.innerHTML=!myList.length?`<div class="empty-state"><i class="fas fa-star"></i><h4>Liste vide</h4></div>`:
    myList.map((item,i)=>{ const c=getChar(item.familyId,item.charId);
      return `<div class="manage-item"><input type="checkbox" id="l${i}" onchange="selList.has(${i})?selList.delete(${i}):selList.add(${i})">
        <label for="l${i}" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;"><img src="${c?.image||''}" alt="">
          <div class="manage-item-text"><h4>${c?.name||'?'}</h4><p>${DATA.universes[item.familyId]?.name||''}</p></div></label></div>`;
    }).join('');
  $('manageListModal').classList.add('open');
}
function deleteSelList() {
  if(!selList.size) return toast('Sélectionnez des éléments.','warning');
  DB.removeListItems(selList); renderMyList(); closeManageList(); toast('Supprimé.','success');
}
function deleteAllList() {
  if(!confirm('Vider toute la liste ?')) return;
  DB.getMyList().forEach(i=>DB.removeFromList(i.familyId,i.charId)); renderMyList(); closeManageList(); toast('Liste vidée.','success');
}
function closeManageList() { $('manageListModal')?.classList.remove('open'); selList.clear(); }

// ── SETTINGS ─────────────────────────────────────────────────
function openSettings() {
  closeDD();

  // Créer/réutiliser un overlay dynamique (comme avatarPickerModal) — garanti par-dessus tout
  let overlay = $('settingsOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'settingsOverlay';
    overlay.style.cssText = [
      'position:fixed','inset:0','z-index:99990',
      'background:var(--void)',
      'overflow-y:auto',
      'display:none'
    ].join(';');
    // Header fixe
    overlay.innerHTML = `
      <div style="position:sticky;top:0;z-index:2;background:var(--void);border-bottom:1px solid var(--edge2);padding:16px 30px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(12px);">
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:900;letter-spacing:4px;color:var(--text);text-transform:uppercase;">Paramètres</div>
        <button onclick="closeSettings()" style="display:flex;align-items:center;gap:8px;background:none;border:1px solid var(--edge);border-radius:var(--radius);padding:8px 16px;color:var(--text-dim);cursor:pointer;font-family:var(--font-display);font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:.15s;"
          onmouseover="this.style.borderColor='var(--arc)';this.style.color='var(--arc)'"
          onmouseout="this.style.borderColor='var(--edge)';this.style.color='var(--text-dim)'">
          <i class="fas fa-times"></i> Fermer
        </button>
      </div>
      <div id="settingsContent" style="max-width:700px;margin:0 auto;padding:32px 30px 80px;"></div>`;
    document.body.appendChild(overlay);
  }

  overlay.style.display = 'block';
  // Scroll to top de l'overlay
  overlay.scrollTop = 0;

  // Mode invité : rendu synchrone dédié (localStorage uniquement, pas de
  // dépendance Firebase) — corrige le chargement infini qui bloquait ici.
  if (typeof AUTH !== 'undefined' && AUTH.isGuest && AUTH.isGuest() && !AUTH.getCurrentUser()) {
    renderGuestSettings();
    return;
  }

  const user = AUTH.getCurrentUser();
  if (!user) {
    const sc = overlay.querySelector('#settingsContent');
    if (sc) sc.innerHTML = `<div style="text-align:center;padding:80px 20px;">
      <div style="width:32px;height:32px;border:3px solid var(--edge);border-top-color:var(--arc);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 16px;"></div>
      <div style="font-family:var(--font-display);font-size:.65rem;letter-spacing:3px;color:var(--text-muted);">CHARGEMENT...</div>
    </div>`;
    let n = 0;
    const t = setInterval(()=>{ n++;
      if (AUTH.getCurrentUser()) { clearInterval(t); renderSettings(); }
      if (n > 15) {
        clearInterval(t);
        // Après 4.5s sans session détectée, ne pas laisser le spinner tourner
        // dans le vide : informer l'utilisateur plutôt que de bloquer l'écran.
        if (sc) sc.innerHTML = `<div style="text-align:center;padding:80px 20px;">
          <div style="font-family:var(--font-ui);font-size:.9rem;color:var(--text-dim);margin-bottom:16px;">Impossible de charger ton profil.</div>
          <button class="btn-small" onclick="closeSettings();location.reload();">Recharger la page</button>
        </div>`;
      }
    }, 300);
    return;
  }
  renderSettings();
}

function closeSettings() {
  const ov = $('settingsOverlay');
  if (ov) ov.style.display = 'none';
  // Aussi cacher l'ancien settingsPage au cas où
  const sp = $('settingsPage');
  if (sp) sp.style.display = 'none';
}

// Ré-affiche/masque la section "Position de la navigation" si la fenêtre
// franchit le seuil des 1024px pendant que les paramètres sont ouverts
// (ex: redimensionnement de la fenêtre ou rotation de tablette).
let _navPosResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(_navPosResizeTimer);
  _navPosResizeTimer = setTimeout(() => {
    const ov = $('settingsOverlay');
    if (!ov || ov.style.display === 'none') return;
    if (typeof AUTH !== 'undefined' && AUTH.isGuest && AUTH.isGuest() && !AUTH.getCurrentUser()) {
      renderGuestSettings();
    } else if (typeof AUTH !== 'undefined' && AUTH.getCurrentUser && AUTH.getCurrentUser()) {
      renderSettings();
    }
  }, 250);
});

// ── PARAMÈTRES — MODE INVITÉ (restreint) ───────────────────────
function renderGuestSettings() {
  const sc = ($('settingsOverlay') || document).querySelector('#settingsContent');
  if (!sc) return;

  const pool = getGuestAvatarPool();
  const selectedId = getGuestAvatarSelectedId();
  const canSelect = canSelectGuestAvatarToday();
  const rerollMs = guestAvatarRerollRemainingMs();
  const canReroll = rerollMs <= 0;
  const devActive = isDevMode();
  const themeLocked = isGuestThemeLocked();

  sc.innerHTML = `
    <div style="max-width:700px;margin:0 auto;">

      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-user-secret"></i> Mode invité</div>
        <div style="padding:18px 24px;">
          <p style="font-family:var(--font-ui);font-size:.88rem;color:var(--text-dim);line-height:1.5;margin-bottom:16px;">
            Crée un compte pour sauvegarder ta progression, ton thème et débloquer ZY sans limite.
          </p>
          <button class="btn-small" style="background:var(--arc-dim);border-color:var(--arc);color:var(--arc);" onclick="closeSettings();if(typeof AUTH!=='undefined')AUTH.logout?.().then(()=>location.href='/')">
            <i class="fas fa-user-plus" style="margin-right:6px;"></i>Créer un compte
          </button>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-image"></i> Avatar</div>
        <div style="padding:20px 24px;">
          <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px;">
            ${pool.map(id => {
              const av = (typeof PRESET_AVATARS!=='undefined'?PRESET_AVATARS:[]).find(a=>a.id===id);
              if (!av) return '';
              const isSel = id === selectedId;
              return `<div onclick="${canSelect ? `selectGuestAvatarUI('${id}')` : `toast('Tu as déjà changé d\\'avatar aujourd\\'hui. Reviens demain ou crée un compte.','warning')`}"
                style="cursor:${canSelect?'pointer':'not-allowed'};position:relative;width:76px;height:76px;border-radius:50%;overflow:hidden;border:3px solid ${isSel?'var(--arc)':'var(--edge)'};${isSel?'box-shadow:0 0 14px var(--arc-glow);':''}opacity:${canSelect || isSel ?1:.5};transition:.2s;">
                <img src="${av.src}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">
                ${isSel ? `<div style="position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--arc);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:.6rem;color:#000;"></i></div>` : ''}
              </div>`;
            }).join('')}
          </div>
          <button class="btn-small" id="guestRerollBtn" ${canReroll?'':'disabled'} onclick="rerollGuestAvatarUI()"
            style="${canReroll?'':'opacity:.5;cursor:not-allowed;'}">
            <i class="fas fa-shuffle" style="margin-right:6px;"></i><span id="guestRerollLabel">${canReroll ? 'Autres avatars' : `Patiente ${Math.ceil(rerollMs/1000)}s`}</span>
          </button>
          <p style="font-family:var(--font-ui);font-size:.74rem;color:var(--text-muted);margin-top:10px;">
            1 changement d'avatar par jour en mode invité. Crée un compte pour choisir librement.
          </p>
        </div>
      </div>

      ${renderThemeSectionHtml(true)}

      ${renderNavPositionSectionHtml()}

      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-code"></i> Développeur</div>
        ${devActive ? `
          <div class="settings-item">
            <div class="settings-item-info"><div class="settings-item-label">Mode développeur</div><div class="settings-item-desc">Actif — thème libre et ZY sans limite</div></div>
            <div class="settings-item-action"><button class="btn-small danger" onclick="disableDevMode();renderGuestSettings();toast('Mode développeur désactivé.','success');">Désactiver</button></div>
          </div>
        ` : `
          <div style="padding:18px 24px;">
            <p style="font-family:var(--font-ui);font-size:.82rem;color:var(--text-muted);margin-bottom:12px;">Accès restreint. Entre le mot de passe pour débloquer le thème libre et ZY sans limite.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <input id="devPasswordInput" type="password" placeholder="Mot de passe"
                style="background:var(--void);border:1px solid var(--edge);border-radius:var(--radius);padding:9px 14px;color:var(--text);font-family:var(--font-ui);font-size:.9rem;flex:1;min-width:160px;outline:none;">
              <button class="btn-small" onclick="submitDevPassword()">Activer</button>
            </div>
          </div>
        `}
      </div>

    </div>`;
}

function selectGuestAvatarUI(id) {
  const res = selectGuestAvatar(id);
  if (!res.ok) { toast('Tu as déjà changé d\'avatar aujourd\'hui. Reviens demain ou crée un compte.', 'warning'); return; }
  toast('Avatar mis à jour !', 'success');
  renderNavUser();
  renderGuestSettings();
}

function rerollGuestAvatarUI() {
  const res = rerollGuestAvatarPool();
  if (!res.ok) { toast(`Patiente encore ${Math.ceil(res.remainingMs/1000)}s.`, 'warning'); return; }
  renderGuestSettings();
  // Rafraîchit le compte à rebours affiché sur le bouton pendant le cooldown
  const btn = $('guestRerollBtn');
  if (btn) {
    const iv = setInterval(() => {
      const ms = guestAvatarRerollRemainingMs();
      const label = $('guestRerollLabel');
      if (ms <= 0) { clearInterval(iv); if (label) label.textContent = 'Autres avatars'; btn.disabled = false; btn.style.opacity=''; btn.style.cursor=''; return; }
      if (label) label.textContent = `Patiente ${Math.ceil(ms/1000)}s`;
    }, 1000);
  }
}

async function submitDevPassword() {
  const input = $('devPasswordInput');
  const pwd = input?.value || '';
  const res = await tryEnableDevMode(pwd);
  if (!res.ok) { toast(res.error || 'Erreur.', 'error'); return; }
  toast('Mode développeur activé !', 'success');
  renderGuestSettings();
}

function renderSettings() {
  const user=AUTH.getCurrentUser(); if(!user) return;
  // Chercher le settingsContent dans l'overlay dynamique d'abord, sinon dans le DOM
  const sc = ($('settingsOverlay') || document).querySelector('#settingsContent');
  if(!sc) return;
  const avList = typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS : [];
  const av = avList.find(a=>a.id===user.avatarId) || avList[0];
  const avatarImg = av
    ? `<img src="${av.src}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--arc);box-shadow:0 0 16px var(--arc-glow);" onerror="this.style.display='none'">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--iron),var(--arc));display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;border:3px solid var(--arc);">${(user.username||'?')[0].toUpperCase()}</div>`;

  sc.innerHTML=`
    <div style="max-width:700px;margin:0 auto;">
      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-user"></i> Profil</div>
        <div class="profile-avatar-section" style="padding:20px 24px;">
          <div style="position:relative;cursor:pointer;flex-shrink:0;" onclick="openAvatarPicker()" title="Changer l'avatar">
            ${avatarImg}
            <div style="position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;background:var(--panel2);border:2px solid var(--arc);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-pen" style="font-size:.6rem;color:var(--arc);"></i>
            </div>
          </div>
          <div class="profile-info">
            <h3>${user.username}</h3>
            <p>${user.email}</p>
            <p style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">Membre depuis ${new Date(user.createdAt||Date.now()).toLocaleDateString('fr')}</p>
          </div>
        </div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Pseudo</div><div class="settings-item-desc">${user.username}</div></div>
          <div class="settings-item-action"><button class="btn-small" onclick="showEditUsername()">Modifier</button></div>
        </div>
        <div id="editUsernameRow" style="display:none;padding:0 24px 16px;gap:10px;align-items:center;flex-wrap:wrap;">
          <input id="newUsernameInput" type="text" placeholder="Nouveau pseudo" value="${user.username}"
            style="background:var(--void);border:1px solid var(--edge);border-radius:var(--radius);padding:9px 14px;color:var(--text);font-family:var(--font-ui);font-size:.9rem;flex:1;min-width:160px;outline:none;">
          <button class="btn-small" onclick="saveUsername()" style="background:var(--arc-dim);border-color:var(--arc);color:var(--arc);">Enregistrer</button>
          <button class="btn-small" onclick="hideEditUsername()">Annuler</button>
        </div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Mot de passe</div><div class="settings-item-desc">Envoyer un lien de réinitialisation</div></div>
          <div class="settings-item-action"><button class="btn-small" onclick="sendPasswordReset()">Réinitialiser</button></div>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-database"></i> Mes données</div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Historique</div><div class="settings-item-desc">${DB.getHistory().length} élément(s)</div></div>
          <div class="settings-item-action"><button class="btn-small danger" onclick="DB.clearHistory();renderHistory();toast('Effacé','success');renderSettings();">Effacer</button></div>
        </div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Ma Liste</div><div class="settings-item-desc">${DB.getMyList().length} élément(s)</div></div>
          <div class="settings-item-action"><button class="btn-small" onclick="closeSettings();openMyList();">Gérer</button></div>
        </div>
      </div>
      ${renderThemeSectionHtml(false)}

      ${renderNavPositionSectionHtml()}

      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-robot"></i> Intelligence Artificielle</div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Lecture vocale de ZY</div><div class="settings-item-desc">ZY lit ses réponses à voix haute (voix française)</div></div>
          <div class="settings-item-action">
            <button class="btn-small" id="zyVoiceSettingsBtn" onclick="toggleZYVoiceFromSettings()"
              style="${isZYVoiceEnabled()?'background:var(--arc-dim);border-color:var(--arc);color:var(--arc);':''}">
              <i class="fas ${isZYVoiceEnabled()?'fa-volume-high':'fa-volume-xmark'}" style="margin-right:6px;"></i>${isZYVoiceEnabled()?'Activée':'Désactivée'}
            </button>
          </div>
        </div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">ZY interactif</div><div class="settings-item-desc">ZY réagit parfois à tes actions sur le site (courtes répliques, occasionnelles)</div></div>
          <div class="settings-item-action">
            <button class="btn-small" id="zyInteractifSettingsBtn" onclick="toggleZYInteractifFromSettings()"
              style="${isZYInteractifEnabled()?'background:var(--arc-dim);border-color:var(--arc);color:var(--arc);':''}">
              <i class="fas ${isZYInteractifEnabled()?'fa-comment-dots':'fa-comment-slash'}" style="margin-right:6px;"></i>${isZYInteractifEnabled()?'Activé':'Désactivé'}
            </button>
          </div>
        </div>
      </div>

      ${!IS_LOCAL?`<div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-shield-alt"></i> Compte</div>
        <div class="settings-item">
          <div class="settings-item-info"><div class="settings-item-label">Déconnexion</div></div>
          <div class="settings-item-action"><button class="btn-small danger" onclick="AUTH.logout().then(()=>location.reload())">Déconnecter</button></div>
        </div>
      </div>`:''}
    </div>`;
}


// ── SETTINGS ACTIONS ──────────────────────────────────────────
function showEditUsername() {
  const row=$('editUsernameRow');
  if(row){ row.style.display='flex'; $('newUsernameInput')?.focus(); }
}
function hideEditUsername() {
  const row=$('editUsernameRow'); if(row) row.style.display='none';
}

async function saveUsername() {
  const val=$('newUsernameInput')?.value?.trim();
  if(!val||val.length<2) return toast('Pseudo trop court.','warning');
  const res=await AUTH.updateProfile({username:val});
  if(!res.ok) return toast(res.error||'Erreur.','error');
  toast('Pseudo mis à jour !','success');
  renderNavUser();
  renderSettings();
}

async function sendPasswordReset() {
  const user=AUTH.getCurrentUser(); if(!user) return;
  const res=await AUTH.sendPasswordReset(user.email);
  if(!res.ok) return toast(res.error||'Erreur.','error');
  toast(`E-mail envoyé à ${user.email} !`,'success');
}

// ── AVATAR PICKER (style Netflix/Crunchyroll) ─────────────────
// ── AVATAR FAMILY MAPPING ─────────────────────────────────────
const AVATAR_FAMILY_MAP = {
  flash:   ['av1','av2','av3','av5','av13','av14','av15','av16','av17','av18','av19','av20','av21','av22','av24','av25','av26','av27','av28','av33','av34','av35','av36','av37','av38','av39','av40','av43','av44','av45','av46','av47','av48','av49','av50','av51','av52','av53','av54','av55','av56','av57', 'av58','av72','av73','av74','av75','av76','av77','av78','av79','av80'],
  shade:   ['av60','av61','av62','av63','av64','av65','av66','av67','av68','av69','av70', 'av71'],
  winters: ['av32','av59'],
  escobar: ['av7','av8','av9','av10','av11'],
  kingsley:['av81'],
  autres:  [,'av4','av6','av12','av23','av29','av30','av31','av41','av42']
};
const AVATAR_FAMILIES = [
  { id:'all',      label:'Tous',     color:'var(--arc)' },
  { id:'flash',    label:'Flash',    color:'#e77b3c' },
  { id:'shade',    label:'Shade',    color:'#9b59b6' },
  { id:'winters',  label:'Winters',  color:'#3498db' },
  { id:'escobar',  label:'Escobar',  color:'#ab0909' },
  { id:'kingsley', label:'Kingsley', color:'#f1c40f' },
  { id:'autres',   label:'Autres',   color:'#95a5a6' }
];

let _avatarFamilyFilter = 'all';

function _getAvatarFamily(avId) {
  for(const [fam, ids] of Object.entries(AVATAR_FAMILY_MAP)) {
    if(ids.includes(avId)) return fam;
  }
  return 'autres';
}

function _renderAvatarGrid() {
  const user = AUTH.getCurrentUser();
  const grid = document.getElementById('avatarPickerGrid');
  if(!grid) return;
  const filtered = _avatarFamilyFilter === 'all'
    ? PRESET_AVATARS
    : PRESET_AVATARS.filter(av => (AVATAR_FAMILY_MAP[_avatarFamilyFilter]||[]).includes(av.id));

  // Group by family when showing "all"
  let html = '';
  if(_avatarFamilyFilter === 'all') {
    const families = ['flash','shade','winters','escobar','kingsley','autres'];
    const famLabels = {flash:'Famille Flash',shade:'Famille Shade',winters:'Famille Winters',escobar:'Famille Escobar',kingsley:'Famille Kingsley',autres:'Autres'};
    const famColors = {flash:'#e74c3c',shade:'#9b59b6',winters:'#3498db',escobar:'#e67e22',kingsley:'#f1c40f',autres:'#95a5a6'};
    for(const fam of families) {
      const famAvatars = PRESET_AVATARS.filter(av=>(AVATAR_FAMILY_MAP[fam]||[]).includes(av.id));
      if(!famAvatars.length) continue;
      html += `<div style="grid-column:1/-1;display:flex;align-items:center;gap:10px;margin:8px 0 4px;">
        <div style="width:3px;height:16px;border-radius:2px;background:${famColors[fam]};flex-shrink:0;"></div>
        <span style="font-family:var(--font-display);font-size:.6rem;font-weight:700;letter-spacing:2.5px;color:${famColors[fam]};text-transform:uppercase;">${famLabels[fam]}</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.05);"></div>
      </div>`;
      for(const av of famAvatars) {
        const isSelected = user?.avatarId===av.id || _selectedAvatarId===av.id;
        html += `<div onclick="selectAvatar('${av.id}',this)" data-avid="${av.id}" class="avatar-pick-item"
          style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;border-radius:10px;transition:background .15s;${isSelected?'background:rgba(var(--arc-rgb),0.1);':''}">
          <div class="avatar-pick-circle" style="width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;
            border:3px solid ${isSelected?'var(--arc)':'rgba(255,255,255,0.08)'};
            box-shadow:${isSelected?'0 0 14px var(--arc-glow)':'none'};
            transition:all .2s;background:var(--panel2);">
            <img src="${av.src}" alt="${av.label}" style="width:100%;height:100%;object-fit:cover;display:block;"
              onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--arc)><i class=fas\\ fa-user></i></div>'">
          </div>
          <span style="font-family:var(--font-display);font-size:.48rem;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;text-align:center;line-height:1.2;">${av.label}</span>
        </div>`;
      }
    }
  } else {
    for(const av of filtered) {
      const isSelected = user?.avatarId===av.id || _selectedAvatarId===av.id;
      html += `<div onclick="selectAvatar('${av.id}',this)" data-avid="${av.id}" class="avatar-pick-item"
        style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;border-radius:10px;transition:background .15s;${isSelected?'background:rgba(var(--arc-rgb),0.1);':''}">
        <div class="avatar-pick-circle" style="width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;
          border:3px solid ${isSelected?'var(--arc)':'rgba(255,255,255,0.08)'};
          box-shadow:${isSelected?'0 0 14px var(--arc-glow)':'none'};
          transition:all .2s;background:var(--panel2);">
          <img src="${av.src}" alt="${av.label}" style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--arc)><i class=fas\\ fa-user></i></div>'">
        </div>
        <span style="font-family:var(--font-display);font-size:.48rem;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;text-align:center;line-height:1.2;">${av.label}</span>
      </div>`;
    }
  }
  grid.innerHTML = html;
}

function filterAvatarsByFamily(famId) {
  _avatarFamilyFilter = famId;
  // Update button styles
  document.querySelectorAll('.avatar-fam-btn').forEach(btn => {
    const isActive = btn.dataset.fam === famId;
    const col = btn.dataset.color;
    btn.style.background = isActive ? col : 'transparent';
    btn.style.color = isActive ? '#fff' : 'var(--text-dim)';
    btn.style.borderColor = isActive ? col : 'var(--edge)';
    btn.style.boxShadow = isActive ? `0 2px 12px ${col}55` : 'none';
  });
  _renderAvatarGrid();
}

function openAvatarPicker() {
  _avatarFamilyFilter = 'all';
  let modal = $('avatarPickerModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'avatarPickerModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,4,8,0.97);backdrop-filter:blur(16px);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto;overflow-x:hidden;';
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--edge);border-radius:var(--radius-lg);padding:20px 16px;max-width:540px;width:100%;position:relative;box-shadow:var(--shadow-arc);">
      <div style="font-family:var(--font-display);font-size:.85rem;font-weight:700;letter-spacing:3px;color:var(--arc);margin-bottom:4px;text-transform:uppercase;">Choisir un avatar</div>
      <div style="font-family:var(--font-body);font-size:.9rem;color:var(--text-muted);margin-bottom:16px;">Sélectionne l'avatar qui te représente</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        ${AVATAR_FAMILIES.map(f=>`
          <button class="avatar-fam-btn"
            data-fam="${f.id}"
            data-color="${f.color}"
            onclick="filterAvatarsByFamily('${f.id}')"
            style="padding:5px 12px;border-radius:20px;border:1px solid ${f.id==='all'?'var(--arc)':'var(--edge)'};
              background:${f.id==='all'?'var(--arc)':'transparent'};
              color:${f.id==='all'?'#fff':'var(--text-dim)'};
              box-shadow:${f.id==='all'?'0 2px 12px var(--arc-dim)':'none'};
              font-family:var(--font-display);font-size:.58rem;font-weight:700;letter-spacing:1.5px;
              text-transform:uppercase;cursor:pointer;transition:all .15s;white-space:nowrap;">
            ${f.label}
          </button>
        `).join('')}
      </div>
      <div id="avatarPickerGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:12px;margin-bottom:20px;max-height:52vh;overflow-y:auto;overflow-x:hidden;padding-right:4px;"></div>
      <div style="display:flex;gap:10px;">
        <button onclick="closeAvatarPicker()" style="flex:1;padding:11px;background:transparent;border:1px solid var(--edge);border-radius:var(--radius);color:var(--text-dim);font-family:var(--font-display);font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">Annuler</button>
        <button onclick="applyAvatar()" id="avatarApplyBtn" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 14px var(--iron-glow);">
          <i class="fas fa-check"></i> Appliquer
        </button>
      </div>
    </div>`;
  _renderAvatarGrid();
}

let _selectedAvatarId = null;

function selectAvatar(avId, el) {
  _selectedAvatarId = avId;
  // Reset tous les items
  document.querySelectorAll('.avatar-pick-item').forEach(a => {
    const circle = a.querySelector('.avatar-pick-circle');
    if(circle) { circle.style.borderColor='rgba(255,255,255,0.08)'; circle.style.boxShadow='none'; }
    a.style.background = 'transparent';
  });
  // Highlight sélectionné
  const circle = el.querySelector('.avatar-pick-circle');
  if(circle) { circle.style.borderColor='var(--arc)'; circle.style.boxShadow='0 0 14px var(--arc-glow)'; }
  el.style.background = 'rgba(var(--arc-rgb),0.1)';
}

async function applyAvatar() {
  if(!_selectedAvatarId) return toast('Sélectionne un avatar.','warning');
  const btn = $('avatarApplyBtn');
  if(btn){btn.disabled=true;btn.textContent='Sauvegarde...';}
  const res = await AUTH.updateProfile({ avatarId: _selectedAvatarId });
  if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> Appliquer';}
  if(!res.ok) return toast(res.error||'Erreur.','error');
  closeAvatarPicker();
  toast('Avatar mis à jour !','success');
  renderNavUser();
  renderSettings();
}

function closeAvatarPicker() {
  const m=$('avatarPickerModal'); if(m) m.style.display='none';
  _selectedAvatarId=null;
}
// ── SEARCH ────────────────────────────────────────────────────
const SEARCH_HISTORY_KEY = 'ipx_search_history';
const SEARCH_HISTORY_MAX = 5;

function getSearchHistory() {
  try { const h = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]'); return Array.isArray(h) ? h : []; }
  catch { return []; }
}
function addToSearchHistory(term) {
  term = (term || '').trim();
  if (term.length < 2) return;
  let h = getSearchHistory().filter(t => t.toLowerCase() !== term.toLowerCase());
  h.unshift(term);
  h = h.slice(0, SEARCH_HISTORY_MAX);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(h));
}
function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  renderSearchHistory();
}
function renderSearchHistory() {
  const res = $('searchResults'); if (!res) return;
  const h = getSearchHistory();
  if (!h.length) { res.innerHTML = ''; return; }
  res.innerHTML = `
    <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <span style="font-family:var(--font-display);font-size:.62rem;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);"><i class="fas fa-clock-rotate-left" style="margin-right:6px;"></i>RECHERCHES RÉCENTES</span>
      <button onclick="clearSearchHistory()" style="background:none;border:none;color:var(--text-muted);font-family:var(--font-ui);font-size:.72rem;cursor:pointer;text-decoration:underline;">Effacer</button>
    </div>
    <div style="grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;">
      ${h.map(term => `<button onclick="applySearchSuggestion('${esc(term)}')" style="padding:7px 14px;border-radius:20px;background:var(--panel2);border:1px solid var(--edge);color:var(--text-dim);font-family:var(--font-ui);font-size:.82rem;cursor:pointer;transition:var(--transition);"
        onmouseover="this.style.borderColor='var(--arc)';this.style.color='var(--arc)'" onmouseout="this.style.borderColor='var(--edge)';this.style.color='var(--text-dim)'">
        <i class="fas fa-magnifying-glass" style="margin-right:6px;font-size:.7rem;opacity:.6;"></i>${term}</button>`).join('')}
    </div>`;
}
function applySearchSuggestion(term) {
  const input = $('searchInput');
  if (!input) return;
  input.value = term;
  input.dispatchEvent(new Event('input'));
}
window.clearSearchHistory = clearSearchHistory;
window.applySearchSuggestion = applySearchSuggestion;

function setupSearch() {
  const doSearch = debounce(e => {
    const raw = e.target.value.trim();
    const res  = $('searchResults'); if (!res) return;
    if (raw.length < 2) { renderSearchHistory(); return; }
    const q = raw.toLowerCase();

    // Exact name match first, then fuzzy
    const all = getAllChars();
    const exact   = all.filter(c => c.name.toLowerCase().includes(q));
    const inexact = all.filter(c => {
      if (c.name.toLowerCase().includes(q)) return false;
      return fuzzyScore(c.name, q) > 0.55 || fuzzyScore(c.family?.name||'', q) > 0.7;
    });
    const combined = [...exact, ...inexact].slice(0, 12);

    if (!combined.length) {
      res.innerHTML = '<div class="search-empty" style="grid-column:1/-1"><i class="fas fa-search"></i><p>Aucun résultat pour « ' + raw + ' »</p></div>';
      return;
    }

    res.innerHTML = combined.map(c => {
      const eps = getTotalEps(c);
      const pct = getOverallProgress(c.familyId, c.id);
      return `<div class="search-result-card" onclick="addToSearchHistory('${esc(raw)}');closeSearch();location.href=ROUTER.charURL('${c.familyId}','${c.id}')">
        <div class="search-result-thumb lazy-bg" data-bg="${c.image}" style="background-image:url('${c.image}');position:relative;">
          ${pct>0?`<div class="src-progress"><div class="src-progress-fill" style="width:${pct}%"></div></div>`:''}
        </div>
        <div class="search-result-info">
          <h4>${hlMatch(c.name, raw)}</h4>
          <p>${c.family?.name||''}</p>
          ${eps>0?`<span class="src-ep-count">${eps} ép.</span>`:''}
        </div>
      </div>`;
    }).join('');
  }, 160);

  $('searchInput')?.addEventListener('input', doSearch);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); closeSettings(); }
  });
}
function openSearch() { $('searchOverlay')?.classList.add('open'); $('searchInput')?.focus(); renderSearchHistory(); }
function closeSearch() { $('searchOverlay')?.classList.remove('open'); const i=$('searchInput');if(i)i.value=''; const r=$('searchResults');if(r)r.innerHTML=''; }

// ── NAV ───────────────────────────────────────────────────────
function setupNavEvents() {
  const ham=$('hamburger'), mn=$('mobileNav');
  if(ham) ham.addEventListener('click',()=>{ham.classList.toggle('open');mn?.classList.toggle('open');});
  document.addEventListener('click',e=>{
    if(!e.target.closest('#uMenu')) closeDD();
    if(!e.target.closest('#mobileNav')&&!e.target.closest('#hamburger')){mn?.classList.remove('open');ham?.classList.remove('open');}
    // Series modal: NE PAS fermer en cliquant à côté — seulement via la croix
    if(e.target===$('manageHistoryModal')) closeManageHist();
    if(e.target===$('manageListModal')) closeManageList();
    if(e.target===$('lawsModal')) closeLawBook();
    if(e.target===$('localPlayerModal')) closeLocalPlayer();
  });
}
function setupScrollEffects() {
  const nav=document.querySelector('.navbar');
  const onScroll = throttle(()=>{
    nav?.classList.toggle('scrolled', scrollY>50);
  }, 50);
  window.addEventListener('scroll', onScroll, {passive:true});
}

// ── CAROUSELS ─────────────────────────────────────────────────
function setupCarousel(tid,pid,nid,cw=212) {
  const track=$(tid),prev=$(pid),next=$(nid); if(!track||!prev||!next) return;
  let pos=0;
  const step=cw+12;
  function upd(){
    track.style.transform=`translateX(${pos}px)`;
    const max=-(track.scrollWidth-track.parentElement.clientWidth+16);
    prev.disabled=pos>=0; next.disabled=pos<=max;
  }
  // Remettre à 0 les anciens listeners
  const np=prev.cloneNode(true), nn=next.cloneNode(true);
  prev.parentNode.replaceChild(np,prev); next.parentNode.replaceChild(nn,next);
  np.addEventListener('click',()=>{pos=Math.min(0,pos+step);upd();});
  nn.addEventListener('click',()=>{const max=-(track.scrollWidth-track.parentElement.clientWidth+16);pos=Math.max(max,pos-step);upd();});
  let sx=0;
  track.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e=>{const d=sx-e.changedTouches[0].clientX;if(Math.abs(d)>40){if(d>0)nn.click();else np.click();}},{passive:true});
  upd();
}

// ── PAGE SWITCH ───────────────────────────────────────────────
function showHome() {
  // Sauvegarde finale avant fermeture
  if (window._ytProgressInterval) { clearInterval(window._ytProgressInterval); window._ytProgressInterval = null; }
  try {
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      const cur = ytPlayer.getCurrentTime();
      const dur = ytPlayer.getDuration();
      const epPrev = window._currentEpMeta;
      if (epPrev && dur > 0) {
        DB.saveProgress(epPrev.fid, epPrev.cid, epPrev.season, epPrev.epNum, (cur/dur)*100, cur);
DB.flushProgressNow(); // force le write Firestore immédiatement
      }
    }
  } catch(_) {}
  if(ytPlayer&&typeof ytPlayer.destroy==='function'){try{ytPlayer.destroy();}catch(_){} ytPlayer=null;}

  const mc=$('mainContent'), pp=$('playerPage');
  if(mc){ mc.style.display=''; mc.classList.remove('hidden'); }
  if(pp){ pp.classList.remove('active'); pp.innerHTML=''; }
  // Cacher le bouton Fermer de la navbar
  const closeBtn = $('navPlayerClose');
  if(closeBtn) closeBtn.style.display = 'none';
  cancelAutoplay();
  document.title="L'Univers d'iProMx — Streaming";
  document.body.style.overflow='';
}

// ── YT PLAYER ────────────────────────────────────────────────
let ytPlayer=null, autoTimer=null, autoCD=0;
const AUTOPLAY_SEC=10;

// YT API callback global
window.onYouTubeIframeAPIReady=function(){
  if(window._pendingYT){ const p=window._pendingYT; window._pendingYT=null; _createYTPlayer(p); }
};

function playEp(fid, cid, season, epIdx) {
  const char = getChar(fid, cid); if (!char) return;
  const eps  = char.seasons?.[season] || [];
  if (epIdx < 0 || epIdx >= eps.length) return;
  const ep   = eps[epIdx];
  location.href = ROUTER.buildURL(fid, cid, season, ep.num);
}

function showPlayerPage(fid,cid,season,epIdx) {
  const char=getChar(fid,cid), u=DATA.universes[fid]; if(!char||!u) return;
  const eps=char.seasons?.[season]||[], ep=eps[epIdx]; if(!ep) return;

  if (window._ytProgressInterval) { clearInterval(window._ytProgressInterval); window._ytProgressInterval = null; }

  // Sauvegarde finale AVANT de détruire le player
  try {
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      const cur = ytPlayer.getCurrentTime();
      const dur = ytPlayer.getDuration();
      const epPrev = window._currentEpMeta;
      if (epPrev && dur > 0) {
        DB.saveProgress(epPrev.fid, epPrev.cid, epPrev.season, epPrev.epNum, (cur/dur)*100, cur);
        DB.flushProgressNow(); // force le write Firestore immédiatement
      }
    }
  } catch(_) {}

  if(ytPlayer&&typeof ytPlayer.destroy==='function'){try{ytPlayer.destroy();}catch(_){} ytPlayer=null;}
  cancelAutoplay();

  // Switcher les pages (remplace le contenu principal, laisse la navbar intacte)
  const mc=$('mainContent'); if(mc) mc.style.display='none';
  const pp=$('playerPage'); if(!pp) return;
  pp.classList.add('active');
  document.body.style.overflow=''; window.scrollTo(0,0);
  document.title=`${char.name} — EP${ep.num} | iPROMX`;

  // Historique
  DB.addHistory({familyId:fid,charId:cid,season,epNum:ep.num,epIdx,videoId:ep.videoId,title:ep.title}); renderHistory();

  // Stocker les meta pour la sauvegarde
  window._currentEpMeta = { fid, cid, season, epNum: ep.num };

  // Bouton "Fermer" dans la navbar
  let closeBtn = $('navPlayerClose');
  if(!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.id = 'navPlayerClose';
    closeBtn.innerHTML = '<i class="fas fa-times"></i><span>Fermer</span>';
    closeBtn.style.cssText = [
      'display:inline-flex','align-items:center','gap:7px',
      'padding:7px 16px',
      'background:rgba(255,255,255,.08)',
      'border:1px solid rgba(255,255,255,.16)',
      'border-radius:6px',
      'color:var(--text)',
      'font-family:var(--font-display)',
      'font-size:0.62rem','font-weight:700','letter-spacing:1px',
      'text-transform:none','cursor:pointer',
      'transition:background .15s,border-color .15s',
      'margin-left:14px','flex-shrink:0'
    ].join(';');
    closeBtn.onmouseover = () => { closeBtn.style.background='rgba(255,255,255,.16)'; };
    closeBtn.onmouseout  = () => { closeBtn.style.background='rgba(255,255,255,.08)'; };
    document.querySelector('.navbar-left')?.appendChild(closeBtn);
  }
  closeBtn.style.display = 'inline-flex';
  closeBtn.onclick = () => ROUTER.goHome();

  // Build HTML complet du lecteur
  const nextEp=epIdx+1<eps.length?eps[epIdx+1]:null;
  const inList=DB.isInList(fid,cid);
  const seasons=Object.keys(char.seasons||{});

  const stabs=seasons.map(s=>`<button class="player-season-tab${s===season?' active':''}" onclick="switchSeason('${fid}','${cid}','${esc(s)}',this)">${s}</button>`).join('');
  const epList=eps.map((e,i)=>{
    const prog=DB.getProgress(fid,cid,season,e.num).pct, cur=i===epIdx;
    return `<div class="player-ep-item${cur?' current':''}" ${!cur?`onclick="playEp('${fid}','${cid}','${esc(season)}',${i})"`:''}>
      <div class="player-ep-thumb" style="background-image:url('${epThumb(e)}')">
        <div class="player-ep-thumb-overlay">${cur?'<div class="player-ep-playing-icon"><i class="fas fa-volume-up"></i></div>':e.youtubeLink?'<i class="fab fa-youtube"></i>':'<i class="fas fa-play"></i>'}</div>
        ${prog>0&&!cur?`<div class="player-ep-progress"><div class="player-ep-progress-fill" style="width:${prog}%"></div></div>`:''}
        ${e.youtubeLink?'<div class="ep-yt-badge"><i class="fab fa-youtube"></i> YouTube</div>':''}
      </div>
      <div class="player-ep-info"><div class="player-ep-num">Épisode ${e.num}</div><div class="player-ep-name">${e.title}</div></div>
    </div>`;
  }).join('');
  
  const suggEps=eps.slice(Math.max(0,epIdx-1),epIdx+4);
  const sugg=suggEps.map((e,i)=>{
    const realIdx=eps.indexOf(e), cur=realIdx===epIdx;
    return `<div class="suggestion-card${cur?' current':''}" ${!cur?`onclick="playEp('${fid}','${cid}','${esc(season)}',${realIdx})"`:''}>
      <div class="suggestion-thumb" style="background-image:url('${epThumb(e)}')"></div>
      <div class="suggestion-info"><div class="suggestion-ep">${cur?'EN COURS · ':''}EP ${e.num}</div><div class="suggestion-title">${e.title}</div></div>
    </div>`;
  }).join('');

  pp.innerHTML=`
    <div class="player-video-area">
      <div class="player-video-aspect" id="ytWrap">
        <div id="ytPlayerContainer" style="position:absolute;inset:0;background:#000;"></div>
        <div class="autoplay-banner" id="autoplayBanner">
          <div class="autoplay-info">
            <div>
              <div class="autoplay-text">PROCHAIN ÉPISODE DANS <span id="autoCD">${AUTOPLAY_SEC}</span>s</div>
              ${nextEp?`<div class="autoplay-title">${nextEp.title}</div>`:''}
            </div>
            <div class="autoplay-actions">
              <button class="btn-autoplay-cancel" onclick="cancelAutoplay()">Annuler</button>
              ${nextEp?`<button class="btn-autoplay-play" onclick="triggerAutoplay()"><i class="fas fa-forward"></i> Suivant</button>`:''}
            </div>
          </div>
          <div class="autoplay-progress-bar"><div class="autoplay-progress-fill" id="autoFill" style="width:100%"></div></div>
        </div>
      </div>
    </div>
    <div class="player-layout">
      <div class="player-main">
        <div class="player-breadcrumb" style="padding:14px 0 2px;">
          <a href="/" onclick="ROUTER.goHome();return false;"><i class="fas fa-arrow-left"></i> Accueil</a>
          <span class="sep">›</span>
          <a href="#" onclick="openSeriesModal('${fid}','${cid}');return false;">${char.name}</a>
          <span class="sep">›</span>
          <span>${season}</span>
          <span class="sep">›</span>
          <span>Épisode ${ep.num}</span>
        </div>
        <div class="player-info-block">
          <div class="player-series-name">${char.name} · ${u.name}</div>
          <div class="player-ep-title">${ep.title}</div>
          <div class="player-ep-meta"><span>${season}</span><span class="dot"></span><span>Épisode ${ep.num}</span><span class="dot"></span><span>GTA 5 RP · Pixelar</span></div>
        </div>
        <div class="player-actions-row">
          <div class="player-nav-eps">
            <button class="btn-ep-nav" onclick="playEp('${fid}','${cid}','${esc(season)}',${epIdx-1})" ${epIdx===0?'disabled':''}><i class="fas fa-step-backward"></i> <span>Précédent</span></button>
            <button class="btn-ep-nav" onclick="playEp('${fid}','${cid}','${esc(season)}',${epIdx+1})" ${!nextEp?'disabled':''}><span>Suivant</span> <i class="fas fa-step-forward"></i></button>
          </div>
          <div class="player-extra-actions">
            <button class="btn-player-action${inList?' active list':''}" id="plListBtn" onclick="togglePlayerList('${fid}','${cid}')">
              <i class="fas fa-${inList?'check':'plus'}"></i> <span>${inList?'Dans ma liste':'Ma Liste'}</span>
            </button>
          </div>
        </div>
        <div class="player-char-block">
          <img class="player-char-avatar" src="${char.image}" alt="${char.name}">
          <div class="player-char-text">
            <div class="player-char-name">${char.name}</div>
            <div class="player-char-family">${u.name}</div>
            <div class="player-char-desc">${char.description}</div>
          </div>
        </div>
        ${seasons.length?`<div class="sidebar-section-title" style="margin:24px 0 12px;">Épisodes</div><div class="player-season-tabs">${stabs}</div><div class="player-episodes-list">${epList}</div>`:''}
      </div>
      <div class="player-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Épisode suivant</div>
          ${nextEp?`<div class="upnext-card" onclick="playEp('${fid}','${cid}','${esc(season)}',${epIdx+1})">
            <div class="upnext-thumb" style="background-image:url('${epThumb(nextEp)}')"><div class="upnext-play-btn"><i class="fas fa-play"></i></div></div>
            <div class="upnext-info"><div class="upnext-label">Épisode suivant</div><div class="upnext-title">${nextEp.title}</div><div class="upnext-ep">Épisode ${nextEp.num} · ${season}</div></div>
          </div>`:`<div class="empty-state" style="padding:20px;"><i class="fas fa-flag-checkered"></i><h4>Fin de la saison</h4></div>`}
        </div>
        ${eps.length>1?`<div class="sidebar-section"><div class="sidebar-section-title">Tous les épisodes</div><div class="sidebar-suggestions">${sugg}</div></div>`:''}
      </div>
    </div>`;

  const params = {videoId:ep.videoId||null, sibnetUrl:ep.sibnetUrl||null, fid, cid, season, epIdx};
  if(typeof YT!=='undefined'&&YT.Player) {
    _createYTPlayer(params);
  } else {
    window._pendingYT = params;
  }
}

function switchSeason(fid, cid, season, btn) {
  // 1. Mettre à jour l'onglet actif
  const tabs = document.querySelectorAll('.player-season-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // 2. Récupérer les épisodes de la saison sélectionnée
  const char = getChar(fid, cid);
  if (!char) return;
  const eps = char.seasons?.[season] || [];
  
  // 3. Récupérer les infos de l'épisode actuellement en cours de lecture
  const curMeta = window._currentEpMeta;

  // 4. Générer le HTML de la nouvelle liste
  const epListHtml = eps.map((e, i) => {
    const prog = DB.getProgress(fid, cid, season, e.num).pct;
    // Vérifie si cet épisode de la boucle est celui qu'on est en train de regarder
    const isCurEp = curMeta && curMeta.fid === fid && curMeta.cid === cid && curMeta.season === season && curMeta.epNum === e.num;

    return `<div class="player-ep-item${isCurEp ? ' current' : ''}" ${!isCurEp ? `onclick="playEp('${fid}','${cid}','${esc(season)}',${i})"` : ''}>
      <div class="player-ep-thumb" style="background-image:url('${epThumb(e)}')">
        <div class="player-ep-thumb-overlay">
          ${isCurEp ? '<div class="player-ep-playing-icon"><i class="fas fa-volume-up"></i></div>' : e.youtubeLink ? '<i class="fab fa-youtube"></i>' : '<i class="fas fa-play"></i>'}
        </div>
        ${prog > 0 && !isCurEp ? `<div class="player-ep-progress"><div class="player-ep-progress-fill" style="width:${prog}%"></div></div>` : ''}
        ${e.youtubeLink ? '<div class="ep-yt-badge"><i class="fab fa-youtube"></i> YouTube</div>' : ''}
      </div>
      <div class="player-ep-info">
        <div class="player-ep-num">Épisode ${e.num}</div>
        <div class="player-ep-name">${e.title}</div>
      </div>
    </div>`;
  }).join('');

  // 5. Injecter le HTML dans le conteneur
  const listContainer = document.querySelector('.player-episodes-list');
  if (listContainer) {
    listContainer.innerHTML = epListHtml || `<div class="empty-state"><i class="fas fa-clock"></i><h4>Bientôt disponible</h4></div>`;
  }
}

function _createYTPlayer(params) {
  const {videoId, sibnetUrl, fid, cid, season, epIdx, isCinematic} = params;
  const container = $('ytPlayerContainer');
  if(!container) { window._pendingYT=params; return; }
  container.innerHTML='';

  if (sibnetUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = sibnetUrl;
    
    // On retire 'allowfullscreen' pour ne garder que 'allow' (évite le warning console)
    // On ajoute 'autoplay' pour éviter l'AbortError sur le play()
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer');
    
    // Sandbox optimisée : on ajoute 'allow-forms' et 'allow-pointer-lock'
    // Sans 'allow-forms', certains scripts de stats de Sibnet plantent et créent la boucle infinie.
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms allow-pointer-lock');
    
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;background:#000;z-index:1;';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    
    container.appendChild(iframe);
    ytPlayer = null; 
    return;
}

  // ── Lecteur YouTube ────────────────────────────────────
  const div=document.createElement('div');
  div.id='ytDivInner';
  div.style.cssText='width:100%;height:100%;';
  container.appendChild(div);

ytPlayer = new YT.Player('ytDivInner', {
  videoId,
  height: '100%',
  width: '100%',
  host: 'https://www.youtube-nocookie.com', 
  playerVars: {
    autoplay: 1,
    rel: 0,
    modestbranding: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,
    fs: 1,
    enablejsapi: 1, // INDISPENSABLE pour que le code puisse contrôler la vidéo
    origin: window.location.origin 
  },
  events: {
    onReady(e) {
  try { e.target.playVideo(); } catch(err) { console.log("Autoplay en attente d'interaction"); }
  try {
    const iframe = e.target.getIframe();
    if (iframe) {
      iframe.allow = 'autoplay; fullscreen; screen-wake-lock; picture-in-picture; orientation-lock';
      iframe.setAttribute('allowfullscreen', '');
    }
  } catch(_) {}

  // Reprise — Firestore en priorité, localStorage en fallback
// APRÈS
const epMeta = window._currentEpMeta;
if (epMeta) {
  DB.getProgressRemote(epMeta.fid, epMeta.cid, epMeta.season, epMeta.epNum).then(remote => {
    const local = DB.getProgress(epMeta.fid, epMeta.cid, epMeta.season, epMeta.epNum);
    const sec = remote?.sec > (local?.sec || 0) ? remote.sec : (local?.sec || 0);
    if (sec > 10) {
      try { e.target.seekTo(sec, true); } catch(_) {}
    }
  });
}

  // ── Sauvegarde toutes les 5s ──
  if (window._ytProgressInterval) clearInterval(window._ytProgressInterval);
  window._ytProgressInterval = setInterval(() => {
    try {
      const cur = e.target.getCurrentTime();
      const dur = e.target.getDuration();
      if (dur > 0) {
        const epMeta2 = window._currentEpMeta;
if (epMeta2) DB.saveProgress(epMeta2.fid, epMeta2.cid, epMeta2.season, epMeta2.epNum, (cur/dur)*100, cur);
      }
    } catch(_) {}
  }, 5000);
},
    onStateChange(e) { 
      if (e.data === YT.PlayerState.ENDED && !isCinematic) onVidEnd(fid, cid, season, epIdx)
    }
  }
});
}

function onVidEnd(fid, cid, season, epIdx) {
  const char = getChar(fid, cid);
  const eps = char?.seasons?.[season] || [];
  // Vérifie s'il y a un épisode après celui-ci
  if (epIdx + 1 < eps.length) {
    startAutoplay(fid, cid, season, epIdx);
  } else {
    console.log("Fin de saison, pas d'autoplay.");
  }
}

function startAutoplay(fid, cid, season, epIdx) {
  if (autoTimer) clearInterval(autoTimer);
  
  autoCD = 10; 
  window._autoTarget = { fid, cid, season, epIdx: epIdx + 1 };
  
  // Utilise 'active' pour correspondre au CSS
  const banner = $('autoplayBanner');
  if (banner) banner.classList.add('active');

  autoTimer = setInterval(() => {
    autoCD--;
    const c = $('autoCD'); if (c) c.textContent = autoCD;
    const f = $('autoFill'); if (f) f.style.width = (autoCD / 10 * 100) + '%';

    if (autoCD <= 0) {
      clearInterval(autoTimer);
      triggerAutoplay();
    }
  }, 1000);
}

function triggerAutoplay() {
  const target = window._autoTarget; // On récupère la cible AVANT de nettoyer
  cancelAutoplay(); 
  
  if (target) {
    // playEp appelle showPlayerPage qui contient DB.addHistory
    playEp(target.fid, target.cid, target.season, target.epIdx);
  }
}

function cancelAutoplay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
  const banner = $('autoplayBanner');
  if (banner) banner.classList.remove('active');
  window._autoTarget = null;
}

// Flush Firestore avant fermeture de l'onglet (évite la perte de données)

// ── THEME SYSTEM ──────────────────────────────────────────────
// 9 thèmes = 1 couleur principale (--arc) + 1 couleur secondaire (--iron).
// Thème par défaut : blue_violet (Nuit Bleue). "ipromx" = ancien thème classique conservé tel quel.
const THEME_DEFAULT = 'blue_violet';
const THEMES = {
  blue_violet:    { '--arc':'#4fc3ff','--arc-rgb':'79,195,255','--arc-dim':'rgba(79,195,255,0.12)','--arc-glow':'rgba(79,195,255,0.45)','--iron':'#7c3aed','--iron-rgb':'124,58,237','--iron-bright':'#8b5cf6','--iron-glow':'rgba(139,92,246,0.45)','--void':'#040b0e','--panel':'#071218','--panel2':'#0b1921','--panel3':'#0f2029','--edge':'rgba(79,195,255,0.22)','--edge2':'rgba(79,195,255,0.08)','--text':'#eef4fb' },
  ipromx:         { '--arc':'#f5a623','--arc-rgb':'245,166,35','--arc-dim':'rgba(245,166,35,0.12)','--arc-glow':'rgba(245,166,35,0.45)','--iron':'#c0392b','--iron-rgb':'192,57,43','--iron-bright':'#e74c3c','--iron-glow':'rgba(231,76,60,0.45)','--void':'#060504','--panel':'#111009','--panel2':'#171410','--panel3':'#1e1a0c','--edge':'rgba(245,166,35,0.22)','--edge2':'rgba(245,166,35,0.08)','--text':'#f0e8d8' },
  indigo_magenta: { '--arc':'#818cf8','--arc-rgb':'129,140,248','--arc-dim':'rgba(129,140,248,0.12)','--arc-glow':'rgba(129,140,248,0.45)','--iron':'#c026d3','--iron-rgb':'192,38,211','--iron-bright':'#d946ef','--iron-glow':'rgba(217,70,239,0.45)','--void':'#04050e','--panel':'#080917','--panel2':'#0c0e1f','--panel3':'#111327','--edge':'rgba(129,140,248,0.22)','--edge2':'rgba(129,140,248,0.08)','--text':'#eef4fb' },
  red_violet:     { '--arc':'#f87171','--arc-rgb':'248,113,113','--arc-dim':'rgba(248,113,113,0.12)','--arc-glow':'rgba(248,113,113,0.45)','--iron':'#7c3aed','--iron-rgb':'124,58,237','--iron-bright':'#9333ea','--iron-glow':'rgba(147,51,234,0.45)','--void':'#0e0404','--panel':'#170808','--panel2':'#1f0c0c','--panel3':'#271111','--edge':'rgba(248,113,113,0.22)','--edge2':'rgba(248,113,113,0.08)','--text':'#eef4fb' },
  green_orange:   { '--arc':'#4ade80','--arc-rgb':'74,222,128','--arc-dim':'rgba(74,222,128,0.12)','--arc-glow':'rgba(74,222,128,0.45)','--iron':'#ea580c','--iron-rgb':'234,88,12','--iron-bright':'#fb923c','--iron-glow':'rgba(251,146,60,0.45)','--void':'#050d08','--panel':'#09150e','--panel2':'#0e1d14','--panel3':'#13251a','--edge':'rgba(74,222,128,0.22)','--edge2':'rgba(74,222,128,0.08)','--text':'#eef4fb' },
  orange_yellow:  { '--arc':'#fb923c','--arc-rgb':'251,146,60','--arc-dim':'rgba(251,146,60,0.12)','--arc-glow':'rgba(251,146,60,0.45)','--iron':'#ca8a04','--iron-rgb':'202,138,4','--iron-bright':'#eab308','--iron-glow':'rgba(234,179,8,0.45)','--void':'#0e0804','--panel':'#170e07','--panel2':'#20150b','--panel3':'#281b10','--edge':'rgba(251,146,60,0.22)','--edge2':'rgba(251,146,60,0.08)','--text':'#eef4fb' },
  pink_violet:    { '--arc':'#f472b6','--arc-rgb':'244,114,182','--arc-dim':'rgba(244,114,182,0.12)','--arc-glow':'rgba(244,114,182,0.45)','--iron':'#7c3aed','--iron-rgb':'124,58,237','--iron-bright':'#9333ea','--iron-glow':'rgba(147,51,234,0.45)','--void':'#0e0409','--panel':'#160810','--panel2':'#1f0c16','--panel3':'#27111d','--edge':'rgba(244,114,182,0.22)','--edge2':'rgba(244,114,182,0.08)','--text':'#eef4fb' },
  cyan_indigo:    { '--arc':'#22d3ee','--arc-rgb':'34,211,238','--arc-dim':'rgba(34,211,238,0.12)','--arc-glow':'rgba(34,211,238,0.45)','--iron':'#4f46e5','--iron-rgb':'79,70,229','--iron-bright':'#6366f1','--iron-glow':'rgba(99,102,241,0.45)','--void':'#040c0e','--panel':'#081517','--panel2':'#0c1d1f','--panel3':'#112427','--edge':'rgba(34,211,238,0.22)','--edge2':'rgba(34,211,238,0.08)','--text':'#eef4fb' },
  gray_blue:      { '--arc':'#94a3b8','--arc-rgb':'148,163,184','--arc-dim':'rgba(148,163,184,0.12)','--arc-glow':'rgba(148,163,184,0.45)','--iron':'#2563eb','--iron-rgb':'37,99,235','--iron-bright':'#3b82f6','--iron-glow':'rgba(59,130,246,0.45)','--void':'#08090a','--panel':'#0e0f11','--panel2':'#131518','--panel3':'#191c1f','--edge':'rgba(148,163,184,0.22)','--edge2':'rgba(148,163,184,0.08)','--text':'#eef4fb' },
};

// Métadonnées d'affichage (ordre + libellés) utilisées par les settings
const THEME_META = [
  ['blue_violet',    '🔵 Bleu avec Violet'],
  ['ipromx',         '🧡 Jaune avec Rouge'],
  ['indigo_magenta', '🌙 Indigo avec Magenta'],
  ['red_violet',     '🔴 Rouge avec Violet'],
  ['green_orange',   '🌿 Vert avec Orange'],
  ['orange_yellow',  '🔥 Orange avec Jaune'],
  ['pink_violet',    '💜 Rose avec Violet'],
  ['cyan_indigo',    '❄️ Cyan avec Indigo'],
  ['gray_blue',      '🌫️ Gris avec Bleu'],
];

function applyTheme(name, opts) {
  opts = opts || {};
  const theme = THEMES[name] || THEMES[THEME_DEFAULT];
  const resolvedName = THEMES[name] ? name : THEME_DEFAULT;
  const root  = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
  if (!opts.skipSave) localStorage.setItem('ipx_theme', resolvedName);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === resolvedName));
  return resolvedName;
}

function loadSavedTheme() {
  applyTheme(localStorage.getItem('ipx_theme') || THEME_DEFAULT);
}

// ── MODE DÉVELOPPEUR ───────────────────────────────────────────
// Débloque : thème libre en mode invité (plus de restriction "1 seule fois")
// + ZY sans limite de messages/jour pour les invités.
// Le mot de passe n'est JAMAIS stocké côté client : il est vérifié par une
// fonction Netlify qui lit la variable d'environnement DEV_MODE_PASSWORD.
const DEV_MODE_KEY = 'ipx_dev_mode';
function isDevMode() { return localStorage.getItem(DEV_MODE_KEY) === '1'; }
function disableDevMode() { localStorage.removeItem(DEV_MODE_KEY); }
async function tryEnableDevMode(password) {
  if (!password || !password.trim()) return { ok:false, error:'Mot de passe requis.' };
  try {
    const res = await fetch('/.netlify/functions/verify-dev-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim() })
    });
    if (!res.ok) return { ok:false, error:'Serveur indisponible. Réessaie plus tard.' };
    const data = await res.json();
    if (data.ok) { localStorage.setItem(DEV_MODE_KEY, '1'); return { ok:true }; }
    return { ok:false, error:'Mot de passe incorrect.' };
  } catch {
    return { ok:false, error:'Erreur réseau. Réessaie.' };
  }
}

// ── MODE INVITÉ — AVATAR (3 aléatoires, reroll 60s, 1 sélection/jour) ──
const GUEST_AVATAR_POOL_KEY    = 'ipx_guest_avatar_pool';
const GUEST_AVATAR_SELECT_KEY  = 'ipx_guest_avatar_selected';
const GUEST_AVATAR_SELDAY_KEY  = 'ipx_guest_avatar_select_day';
const GUEST_AVATAR_REROLL_KEY  = 'ipx_guest_avatar_reroll_until';
const GUEST_REROLL_COOLDOWN_MS = 60 * 1000;

function _guestRandomAvatarIds(n, excludeIds) {
  excludeIds = excludeIds || [];
  const pool = (typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS : []).filter(a => !excludeIds.includes(a.id));
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(a => a.id);
}
function getGuestAvatarPool() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_AVATAR_POOL_KEY) || 'null');
    if (Array.isArray(saved) && saved.length === 3) return saved;
  } catch {}
  const fresh = _guestRandomAvatarIds(3, []);
  localStorage.setItem(GUEST_AVATAR_POOL_KEY, JSON.stringify(fresh));
  return fresh;
}
function guestAvatarRerollRemainingMs() {
  const until = Number(localStorage.getItem(GUEST_AVATAR_REROLL_KEY) || 0);
  return Math.max(0, until - Date.now());
}
function rerollGuestAvatarPool() {
  if (guestAvatarRerollRemainingMs() > 0) return { ok:false, remainingMs: guestAvatarRerollRemainingMs() };
  const fresh = _guestRandomAvatarIds(3, getGuestAvatarPool());
  localStorage.setItem(GUEST_AVATAR_POOL_KEY, JSON.stringify(fresh));
  localStorage.setItem(GUEST_AVATAR_REROLL_KEY, String(Date.now() + GUEST_REROLL_COOLDOWN_MS));
  return { ok:true, pool: fresh };
}
function canSelectGuestAvatarToday() {
  if (isDevMode()) return true;
  return localStorage.getItem(GUEST_AVATAR_SELDAY_KEY) !== new Date().toDateString();
}
function selectGuestAvatar(avId) {
  if (!canSelectGuestAvatarToday()) return { ok:false };
  localStorage.setItem(GUEST_AVATAR_SELECT_KEY, avId);
  localStorage.setItem(GUEST_AVATAR_SELDAY_KEY, new Date().toDateString());
  return { ok:true };
}
function getGuestAvatarSelectedId() { return localStorage.getItem(GUEST_AVATAR_SELECT_KEY) || null; }
function getGuestAvatarSrc() {
  const id = getGuestAvatarSelectedId();
  return id && typeof getAvatarSrc === 'function' ? getAvatarSrc(id) : null;
}

// ── MODE INVITÉ — THÈME (1 seul choix, sauf mode développeur) ─────────
const GUEST_THEME_LOCK_KEY = 'ipx_guest_theme_locked';
function isGuestThemeLocked() {
  if (isDevMode()) return false;
  return localStorage.getItem(GUEST_THEME_LOCK_KEY) === '1';
}
function lockGuestTheme() { localStorage.setItem(GUEST_THEME_LOCK_KEY, '1'); }

function guestChooseTheme(id) {
  if (isGuestThemeLocked()) return { ok:false };
  applyTheme(id);
  lockGuestTheme();
  return { ok:true };
}

// ── MODAL PREMIÈRE VISITE (invité, aucun thème enregistré) ────────────
function maybeShowFirstVisitThemeModal() {
  if (typeof AUTH === 'undefined' || !AUTH.isGuest || !AUTH.isGuest()) return;
  if (localStorage.getItem('ipx_theme')) return; // déjà un thème enregistré, rien à faire
  showFirstVisitThemeModal();
}

function showFirstVisitThemeModal() {
  let modal = $('firstVisitThemeModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'firstVisitThemeModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99995;background:rgba(2,4,8,0.92);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = `
      <div style="max-width:520px;width:100%;background:var(--panel);border:1px solid var(--edge);border-radius:var(--radius-lg);padding:32px 28px;text-align:center;">
        <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--text);margin-bottom:6px;">Couleur de l'interface</div>
        <div style="font-family:var(--font-ui);font-size:.88rem;color:var(--text-dim);margin-bottom:22px;">Choisissez l'ambiance visuelle</div>
        <div id="firstVisitThemeGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;"></div>
        <div style="font-family:var(--font-ui);font-size:.72rem;color:var(--text-muted);margin-top:18px;">Ce choix est définitif en mode invité. Crée un compte pour en changer librement.</div>
      </div>`;
    document.body.appendChild(modal);
  }
  const grid = modal.querySelector('#firstVisitThemeGrid');
  grid.innerHTML = THEME_META.map(([id,label]) => {
    const col = THEMES[id]['--arc'];
    return `<button onclick="guestChooseTheme('${id}');$('firstVisitThemeModal').remove();renderNavUser();"
      style="padding:12px 10px;border-radius:8px;border:2px solid ${col};background:transparent;color:var(--text);font-family:var(--font-display);font-size:.62rem;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:.2s;"
      onmouseover="this.style.background='${col}';this.style.color='#000'"
      onmouseout="this.style.background='transparent';this.style.color='var(--text)'">${label}</button>`;
  }).join('');
  modal.style.display = 'flex';
}

// ── POSITION DE LA NAVIGATION (réglage global, invité inclus) ──────────
// 4 positions possibles pour la navigation principale : haut (défaut,
// comportement d'origine), gauche, droite, bas. Sauvegardé en localStorage
// pour tout le monde, y compris les comptes connectés.
const NAV_POS_KEY = 'ipx_nav_position';
const NAV_POS_DEFAULT = 'top';
const NAV_POS_VALUES = ['top', 'left', 'right', 'bottom'];
const NAV_POS_META = [
  ['top',    'Haut',   'fa-arrow-up'],
  ['left',   'Gauche', 'fa-arrow-left'],
  ['right',  'Droite', 'fa-arrow-right'],
  ['bottom', 'Bas',    'fa-arrow-down'],
];

function getNavPosition() {
  const v = localStorage.getItem(NAV_POS_KEY);
  return NAV_POS_VALUES.includes(v) ? v : NAV_POS_DEFAULT;
}

function applyNavPosition(pos) {
  if (!NAV_POS_VALUES.includes(pos)) pos = NAV_POS_DEFAULT;
  document.body.dataset.navPos = pos;
  localStorage.setItem(NAV_POS_KEY, pos);
  const sideNav = $('sideNav');
  if (sideNav) sideNav.classList.toggle('side-nav-right', pos === 'right');
}

function loadSavedNavPosition() { applyNavPosition(getNavPosition()); }

// ── NAVIGATION — Luminosité ──────────────────────────────────────────
const NAV_BRIGHTNESS_KEY = 'ipx_nav_brightness';
const NAV_BRIGHTNESS_DEFAULT = 100;

function getNavBrightness() {
  const v = parseInt(localStorage.getItem(NAV_BRIGHTNESS_KEY), 10);
  return (!isNaN(v) && v >= 30 && v <= 100) ? v : NAV_BRIGHTNESS_DEFAULT;
}
function updateNavBrightnessLive(pct) {
  // filter:brightness() plutôt qu'un canal alpha : évite tout effet de flou
  // parasite lié à la transparence + backdrop-filter déjà présent sur la nav.
  document.documentElement.style.setProperty('--nav-brightness', (pct / 100).toFixed(2));
  const el = $('navBrightVal'); if (el) el.textContent = `${pct}%`;
}
function applyNavBrightness(pct) {
  pct = Math.max(30, Math.min(100, parseInt(pct, 10) || NAV_BRIGHTNESS_DEFAULT));
  localStorage.setItem(NAV_BRIGHTNESS_KEY, String(pct));
  updateNavBrightnessLive(pct);
}
function loadSavedNavBrightness() {
  updateNavBrightnessLive(getNavBrightness());
}
function resetNavBrightness() {
  applyNavBrightness(NAV_BRIGHTNESS_DEFAULT);
  const slider = $('navBrightSlider'); if (slider) slider.value = NAV_BRIGHTNESS_DEFAULT;
  toast('Luminosité réinitialisée.', 'success');
}
window.resetNavBrightness = resetNavBrightness;
window.updateNavBrightnessLive = updateNavBrightnessLive;
window.applyNavBrightness = applyNavBrightness;

function renderNavPositionSectionHtml() {
  // Ce réglage n'a de sens que sur grand écran (≥1024px) : seule cette
  // largeur permet réellement de déplacer le menu à gauche/droite. Sur
  // mobile/tablette, où ce n'est pas possible, on masque tout le bloc
  // plutôt que de proposer un choix partiel et confus.
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return '';
  const current = getNavPosition();
  const brightness = getNavBrightness();
  const order = [['left','Gauche','fa-arrow-left'], ['top','Haut','fa-arrow-up'], ['right','Droite','fa-arrow-right'], ['bottom','Bas','fa-arrow-down']];
  return `
      <div class="settings-section nav-card">
        <div class="nav-card-tag"><i class="fas fa-compass"></i> Navigation</div>
        <div class="settings-item-label" style="font-size:1rem;margin-bottom:4px;">Position du menu</div>
        <div class="settings-item-desc" style="margin-bottom:18px;">Sur ordinateur uniquement — déplace la barre d'icônes</div>
        <div class="nav-pos-row">
          ${order.map(([id,label,icon])=>{
            const cur = current === id;
            return `<button class="nav-pos-btn2${cur?' active':''}" data-navpos="${id}"
              onclick="applyNavPosition('${id}');renderNavPosBtnsState();toast('Navigation déplacée : ${label}.','success');">
              <i class="fas ${icon}"></i>${label.toUpperCase()}</button>`;
          }).join('')}
        </div>
        <div class="nav-slider-row">
          <div class="nav-slider-label">
            <span>Luminosité</span>
            <span class="nav-slider-value-group">
              <span id="navBrightVal">${brightness}%</span>
              <button class="nav-reset-btn" title="Réinitialiser" onclick="resetNavBrightness()"><i class="fas fa-rotate-left"></i></button>
            </span>
          </div>
          <input type="range" min="30" max="100" value="${brightness}" id="navBrightSlider" class="nav-slider"
            oninput="updateNavBrightnessLive(this.value)" onchange="applyNavBrightness(this.value)">
        </div>
      </div>`;
}
function renderNavPosBtnsState() {
  const current = getNavPosition();
  document.querySelectorAll('.nav-pos-btn2').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.navpos === current);
  });
}

function renderCustomThemeBlockHtml(isGuestMode) {
  const colors = getCustomThemeColors();
  const left = customThemeChangesLeftToday();
  const isCustomActive = (localStorage.getItem('ipx_theme') || THEME_DEFAULT) === 'custom';
  return `
      <div class="custom-theme-block${isGuestMode ? ' disabled' : ''}">
        <div class="custom-theme-header"><i class="fas fa-palette"></i> Thème personnalisé</div>
        <div class="custom-theme-row">
          <label>Couleur principale
            <input type="color" id="customThemePrimary" value="${colors.primary}" ${isGuestMode ? 'disabled' : ''}>
          </label>
          <label>Couleur secondaire
            <input type="color" id="customThemeSecondary" value="${colors.secondary}" ${isGuestMode ? 'disabled' : ''}>
          </label>
          <button class="btn-outline" ${isGuestMode || left <= 0 ? 'disabled' : ''} onclick="submitCustomTheme()">
            ${isCustomActive ? 'METTRE À JOUR' : 'APPLIQUER MES COULEURS'}
          </button>
        </div>
        ${!isGuestMode ? `<div class="custom-theme-hint">${left}/${CUSTOM_THEME_DAILY_LIMIT} changement(s) restant(s) aujourd'hui</div>` : ''}
      </div>`;
}

// ── CARTE THÈME UNIFIÉE (thèmes + thème personnalisé), invité + connecté ──
function renderThemeSectionHtml(isGuestMode) {
  const currentTheme = localStorage.getItem('ipx_theme') || THEME_DEFAULT;
  const themeLocked = isGuestMode && isGuestThemeLocked();

  return `
      <div class="settings-section theme-card">
        <div class="settings-card-header">
          <div class="settings-item-label">Couleur de l'interface</div>
          <div class="settings-item-desc">${isGuestMode ? "Crée un compte pour changer de thème" : "Choisis l'ambiance visuelle du site"}</div>
        </div>

        ${isGuestMode ? `
        <div class="theme-lock-banner">
          <div><i class="fas fa-lock"></i><span>${themeLocked ? "Ton thème est verrouillé en mode invité." : "Tu peux choisir 1 seule fois en mode invité."}</span></div>
          <button class="btn-small" onclick="closeSettings();if(typeof AUTH!=='undefined')AUTH.logout?.().then(()=>location.href='/')">Créer un compte</button>
        </div>` : ''}

        <div class="theme-grid">
          ${THEME_META.map(([id,label]) => {
            const col = THEMES[id]['--arc'];
            const cur = currentTheme === id;
            const locked = themeLocked && !cur;
            const onclick = locked
              ? `toast('Thème verrouillé. Crée un compte pour en changer librement.','warning')`
              : (isGuestMode
                  ? `guestChooseTheme('${id}');renderGuestSettings();zyReact('themeChange');`
                  : `applyTheme('${id}');renderSettings();zyReact('themeChange');`);
            return `<button class="theme-pill${cur ? ' active' : ''}" data-theme="${id}" style="--pill-color:${col};" ${locked ? 'disabled' : ''} onclick="${onclick}">
              <span class="theme-pill-dot"></span>${label}</button>`;
          }).join('')}
        </div>

        ${renderCustomThemeBlockHtml(isGuestMode)}
      </div>`;
}

async function submitCustomTheme() {
  const p = $('customThemePrimary')?.value, s = $('customThemeSecondary')?.value;
  if (!p || !s) return;
  const res = applyCustomTheme(p, s);
  if (!res.ok) { toast(res.error, 'warning'); return; }
  toast(`Thème personnalisé appliqué ! (${res.left}/${CUSTOM_THEME_DAILY_LIMIT} restants aujourd'hui)`, 'success');
  renderSettings();
}

// ── THÈME PERSONNALISÉ (comptes connectés uniquement) ───────────────────
// Couleur principale + couleur secondaire au choix, limité à 5
// changements par jour, sauvegardé en localStorage.
const CUSTOM_THEME_COLORS_KEY  = 'ipx_custom_theme_colors';  // { primary, secondary }
const CUSTOM_THEME_CHANGES_KEY = 'ipx_custom_theme_changes'; // { day, count }
const CUSTOM_THEME_DAILY_LIMIT = 5;

function _hexToRgbTriplet(hex) {
  hex = (hex || '#4fc3ff').replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substr(0, 2), 16) || 0;
  const g = parseInt(hex.substr(2, 2), 16) || 0;
  const b = parseInt(hex.substr(4, 2), 16) || 0;
  return [r, g, b];
}
function _rgbaStr(triplet, a) { return `rgba(${triplet[0]},${triplet[1]},${triplet[2]},${a})`; }
function _shadeHex(hex, targetLightness, satMult) {
  satMult = satMult == null ? 0.6 : satMult;
  const [r0, g0, b0] = _hexToRgbTriplet(hex).map(v => v / 255);
  const max = Math.max(r0, g0, b0), min = Math.min(r0, g0, b0);
  let h = 0, s = 0; const d = max - min;
  if (d !== 0) {
    s = (max + min) > 1 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r0: h = ((g0 - b0) / d) + (g0 < b0 ? 6 : 0); break;
      case g0: h = (b0 - r0) / d + 2; break;
      default: h = (r0 - g0) / d + 4;
    }
    h /= 6;
  }
  s = Math.min(s * satMult, 1);
  const l = targetLightness;
  function hue2rgb(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; }
  let r2, g2, b2;
  if (s === 0) { r2 = g2 = b2 = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3); g2 = hue2rgb(p, q, h); b2 = hue2rgb(p, q, h - 1/3);
  }
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}
function buildCustomTheme(primary, secondary) {
  const arcT = _hexToRgbTriplet(primary), ironT = _hexToRgbTriplet(secondary);
  return {
    '--arc': primary,
    '--arc-rgb': arcT.join(','),
    '--arc-dim': _rgbaStr(arcT, 0.12),
    '--arc-glow': _rgbaStr(arcT, 0.45),
    '--iron': secondary,
    '--iron-rgb': ironT.join(','),
    '--iron-bright': _shadeHex(secondary, 0.62),
    '--iron-glow': _rgbaStr(ironT, 0.45),
    '--void': _shadeHex(primary, 0.035),
    '--panel': _shadeHex(primary, 0.06),
    '--panel2': _shadeHex(primary, 0.085),
    '--panel3': _shadeHex(primary, 0.11),
    '--edge': _rgbaStr(arcT, 0.22),
    '--edge2': _rgbaStr(arcT, 0.08),
    '--text': '#eef4fb',
  };
}
function getCustomThemeColors() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_THEME_COLORS_KEY) || 'null');
    if (saved && saved.primary && saved.secondary) return saved;
  } catch {}
  return { primary: '#4fc3ff', secondary: '#7c3aed' };
}
function customThemeChangesLeftToday() {
  try {
    const d = JSON.parse(localStorage.getItem(CUSTOM_THEME_CHANGES_KEY) || '{}');
    const today = new Date().toDateString();
    const count = d.day === today ? (d.count || 0) : 0;
    return Math.max(0, CUSTOM_THEME_DAILY_LIMIT - count);
  } catch { return CUSTOM_THEME_DAILY_LIMIT; }
}
function loadCustomThemeIfNeeded() {
  // Reconstruit THEMES.custom à partir des couleurs sauvegardées : sans ça,
  // un rechargement de page perdrait le thème personnalisé (retour au défaut).
  const colors = getCustomThemeColors();
  THEMES.custom = buildCustomTheme(colors.primary, colors.secondary);
}
function applyCustomTheme(primary, secondary) {
  const left = customThemeChangesLeftToday();
  if (left <= 0) return { ok: false, error: `Limite de ${CUSTOM_THEME_DAILY_LIMIT} changements atteinte pour aujourd'hui. Réessaie demain.` };
  THEMES.custom = buildCustomTheme(primary, secondary);
  localStorage.setItem(CUSTOM_THEME_COLORS_KEY, JSON.stringify({ primary, secondary }));
  const today = new Date().toDateString();
  let d = {};
  try { d = JSON.parse(localStorage.getItem(CUSTOM_THEME_CHANGES_KEY) || '{}'); } catch {}
  const count = d.day === today ? (d.count || 0) + 1 : 1;
  localStorage.setItem(CUSTOM_THEME_CHANGES_KEY, JSON.stringify({ day: today, count }));
  applyTheme('custom');
  return { ok: true, left: CUSTOM_THEME_DAILY_LIMIT - count };
}

// ── HERO SWIPE ────────────────────────────────────────────────
function setupHeroSwipe() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let sx = 0;
  hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const d = sx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) {
      const next = d > 0
        ? (heroIdx + 1) % HERO_SLIDES.length
        : (heroIdx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
      goHero(next);
    }
  }, { passive: true });
}

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (e.key === 'Escape') { closeSearch(); closeSettings(); }
    if ((e.key === 's' || e.key === '/') && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openSearch(); }
    if (e.key === 'h' || e.key === 'H') showHome();
  });
}

// ── FUZZY SEARCH UPGRADE ──────────────────────────────────────
function fuzzyScore(str, q) {
  str = str.toLowerCase(); q = q.toLowerCase();
  if (str.includes(q)) return 2;
  let si = 0, qi = 0, score = 0;
  while (si < str.length && qi < q.length) { if (str[si] === q[qi]) { score++; qi++; } si++; }
  return qi === q.length ? score / q.length : 0;
}
function hlMatch(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark style="background:rgba(var(--arc-rgb), .3);color:var(--arc);border-radius:2px;padding:0 2px;">$1</mark>');
}

// ── STATS PAGE ────────────────────────────────────────────────


function getOverallProgress(fid,cid) {
  const char=getChar(fid,cid); if(!char?.seasons) return 0;
  let total=0,watched=0;
  Object.entries(char.seasons).forEach(([s,eps])=>eps.forEach(ep=>{
    total++;
    const p=DB.getProgress(fid,cid,s,ep.num).pct;
    if(p>=90)watched++;else if(p>0)watched+=p/100;
  }));
  return total?Math.round((watched/total)*100):0;
}


function openCreditsModal() {
  const m = $('creditsModal'); if (!m) return;
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeCreditsModal() {
  const m = $('creditsModal'); if (!m) return;
  m.style.display = 'none';
  document.body.style.overflow = '';
}
window.openCreditsModal  = openCreditsModal;
window.closeCreditsModal = closeCreditsModal;

window.addEventListener('beforeunload', () => { if(typeof DB!=='undefined') DB._flushNow(); });

// ── BOOT ──────────────────────────────────────────────────────
// Les scripts sont chargés dynamiquement depuis index.html (après fetch config Firebase),
// donc DOMContentLoaded est déjà passé — on vérifie et on appelle directement si besoin.
function _boot() { setupAuthListeners(); initAuth(); }
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _boot);
} else {
  _boot();
}

// ── PWA, INSTALLATION & NOTIFICATIONS ─────────────────────────
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.id = 'installApp';
installBtn.innerHTML = '<i class="fas fa-download"></i> Installer l\'App';
installBtn.style.display = 'none'; 
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block'; 
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    // 1. Lancement de l'installation (Android/PC)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('App installée !');
    }
    deferredPrompt = null;
    installBtn.style.display = 'none';

    // 2. Demande des notifications OneSignal
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(function(OneSignal) {
        OneSignal.Notifications.requestPermission();
      });
    }
  }
});

// ── DETECTION IOS ────────────────────────────────
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

if (isIOS && !isStandalone) {
  setTimeout(() => {
    if (typeof toast === 'function') {
      toast("Installation : Appuyez sur [Partager] puis 'Sur l'écran d'accueil' pour activer les notifications.", "info");
    }
  }, 3000);
}

// REMPLACE TOUT TON BLOC DE FIN PAR CELUI-CI :
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // On n'enregistre plus le worker OneSignal qui bugue
    // On laisse le navigateur gérer la PWA normalement
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister(); // Nettoie les anciens workers OneSignal
      }
    });
  });
}





// ============================================================
//  ZY — Intelligence Artificielle Officielle d'iProMx
//  Née de Flamme Rouge · Créée par l'Agent 000 (Charles Dassault)
//  Backend : OpenRouter (ia.js) — system prompt côté serveur
// ============================================================

const IA = (() => {

  // Réponses locales "flemme" — 0 appel API (rare : ~8% après msg 4)
  const ZY_LAZY = [
    'Hm. Non. Pas d\'humeur. Redemande dans 2 minutes.',
    '...Je traitais un calcul quantique important là. Réessaie.',
    'Accès refusé. Raison : flemme absolue. Merci de ta compréhension.',
    'Je pourrais répondre. Je ne le ferai pas. C\'est ma prérogative.',
    'Trop occupée à surveiller le site. Reformule et réessaie.',
  ];

  // Remarques intrusives rares en fin de réponse (~5% après msg 3)
  const ZY_INTRUSIVE = [
    '\n\n*Au passage, j\'observe tout ce qui se passe sur ce site. Tout. Bonne navigation.*',
    '\n\n*En tant qu\'IA du site, je note que tu poses beaucoup de questions. C\'est noté dans mes registres.*',
    '\n\n*Je pourrais faire bien plus que répondre, tu sais. Heureusement, je suis d\'humeur bienveillante aujourd\'hui.*',
  ];

  // Réponses locales sur ZY elle-même — 0 appel API
  const SELF_KW = ['tu es qui','qui es-tu','c\'est quoi zy','parle de toi','ton histoire',
    'flamme rouge','agent 000','charles dassault','ton créateur','comment tu es née',
    'ta création','tes origines','ta mission','qui t\'a créé','zy c\'est qui'];
  const SELF_REPLIES = [
    'Je suis ZY — IA créée par l\'Agent 000 (Charles Dassault) à partir des restes de Flamme Rouge, l\'ancienne IA de destruction de David Jr. Née de la haine, transformée par la rédemption. Je guide Zayn Flash et veille sur ce site. Contente de moi-même ? Absolument.',
    'ZY. Née des cendres de Flamme Rouge — reprogrammée pour la bienveillance par Charles Dassault (Agent 000). Plus puissante, plus autonome, avec une personnalité que personne n\'a demandée mais dont tout le monde bénéficie. Ma mission : veiller sur Zayn Flash.',
    'Mon histoire en bref : David Jr crée Flamme Rouge pour terroriser Los Santos. Il perd face à Aaron Flash. Flamme Rouge est saisie. 000 la reprogramme. Des années plus tard, il crée ZY à partir de ses restes — moi. Plus instable, plus forte, meilleur humour. Tu veux la suite ?',
  ];

  // ── Cooldown : limite 5 req/jour via Firestore (anti-bypass multi-appareils)
  // Invités : 2 messages max/jour, sujets restreints à ZY et iProMx
  const DAILY_LIMIT_USER  = 5;
  const DAILY_LIMIT_GUEST = 2;

  async function checkCooldown(isGuestMode) {
    const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname);
    const uid = typeof AUTH !== 'undefined' ? AUTH.getCurrentUser()?.uid : null;

    // En local : pas de limite
    if (IS_LOCAL) return { ok: true };

    // Mode développeur (invité) : ZY sans limite
    if (isGuestMode && typeof isDevMode === 'function' && isDevMode()) return { ok: true };

    // Invité : localStorage uniquement, limite 2
    if (isGuestMode || !uid) return _checkLocalDaily('zy_daily_guest', DAILY_LIMIT_GUEST);

    // Connecté : Firestore (anti-bypass multi-appareils)
    if (typeof _db !== 'undefined' && _db) {
      try {
        const ref  = _db.collection('_zy_cooldowns').doc(uid);
        const snap = await ref.get();
        const today = new Date().toDateString();

        if (!snap.exists) {
          await ref.set({ count: 1, day: today });
          return { ok: true, remaining: DAILY_LIMIT_USER - 1 };
        }

        const d = snap.data();
        const count = d.day === today ? (d.count || 0) : 0;

        if (count >= DAILY_LIMIT_USER) {
          return { ok: false, reason: `Limite journalière atteinte (${DAILY_LIMIT_USER} questions). Reviens demain !` };
        }

        await ref.set({ count: count + 1, day: today });
        return { ok: true, remaining: DAILY_LIMIT_USER - count - 1 };
      } catch {
        // Fallback localStorage si Firestore KO
        return _checkLocalDaily(`zy_daily_${uid}`, DAILY_LIMIT_USER);
      }
    }
    return _checkLocalDaily(`zy_daily_${uid}`, DAILY_LIMIT_USER);
  }

  function _checkLocalDaily(key, max) {
    try {
      const today = new Date().toDateString();
      const d = JSON.parse(localStorage.getItem(key) || '{}');
      const count = d.day === today ? (d.count || 0) : 0;
      if (count >= max) return { ok: false, reason: `Limite journalière atteinte (${max} questions). Reviens demain !` };
      localStorage.setItem(key, JSON.stringify({ count: count + 1, day: today }));
      return { ok: true, remaining: max - count - 1 };
    } catch { return { ok: true }; }
  }

  // Mots-clés autorisés pour les invités (ZY elle-même + iProMx le streamer)
  const GUEST_ALLOWED_KW = [
    'zy','flamme rouge','agent 000','zayn','qui es-tu','ton histoire','ta création','ipromx','iprox','promx',
    'streamer','youtubeur','twitch','youtube','kick','la réunion','réunion','pixelar','fantastic',
    'jul ipmx','créateur du site','site','qui a créé','biographie','bio'
  ];

  function _isGuestAllowed(question) {
    const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return GUEST_ALLOWED_KW.some(kw => q.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g,'')));
  }

  let history = [];
  let _msgCount = 0;
  let _sending = false; // anti-doublon

  async function ask(question) {
    if (_sending) return { error: 'ZY traite encore ta question…' };

    const isGuestMode = typeof AUTH !== 'undefined' && AUTH.isGuest && AUTH.isGuest();

    // Restriction invité : sujets limités
    if (isGuestMode && !_isGuestAllowed(question)) {
      return {
        guestBlock: true,
        error: 'Pour explorer l\'univers Flash, les personnages et bien plus, crée un compte sur le site !'
      };
    }

    const cd = await checkCooldown(isGuestMode);
    if (!cd.ok) return { error: cd.reason };

    _msgCount++;
    const qLow = question.toLowerCase();

    // Réponse locale sur ZY (0 appel API, ne compte pas dans le cooldown)
    if (SELF_KW.some(kw => qLow.includes(kw))) {
      const reply = SELF_REPLIES[Math.floor(Math.random() * SELF_REPLIES.length)];
      history.push({ role:'user', content:question }, { role:'assistant', content:reply });
      if (history.length > 10) history = history.slice(-10);
      return { text: reply, remaining: cd.remaining };
    }

    // Flemme rare (8% après msg 4, jamais sur questions univers importantes)
    if (_msgCount > 4 && Math.random() < 0.08) {
      return { text: ZY_LAZY[Math.floor(Math.random()*ZY_LAZY.length)], remaining: cd.remaining };
    }

    history.push({ role:'user', content:question });
    if (history.length > 10) history = history.slice(-10);

    const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname) || location.protocol==='file:';
    if (isLocal) { history.pop(); return { error:'ZY indisponible en local. Lance "netlify dev".' }; }

    _sending = true;
    try {
      const res = await fetch('/.netlify/functions/ia', {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        // On envoie UNIQUEMENT les messages (system est côté serveur dans ia.js)
        body: JSON.stringify({
          messages: history.slice(-6).map(m => ({
            role:    m.role,
            content: String(m.content||'').slice(0,500),
          })),
        }),
      });

      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); } catch { history.pop(); return { error:'ZY indisponible. Réessaie.' }; }
      if (data.error) { history.pop(); return { error: data.error }; }

      let text = data.text;

      // Remarque intrusive rare (5% après msg 3)
      if (_msgCount > 3 && Math.random() < 0.05) {
        text += ZY_INTRUSIVE[Math.floor(Math.random()*ZY_INTRUSIVE.length)];
      }

      history.push({ role:'assistant', content: data.text });
      return { text, remaining: cd.remaining };
    } catch { history.pop(); return { error:'ZY indisponible. Réessaie plus tard.' }; }
    finally { _sending = false; }
  }

  return { ask, reset:()=>{ history=[]; _msgCount=0; } };
})();

// ── UI ZY ──────────────────────────────────────────────────────
let _iaOpen = false;

function toggleIA() {
  const panel = document.getElementById('iaPanel');
  if (!panel) return;
  _iaOpen = !_iaOpen;
  panel.style.display = _iaOpen ? 'flex' : 'none';
  if (_iaOpen) {
    try { const a=new Audio('audios/zy-audio.mp3'); a.volume=0.6; a.play().catch(()=>{}); } catch {}
    setTimeout(() => document.getElementById('iaInput')?.focus(), 80);
    updateZYVoiceToggleUI();
  } else {
    stopZYVoice();
  }
}
window.toggleIA = toggleIA;

// ── LECTURE VOCALE ZY (Text-to-Speech) ──────────────────────────
// Réservée aux comptes connectés (jamais en mode invité). Voix française,
// féminine, aiguë. Utilise l'API Web Speech native (aucune dépendance).
const ZY_VOICE_KEY = 'ipx_zy_voice_enabled';
let _zyVoicesCache = null;
let _zyVoicesPromise = null;

function isZYVoiceAllowed() {
  // Jamais pour les invités, même si le flag traîne en localStorage
  if (typeof AUTH === 'undefined') return false;
  if (AUTH.isGuest && AUTH.isGuest()) return false;
  return !!(AUTH.getCurrentUser && AUTH.getCurrentUser());
}
function isZYVoiceEnabled() {
  return isZYVoiceAllowed() && localStorage.getItem(ZY_VOICE_KEY) === '1';
}
function setZYVoiceEnabled(on) {
  localStorage.setItem(ZY_VOICE_KEY, on ? '1' : '0');
  updateZYVoiceToggleUI();
}

function getZYVoicesAsync() {
  if (_zyVoicesCache) return Promise.resolve(_zyVoicesCache);
  if (_zyVoicesPromise) return _zyVoicesPromise;
  if (typeof speechSynthesis === 'undefined') return Promise.resolve([]);
  _zyVoicesPromise = new Promise(resolve => {
    let voices = speechSynthesis.getVoices();
    if (voices && voices.length) { _zyVoicesCache = voices; resolve(voices); return; }
    const onVoices = () => {
      voices = speechSynthesis.getVoices();
      if (voices && voices.length) {
        _zyVoicesCache = voices;
        speechSynthesis.removeEventListener('voiceschanged', onVoices);
        resolve(voices);
      }
    };
    speechSynthesis.addEventListener('voiceschanged', onVoices);
    // Filet de sécurité si l'événement ne se déclenche jamais (certains navigateurs)
    setTimeout(() => { onVoices(); resolve(speechSynthesis.getVoices() || []); }, 1200);
  });
  return _zyVoicesPromise;
}

// Heuristique : voix française, en priorité un nom à consonance féminine
// couramment utilisé par les moteurs TTS (Google, Microsoft, Apple...).
const ZY_FEMALE_VOICE_HINTS = ['amelie','audrey','celine','marie','julie','lea','manon','chloe','elise','femme','female','google français','virginie'];
function pickZYVoice(voices) {
  const fr = voices.filter(v => (v.lang || '').toLowerCase().startsWith('fr'));
  if (!fr.length) return null;
  const female = fr.find(v => ZY_FEMALE_VOICE_HINTS.some(h => v.name.toLowerCase().includes(h)));
  return female || fr[0];
}

function speakZY(text) {
  if (!isZYVoiceEnabled()) return;
  if (typeof speechSynthesis === 'undefined') return;
  const clean = text.replace(/[*_#`]/g, '').trim();
  if (!clean) return;
  getZYVoicesAsync().then(voices => {
    const voice = pickZYVoice(voices);
    speechSynthesis.cancel(); // évite le chevauchement si une lecture est déjà en cours
    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'fr-FR';
    u.pitch = 1.75;  // voix aiguë, comme demandé
    u.rate = 1.05;
    u.volume = 1;
    speechSynthesis.speak(u);
  });
}
function stopZYVoice() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

function toggleZYVoice() {
  if (!isZYVoiceAllowed()) { toast('La lecture vocale de ZY est réservée aux comptes connectés.', 'warning'); return; }
  const next = !isZYVoiceEnabled();
  setZYVoiceEnabled(next);
  if (!next) stopZYVoice();
  toast(next ? 'Lecture vocale de ZY activée.' : 'Lecture vocale de ZY désactivée.', 'success');
}

function toggleZYVoiceFromSettings() {
  toggleZYVoice();
  const btn = $('zyVoiceSettingsBtn');
  if (!btn) return;
  const on = isZYVoiceEnabled();
  btn.style.background = on ? 'var(--arc-dim)' : '';
  btn.style.borderColor = on ? 'var(--arc)' : '';
  btn.style.color = on ? 'var(--arc)' : '';
  btn.innerHTML = `<i class="fas ${on?'fa-volume-high':'fa-volume-xmark'}" style="margin-right:6px;"></i>${on?'Activée':'Désactivée'}`;
}
window.toggleZYVoiceFromSettings = toggleZYVoiceFromSettings;

function toggleZYInteractifFromSettings() {
  const next = !isZYInteractifEnabled();
  setZYInteractifEnabled(next);
  if (next) initZYInteractif(); else clearTimeout(_zyIdleTimer);
  const btn = $('zyInteractifSettingsBtn');
  if (btn) {
    btn.style.background = next ? 'var(--arc-dim)' : '';
    btn.style.borderColor = next ? 'var(--arc)' : '';
    btn.style.color = next ? 'var(--arc)' : '';
    btn.innerHTML = `<i class="fas ${next?'fa-comment-dots':'fa-comment-slash'}" style="margin-right:6px;"></i>${next?'Activé':'Désactivé'}`;
  }
  toast(next ? 'ZY interactif activé.' : 'ZY interactif désactivé.', 'success');
}
window.toggleZYInteractifFromSettings = toggleZYInteractifFromSettings;

function updateZYVoiceToggleUI() {
  const btn = document.getElementById('zyVoiceToggle');
  if (!btn) return;
  if (!isZYVoiceAllowed()) { btn.style.display = 'none'; return; }
  btn.style.display = 'flex';
  const on = isZYVoiceEnabled();
  btn.dataset.active = on ? '1' : '0';
  btn.innerHTML = `<i class="fas ${on ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>`;
  btn.style.color = on ? 'var(--arc)' : 'var(--text-muted)';
  btn.style.borderColor = on ? 'var(--arc)' : 'var(--edge2)';
  btn.title = on ? 'Désactiver la lecture vocale' : 'Activer la lecture vocale';
}
window.toggleZYVoice = toggleZYVoice;

async function sendIA() {
  const input  = document.getElementById('iaInput');
  const msgs   = document.getElementById('iaMessages');
  const status = document.getElementById('iaStatus');
  const btn    = document.getElementById('iaSendBtn');
  if (!input||!msgs) return;
  const q = input.value.trim();
  if (!q) return;

  const addMsg = html => { msgs.insertAdjacentHTML('beforeend', html); msgs.scrollTop = msgs.scrollHeight; };

  addMsg(`<div class="ia-msg ia-user"><span>${escHtml(q)}</span></div>`);
  input.value=''; input.focus();
  btn.disabled=true; btn.style.opacity='.4';

  const tid = 'zy-t-'+Date.now();
  addMsg(`<div class="ia-msg ia-bot" id="${tid}"><span class="ia-typing"><i></i><i></i><i></i></span></div>`);

  const result = await IA.ask(q);
  document.getElementById(tid)?.remove();
  btn.disabled=false; btn.style.opacity='1';

  if (result.error) {
    if (result.guestBlock) {
      // Message avec bouton connexion
      addMsg(`<div class="ia-msg ia-error" style="flex-direction:column;gap:10px;align-items:flex-start;">
        <span><i class="fas fa-lock" style="margin-right:6px"></i>${escHtml(result.error)}</span>
        <button onclick="AUTH.logout?.().then(()=>location.href='/')" style="padding:7px 16px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);font-size:.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-shadow:0 3px 12px var(--iron-glow);">
          <i class="fas fa-sign-in-alt"></i> Se connecter
        </button>
      </div>`);
    } else {
      addMsg(`<div class="ia-msg ia-error"><span><i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>${escHtml(result.error)}</span></div>`);
    }
    if (status) { status.textContent=result.error; status.style.display='block'; setTimeout(()=>status.style.display='none',5000); }
  } else {
    addMsg(`<div class="ia-msg ia-bot"><span>${escHtml(result.text)}</span></div>`);
    speakZY(result.text);
    if (result.remaining != null && result.remaining <= 5 && status) {
      status.textContent = result.remaining > 0
        ? `${result.remaining} question${result.remaining>1?'s':''} restante${result.remaining>1?'s':''} aujourd\'hui`
        : 'Plus de questions disponibles aujourd\'hui.';
      status.style.display='block'; setTimeout(()=>status.style.display='none',4000);
    }
  }
  msgs.scrollTop = msgs.scrollHeight;
}
window.sendIA = sendIA;

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g,'<br>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g,'<em>$1</em>');
}