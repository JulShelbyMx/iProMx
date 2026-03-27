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
  { id:'av1',  src:'images/avatars/avatar1.webp',  label:'Flash'     },
  { id:'av2',  src:'images/avatars/avatar2.webp',  label:'Shade'     },
  { id:'av3',  src:'images/avatars/avatar3.webp',  label:'Winters'   },
  { id:'av4',  src:'images/avatars/avatar4.webp',  label:'Mystère'   },
  { id:'av5',  src:'images/avatars/avatar5.webp',  label:'Phénix'    },
  { id:'av6',  src:'images/avatars/avatar6.webp',  label:'Guerrier'  },
  { id:'av7',  src:'images/avatars/avatar7.webp',  label:'Ombre'     },
  { id:'av8',  src:'images/avatars/avatar8.webp',  label:'Légende'   },
  { id:'av9',  src:'images/avatars/avatar9.webp',  label:'FanTasTic' },
  { id:'av10', src:'images/avatars/avatar10.webp', label:'iProMx'    },
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
    if (username.trim().length < 2) return { ok:false, error:'Pseudo trop court (min. 2 caractères).' };
    try {
      const cred = await _auth.createUserWithEmailAndPassword(email.trim(), password);
      await cred.user.updateProfile({ displayName: username.trim() });
      this._user    = cred.user;
      this._profile = { username: username.trim(), avatarId: 'av1' };
      // 1 seul write Firestore à l'inscription
      await _db.collection('users').doc(cred.user.uid).set({
        username: username.trim(), avatarId: 'av1',
        email: email.toLowerCase().trim(),
        history: [], myList: [],
        createdAt: new Date().toISOString()
      });
      DB._setData([], []);
      this._cache();
      return { ok:true, user:this.getCurrentUser() };
    } catch (e) { return { ok:false, error:this._err(e.code) }; }
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
      const timer = setTimeout(() => resolve(!!localStorage.getItem('ipx_uid')), 6000);
      _auth.onAuthStateChanged(async user => {
        clearTimeout(timer);
        if (user) {
          this._user = user;
          // Forcer le rafraîchissement du token avant tout read Firestore
          // (évite l'erreur "Missing or insufficient permissions" au démarrage)
          try { await user.getIdToken(true); } catch(_) {}
          await this._loadDoc();
          this._cache();
          resolve(true);
        } else {
          this._user = null; this._profile = null;
          localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
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

    /* Progression — localStorage uniquement */
    getProgress(fid, cid, s, n) {
      try {
        const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
        return (JSON.parse(localStorage.getItem(k) || '[]')
          .find(p => p.fid===fid && p.cid===cid && p.s===s && p.n===n) || { pct:0 }).pct;
      } catch { return 0; }
    },

    saveProgress(fid, cid, s, n, pct) {
      try {
        const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
        const p = JSON.parse(localStorage.getItem(k) || '[]');
        const i = p.findIndex(x => x.fid===fid && x.cid===cid && x.s===s && x.n===n);
        if (i >= 0) p[i].pct = pct; else p.push({ fid, cid, s, n, pct });
        localStorage.setItem(k, JSON.stringify(p));
      } catch {}
    }
  };
})();
