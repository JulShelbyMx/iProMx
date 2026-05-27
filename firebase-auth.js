'use strict';

const PRESET_AVATARS = [
  { id:'av1',  src:'https://ik.imagekit.io/ipromx/images/avatars/flashballelogo.webp',       label:'Logo Flash' },
  { id:'av2',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/david.webp',       label:'David Flash' },
  { id:'av3',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/john.webp',        label:'John Flash' },
  { id:'av4',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/poildecarotte.webp', label:'Poil de carotte' },
  { id:'av5',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/ken.webp',         label:'Ken Flash' },
  { id:'av6',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/legeant.webp',     label:'Le Géant Freddy' },
  { id:'av7',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/tom.webp',         label:'Tom Escobar 1' },
  { id:'av8',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/agentx2ciné.webp', label:'Agent X 1' },
  { id:'av9',  src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/agentx3ciné.webp', label:'Agent X 2' },
  { id:'av10', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/tomadulteciné.webp', label:'Tom 2' },
  { id:'av11', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/tom-agentx.webp',  label:'Tom et Agent X' },
  { id:'av12', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/legenie.webp',     label:'Le Génie' },
  { id:'av13', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/aaron.webp',       label:'Aaron Flash 1' },
  { id:'av14', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/aaron2.webp',      label:'Aaron Flash 2' },
  { id:'av15', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/aaronmeditate.webp', label:'Aaron Flash 3' },
  { id:'av16', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/aaron3.webp',      label:'Aaron Flash 4' },
  { id:'av17', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/davidjr2.webp',    label:'David JR Flash 1' },
  { id:'av18', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/davidjr.webp',     label:'David JR Flash 2' },
  { id:'av19', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/djrretourciné.webp', label:'David JR Flash 3' },
  { id:'av20', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/damon.webp',       label:'Damon Flash 1' },
  { id:'av21', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/damonciné.webp',   label:'Damon Flash 2' },
  { id:'av22', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/damon3.webp',      label:'Damon Flash 3' },
  { id:'av23', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/billy.webp',       label:'Billy' },
  { id:'av24', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/monstrekayton_flash.webp', label:'Kayton Flash 1' },
  { id:'av25', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/kaytonretourciné.webp',    label:'Kayton Flash 2' },
  { id:'av26', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/kayton.webp',      label:'Kayton Flash 3' },
  { id:'av27', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/kaytonlg.webp',    label:'Kayton Flash 4' },
  { id:'av28', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/kaytonentrainement.webp', label:'Kayton Flash 5' },
  { id:'av29', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/ryan.webp',        label:'Ryan Johnson' },
  { id:'av30', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zakhackeur.webp',  label:'Zak Hackeur' },
  { id:'av31', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/ganggamins.webp',  label:'Gang Gamins' },
  { id:'av32', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/oliver.webp',      label:'Oliver Winters' },
  { id:'av33', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adriannewflashciné.webp', label:'Adrian Flash 1' },
  { id:'av34', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adriandebut.webp', label:'Adrian Flash 2' },
  { id:'av35', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adrianprime2.webp', label:'Adrian Flash 3' },
  { id:'av36', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adriancasquette.webp', label:'Adrian Flash 4' },
  { id:'av37', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adrianinvitation.webp', label:'Adrian Flash 5' },
  { id:'av38', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/adrian.webp',      label:'Adrian Flash 6' },
  { id:'av39', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/manda.webp',       label:'Manda Flash' },
  { id:'av40', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/manda2.webp',      label:'Manda Flash 2' },
  { id:'av41', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/leconcierge.webp', label:'Le concierge' },
  { id:'av42', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/axeleret.webp',    label:'Axel Leret' },
  { id:'av43', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/ned-eden-eddy.webp', label:'Eden Ned Eddy' },
  { id:'av44', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/edenteaser.webp',  label:'Eden Flash 1' },
  { id:'av45', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/edenfuitciné.webp', label:'Eden Flash 2' },
  { id:'av46', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/eden2.webp',       label:'Eden Flash 3' },
  { id:'av47', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/nededeneddyprime.webp', label:'Ned Flash 1' },
  { id:'av48', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/nedyeux.webp',     label:'Ned Flash 2' },
  { id:'av49', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/nedsouvenirs.webp', label:'Ned Flash 3' },
  { id:'av50', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/latache.webp',     label:'La tache' },
  { id:'av51', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/nedprime.webp',    label:'Ned Flash 4' },
  { id:'av52', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/ned_flash.webp',   label:'Ned Flash 5' },
  { id:'av53', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/nedpose.webp',     label:'Ned Flash 6' },
  { id:'av54', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zaynnedocean.webp', label:'Ned Flash 7' },
  { id:'av55', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/eddyhumain.webp',  label:'Eddy Flash 1' },
  { id:'av56', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/eddyflash1.webp',  label:'Eddy Flash 2' },
  { id:'av57', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/eddy3.webp',       label:'Eddy Flash 3' },
  { id:'av58', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/jake.webp',        label:'Jake Winters' },
  { id:'av59', src:'https://ik.imagekit.io/ipromx/images/avatars/shadelogologo.webp',         label:'Logo Shade' },
  { id:'av60', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver1.webp',     label:'Sylvester Shade 1' },
  { id:'av61', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver2.webp',     label:'Sylvester Shade 2' },
  { id:'av62', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver3.webp',     label:'Sylvester Shade 3' },
  { id:'av63', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver4.webp',     label:'Sylvester x La Mort 4' },
  { id:'av64', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver5.webp',     label:'Sylvester Shade 5' },
  { id:'av65', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver6.webp',     label:'Sylvester Shade 6' },
  { id:'av66', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver7.webp',     label:'Sylvester Shade 7' },
  { id:'av67', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/silver8.webp',     label:'Sylvester Shade 8' },
  { id:'av68', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/lamort1.webp',     label:'La Mort 1' },
  { id:'av69', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/lamort2.webp',     label:'La Mort 2' },
  { id:'av70', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/lamort3.webp',     label:'La Mort 3' },
  { id:'av71', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn1.webp',       label:'Zayn Flash 1' },
  { id:'av72', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn2.webp',       label:'Zayn Flash 2' },
  { id:'av73', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn3.webp',       label:'Zayn Flash 3' },
  { id:'av74', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn4.webp',       label:'Zayn Flash 4' },
  { id:'av75', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn5.webp',       label:'Zayn Flash 5' },
  { id:'av76', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn6.webp',       label:'Zayn Flash 6' },
  { id:'av77', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn7.webp',       label:'Zayn Flash 7' },
  { id:'av78', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn8.webp',       label:'Zayn Flash 8' },
  { id:'av79', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zayn9.webp',       label:'Zayn Flash 9' },
  { id:'av80', src:'https://ik.imagekit.io/ipromx/images/avatars/letigrebl/zack.webp',        label:'Zack Kingsley' }
];

function getAvatarSrc(id) {
  return PRESET_AVATARS.find(a => a.id === id)?.src || PRESET_AVATARS[0].src;
}

const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname)
  || location.protocol === 'file:';

let _app = null, _auth = null, _db = null;

function _initFB() {
  if (_app) return true;
  const cfg = window.__FIREBASE_CONFIG__;
  if (!cfg?.apiKey) { console.warn('[iPROMX] Firebase config absente.'); return false; }
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

const AUTH = {
  _user:     null,
  _profile:  null,
  _guestKey: 'ipx_guest',
  _devUser: {
    uid: 'dev-001', id: 'dev-001', username: 'DevLocal',
    email: 'dev@local.test', avatarId: 'av1', createdAt: new Date().toISOString()
  },

  isLoggedIn() { return IS_LOCAL || !!this._user || !!localStorage.getItem('ipx_uid'); },
  isGuest()    { return !IS_LOCAL && !!localStorage.getItem(this._guestKey); },

  getCurrentUser() {
    if (IS_LOCAL) return this._devUser;
    if (this._user) return {
      uid:       this._user.uid,
      id:        this._user.uid,
      email:     this._user.email,
      username:  this._profile?.username || this._user.displayName || this._user.email.split('@')[0],
      avatarId:  this._profile?.avatarId || 'av1',
      createdAt: this._user.metadata.creationTime
    };
    try {
      const cached = JSON.parse(localStorage.getItem('ipx_user'));
      if (cached) return cached;
    } catch {}
    const uid = localStorage.getItem('ipx_uid');
    if (uid) return { uid, id: uid, email: '', username: 'Utilisateur', avatarId: 'av1', createdAt: new Date().toISOString() };
    return null;
  },

  async register(username, email, password) {
    if (IS_LOCAL) return { ok: true, user: this._devUser };
    if (!_initFB()) return { ok: false, error: 'Impossible de contacter le serveur.' };

    const cleanUsername = username.trim();
    if (cleanUsername.length < 2) return { ok: false, error: 'Pseudo trop court (min. 2 caractères).' };

    try {
      const rlRes = await fetch('/.netlify/functions/check-register-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (rlRes.status === 429) {
        const data = await rlRes.json();
        return { ok: false, error: data.error || 'Trop de tentatives. Réessaie plus tard.' };
      }
    } catch (e) {
      console.warn('[iPROMX] Rate limit check failed, proceeding.', e);
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      const cred = await _auth.createUserWithEmailAndPassword(cleanEmail, password);
      await cred.user.updateProfile({ displayName: cleanUsername });

      this._user    = cred.user;
      this._profile = { username: cleanUsername, avatarId: 'av1' };

      await _db.collection('users').doc(cred.user.uid).set({
        username:  cleanUsername,
        avatarId:  'av1',
        email:     cleanEmail,
        history:   [],
        myList:    [],
        createdAt: new Date().toISOString()
      });

      DB._setData([], []);
      DB._loadProgress({});
      this._cache();
      return { ok: true, user: this.getCurrentUser() };
    } catch (e) {
      return { ok: false, error: this._err(e.code) };
    }
  },

  async login(email, password) {
    if (IS_LOCAL) return { ok: true, user: this._devUser };
    if (!_initFB()) return { ok: false, error: 'Impossible de contacter le serveur.' };
    try {
      const cred = await _auth.signInWithEmailAndPassword(email.trim(), password);
      this._user = cred.user;
      await this._loadDoc();
      this._cache();
      return { ok: true, user: this.getCurrentUser() };
    } catch (e) {
      return { ok: false, error: this._err(e.code) };
    }
  },

  async restoreSession() {
    if (IS_LOCAL) return true;
    if (!_initFB()) return false;
    return new Promise(resolve => {
      const timer = setTimeout(() => resolve(!!localStorage.getItem('ipx_uid')), 3000);
      _auth.onAuthStateChanged(async user => {
        clearTimeout(timer);
        if (user?.uid) {
          this._user = user;
          try {
            await user.getIdToken(true);
            await this._loadDoc();
            this._cache();
            resolve(true);
          } catch (e) {
            console.error('[iPROMX] Session restore error:', e);
            resolve(true);
          }
        } else {
          this._user    = null;
          this._profile = null;
          localStorage.removeItem('ipx_user');
          localStorage.removeItem('ipx_uid');
          resolve(false);
        }
      });
    });
  },

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
        DB._loadProgress(d.progress || {});
        DB._loadRatings(d.ratings || null);
      } else {
        this._profile = {
          username: this._user.displayName || this._user.email.split('@')[0],
          avatarId: 'av1'
        };
        await _db.collection('users').doc(this._user.uid).set({
          ...this._profile,
          email:     this._user.email,
          history:   [],
          myList:    [],
          createdAt: new Date().toISOString()
        });
        DB._setData([], []);
      }
    } catch (e) {
      console.warn('[iPROMX] Firestore read error:', e.message);
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
    if (IS_LOCAL) return { ok: true };
    if (!this._user) return { ok: false, error: 'Non connecté.' };
    if (!_db)        return { ok: false, error: 'Service indisponible.' };
    try {
      const upd = {};
      if (data.username) {
        upd.username = data.username;
        await this._user.updateProfile({ displayName: data.username });
      }
      if (data.avatarId) upd.avatarId = data.avatarId;
      if (Object.keys(upd).length) {
        await _db.collection('users').doc(this._user.uid).set(upd, { merge: true });
        this._profile = { ...this._profile, ...upd };
      }
      this._cache();
      return { ok: true, user: this.getCurrentUser() };
    } catch (e) {
      return { ok: false, error: this._err(e.code) };
    }
  },

  async sendPasswordReset(email) {
    if (IS_LOCAL) return { ok: true };
    if (!_initFB()) return { ok: false, error: 'Service indisponible.' };
    try {
      await _auth.sendPasswordResetEmail(email.trim());
      return { ok: true };
    } catch (e) {
      return { ok: false, error: this._err(e.code) };
    }
  },

  async logout() {
    DB._flushNow();
    try { DB._flushRatings?.(); } catch {}
    DB._flushRatings?.();
    if (!IS_LOCAL && _auth) { try { await _auth.signOut(); } catch (_) {} }
    this._user    = null;
    this._profile = null;
    DB._reset();
    localStorage.removeItem('ipx_user');
    localStorage.removeItem('ipx_uid');
    localStorage.removeItem(this._guestKey);
  },

  enterGuest() {
    this._user    = null;
    this._profile = null;
    DB._reset();
    localStorage.removeItem('ipx_user');
    localStorage.removeItem('ipx_uid');
    localStorage.setItem(this._guestKey, '1');
  },

  _err(code) {
    const map = {
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
    return map[code] || `Erreur : ${code}`;
  }
};

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
      await ref.set({ history: _hist, myList: _list }, { merge: true });
    } catch (e) {
      console.warn('[iPROMX] DB write error:', e.message);
      _dirty = true;
    }
  }

  return {
    _setData(h, l) { _hist = h; _list = l; },
    _flushNow()    { _flush(); },
    _reset()       { clearTimeout(_timer); _hist = []; _list = []; _dirty = false; },

    getHistory() { return _hist; },

    addHistory(e) {
      _hist = _hist.filter(x =>
        !(x.familyId === e.familyId && x.charId === e.charId &&
          x.season   === e.season   && x.epNum  === e.epNum));
      _hist.unshift({ ...e, watchedAt: new Date().toISOString() });
      _hist = _hist.slice(0, 100);
      _schedule();
    },

    clearHistory() { _hist = []; _schedule(); },

    removeHistoryItems(set) {
      [...set].sort((a, b) => b - a).forEach(i => _hist.splice(i, 1));
      _schedule();
    },

    getMyList() { return _list; },

    addToList(item) {
      if (_list.find(i => i.familyId === item.familyId && i.charId === item.charId)) return false;
      _list.unshift({ ...item, addedAt: new Date().toISOString() });
      _schedule();
      return true;
    },

    removeFromList(fid, cid) {
      _list = _list.filter(i => !(i.familyId === fid && i.charId === cid));
      _schedule();
    },

    isInList(fid, cid) { return _list.some(i => i.familyId === fid && i.charId === cid); },

    removeListItems(set) {
      [...set].sort((a, b) => b - a).forEach(i => _list.splice(i, 1));
      _schedule();
    },

    _prog:      {},
    _progTimer: null,

    getProgress(fid, cid, s, n) {
      try {
        const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
        return JSON.parse(localStorage.getItem(k) || '[]')
          .find(p => p.fid === fid && p.cid === cid && p.s === s && p.n === n)
          || { pct: 0, sec: 0 };
      } catch { return { pct: 0, sec: 0 }; }
    },

    saveProgress(fid, cid, s, n, pct, sec) {
      try {
        const k = `ipx_prog_${AUTH.getCurrentUser()?.uid || 'g'}`;
        const p = JSON.parse(localStorage.getItem(k) || '[]');
        const i = p.findIndex(x => x.fid === fid && x.cid === cid && x.s === s && x.n === n);
        const entry = { fid, cid, s, n, pct, sec: sec || 0 };
        if (i >= 0) p[i] = entry; else p.push(entry);
        localStorage.setItem(k, JSON.stringify(p));
      } catch {}

      const key = `${fid}__${cid}__${s}__${n}`;
      this._prog[key] = { pct, sec: sec || 0, updatedAt: new Date().toISOString() };

      clearTimeout(this._progTimer);
      this._progTimer = setTimeout(() => this._flushProgress(), 30000);
    },

    async _flushProgress() {
      const ref = docRef();
      if (!ref || !Object.keys(this._prog).length) return;
      try {
        await ref.set({ progress: this._prog }, { merge: true });
      } catch (e) {
        console.warn('[iPROMX] progress flush error:', e.message);
      }
    },

    flushProgressNow() {
      clearTimeout(this._progTimer);
      this._progTimer = setTimeout(() => this._flushProgress(), 5000);
    },

    async getProgressRemote(fid, cid, s, n) {
      const ref = docRef(); if (!ref) return null;
      try {
        const doc = await ref.get();
        return doc.data()?.progress?.[`${fid}__${cid}__${s}__${n}`] || null;
      } catch { return null; }
    },

    _loadProgress(progressData) {
      if (progressData) this._prog = { ...progressData };
    },

    _ratings: {},
    _ratTimer: null,

    saveRating(fid, cid, season, epNum, stars) {
      const key   = `${fid}__${cid}__${season}__${epNum}`;
      const lsKey = `ipx_ratings_${AUTH.getCurrentUser()?.uid || 'g'}`;
      try {
        const all = JSON.parse(localStorage.getItem(lsKey) || '{}');
        if (stars === 0) delete all[key]; else all[key] = stars;
        localStorage.setItem(lsKey, JSON.stringify(all));
      } catch {}
      if (stars === 0) delete this._ratings[key]; else this._ratings[key] = stars;
      clearTimeout(this._ratTimer);
      this._ratTimer = setTimeout(() => this._flushRatings(), 10000);
    },

    async _flushRatings() {
      const ref = docRef(); if (!ref || !Object.keys(this._ratings).length) return;
      try { await ref.set({ ratings: this._ratings }, { merge: true }); }
      catch (e) { console.warn('[iPROMX] ratings flush:', e.message); }
    },

    _loadRatings(data) {
      if (!data) return;
      this._ratings = { ...data };
      const lsKey = `ipx_ratings_${AUTH.getCurrentUser()?.uid || 'g'}`;
      try { localStorage.setItem(lsKey, JSON.stringify(data)); } catch {}
    },
  };
})();