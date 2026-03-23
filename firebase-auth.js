/* ============================================================
   iPROMX — FIREBASE AUTH + FIRESTORE
   Auth + données cloud cross-device

   SETUP Firebase Console :
   1. Authentication → Email/Password → Activer
   2. Firestore Database → Créer en mode production
   3. Firestore Rules → coller ces règles :
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{uid} {
            allow read, write: if request.auth != null && request.auth.uid == uid;
          }
        }
      }
   4. Remplacer firebaseConfig ci-dessous avec tes vraies valeurs
   ============================================================ */

// ── CONFIG FIREBASE ──────────────────────────────────────────
// La config est injectée dynamiquement par la Netlify function
// /.netlify/functions/firebase-config (variables d'env Netlify)
// NE PAS mettre de vraies clés ici — elles seraient leakées dans le repo.
const FIREBASE_CONFIG = window.__FIREBASE_CONFIG__ || null;

// ── AVATARS PRÉDÉFINIS ───────────────────────────────────────
// Mets tes images dans /images/avatars/ et change les noms
const PRESET_AVATARS = [
  { id:'av1', src:'images/avatars/avatar1.webp', label:'Flash'    },
  { id:'av2', src:'images/avatars/avatar2.webp', label:'Shade'    },
  { id:'av3', src:'images/avatars/avatar3.webp', label:'Winters'  },
  { id:'av4', src:'images/avatars/avatar4.webp', label:'Mystère'  },
  { id:'av5', src:'images/avatars/avatar5.webp', label:'Phénix'   },
  { id:'av6', src:'images/avatars/avatar6.webp', label:'Guerrier' },
  { id:'av7', src:'images/avatars/avatar7.webp', label:'Ombre'    },
  { id:'av8', src:'images/avatars/avatar8.webp', label:'Légende'  },
];

// ── LOCAL ────────────────────────────────────────────────────
const IS_LOCAL = ['localhost','127.0.0.1',''].includes(location.hostname)
  || location.protocol === 'file:';

// ── FIREBASE INIT ────────────────────────────────────────────
let _app  = null;
let _auth = null;
let _db   = null;

function _initFB() {
  if (_app) return true;
  if (!FIREBASE_CONFIG) { console.error('Firebase config not loaded yet. Ensure /.netlify/functions/firebase-config is called before firebase-auth.js.'); return false; }
  try {
    _app  = firebase.initializeApp(FIREBASE_CONFIG);
    _auth = firebase.auth();
    _db   = firebase.firestore();
    _auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return true;
  } catch(e) { console.error('Firebase init failed:', e); return false; }
}

// ── AUTH ─────────────────────────────────────────────────────
const AUTH = {
  _user:    null,
  _profile: null,
  _guestKey:'ipx_guest',
  _devUser: { uid:'dev-001', id:'dev-001', username:'DevLocal', email:'dev@local.test', avatarId:'av1', createdAt:new Date().toISOString() },

  isLoggedIn()    { return IS_LOCAL || !!this._user || !!localStorage.getItem('ipx_uid'); },
  isGuest()       { return !IS_LOCAL && !!localStorage.getItem(this._guestKey); },
  getCurrentUser(){
    if (IS_LOCAL) return this._devUser;
    if (this._user) return {
      uid:      this._user.uid,
      id:       this._user.uid,
      email:    this._user.email,
      username: this._profile?.username || this._user.displayName || this._user.email.split('@')[0],
      avatarId: this._profile?.avatarId || 'av1',
      createdAt:this._user.metadata.creationTime
    };
    try { return JSON.parse(localStorage.getItem('ipx_user')); } catch { return null; }
  },

  async register(username, email, password) {
    if (IS_LOCAL) return { ok:true, user:this._devUser };
    if (!_initFB()) return { ok:false, error:'Erreur de connexion.' };
    if (username.trim().length < 2) return { ok:false, error:'Le pseudo doit faire au moins 2 caractères.' };
    try {
      const cred = await _auth.createUserWithEmailAndPassword(email.trim(), password);
      await cred.user.updateProfile({ displayName: username.trim() });
      this._user    = cred.user;
      this._profile = { username:username.trim(), avatarId:'av1', history:[], myList:[] };
      await _db.collection('users').doc(cred.user.uid).set({
        ...this._profile, email:email.toLowerCase().trim(), createdAt:new Date().toISOString()
      });
      this._cacheUser();
      return { ok:true, user:this.getCurrentUser() };
    } catch(e) { return { ok:false, error:this._err(e.code) }; }
  },

  async login(email, password) {
    if (IS_LOCAL) return { ok:true, user:this._devUser };
    if (!_initFB()) return { ok:false, error:'Erreur de connexion.' };
    try {
      const cred = await _auth.signInWithEmailAndPassword(email.trim(), password);
      this._user = cred.user;
      await this._loadProfile();
      await DB._loadAll();
      this._cacheUser();
      return { ok:true, user:this.getCurrentUser() };
    } catch(e) { return { ok:false, error:this._err(e.code) }; }
  },

  async restoreSession() {
    if (IS_LOCAL) return true;
    if (!_initFB()) return false;
    return new Promise(resolve => {
      const timer = setTimeout(()=>resolve(!!localStorage.getItem('ipx_uid')), 6000);
      _auth.onAuthStateChanged(async user => {
        clearTimeout(timer);
        if (user) {
          this._user = user;
          await this._loadProfile();
          await DB._loadAll();
          this._cacheUser();
          resolve(true);
        } else {
          this._user = null; this._profile = null;
          localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
          resolve(false);
        }
      });
    });
  },

  async _loadProfile() {
    if (!this._user || !_db) return;
    try {
      const snap = await _db.collection('users').doc(this._user.uid).get();
      if (snap.exists) {
        this._profile = snap.data();
      } else {
        this._profile = { username:this._user.displayName||this._user.email.split('@')[0], avatarId:'av1', history:[], myList:[] };
        await _db.collection('users').doc(this._user.uid).set({ ...this._profile, email:this._user.email, createdAt:new Date().toISOString() });
      }
    } catch(e) { console.warn('Profile load error:', e); }
  },

  _cacheUser() {
    const u = this.getCurrentUser();
    localStorage.setItem('ipx_user', JSON.stringify(u));
    if (this._user) localStorage.setItem('ipx_uid', this._user.uid);
  },

  async updateProfile(data) {
    if (IS_LOCAL) return { ok:true };
    if (!this._user) return { ok:false, error:'Non connecté.' };
    try {
      const updates = {};
      if (data.username) { updates.username = data.username; await this._user.updateProfile({ displayName:data.username }); }
      if (data.avatarId) updates.avatarId = data.avatarId;
      if (Object.keys(updates).length) {
        await _db.collection('users').doc(this._user.uid).update(updates);
        this._profile = { ...this._profile, ...updates };
      }
      this._cacheUser();
      return { ok:true, user:this.getCurrentUser() };
    } catch(e) { return { ok:false, error:this._err(e.code) }; }
  },

  async sendPasswordReset(email) {
    if (IS_LOCAL) return { ok:true };
    if (!_initFB()) return { ok:false, error:'Erreur de connexion.' };
    try { await _auth.sendPasswordResetEmail(email.trim()); return { ok:true }; }
    catch(e) { return { ok:false, error:this._err(e.code) }; }
  },

  async logout() {
    if (!IS_LOCAL && _auth) { try { await _auth.signOut(); } catch(_){} }
    this._user=null; this._profile=null;
    DB._clearCache();
    localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
    localStorage.removeItem(this._guestKey);
  },
  enterGuest() {
    this._user=null; this._profile=null; DB._clearCache();
    localStorage.removeItem('ipx_user'); localStorage.removeItem('ipx_uid');
    localStorage.setItem(this._guestKey,'1');
  },

  _err(code) {
    const m={
      'auth/email-already-in-use':'Cette adresse e-mail est déjà utilisée.',
      'auth/invalid-email':'Adresse e-mail invalide.',
      'auth/weak-password':'Mot de passe trop faible (min. 6 caractères).',
      'auth/user-not-found':'Aucun compte trouvé avec cet e-mail.',
      'auth/wrong-password':'Mot de passe incorrect.',
      'auth/invalid-credential':'E-mail ou mot de passe incorrect.',
      'auth/too-many-requests':'Trop de tentatives. Réessaie dans quelques minutes.',
      'auth/network-request-failed':'Erreur réseau. Vérifie ta connexion.',
      'auth/user-disabled':'Ce compte a été désactivé.',
    };
    return m[code]||`Erreur : ${code}`;
  }
};

// ── DB — Firestore cloud ─────────────────────────────────────
const DB = (() => {
  let _hist = null;
  let _list = null;

  const uid    = () => AUTH._user?.uid || null;
  const docRef = () => (uid()&&_db) ? _db.collection('users').doc(uid()) : null;

  async function _loadAll() {
    const ref = docRef(); if(!ref) return;
    try {
      const snap = await ref.get();
      if (snap.exists) {
        const d = snap.data();
        _hist = Array.isArray(d.history) ? d.history : [];
        _list = Array.isArray(d.myList)  ? d.myList  : [];
      } else { _hist=[]; _list=[]; }
    } catch(e) { _hist=[]; _list=[]; }
    // Charger la progression séparément (sous-collection)
    await ret._loadProgress();
  }

  async function _saveField(field, val) {
    const ref = docRef(); if(!ref) return;
    try { await ref.update({ [field]:val }); }
    catch { try { await ref.set({ [field]:val },{merge:true}); } catch(_){} }
  }

  const ret = {
    _loadAll,
    _clearCache() { _hist=null; _list=null; this._prog=null; this._progDirty=false; clearTimeout(this._progTimer); },

    // ── History ─────────────────────────────────────────────
    getHistory()  { return _hist||[]; },
    async addHistory(e) {
      if(!_hist) await _loadAll();
      const filtered=(_hist||[]).filter(x=>!(x.familyId===e.familyId&&x.charId===e.charId&&x.season===e.season&&x.epNum===e.epNum));
      filtered.unshift({...e,watchedAt:new Date().toISOString()});
      _hist=filtered.slice(0,100);
      await _saveField('history',_hist);
    },
    async clearHistory() { _hist=[]; await _saveField('history',[]); },
    async removeHistoryItems(idxSet) {
      if(!_hist) await _loadAll();
      const h=[..._hist]; [...idxSet].sort((a,b)=>b-a).forEach(i=>h.splice(i,1));
      _hist=h; await _saveField('history',h);
    },

    // ── MyList ──────────────────────────────────────────────
    getMyList() { return _list||[]; },
    async addToList(item) {
      if(!_list) await _loadAll();
      if((_list||[]).find(i=>i.familyId===item.familyId&&i.charId===item.charId)) return false;
      _list=[{...item,addedAt:new Date().toISOString()},...(_list||[])];
      await _saveField('myList',_list); return true;
    },
    async removeFromList(fid,cid) {
      if(!_list) await _loadAll();
      _list=(_list||[]).filter(i=>!(i.familyId===fid&&i.charId===cid));
      await _saveField('myList',_list);
    },
    isInList(fid,cid) { return (_list||[]).some(i=>i.familyId===fid&&i.charId===cid); },
    async removeListItems(idxSet) {
      if(!_list) await _loadAll();
      const l=[..._list]; [...idxSet].sort((a,b)=>b-a).forEach(i=>l.splice(i,1));
      _list=l; await _saveField('myList',l);
    },

    // ── Progression (Firestore — synchronisée cross-device) ──────
    // On garde un cache en mémoire pour éviter trop de reads.
    // Les writes sont debouncés (~3s) pour limiter les appels Firestore.
    _prog: null,
    _progDirty: false,
    _progTimer: null,

    async _loadProgress() {
      const ref = docRef(); if(!ref) { this._prog = {}; return; }
      try {
        const snap = await ref.collection('progress').doc('data').get();
        this._prog = snap.exists ? (snap.data().entries || {}) : {};
      } catch { this._prog = {}; }
    },

    _progKey(fid,cid,s,n) { return `${fid}|${cid}|${s}|${n}`; },

    async _flushProgress() {
      if(!this._progDirty || !this._prog) return;
      this._progDirty = false;
      const ref = docRef(); if(!ref) return;
      try {
        await ref.collection('progress').doc('data').set({ entries: this._prog }, { merge: true });
      } catch(e) { console.warn('Progress flush error:', e); }
    },

    getProgress(fid,cid,s,n) {
      if(!this._prog) return 0;
      return this._prog[this._progKey(fid,cid,s,n)] || 0;
    },
    saveProgress(fid,cid,s,n,pct) {
      if(!this._prog) this._prog = {};
      this._prog[this._progKey(fid,cid,s,n)] = pct;
      this._progDirty = true;
      clearTimeout(this._progTimer);
      this._progTimer = setTimeout(() => this._flushProgress(), 3000);
    }
  };
  return ret;
})();
