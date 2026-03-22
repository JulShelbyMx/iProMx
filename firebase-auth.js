/* ============================================================
   iPROMX — FIREBASE AUTH
   Remplace le localStorage pour les comptes cross-device
   Données de visionnage (history, list) = localStorage par device
   
   SETUP :
   1. Créer un projet Firebase : https://console.firebase.google.com
   2. Activer Authentication → Email/Password
   3. Remplacer les valeurs firebaseConfig ci-dessous
   4. Aucun autre setup nécessaire (règles Firestore non requises)
   ============================================================ */

// ── CONFIG FIREBASE ─────────────────────────────────────────
// Remplace ces valeurs par celles de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABsp0Hq_awsAEyWU2WyKxgaIbAH_DII-I",
  authDomain: "ipromx-site.firebaseapp.com",
  projectId: "ipromx-site",
  storageBucket: "ipromx-site.firebasestorage.app",
  messagingSenderId: "1062621859736",
  appId: "1:1062621859736:web:cf9172ce0196aca00b65ed",
  measurementId: "G-98GVB7ETDW"
};

// ── DÉTECTION LOCAL ──────────────────────────────────────────
const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname)
  || location.protocol === 'file:';

// ── FIREBASE INIT ────────────────────────────────────────────
let _firebaseApp  = null;
let _firebaseAuth = null;

function initFirebase() {
  if (_firebaseApp) return true;
  try {
    _firebaseApp  = firebase.initializeApp(FIREBASE_CONFIG);
    _firebaseAuth = firebase.auth();
    _firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return true;
  } catch(e) {
    console.error('Firebase init failed:', e);
    return false;
  }
}

// ── AUTH ─────────────────────────────────────────────────────
const AUTH = {
  _currentUser: null,      // Firebase User object
  _guestKey: 'ipx_guest',
  _devUser: {
    id: 'dev-001', username: 'DevLocal', email: 'dev@local.test',
    uid: 'dev-001', createdAt: new Date().toISOString()
  },

  // ── Getters ──────────────────────────────────────────────
  isLoggedIn() {
    if (IS_LOCAL) return true;
    return !!this._currentUser || !!localStorage.getItem('ipx_user');
  },

  isGuest() {
    return !IS_LOCAL && !!localStorage.getItem(this._guestKey);
  },

  getCurrentUser() {
    if (IS_LOCAL) return this._devUser;
    if (this._currentUser) {
      return {
        uid: this._currentUser.uid,
        id:  this._currentUser.uid,
        email: this._currentUser.email,
        username: this._currentUser.displayName || this._currentUser.email.split('@')[0],
        createdAt: this._currentUser.metadata.creationTime
      };
    }
    // Fallback: session stockée localement
    try { return JSON.parse(localStorage.getItem('ipx_user')); } catch { return null; }
  },

  // ── Inscription ──────────────────────────────────────────
  async register(username, email, password) {
    if (IS_LOCAL) return { ok: true, user: this._devUser };
    if (!initFirebase()) return { ok: false, error: 'Erreur de connexion au service.' };

    if (password.length < 6)
      return { ok: false, error: 'Le mot de passe doit faire au moins 6 caractères.' };
    if (username.trim().length < 3)
      return { ok: false, error: 'Le pseudo doit faire au moins 3 caractères.' };

    try {
      const cred = await _firebaseAuth.createUserWithEmailAndPassword(email.trim(), password);
      await cred.user.updateProfile({ displayName: username.trim() });
      this._currentUser = cred.user;
      const user = this.getCurrentUser();
      localStorage.setItem('ipx_user', JSON.stringify(user));
      localStorage.removeItem(this._guestKey);
      return { ok: true, user };
    } catch(e) {
      return { ok: false, error: this._fbError(e.code) };
    }
  },

  // ── Connexion ────────────────────────────────────────────
  async login(email, password) {
    if (IS_LOCAL) return { ok: true, user: this._devUser };
    if (!initFirebase()) return { ok: false, error: 'Erreur de connexion au service.' };

    try {
      const cred = await _firebaseAuth.signInWithEmailAndPassword(email.trim(), password);
      this._currentUser = cred.user;
      const user = this.getCurrentUser();
      localStorage.setItem('ipx_user', JSON.stringify(user));
      localStorage.removeItem(this._guestKey);
      return { ok: true, user };
    } catch(e) {
      return { ok: false, error: this._fbError(e.code) };
    }
  },

  // ── Déconnexion ──────────────────────────────────────────
  async logout() {
    if (!IS_LOCAL && _firebaseAuth) {
      try { await _firebaseAuth.signOut(); } catch(_) {}
    }
    this._currentUser = null;
    localStorage.removeItem('ipx_user');
    localStorage.removeItem(this._guestKey);
  },

  // ── Mode invité ──────────────────────────────────────────
  enterGuest() {
    this._currentUser = null;
    localStorage.removeItem('ipx_user');
    localStorage.setItem(this._guestKey, '1');
  },

  // ── Restaurer session au démarrage ───────────────────────
  async restoreSession() {
    if (IS_LOCAL) { this._currentUser = null; return true; }
    if (!initFirebase()) return false;

    return new Promise(resolve => {
      // Timeout 5s au cas où Firebase ne répond pas
      const timer = setTimeout(() => {
        // Utiliser la session locale comme fallback
        const stored = localStorage.getItem('ipx_user');
        resolve(!!stored);
      }, 5000);

      _firebaseAuth.onAuthStateChanged(user => {
        clearTimeout(timer);
        if (user) {
          this._currentUser = user;
          localStorage.setItem('ipx_user', JSON.stringify(this.getCurrentUser()));
          localStorage.removeItem(this._guestKey);
          resolve(true);
        } else {
          this._currentUser = null;
          localStorage.removeItem('ipx_user');
          resolve(false);
        }
      });
    });
  },

  // ── Traduction erreurs Firebase ──────────────────────────
  _fbError(code) {
    const map = {
      'auth/email-already-in-use':    'Cette adresse e-mail est déjà utilisée.',
      'auth/invalid-email':           'Adresse e-mail invalide.',
      'auth/weak-password':           'Mot de passe trop faible (min. 6 caractères).',
      'auth/user-not-found':          'Aucun compte trouvé avec cet e-mail.',
      'auth/wrong-password':          'Mot de passe incorrect.',
      'auth/too-many-requests':       'Trop de tentatives. Réessaie dans quelques minutes.',
      'auth/network-request-failed':  'Erreur réseau. Vérifie ta connexion.',
      'auth/invalid-credential':      'E-mail ou mot de passe incorrect.',
      'auth/user-disabled':           'Ce compte a été désactivé.',
    };
    return map[code] || `Erreur : ${code}`;
  }
};

// ── DB (données locales par device) ──────────────────────────
const DB = (() => {
  const uid  = () => AUTH.getCurrentUser()?.uid || AUTH.getCurrentUser()?.id || 'guest';
  const key  = t  => `ipx_${t}_${uid()}`;
  const load = t  => { try { return JSON.parse(localStorage.getItem(key(t))||'[]'); } catch { return []; } };
  const save = (t,d) => localStorage.setItem(key(t), JSON.stringify(d));

  return {
    getHistory: () => load('hist'),
    addHistory(e) {
      let h = load('hist').filter(x =>
        !(x.familyId===e.familyId && x.charId===e.charId &&
          x.season===e.season && x.epNum===e.epNum));
      h.unshift({...e, watchedAt: new Date().toISOString()});
      save('hist', h.slice(0,100));
    },
    clearHistory:       () => save('hist', []),
    removeHistoryItems(idxSet) {
      const h=[...load('hist')];
      [...idxSet].sort((a,b)=>b-a).forEach(i=>h.splice(i,1));
      save('hist',h);
    },

    getMyList:  () => load('list'),
    addToList(item) {
      const l = load('list');
      if(l.find(i=>i.familyId===item.familyId&&i.charId===item.charId)) return false;
      l.unshift({...item, addedAt: new Date().toISOString()});
      save('list',l); return true;
    },
    removeFromList: (fid,cid) => save('list', load('list').filter(i=>!(i.familyId===fid&&i.charId===cid))),
    isInList:       (fid,cid) => load('list').some(i=>i.familyId===fid&&i.charId===cid),
    removeListItems(idxSet) {
      const l=[...load('list')];
      [...idxSet].sort((a,b)=>b-a).forEach(i=>l.splice(i,1));
      save('list',l);
    },

    getProgress:    (fid,cid,s,n) => (load('prog').find(p=>p.fid===fid&&p.cid===cid&&p.s===s&&p.n===n)||{pct:0}).pct,
    saveProgress(fid,cid,s,n,pct) {
      const p=load('prog'), i=p.findIndex(x=>x.fid===fid&&x.cid===cid&&x.s===s&&x.n===n);
      if(i>=0) p[i].pct=pct; else p.push({fid,cid,s,n,pct});
      save('prog',p);
    }
  };
})();
