'use strict';

const ROUTER = (() => {
  const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname) || location.protocol==='file:';
  const charSlug = cid => cid.split('-')[0];
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

  if (loggedIn || AUTH.isGuest()) { hideAuth(); initApp(); return; }
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
  $('guestBtn')?.addEventListener('click',()=>{ AUTH.enterGuest(); hideAuth(); initApp(); });
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
  loadSavedTheme();
  renderNavUser();
  renderNotification();
  renderHero();
  renderUniverses();
  renderCinematics();
  renderGallery();
  renderHistory();
  renderMyList();
  renderSocial();
  setupNavEvents();
  setupScrollEffects();
  setupSearch();
  setupHeroSwipe();
  setupKeyboardShortcuts();
  startHeroAuto();
  ROUTER.init();
  checkTwitchLive();
  setTimeout(initLazyBg, 100);
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
    </div>`;
  const dots=document.querySelector('.hero-indicators');
  if(dots) dots.innerHTML=HERO_SLIDES.map((_,j)=>`<div class="hero-dot${j===i?' active':''}" onclick="goHero(${j})"></div>`).join('');
}
function goHero(i) { updateHero(i); clearInterval(heroTimer); startHeroAuto(); }
function startHeroAuto() { heroTimer=setInterval(()=>updateHero((heroIdx+1)%HERO_SLIDES.length),8000); }

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
  } else {
    DB.addToList({familyId:fid,charId:cid,name:getChar(fid,cid)?.name});
    if(btn){btn.innerHTML='<i class="fas fa-check"></i>';btn.classList.add('active');}
    toast('Ajouté à votre liste !','success');
  }
  renderMyList();
}

// ── SOCIAL ────────────────────────────────────────────────────
function renderSocial() {
  const g=$('socialGrid'); if(!g) return;
  g.innerHTML = DATA.social.map(s => `
    <a href="${s.url}" target="_blank" style="
      display:flex;flex-direction:column;
      background:${s.bg};
      border:1px solid ${s.border};
      border-radius:var(--radius-lg);
      overflow:hidden;
      text-decoration:none;
      transition:transform .2s,box-shadow .2s;
      cursor:pointer;
    " onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px ${s.border}'"
       onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="height:3px;background:${s.color};width:100%;"></div>
      <div style="padding:18px 18px 16px;display:flex;flex-direction:column;gap:14px;flex:1;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:10px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:1.15rem;color:white;flex-shrink:0;">
            <i class="${s.icon}"></i>
          </div>
          <span style="font-family:var(--font-display);font-size:.75rem;font-weight:900;letter-spacing:2px;color:var(--text);text-transform:uppercase;">${s.name}</span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:${s.color};border-radius:30px;color:white;font-family:var(--font-display);font-size:.58rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;align-self:flex-start;margin-top:auto;">
          <i class="${s.ctaIcon}" style="font-size:.78rem;"></i> ${s.cta}
        </div>
      </div>
    </a>`).join('');
}

// ── NOTIFICATION BANNER ───────────────────────────────────────
function renderNotification() {
  const banner = $('notifBanner');
  const inner  = $('notifInner');
  if(!banner||!inner) return;

  const n = DATA.notification;
  if(!n?.active) { banner.style.display='none'; return; }

  // Construire le bouton action
  let actionBtn = '';
  if(n.link) {
    const char = getChar(n.link.familyId, n.link.charId);
    const eps  = char?.seasons?.[n.link.season]||[];
    const epIdx= eps.findIndex(e=>e.num===n.link.epNum);
    if(epIdx>=0) {
      actionBtn = `<button onclick="playEp('${n.link.familyId}','${n.link.charId}','${esc(n.link.season)}',${epIdx})"
        style="flex-shrink:0;padding:9px 20px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));
               border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);
               font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;
               box-shadow:0 3px 12px var(--iron-glow);white-space:nowrap;transition:all .2s;">
        <i class="fas fa-play"></i> Regarder
      </button>`;
    }
  } else if(n.externalUrl) {
    actionBtn = `<a href="${n.externalUrl}" target="_blank"
      style="flex-shrink:0;padding:9px 20px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));
             border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);
             font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;
             text-decoration:none;box-shadow:0 3px 12px var(--iron-glow);white-space:nowrap;">
      <i class="fas fa-external-link-alt"></i> ${n.externalLabel||'Voir'}
    </a>`;
  }

  inner.innerHTML = `
    <div style="
      display:flex;align-items:center;gap:14px;flex-wrap:wrap;
      padding:14px 20px;margin:16px 0 0;
      background:linear-gradient(135deg,rgba(231,76,60,0.1),rgba(245,166,35,0.06));
      border:1px solid rgba(245,166,35,0.25);border-left:3px solid var(--arc);
      border-radius:var(--radius);position:relative;
    ">
      <span style="
        flex-shrink:0;padding:3px 10px;background:var(--arc);color:var(--void);
        font-family:var(--font-display);font-size:.55rem;font-weight:900;
        letter-spacing:2px;border-radius:3px;text-transform:uppercase;
      ">${n.label||'INFO'}</span>
      <span style="flex:1;font-family:var(--font-body);font-size:.95rem;color:var(--text-dim);min-width:150px;">
        ${(Array.isArray(n.texts) ? n.texts : [n.text||n.texts]).join('<br>')}
      </span>
      ${actionBtn}

    </div>`;
  banner.style.display = '';
}

// ── GALERIE ───────────────────────────────────────────────────
// Ajoutez vos images ici au format 'https://ik.imagekit.io/ipromx/images/download/example.jpg'
// Helper pour créer une entrée galerie : src = affichage, dl = téléchargement ImageKit
const _gimg = url => ({ src: url, dl: url + '?ik-attachment=true' });

const GALLERY_IMAGES = [
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img81.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img104.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img121.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img2.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img42.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img79.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img34.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img93.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img83.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img24.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img23.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img124.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img64.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img130.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img129.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img139.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img144.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img26.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img71.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img107.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img135.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img91.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img74.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img8.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img59.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img21.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img7.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img153.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img105.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img14.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img57.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img67.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img158.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img155.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img127.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img9.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img114.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img80.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img128.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img149.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img100.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img125.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img48.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img120.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img1.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img63.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img33.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img101.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img16.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img56.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img28.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img43.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img122.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img54.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img98.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img111.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img140.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img32.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img154.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img90.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img143.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img77.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img11.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img123.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img40.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img37.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img89.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img142.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img30.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img86.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img138.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img41.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img88.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img52.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img25.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img3.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img58.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img136.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img137.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img141.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img46.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img66.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img69.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img19.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img99.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img94.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img117.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img78.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img92.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img61.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img145.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img20.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img134.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img29.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img39.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img18.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img72.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img95.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img112.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img4.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img108.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img113.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img131.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img119.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img51.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img15.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img146.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img55.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img118.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img70.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img82.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img35.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img103.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img65.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img148.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img68.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img133.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img17.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img22.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img151.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img150.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img96.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img157.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img31.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img53.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img73.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img132.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img5.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img110.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img13.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img126.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img147.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img115.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img27.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img97.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img45.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img10.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img47.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img6.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img84.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img87.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img50.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img102.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img36.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img106.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img44.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img49.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img152.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img156.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img12.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img62.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img116.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img76.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img75.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img60.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img38.webp'), //grande image
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img109.webp'),
_gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img159.webp'),
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
    <div class="card" onclick="playCinematic(${i})">
      <div class="card-thumb" style="background-image:url('${c.image||''}')">
        <div class="card-play-icon"><i class="fas fa-film"></i></div>
        <div class="card-badge" style="background:rgba(245,166,35,0.85);color:#000;">CINÉMATIQUE</div>
      </div>
      <div class="card-info"><div class="card-title">${c.title}</div><div class="card-meta">${c.desc||''}</div></div>
    </div>`).join('');
  setTimeout(()=>setupCarousel('cinematicsTrack','cinematicsPrev','cinematicsNext'),50);
}

// APRÈS
function playCinematic(idx) {
  const items=DATA.cinematics||[];
  const c=items[idx]; if(!c) return;

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
  // try { history.pushState({},``,`/cinematique/${idx}`); } catch(_){}

  // Nav close button
  let closeBtn=$('navPlayerClose');
  if(!closeBtn){
    closeBtn=document.createElement('button');
    closeBtn.id='navPlayerClose';
    closeBtn.innerHTML='<i class="fas fa-times"></i><span>Fermer</span>';
    closeBtn.style.cssText='display:inline-flex;align-items:center;gap:7px;padding:7px 16px;background:rgba(231,76,60,0.13);border:1px solid rgba(231,76,60,0.5);border-radius:6px;color:#e74c3c;font-family:var(--font-display);font-size:0.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;margin-left:14px;flex-shrink:0;';
    closeBtn.onmouseover=()=>{closeBtn.style.background='rgba(231,76,60,0.28)';};
    closeBtn.onmouseout=()=>{closeBtn.style.background='rgba(231,76,60,0.13)';};
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
      if (n > 15) clearInterval(t);
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
      <div class="settings-section">
        <div class="settings-section-header"><i class="fas fa-palette"></i> Thème</div>
        <div class="settings-item" style="flex-direction:column;align-items:flex-start;gap:14px;">
          <div class="settings-item-info"><div class="settings-item-label">Couleur de l'interface</div><div class="settings-item-desc">Choisissez l'ambiance visuelle</div></div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;width:100%;">
            ${[
              ['iron','⚙️ Iron Man','#f5a623'],
              ['midnight','🌙 Midnight','#7c8cff'],
              ['crimson','🔴 Crimson','#ff6b6b'],
              ['forest','🌿 Forest','#4ade80'],
              ['ocean','🌊 Ocean','#38bdf8'],
              ['ember','🔥 Ember','#fb923c'],
              ['neon','💜 Neon','#e879f9'],
              ['gold','✨ Gold','#fbbf24'],
              ['ice','❄️ Ice','#a5f3fc'],
              ['smoke','🌫️ Smoke','#94a3b8'],
            ].map(([id,label,col])=>{
              const cur=(localStorage.getItem('ipx_theme')||'iron')===id;
              return `<button class="theme-btn${cur?' active':''}" data-theme="${id}"
                onclick="applyTheme('${id}');renderSettings();"
                style="padding:9px 12px;border-radius:8px;border:2px solid ${col}${cur?'':';opacity:.65'};background:${cur?col+';color:#000':cur?col+';color:#000':'transparent;color:var(--text-dim)'};font-family:var(--font-display);font-size:.56rem;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px;justify-content:center;">${label}</button>`;
            }).join('')}
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
  flash:   ['av1','av2','av3','av5','av13','av14','av15','av16','av17','av18','av19','av20','av21','av22','av24','av25','av26','av27','av28','av33','av34','av35','av36','av37','av38','av39','av40','av43','av44','av45','av46','av47','av48','av49','av50','av51','av52','av53','av54','av55','av56','av57','av71','av72','av73','av74','av75','av76','av77','av78','av79'],
  shade:   ['av59','av60','av61','av62','av63','av64','av65','av66','av67','av68','av69','av70'],
  winters: ['av32','av58'],
  escobar: ['av7','av8','av9','av10','av11'],
  kingsley:['av80'],
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
          style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;border-radius:10px;transition:background .15s;${isSelected?'background:rgba(245,166,35,0.07);':''}">
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
        style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;border-radius:10px;transition:background .15s;${isSelected?'background:rgba(245,166,35,0.07);':''}">
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
  el.style.background = 'rgba(245,166,35,0.07)';
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
function setupSearch() {
  const doSearch = debounce(e => {
    const raw = e.target.value.trim();
    const res  = $('searchResults'); if (!res) return;
    if (raw.length < 2) { res.innerHTML = ''; return; }
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
      return `<div class="search-result-card" onclick="closeSearch();location.href=ROUTER.charURL('${c.familyId}','${c.id}')">
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
function openSearch() { $('searchOverlay')?.classList.add('open'); $('searchInput')?.focus(); }
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
      'background:rgba(231,76,60,0.13)',
      'border:1px solid rgba(231,76,60,0.5)',
      'border-radius:6px',
      'color:#e74c3c',
      'font-family:var(--font-display)',
      'font-size:0.62rem','font-weight:700','letter-spacing:2px',
      'text-transform:uppercase','cursor:pointer',
      'transition:background .15s,border-color .15s',
      'margin-left:14px','flex-shrink:0'
    ].join(';');
    closeBtn.onmouseover = () => { closeBtn.style.background='rgba(231,76,60,0.28)'; };
    closeBtn.onmouseout  = () => { closeBtn.style.background='rgba(231,76,60,0.13)'; };
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
const THEMES = {
  iron:    { '--arc':'#f5a623','--arc-dim':'rgba(245,166,35,0.12)','--arc-glow':'rgba(245,166,35,0.45)','--iron':'#c0392b','--iron-bright':'#e74c3c','--iron-glow':'rgba(231,76,60,0.45)','--void':'#060504','--panel':'#111009','--panel2':'#171410','--panel3':'#1e1a0c','--edge':'rgba(245,166,35,0.22)','--edge2':'rgba(245,166,35,0.08)','--text':'#f0e8d8' },
  midnight:{ '--arc':'#7c8cff','--arc-dim':'rgba(124,140,255,0.12)','--arc-glow':'rgba(124,140,255,0.45)','--iron':'#4f46e5','--iron-bright':'#6366f1','--iron-glow':'rgba(99,102,241,0.45)','--void':'#04040a','--panel':'#0a0a14','--panel2':'#111122','--panel3':'#181830','--edge':'rgba(124,140,255,0.22)','--edge2':'rgba(124,140,255,0.08)','--text':'#e8eaf8' },
  crimson: { '--arc':'#ff6b6b','--arc-dim':'rgba(255,107,107,0.12)','--arc-glow':'rgba(255,107,107,0.45)','--iron':'#c0392b','--iron-bright':'#e74c3c','--iron-glow':'rgba(231,76,60,0.45)','--void':'#080404','--panel':'#130808','--panel2':'#1a0a0a','--panel3':'#200c0c','--edge':'rgba(255,107,107,0.22)','--edge2':'rgba(255,107,107,0.08)','--text':'#f8e8e8' },
  forest:  { '--arc':'#4ade80','--arc-dim':'rgba(74,222,128,0.12)','--arc-glow':'rgba(74,222,128,0.45)','--iron':'#16a34a','--iron-bright':'#22c55e','--iron-glow':'rgba(34,197,94,0.45)','--void':'#030806','--panel':'#081209','--panel2':'#0d180e','--panel3':'#111e12','--edge':'rgba(74,222,128,0.22)','--edge2':'rgba(74,222,128,0.08)','--text':'#e8f8ec' },
  ocean:   { '--arc':'#38bdf8','--arc-dim':'rgba(56,189,248,0.12)','--arc-glow':'rgba(56,189,248,0.45)','--iron':'#0369a1','--iron-bright':'#0ea5e9','--iron-glow':'rgba(14,165,233,0.45)','--void':'#020a10','--panel':'#071220','--panel2':'#0c1a2e','--panel3':'#10223a','--edge':'rgba(56,189,248,0.22)','--edge2':'rgba(56,189,248,0.08)','--text':'#e0f4ff' },
  ember:   { '--arc':'#fb923c','--arc-dim':'rgba(251,146,60,0.12)','--arc-glow':'rgba(251,146,60,0.45)','--iron':'#9a3412','--iron-bright':'#ea580c','--iron-glow':'rgba(234,88,12,0.45)','--void':'#080402','--panel':'#180a04','--panel2':'#220e06','--panel3':'#2c1208','--edge':'rgba(251,146,60,0.22)','--edge2':'rgba(251,146,60,0.08)','--text':'#fff1e6' },
  neon:    { '--arc':'#e879f9','--arc-dim':'rgba(232,121,249,0.12)','--arc-glow':'rgba(232,121,249,0.45)','--iron':'#a21caf','--iron-bright':'#d946ef','--iron-glow':'rgba(217,70,239,0.45)','--void':'#060108','--panel':'#100614','--panel2':'#180a1e','--panel3':'#200d28','--edge':'rgba(232,121,249,0.22)','--edge2':'rgba(232,121,249,0.08)','--text':'#fce7ff' },
  gold:    { '--arc':'#fbbf24','--arc-dim':'rgba(251,191,36,0.12)','--arc-glow':'rgba(251,191,36,0.45)','--iron':'#92400e','--iron-bright':'#d97706','--iron-glow':'rgba(217,119,6,0.45)','--void':'#060400','--panel':'#130e00','--panel2':'#1c1500','--panel3':'#261d00','--edge':'rgba(251,191,36,0.22)','--edge2':'rgba(251,191,36,0.08)','--text':'#fffbeb' },
  ice:     { '--arc':'#a5f3fc','--arc-dim':'rgba(165,243,252,0.12)','--arc-glow':'rgba(165,243,252,0.45)','--iron':'#164e63','--iron-bright':'#06b6d4','--iron-glow':'rgba(6,182,212,0.4)','--void':'#020608','--panel':'#060e12','--panel2':'#0a161c','--panel3':'#0e1e26','--edge':'rgba(165,243,252,0.2)','--edge2':'rgba(165,243,252,0.07)','--text':'#ecfeff' },
  smoke:   { '--arc':'#94a3b8','--arc-dim':'rgba(148,163,184,0.12)','--arc-glow':'rgba(148,163,184,0.35)','--iron':'#475569','--iron-bright':'#64748b','--iron-glow':'rgba(100,116,139,0.4)','--void':'#050507','--panel':'#0e0e12','--panel2':'#141418','--panel3':'#1a1a1e','--edge':'rgba(148,163,184,0.18)','--edge2':'rgba(148,163,184,0.07)','--text':'#e2e8f0' },
};

function applyTheme(name) {
  const theme = THEMES[name] || THEMES.iron;
  const root  = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
  localStorage.setItem('ipx_theme', name);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === name));
}

function loadSavedTheme() {
  applyTheme(localStorage.getItem('ipx_theme') || 'iron');
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
  return text.replace(re, '<mark style="background:rgba(245,166,35,.3);color:var(--arc);border-radius:2px;padding:0 2px;">$1</mark>');
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
//  iProMx IA — Système conversationnel
//  Modèle : Gemini 2.0 Flash (Google AI Studio, plan gratuit)
//  Cooldown : 1min/message, 5msg → 30min (Firestore)
// ============================================================

const IA = (() => {

  // Build compact universe context from DATA (~4KB max)
  function buildContext() {
    const lines = [];
    for (const [fid, u] of Object.entries(DATA.universes)) {
      lines.push(`\n## Famille ${u.name} (${fid})`);
      for (const c of u.characters) {
        const eps = Object.values(c.seasons || {}).reduce((a, s) => a + s.length, 0);
        const seasons = Object.keys(c.seasons || {});
        const desc = (c.description || '').slice(0, 120);
        lines.push(`- **${c.name}** : ${desc}${desc.length >= 120 ? '...' : ''} | ${eps} épisodes (${seasons.join(', ')})`);
        // Add a few episode titles for context
        for (const [s, epList] of Object.entries(c.seasons || {})) {
          const sample = epList.slice(0, 3).map(e => e.title).join(' / ');
          if (sample) lines.push(`  Épisodes (${s}) ex: ${sample}`);
        }
      }
    }
    return lines.join('\n').slice(0, 6000);
  }

  console.log('[IA] Building SYSTEM_PROMPT...');
  const SYSTEM_PROMPT = `Tu es l'IA officielle d'iProMx, une plateforme de streaming dédiée à l'univers de roleplay GTA 5 d'iProMx (univers Pixelar). Tu réponds en français, de façon naturelle et concise (max 3 phrases par réponse sauf si résumé demandé). Tu connais tous les personnages, familles et épisodes ci-dessous. Pour les résumés de personnage, base-toi sur les titres d'épisodes pour deviner les arcs narratifs. Si une question est hors sujet, réponds brièvement et redirige vers l'univers.

Univers disponible :
${buildContext()}`;

  // ── Cooldown géré sur Firestore ────────────────────────────
  async function checkCooldown() {
    const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname);
    const uid = typeof AUTH !== 'undefined' ? AUTH.getCurrentUser()?.uid : null;
    const guestKey = `ia_cd_${uid || 'guest'}`;

    if (IS_LOCAL || !uid || typeof _db === 'undefined' || !_db) {
      // Local fallback: localStorage only
      return checkLocalCooldown(guestKey);
    }

    try {
      const ref  = _db.collection('_ia_cooldowns').doc(uid);
      const snap = await ref.get();
      const now  = Date.now();

      if (!snap.exists) {
        await ref.set({ count: 1, windowStart: now, lastMsg: now });
        return { ok: true };
      }

      const d = snap.data();
      const windowElapsed = now - (d.windowStart || 0);
      const lastElapsed   = now - (d.lastMsg || 0);

      // Hard cooldown: 30min after 5 messages
      if ((d.count || 0) >= 5 && windowElapsed < 30 * 60 * 1000) {
        const left = Math.ceil((30 * 60 * 1000 - windowElapsed) / 60000);
        return { ok: false, reason: `Limite atteinte. Réessaie dans ${left} min.` };
      }

      // Per-message cooldown: 1min
      if (lastElapsed < 60 * 1000) {
        const left = Math.ceil((60 * 1000 - lastElapsed) / 1000);
        return { ok: false, reason: `Attends encore ${left}s.` };
      }

      // Reset window after 30min
      const newCount = windowElapsed >= 30 * 60 * 1000 ? 1 : (d.count || 0) + 1;
      const newStart = windowElapsed >= 30 * 60 * 1000 ? now : (d.windowStart || now);
      await ref.set({ count: newCount, windowStart: newStart, lastMsg: now });
      return { ok: true, remaining: 5 - newCount };
    } catch (e) {
      console.warn('[IA] Firestore cooldown error, fallback local:', e.message);
      return checkLocalCooldown(guestKey);
    }
  }

  function checkLocalCooldown(key) {
    console.log('[IA] checkLocalCooldown, key:', key);
    const now = Date.now();
    try {
      const d = JSON.parse(localStorage.getItem(key) || '{}');
      const windowElapsed = now - (d.windowStart || 0);
      const lastElapsed   = now - (d.lastMsg || 0);
      if ((d.count || 0) >= 5 && windowElapsed < 30 * 60 * 1000) {
        const left = Math.ceil((30 * 60 * 1000 - windowElapsed) / 60000);
        return { ok: false, reason: `Limite atteinte. Réessaie dans ${left} min.` };
      }
      if (lastElapsed < 60 * 1000) {
        const left = Math.ceil((60 * 1000 - lastElapsed) / 1000);
        return { ok: false, reason: `Attends encore ${left}s.` };
      }
      const newCount = windowElapsed >= 30 * 60 * 1000 ? 1 : (d.count || 0) + 1;
      const newStart = windowElapsed >= 30 * 60 * 1000 ? now : (d.windowStart || now);
      localStorage.setItem(key, JSON.stringify({ count: newCount, windowStart: newStart, lastMsg: now }));
      return { ok: true, remaining: 5 - newCount };
    } catch { return { ok: true }; }
  }

  // ── Conversation history (session only, last 6 messages max) ──
  let history = [];

  async function ask(question) {
    console.log('[IA] ask() appelé avec:', question.slice(0, 60));

    const cd = await checkCooldown();
    console.log('[IA] cooldown result:', cd);
    if (!cd.ok) return { error: cd.reason };

    history.push({ role: 'user', content: question });
    if (history.length > 12) history = history.slice(-12);

    const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname) || location.protocol === 'file:';
    console.log('[IA] isLocal:', isLocal, '| hostname:', location.hostname);
    console.log('[IA] Envoi vers /.netlify/functions/ia, messages:', history.length);
    console.log('[IA] system prompt length:', SYSTEM_PROMPT.length);

    // En local : utilise Netlify Dev (netlify dev) ou retourne un message d'info
    if (isLocal) {
      history.pop();
      return { error: 'IA indisponible en local. Lance "netlify dev" ou teste sur Netlify.' };
    }

    try {
      const res = await fetch('/.netlify/functions/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system:   SYSTEM_PROMPT,
          messages: history,
        }),
      });

      console.log('[IA] HTTP status:', res.status, res.statusText);

      const rawText = await res.text();
      console.log('[IA] Raw response:', rawText.slice(0, 300));

      let data;
      try { data = JSON.parse(rawText); }
      catch(e) { console.error('[IA] JSON parse error:', e.message, rawText.slice(0,200)); history.pop(); return { error: 'Indisponible, réessayez plus tard.' }; }

      if (data.error) {
        console.warn('[IA] Erreur retournée:', data.error);
        history.pop();
        return { error: data.error };
      }
      console.log('[IA] Réponse OK:', data.text?.slice(0, 80));
      history.push({ role: 'assistant', content: data.text });
      return { text: data.text, remaining: cd.remaining };
    } catch(err) {
      console.error('[IA] Fetch exception:', err.message, err);
      history.pop();
      return { error: 'Indisponible, réessayez plus tard.' };
    }
  }

  console.log('[IA] Module initialisé. SYSTEM_PROMPT length:', SYSTEM_PROMPT.length);
  return { ask, reset: () => { history = []; } };
})();

// ── UI ─────────────────────────────────────────────────────────
let _iaOpen = false;

function toggleIA() {
  const panel = $('iaPanel');
  if (!panel) return;
  _iaOpen = !_iaOpen;
  panel.style.display = _iaOpen ? 'flex' : 'none';
  if (_iaOpen) setTimeout(() => $('iaInput')?.focus(), 80);
}
window.toggleIA = toggleIA;

async function sendIA() {
  const input = $('iaInput'), msgs = $('iaMessages'), status = $('iaStatus'), btn = $('iaSendBtn');
  if (!input || !msgs) return;
  const q = input.value.trim();
  if (!q) return;

  const addMsg = (html) => {
    msgs.insertAdjacentHTML('beforeend', html);
    msgs.scrollTop = msgs.scrollHeight;
  };

  addMsg(`<div class="ia-msg ia-user"><span>${escHtml(q)}</span></div>`);
  input.value = '';
  input.focus();
  btn.disabled = true;
  btn.style.opacity = '.4';

  const typingId = 'ia-typing-' + Date.now();
  addMsg(`<div class="ia-msg ia-bot" id="${typingId}"><span class="ia-typing"><i></i><i></i><i></i></span></div>`);

  const result = await IA.ask(q);

  document.getElementById(typingId)?.remove();
  btn.disabled = false;
  btn.style.opacity = '1';

  if (result.error) {
    addMsg(`<div class="ia-msg ia-error"><span><i class="fas fa-exclamation-circle" style="margin-right:6px;"></i>${escHtml(result.error)}</span></div>`);
    if (status) { status.textContent = result.error; status.style.display = 'block'; setTimeout(() => { status.style.display = 'none'; }, 4000); }
  } else {
    addMsg(`<div class="ia-msg ia-bot"><span>${escHtml(result.text)}</span></div>`);
    if (result.remaining !== undefined && status) {
      status.textContent = `${result.remaining} message${result.remaining > 1 ? 's' : ''} restant${result.remaining > 1 ? 's' : ''}`;
      status.style.display = 'block';
      setTimeout(() => { status.style.display = 'none'; }, 3000);
    }
  }
  msgs.scrollTop = msgs.scrollHeight;
}
window.sendIA = sendIA;

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}