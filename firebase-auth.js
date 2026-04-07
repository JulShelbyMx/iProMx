/* ============================================================
   iPROMX — FIREBASE AUTH + FIRESTORE  (v2 — optimisé)

   SETUP Firebase Console :
   1. Authentication → Email/Password → Activer
   2. Firestore Database → Créer → Mode Production
   3. Firestore Rules (remplacer exactement) :

      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{uid} {
            allow read, write: if request.auth != null
                               && request.auth.uid == uid;
          }
        }
      }

   4. Variables Netlify → Site settings → Env vars :
        FIREBASE_API_KEY
        FIREBASE_AUTH_DOMAIN
        FIREBASE_PROJECT_ID
        FIREBASE_STORAGE_BUCKET
        FIREBASE_MESSAGING_SENDER_ID
        FIREBASE_APP_ID

   Optimisations Firestore :
   - Tout dans 1 seul document /users/{uid} (pas de sous-collections)
   - 1 read par session (à la connexion), cache mémoire ensuite
   - Writes history/list : debouncés 2s (pas de rafale)
   - Progression vidéo : localStorage (trop volatile pour Firestore)
   - updateProfile : merge partiel (ne touche pas aux autres champs)
   ============================================================ */

/* ── AVATARS PRÉDÉFINIS ──────────────────────────────────── */
const PRESET_AVATARS = [
  { id:'av1',  src:'images/david_flash.png',  label:'David Flash'     },
  { id:'av2',  src:'images/tigreblancdavid.png',  label:'TigreB David'     },
  { id:'av3',  src:'images/john_flash.png',  label:'John Flash'     },
  { id:'av4',  src:'images/loupjohn.webp',  label:'Loup John'     },
  { id:'av5',  src:'images/poildecarotte-avatar.png',  label:'Poil de carotte'     },
  { id:'av6',  src:'images/ken_flash.png',  label:'Ken Flash'     },
  { id:'av7',  src:'images/dragonken.png',  label:'Dragon Ken'     },
  { id:'av8',  src:'images/legeant.png',  label:'Le Géant Freddy'     },
  { id:'av9',  src:'images/tom_escobar.png',  label:'Tom Escobar'     },
  { id:'av10',  src:'images/legenie.png',  label:'Le Génie'     },
  { id:'av11',  src:'images/aaron_flash.jpg',  label:'Aaron Flash 1'     },
  { id:'av12',  src:'images/aaron_flash1.webp',  label:'Aaron Flash 2'     },
  { id:'av13',  src:'images/aaron_flash2.webp',  label:'Aaron Flash 3'     },
  { id:'av14',  src:'images/phénixaaron.webp',  label:'Phenix Aaron'     },
  { id:'av15',  src:'images/davidjr_flash1.webp',  label:'David JR Flash 1'     },
  { id:'av16',  src:'images/davidjr_flash.webp',  label:'David JR Flash 2'     },
  { id:'av17',  src:'images/cobradavidjr.webp',  label:'DJR Cobra'     },
  { id:'av18',  src:'images/damon_flash1.jpg',  label:'Damon Flash 1'     },
  { id:'av19',  src:'images/damon_flash2.jpg',  label:'Damon Flash 2'     },
  { id:'av20',  src:'images/liondamon.png',  label:'Lion Damon'     },
  { id:'av21',  src:'images/billy.png',  label:'Billy'     },
  { id:'av22',  src:'images/monstrekayton_flash.webp',  label:'Kayton Flash 1'     },
  { id:'av23',  src:'images/kayton_flash1.webp',  label:'Kayton Flash 2'     },
  { id:'av24',  src:'images/kayton_flash.webp',  label:'Kayton Flash 3'     },
  { id:'av25',  src:'images/loupgaroukayton.webp',  label:'LoupGarou Kayton'     },
  { id:'av26',  src:'images/ryan.png',  label:'Ryan Johnson'     },
  { id:'av27',  src:'images/zakhackeur.png',  label:'Zak Hackeur'     },
  { id:'av28',  src:'images/ganggamins.png',  label:'Gang Gamins'     },
  { id:'av29',  src:'images/oliver_winters.png',  label:'Oliver Winters'     },
  { id:'av30',  src:'images/adrian_flash1.webp',  label:'Adrian Flash 1'     },
  { id:'av31',  src:'images/adrian_flash2.webp',  label:'Adrian Flash 2'     },
  { id:'av32',  src:'images/adrian_flash4.png',  label:'Adrian Flash 3'     },
  { id:'av33',  src:'images/adrian_flash3.webp',  label:'Adrian Flash 4'     },
  { id:'av34',  src:'images/basilicadrian.webp',  label:'Basilic Adrian'     },
  { id:'av35',  src:'images/manda_flash.png',  label:'Manda Flash'     },
  { id:'av36',  src:'images/axel_leret.png',  label:'Axel Leret'     },
  { id:'av37',  src:'images/eden_flash.webp',  label:'Eden Flash'     },
  { id:'av38',  src:'images/ned_flash.png',  label:'Ned Flash'     },
  { id:'av39',  src:'images/ned-logo.png',  label:'Ned Logo'     },
  { id:'av40',  src:'images/eddy_flash-avatar.png',  label:'Eddy Flash'     },
  { id:'av41',  src:'images/eddy-logo.png',  label:'Eddy Logo'     },
  { id:'av42',  src:'images/cerbere.png',  label:'Cerbère Ned/Eden/Eddy'     },
  { id:'av43',  src:'images/jake_winters.png',  label:'Jake Winters'     },
  { id:'av44',  src:'images/flashballelogo.webp',  label:'Logo Flash'     },
  { id:'av45',  src:'images/shadelogologo.webp',  label:'Logo Shade'     },
  { id:'av46',  src:'images/sylvester-avatar.png',  label:'Sylvester Shade 1'     },
  { id:'av47',  src:'images/sylvester_shade.png',  label:'Sylvester Shade 2'     },
  { id:'av48',  src:'images/sylvester_shade.webp',  label:'Sylvester Shade 3'     },
  { id:'av49',  src:'images/zayn_flash.png',  label:'Zayn Flash'     },
  { id:'av50',  src:'images/zack_kingsley1.png',  label:'Zack Kingsley'     },

  

];
function getAvatarSrc(id) {
  return PRESET_AVATARS.find(a => a.id === id)?.src || PRESET_AVATARS[0].src;
}

/* ── DÉTECTION LOCAL ─────────────────────────────────────── */
const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname)
  || location.protocol === 'file:';

/* ── FIREBASE INIT ───────────────────────────────────────── */
let _app = null, _auth = null, _db = null;

function _initFB() {
  if (_app) return true;
  const cfg = window.__FIREBASE_CONFIG__;
  if (!cfg || !cfg.apiKey) {
    console.warn('[iPROMX] Firebase config absente — mode local.');
    return false;
  }
  try {
    _app  = firebase.initializeApp(cfg);
    _auth = firebase.auth();
    _db   = firebase.firestore();
    _auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // ── AJOUT APP CHECK (reCAPTCHA Enterprise) ────────────────
    try {
      const appCheck = firebase.appCheck();
      appCheck.activate(
        new firebase.appCheck.ReCaptchaEnterpriseProvider('6LfF_qosAAAAAMZ1xqdr1YRUhRYc-JqZxsIFjd4p'),
        true // auto-refresh du token en arrière-plan
      );
      console.log('[iPROMX] App Check est actif.');
    } catch (acError) {
      console.error('[iPROMX] Erreur App Check:', acError);
    }
    // ──────────────────────────────────────────────────────────

    return true;
  } catch (e) {
    console.error('[iPROMX] Firebase init:', e);
    return false;
  }
}

/* ── AUTH ────────────────────────────────────────────────── */
const AUTH = {
  _user: null, _profile: null, _guestKey: 'ipx_guest',
  _devUser: {
    uid:'dev-001', id:'dev-001', username:'DevLocal',
    email:'dev@local.test', avatarId:'av1', createdAt: new Date().toISOString()
  },

  isLoggedIn()     { return IS_LOCAL || !!this._user || !!localStorage.getItem('ipx_uid'); },
  isGuest()        { return !IS_LOCAL && !!localStorage.getItem(this._guestKey); },

  getCurrentUser() {
    if (IS_LOCAL) return this._devUser;
    if (this._user) return {
      uid:      this._user.uid,
      id:       this._user.uid,
      email:    this._user.email,
      username: this._profile?.username || this._user.displayName || this._user.email.split('@')[0],
      avatarId: this._profile?.avatarId || 'av1',
      createdAt:this._user.metadata.creationTime
    };
    // Fallback sur le cache local (connexion offline ou profile pas encore chargé)
    try {
      const cached = JSON.parse(localStorage.getItem('ipx_user'));
      if (cached) return cached;
    } catch {}
    // Dernier recours : uid connu mais pas de profil
    const uid = localStorage.getItem('ipx_uid');
    if (uid) return { uid, id:uid, email:'', username:'Utilisateur', avatarId:'av1', createdAt:new Date().toISOString() };
    return null;
  },

  async register(username, email, password) {
    if (IS_LOCAL) return { ok:true, user:this._devUser };
    if (!_initFB()) return { ok:false, error:'Impossible de contacter le serveur.' };
    
    // 1. Validation locale basique
    const cleanUsername = username.trim();
    if (cleanUsername.length < 2) return { ok:false, error:'Pseudo trop court (min. 2 caractères).' };
 
    // ── 2. APPEL AU RATE LIMITER (NETLIFY) ──────────────────────
    try {
      const rlRes = await fetch('/.netlify/functions/check-register-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (rlRes.status === 429) {
        const data = await rlRes.json();
        // Affiche le message d'erreur précis renvoyé par ton script (ex: "Réessaie dans 45 min.")
        return { ok: false, error: data.error || 'Trop de tentatives. Réessaie plus tard.' };
      }
    } catch (e) {
      // Si la fonction Netlify est en panne, on laisse passer pour ne pas bloquer les vrais gens
      console.warn('[iPROMX] Rate limit check failed, proceeding...', e);
    }
    // ──────────────────────────────────────────────────────────

    // 3. Création du compte Firebase
    try {
      const cleanEmail = email.toLowerCase().trim();
      const cred = await _auth.createUserWithEmailAndPassword(cleanEmail, password);
      
      await cred.user.updateProfile({ displayName: cleanUsername });
      
      this._user    = cred.user;
      this._profile = { username: cleanUsername, avatarId: 'av1' };

      // Initialisation du document Firestore
      const userData = {
        username: cleanUsername,
        avatarId: 'av1',
        email: cleanEmail,
        history: [],
        myList: [],
        createdAt: new Date().toISOString()
      };

      await _db.collection('users').doc(cred.user.uid).set(userData);

      // Synchro avec ton interface (DB.js)
      DB._setData([], []);
      DB._loadProgress({});
      
      this._cache();
      return { ok:true, user:this.getCurrentUser() };
      
    } catch (e) { 
      return { ok:false, error:this._err(e.code) }; 
    }
  },
  async login(email, password) {
    if (IS_LOCAL) return { ok:true, user:this._devUser };
    if (!_initFB()) return { ok:false, error:'Impossible de contacter le serveur.' };
    try {
      const cred = await _auth.signInWithEmailAndPassword(email.trim(), password);
      this._user = cred.user;
      // Token frais avant read Firestore
      try { await cred.user.getIdToken(true); } catch(_) {}
      await this._loadDoc();
      this._cache();
      return { ok:true, user:this.getCurrentUser() };
    } catch (e) { return { ok:false, error:this._err(e.code) }; }
  },

async restoreSession() {
    if (IS_LOCAL) return true;
    if (!_initFB()) return false;
    
    return new Promise(resolve => {
      // Timeout un peu plus court (3s suffisent généralement)
      const timer = setTimeout(() => resolve(!!localStorage.getItem('ipx_uid')), 3000);
      
      _auth.onAuthStateChanged(async user => {
        clearTimeout(timer);
        if (user && user.uid) { // Vérifie bien que l'UID existe
          this._user = user;
          try { 
            // Rafraîchissement du token
            await user.getIdToken(true); 
            
            // Tente de charger le document Firestore
            await this._loadDoc(); 
            this._cache();
            resolve(true);
          } catch(e) {
            console.error("Erreur Firestore au démarrage:", e);
            // Si Firestore échoue (Erreur 400), on resolve quand même 
            // pour ne pas bloquer l'interface
            resolve(true); 
          }
        } else {
          this._user = null; 
          this._profile = null;
          localStorage.removeItem('ipx_user'); 
          localStorage.removeItem('ipx_uid');
          resolve(false);
        }
      });
    });
  },

  // 1 seul read Firestore — charge profil + history + list d'un coup
  async _loadDoc() {
    if (!this._user || !_db) return;
    try {
      const snap = await _db.collection('users').doc(this._user.uid).get();
      if (snap.exists) {
        const d = snap.data();
        this._profile = {
          username: d.username || this._user.displayName || this._user.email.split('@')[0],
          avatarId: d.avatarId || 'av1'
        };
        DB._setData(
          Array.isArray(d.history) ? d.history : [],
          Array.isArray(d.myList)  ? d.myList  : []
        );
      } else {
        // Créer le doc si absent (ancien utilisateur sans doc)
        this._profile = { username: this._user.displayName || this._user.email.split('@')[0], avatarId: 'av1' };
        await _db.collection('users').doc(this._user.uid).set({
          ...this._profile, email: this._user.email,
          history: [], myList: [], createdAt: new Date().toISOString()
        });
        DB._setData([], []);
      }
    } catch (e) {
      console.warn('[iPROMX] Firestore read error:', e.message);
      // Mode dégradé : profil par défaut, données vides
      this._profile = { username: this._user.displayName || 'Utilisateur', avatarId: 'av1' };
      DB._setData([], []);
    }
  },

  _cache() {
    const u = this.getCurrentUser();
    localStorage.setItem('ipx_user', JSON.stringify(u));
    if (this._user) localStorage.setItem('ipx_uid', this._user.uid);
  },

  async updateProfile(data) {
    if (IS_LOCAL) return { ok:true };
    if (!this._user) return { ok:false, error:'Non connecté.' };
    if (!_db)        return { ok:false, error:'Service indisponible.' };
    try {
      const upd = {};
      if (data.username) {
        upd.username = data.username;
        await this._user.updateProfile({ displayName: data.username });
      }
      if (data.avatarId) upd.avatarId = data.avatarId;
      if (Object.keys(upd).length) {
        // merge:true → write partiel, ne touche pas history/myList
        await _db.collection('users').doc(this._user.uid).set(upd, { merge: true });
        this._profile = { ...this._profile, ...upd };
      }
      this._cache();
      return { ok:true, user:this.getCurrentUser() };
    } catch (e) { return { ok:false, error:this._err(e.code) }; }
  },

  async sendPasswordReset(email) {
    if (IS_LOCAL) return { ok:true };
    if (!_initFB()) return { ok:false, error:'Service indisponible.' };
    try { await _auth.sendPasswordResetEmail(email.trim()); return { ok:true }; }
    catch (e) { return { ok:false, error:this._err(e.code) }; }
  },

  async logout() {
    DB._flushNow(); // écriture immédiate avant déconnexion
    if (!IS_LOCAL && _auth) { try { await _auth.signOut(); } catch (_) {} }
    this._user = null; this._profile = null;
    DB._reset();
    localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
    localStorage.removeItem(this._guestKey);
  },

  enterGuest() {
    this._user = null; this._profile = null;
    DB._reset();
    localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
    localStorage.setItem(this._guestKey, '1');
  },

  _err(code) {
    const m = {
      'auth/email-already-in-use':   'Cette adresse e-mail est déjà utilisée.',
      'auth/invalid-email':          'Adresse e-mail invalide.',
      'auth/weak-password':          'Mot de passe trop faible (min. 6 caractères).',
      'auth/user-not-found':         'Aucun compte trouvé avec cet e-mail.',
      'auth/wrong-password':         'Mot de passe incorrect.',
      'auth/invalid-credential':     'E-mail ou mot de passe incorrect.',
      'auth/too-many-requests':      'Trop de tentatives. Réessaie dans quelques minutes.',
      'auth/network-request-failed': 'Erreur réseau. Vérifie ta connexion.',
      'auth/user-disabled':          'Ce compte a été désactivé.',
    };
    return m[code] || `Erreur : ${code}`;
  }
};

/* ── DB — Cache mémoire + écriture Firestore debouncée ───── */
/*
   Architecture :
   - _hist / _list chargés en mémoire au login (depuis le doc Firestore)
   - Toutes les mutations sont synchrones en mémoire (UI instantanée)
   - Un seul write debouncé 2s écrit les deux champs dans le même doc
   - À la déconnexion, _flushNow() force le write immédiatement
   - La progression reste en localStorage (updated 4x/s → trop pour Firestore)
*/
const DB = (() => {
  let _hist  = [];
  let _list  = [];
  let _timer = null;
  let _dirty = false;

  const uid    = () => AUTH._user?.uid || null;
  const docRef = () => (uid() && _db) ? _db.collection('users').doc(uid()) : null;

  function _schedule() {
    _dirty = true;
    clearTimeout(_timer);
    _timer = setTimeout(_flush, 2000);
  }

  async function _flush() {
    if (!_dirty) return;
    _dirty = false;
    clearTimeout(_timer);
    const ref = docRef(); if (!ref) return;
    try {
      // Un seul write avec les deux champs
      await ref.set({ history: _hist, myList: _list }, { merge: true });
    } catch (e) {
      console.warn('[iPROMX] DB write error:', e.message);
      _dirty = true; // retry au prochain schedule
    }
  }

  return {
    _setData(h, l)  { _hist = h; _list = l; },
    _flushNow()     { _flush(); },
    _reset()        { clearTimeout(_timer); _hist = []; _list = []; _dirty = false; },

    /* Historique */
    getHistory() { return _hist; },

    addHistory(e) {
      _hist = _hist.filter(x =>
        !(x.familyId===e.familyId && x.charId===e.charId &&
          x.season===e.season && x.epNum===e.epNum));
      _hist.unshift({ ...e, watchedAt: new Date().toISOString() });
      _hist = _hist.slice(0, 100);
      _schedule();
    },

    clearHistory()           { _hist = []; _schedule(); },
    removeHistoryItems(set)  {
      [...set].sort((a,b)=>b-a).forEach(i => _hist.splice(i,1));
      _schedule();
    },

    /* Ma Liste */
    getMyList() { return _list; },

    addToList(item) {
      if (_list.find(i => i.familyId===item.familyId && i.charId===item.charId)) return false;
      _list.unshift({ ...item, addedAt: new Date().toISOString() });
      _schedule();
      return true;
    },

    removeFromList(fid, cid) {
      _list = _list.filter(i => !(i.familyId===fid && i.charId===cid));
      _schedule();
    },

    isInList(fid, cid) { return _list.some(i => i.familyId===fid && i.charId===cid); },

    removeListItems(set) {
      [...set].sort((a,b)=>b-a).forEach(i => _list.splice(i,1));
      _schedule();
    },

/* Progression — localStorage (cache) + Firestore debouncé 30s */
_prog: {},        // cache mémoire
_progTimer: null,

getProgress(fid, cid, s, n) {
  try {
    const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
    return JSON.parse(localStorage.getItem(k) || '[]')
      .find(p => p.fid===fid && p.cid===cid && p.s===s && p.n===n) || { pct:0, sec:0 };
  } catch { return { pct:0, sec:0 }; }
},

saveProgress(fid, cid, s, n, pct, sec) {
  // 1. localStorage immédiat
  try {
    const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
    const p = JSON.parse(localStorage.getItem(k) || '[]');
    const i = p.findIndex(x => x.fid===fid && x.cid===cid && x.s===s && x.n===n);
    const entry = { fid, cid, s, n, pct, sec: sec || 0 };
    if (i >= 0) p[i] = entry; else p.push(entry);
    localStorage.setItem(k, JSON.stringify(p));
  } catch {}

  // 2. Cache mémoire
  const key = `${fid}__${cid}__${s}__${n}`;
  this._prog[key] = { pct, sec: sec || 0, updatedAt: new Date().toISOString() };

  // 3. Firestore debouncé 30s — 1 seul write même si appelé souvent
  clearTimeout(this._progTimer);
  this._progTimer = setTimeout(() => this._flushProgress(), 30000);
},

async _flushProgress() {
  const ref = docRef(); if (!ref || !Object.keys(this._prog).length) return;
  try {
    await ref.set({ progress: this._prog }, { merge: true });
  } catch(e) { console.warn('[iPROMX] progress flush error:', e.message); }
},

// Appelé à la fermeture pour forcer le write sans attendre 30s
flushProgressNow() {
  clearTimeout(this._progTimer);
  this._progTimer = setTimeout(() => this._flushProgress(), 5000);
},

// Lit depuis le doc déjà en mémoire (0 lecture Firestore supplémentaire)
async getProgressRemote(fid, cid, s, n) {
  const ref = docRef(); if (!ref) return null;
  try {
    const doc = await ref.get();
    const key = `${fid}__${cid}__${s}__${n}`;
    return doc.data()?.progress?.[key] || null;
  } catch { return null; }
},

// Appelé au login pour pré-remplir le cache mémoire
_loadProgress(progressData) {
  if (progressData) this._prog = { ...progressData };
},
  };

})();

