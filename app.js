if (typeof window.$ === 'undefined') window.$   = id => document.getElementById(id);
if (typeof window.$$ === 'undefined') window.$$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

if (typeof window.throttle === 'undefined') window.throttle = (fn, ms) => { let last = 0; return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; };
if (typeof window.debounce === 'undefined') window.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

if (typeof window.ytThumb === 'undefined') window.ytThumb = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
if (typeof window.epThumb === 'undefined') window.epThumb = ep => ep.thumb || (ep.videoId ? ytThumb(ep.videoId) : 'https://ik.imagekit.io/ipromx/images/flash.jpg');
if (typeof window.fmtTime === 'undefined') window.fmtTime = s => { if (isNaN(s) || s < 0) return '0:00'; const m = Math.floor(s / 60), sec = String(Math.floor(s % 60)).padStart(2, '0'); return `${m}:${sec}`; };

if (typeof window.getChar === 'undefined') window.getChar = (fid, cid) => DATA.universes[fid]?.characters.find(c => c.id === cid) || null;
if (typeof window.getTotalEps === 'undefined') window.getTotalEps = c => Object.values(c.seasons || {}).reduce((s, e) => s + e.length, 0);
if (typeof window.hasContent === 'undefined') window.hasContent = c => getTotalEps(c) > 0 || c.hasLocalVideo || c.hasLawBook;
if (typeof window.getFirstEp === 'undefined') window.getFirstEp = c => { for (const [s, eps] of Object.entries(c.seasons || {})) if (eps.length) return { season: s, ep: eps[0], idx: 0 }; return null; };

const getAllChars = () => {
  const ordered = [];
  const seen = new Set();
  for(const [fid,cid] of CHAR_ORDER) {
    const u = DATA.universes[fid]; if(!u) continue;
    const c = u.characters.find(ch=>ch.id===cid); if(!c) continue;
    ordered.push({...c, familyId:fid, family:u});
    seen.add(fid+'|'+cid);
  }
  // Ajouter tout ce qui n'est pas dans la liste d'ordre
  for(const [fid,u] of Object.entries(DATA.universes)) {
    for(const c of u.characters) {
      if(!seen.has(fid+'|'+c.id)) ordered.push({...c, familyId:fid, family:u});
    }
  }
  return ordered;
};

function getOverallProgress(fid, cid) {
  const char = getChar(fid, cid);
  if (!char?.seasons) return 0;
  let total = 0, watched = 0;
  Object.entries(char.seasons).forEach(([s, eps]) => {
    eps.forEach(ep => {
      total++;
      const p = typeof DB !== 'undefined' ? DB.getProgress(fid, cid, s, ep.num).pct : 0;
      if (p >= 90) watched++;
      else if (p > 0) watched += p / 100;
    });
  });
  return total ? Math.round((watched / total) * 100) : 0;
}

// Progression de lecture du lore : même mécanisme que les épisodes (DB.getProgress/
// saveProgress), avec une "saison" dédiée '__lore__' et le numéro de chapitre comme
// numéro d'épisode. 100% = chapitre lu. Isolé de getOverallProgress (contenu vidéo).
const LORE_SEASON_KEY = '__lore__';
function isChapterRead(fid, cid, chapterIdx) {
  return typeof DB !== 'undefined' && DB.getProgress(fid, cid, LORE_SEASON_KEY, chapterIdx).pct >= 100;
}
function setChapterRead(fid, cid, chapterIdx, read) {
  if (typeof DB === 'undefined') return;
  DB.saveProgress(fid, cid, LORE_SEASON_KEY, chapterIdx, read ? 100 : 0, 0);
  DB.flushProgressNow();
}
function getLoreProgress(fid, cid) {
  const char = getChar(fid, cid);
  const chapters = char?.lore?.chapters || [];
  if (!chapters.length) return { read: 0, total: 0, pct: 0 };
  const read = chapters.filter((_, i) => isChapterRead(fid, cid, i)).length;
  return { read, total: chapters.length, pct: Math.round((read / chapters.length) * 100) };
}

function initLazyBg() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.lazy-bg[data-bg]').forEach(el => {
      el.style.backgroundImage = `url('${el.dataset.bg}')`;
    });
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        el.classList.remove('lazy-bg');
        obs.unobserve(el);
      }
    });
  }, { rootMargin: '120px' });
  document.querySelectorAll('.lazy-bg[data-bg]').forEach(el => obs.observe(el));
}
window.initLazyBg = initLazyBg;


// ── SLUG ROUTER (partagé entre character.html et episode.html) ──
const SLUG = {
  char: cid => {
    // Slug explicite (surcharge manuelle dans data.js, ex: 'ned-eden-eddy')
    for (const u of Object.values(DATA.universes || {})) {
      const found = (u.characters || []).find(c => c.id === cid);
      if (found?.slug) return found.slug;
    }
    const first = cid.split('-')[0];
    // Collision check : si plusieurs ids dans DATA partagent le même 1er segment
    // (ex: "le-genie" et "le-geant" -> "le"), on utilise l'id complet pour désambiguïser.
    let count = 0;
    for (const u of Object.values(DATA.universes || {})) {
      for (const c of (u.characters || [])) {
        if (c.id.split('-')[0] === first) count++;
        if (count > 1) return cid;
      }
    }
    return first;
  },
  seas:  s   => s.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  charURL(fid, cid) {
    const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname)||location.protocol==='file:';
    if (isLocal) return `/character.html?fid=${encodeURIComponent(fid)}&cid=${encodeURIComponent(cid)}`;
    return `/${fid}/${this.char(cid)}/`;
  },
  epURL(fid, cid, season, epNum) {
    const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname)||location.protocol==='file:';
    if (isLocal) return `/episode.html?fid=${encodeURIComponent(fid)}&cid=${encodeURIComponent(cid)}&season=${encodeURIComponent(season)}&ep=${epNum}`;
    return `/${fid}/${this.char(cid)}/${this.seas(season)}/ep${epNum}`;
  },
  cineURL(idx) {
    const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname) || location.protocol === 'file:';
    if (isLocal) return `/cinematic.html?idx=${idx}`;
    return `/cinematics/ep${idx}`;
  },
  parseCine(path) {
    const p = path.replace(/^\//, '').split('/').filter(Boolean);
    if (p[0] !== 'cinematics' || !p[1]) return null;
    const n = parseInt(p[1].replace('ep', ''));
    return isNaN(n) ? null : { view: 'cinematic', idx: n };
  },
  findChar(fid, slug) { return DATA.universes[fid]?.characters.find(c => c.slug === slug || c.id === slug || c.id.startsWith(slug + '-')) || null; },
  findSeas(fid, cid, slug) { return Object.keys(getChar(fid, cid)?.seasons || {}).find(s => this.seas(s) === slug) || null; },
  parse(path) {
    const p = path.replace(/^\//, '').split('/').filter(Boolean);
    if (!p[0] || !DATA.universes[p[0]]) return { view: 'home' };
    const fid  = p[0];
    const char = p[1] ? this.findChar(fid, p[1]) : null;
    if (!char) return { view: 'home' };
    if (!p[2] || !p[3]) return { view: 'character', fid, cid: char.id };
    const season = this.findSeas(fid, char.id, p[2]);
    if (!season) return { view: 'character', fid, cid: char.id };
    const epNum = parseInt(p[3].replace('ep', ''));
    if (isNaN(epNum)) return { view: 'character', fid, cid: char.id };
    return { view: 'episode', fid, cid: char.id, season, epNum };
  }
};

// ── TOAST ──
function toast(msg, type = 'success') {
  let tc = document.getElementById('toastContainer');
  if (!tc) { tc = document.createElement('div'); tc.id = 'toastContainer'; tc.className = 'toast-container'; document.body.appendChild(tc); }
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-triangle-exclamation', info: 'fa-info-circle' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type] || icons.info} toast-icon"></i><span class="toast-text">${msg}</span><button class="toast-dismiss" onclick="this.closest('.toast').remove()"><i class="fas fa-times"></i></button>`;
  tc.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 3500);
}
window.toast = toast;

// ── NAV ──
function setupNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', throttle(() => nav.classList.toggle('scrolled', scrollY > 40), 50), { passive: true });
}

function setupHamburger() {
  const ham = document.getElementById('hamburger'), mn = document.getElementById('mobileNav');
  if (!ham) return;
  ham.addEventListener('click', () => { ham.classList.toggle('open'); mn?.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (!e.target.closest('#mobileNav') && !e.target.closest('#hamburger')) {
      mn?.classList.remove('open'); ham?.classList.remove('open');
    }
  });
}

function renderNavUser() {
  const area = document.getElementById('navUserArea'); if (!area) return;
  const user    = typeof AUTH !== 'undefined' ? AUTH.getCurrentUser() : null;
  const isGuest = typeof AUTH !== 'undefined' ? AUTH.isGuest() : false;
  if (!user && !isGuest) { area.innerHTML = ''; return; }

  const initials  = user?.displayName ? user.displayName.slice(0, 2).toUpperCase()
                  : user?.username    ? user.username.slice(0, 2).toUpperCase() : 'G';
  const avatarImg = user?.photoURL || (user?.avatarId ? PRESET_AVATARS?.find(a => a.id === user.avatarId)?.src : null);

  area.innerHTML = `
    <div class="user-menu" id="uMenu">
      ${avatarImg
        ? `<img src="${avatarImg}" class="user-avatar-nav" alt="avatar" onclick="toggleDD()">`
        : `<div class="user-avatar-placeholder" onclick="toggleDD()">${initials}</div>`}
      <div class="user-dropdown" id="userDropdown">
        <div class="dd-header">
          ${avatarImg ? `<img src="${avatarImg}" class="dd-avatar">` : `<div class="dd-avatar-placeholder">${initials}</div>`}
          <div>
            <div class="dd-name">${user?.username || user?.displayName || 'Invité'}</div>
            <div class="dd-role">${isGuest ? 'Mode invité' : (user?.email || '')}</div>
          </div>
        </div>
        <button class="dd-item" onclick="closeDD();window.location='/'"><i class="fas fa-home"></i> Accueil</button>
        ${!isGuest ? `<button class="dd-item" onclick="closeDD();openStatsPage?.()"><i class="fas fa-chart-bar"></i> Mes stats</button>` : ''}
        ${!isGuest ? `<button class="dd-item" onclick="closeDD();if(typeof openSettings==='function')openSettings()"><i class="fas fa-cog"></i> Paramètres</button>` : ''}
        <button class="dd-item danger" onclick="${isGuest
          ? "if(typeof AUTH!=='undefined')AUTH.logout?.().then(()=>location.href='/')"
          : "if(typeof AUTH!=='undefined')AUTH.logout?.().then(()=>location.href='/')"}">
          <i class="fas fa-sign-out-alt"></i> ${isGuest ? 'Quitter' : 'Déconnexion'}
        </button>
      </div>
    </div>`;

  document.addEventListener('click', e => { if (!e.target.closest('#uMenu')) closeDD(); });
}
window.renderNavUser = renderNavUser;

function toggleDD() { document.getElementById('userDropdown')?.classList.toggle('open'); }
function closeDD()   { document.getElementById('userDropdown')?.classList.remove('open'); }
window.toggleDD = toggleDD;
window.closeDD  = closeDD;

// ── LIVE BADGE ──
async function checkLiveBadge() {
  const badge = document.getElementById('liveBadge'); if (!badge) return;
  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  if (isLocal) return;
  try {
    const r = await fetch('/.netlify/functions/live-on-twitch');
    const d = await r.json();
    badge.style.display = d.status === 'online' ? 'flex' : 'none';
    if (d.status === 'online') badge.title = d.streamTitle || 'Live en cours';
  } catch { badge.style.display = 'none'; }
}

// ── TOGGLE LIST (pages character/episode) ──
window.toggleList = function(fid, cid, btn) {
  if (typeof AUTH !== 'undefined' && AUTH.isGuest() && !['localhost','127.0.0.1',''].includes(location.hostname)) {
    return toast('Connectez-vous pour gérer votre liste.', 'warning');
  }
  if (typeof DB !== 'undefined') {
    if (DB.isInList(fid, cid)) {
      DB.removeFromList(fid, cid);
      if (btn) { btn.innerHTML = '<i class="fas fa-plus"></i>'; btn.classList.remove('active'); }
      toast('Retiré de votre liste.', 'info');
    } else {
      DB.addToList({ familyId: fid, charId: cid, name: getChar(fid, cid)?.name });
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i>'; btn.classList.add('active'); }
      toast('Ajouté à votre liste !', 'success');
    }
  }
};

// ── USER BTN FLOTTANT (character.html, lore/index.html, pages secondaires) ──
function renderUserBtn(){
  const user=typeof AUTH!=='undefined'?AUTH.getCurrentUser():null;
  const isGuest=typeof AUTH!=='undefined'?AUTH.isGuest():false;
  const btn=document.getElementById('userBtnFixed');
  if(!btn)return;
  if(!user&&!isGuest){btn.style.display='none';return;}
  const avSrc=user?.avatarId&&typeof PRESET_AVATARS!=='undefined'?PRESET_AVATARS?.find(a=>a.id===user.avatarId)?.src:null;
  const initials=(user?.username||'G').slice(0,2).toUpperCase();
  btn.innerHTML=`<span style="font-family:var(--font-display);font-size:.56rem;letter-spacing:1px;color:var(--text-muted);">${user?.username||'Invité'}</span>
    ${avSrc?`<img src="${avSrc}" class="user-btn-avatar">`:`<div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--iron),var(--arc));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:.65rem;font-weight:700;color:white;">${initials}</div>`}`;
}
window.renderUserBtn=renderUserBtn;

function openUserMenu(){
  const float=document.getElementById('userMenuFloat');
  if(!float)return;
  if(float.style.display!=='none'){float.style.display='none';return;}
  const user=typeof AUTH!=='undefined'?AUTH.getCurrentUser():null;
  const isGuest=typeof AUTH!=='undefined'?AUTH.isGuest():false;
  float.innerHTML=`<div style="background:var(--panel);border:1px solid var(--edge);border-radius:var(--radius-lg);overflow:hidden;min-width:190px;box-shadow:var(--shadow-arc);animation:fadeInUp .18s ease;">
    <div style="padding:12px 16px;border-bottom:1px solid var(--edge2);">
      <div style="font-family:var(--font-display);font-size:.7rem;font-weight:700;color:var(--text);">${user?.username||'Invité'}</div>
      ${user?.email?`<div style="font-family:var(--font-ui);font-size:.7rem;color:var(--text-muted);margin-top:2px;">${user.email}</div>`:''}
    </div>
    <button class="dd-item" onclick="location.href='/'"><i class="fas fa-home"></i> Accueil</button>
    <button class="dd-item danger" onclick="${isGuest
      ? "AUTH.logout?.().then(()=>location.href='/')"
      : "AUTH.logout?.().then(()=>location.href='/')"}">
      <i class="fas fa-sign-out-alt"></i> ${isGuest?'Quitter':'Déconnexion'}
    </button>
  </div>`;
  float.style.display='block';
  setTimeout(()=>document.addEventListener('click',()=>{float.style.display='none';},{once:true}),0);
}
window.openUserMenu=openUserMenu;

// ── INIT COMMUN (character.html + episode.html) ──
function appInit(cb) {
  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);

  async function run() {
    if (!isLocal) {
      try {
        const r = await fetch('/.netlify/functions/firebase-config');
        if (r.ok) { const js = await r.text(); new Function(js)(); }
      } catch {}
    }

    await new Promise(res => {
      const s = document.createElement('script');
      s.src = '/firebase-auth.js?v=50'; s.onload = res; s.onerror = res;
      document.body.appendChild(s);
    });

    if (!isLocal) {
      let loggedIn = false;
      try { loggedIn = await AUTH.restoreSession(); } catch {}
      if (!loggedIn && !AUTH.isGuest()) {
        sessionStorage.setItem('ipx_redirect', location.pathname);
        location.href = '/';
        return;
      }
    }

    setupNavScroll();
    setupHamburger();
    renderNavUser();
    checkLiveBadge();

    // Scroll-to-top button
    if (!document.getElementById('scrollTopBtn')) {
      const btn = document.createElement('button');
      btn.id = 'scrollTopBtn';
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      btn.title = 'Haut de page';
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.appendChild(btn);
      window.addEventListener('scroll', throttle(() => btn.classList.toggle('visible', scrollY > 400), 100), { passive: true });
    }

    initLazyBg();
    if (cb) cb();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
}
window.appInit = appInit;