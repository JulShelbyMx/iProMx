/* ============================================================
   iPROMX v4 — App principale
   AUTH et DB définis dans firebase-auth.js
   ============================================================ */
'use strict';

// ── PERF UTILS ────────────────────────────────────────────────
const throttle = (fn, ms) => { let last=0; return (...a)=>{ const now=Date.now(); if(now-last>=ms){last=now;fn(...a);} }; };
const debounce = (fn, ms) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };

// ── DATA ──────────────────────────────────────────────────────
const FB = 'images/flash.jpg';
const DATA = {
  universes: {
    flash: {
      id:'flash', name:'Famille Flash', color:'#e74c3c',
      description:'La saga légendaire qui traverse les générations. Los Santos ne sera plus jamais le même.',
      image:'images/flashlogo.webp', banner:FB,
      characters:[
        { id:'david-flash', name:'David Flash', image:'images/david_flash.jpg', banner:FB,
          description:'Le fondateur légendaire de la famille Flash. Un homme au passé trouble qui a bâti un empire dans l\'ombre de Los Santos.',
          seasons:{ 'Saison 1':[{num:1,title:'POUR LA PREMIÈRE FOIS JE TESTE GTAV RP',videoId:'z_H0tafxHAc'},{num:2,title:'Les Débuts dans Los Santos',videoId:'z_H0tafxHAc'}], 'Saison 2':[{num:1,title:'LA FEMME DE MA VIE OU LE GANG',videoId:'Eoo3Vpelub4'},{num:2,title:'LA FEMME DE MA VIE OU LE GANG (SUITE)',videoId:'Eoo3Vpelub4'}] }},
        { id:'john-flash', name:'John Flash', image:'images/john_flash.jpg', banner:FB,
          description:'Le successeur ambitieux. Charismatique, déterminé, il modernise l\'empire familial tout en affrontant ses propres démons.',
          seasons:{ 'Saison 1':[{num:1,title:'Je suis gay !',videoId:'z_H0tafxHAc'},{num:2,title:'Les Débuts',videoId:'z_H0tafxHAc'}], 'Saison 2':[{num:1,title:'LA FEMME DE MA VIE OU LE GANG',videoId:'Eoo3Vpelub4'}] }},
        { id:'ken-flash', name:'Ken Flash', image:'images/ken_flash.jpg', banner:FB,
          description:'Le stratège froid. Maître des plans complexes et des alliances secrètes.', seasons:{} },
        { id:'aaron-flash', name:'Aaron Flash', image:'images/aaron_flash.webp', banner:FB,
          description:'L\'ancien militaire reconverti. Le bras armé de la famille, prêt à tout pour protéger les siens.',
          hasLocalVideo:true, videoUrl:'vidéos/phénixanimation1.mp4', seasons:{} },
        { id:'david-jr-flash', name:'David Jr Flash', image:'images/davidjr_flash.webp', banner:FB,
          description:'La nouvelle génération montante. Entre admiration et rébellion face à l\'héritage criminel.', seasons:{} },
        { id:'damon-flash', name:'Damon Flash', image:'images/damon_flash2.jpg', banner:FB,
          description:'Le mystérieux et imprévisible. Son retour soulève des questions.', seasons:{} },
        { id:'kayton-flash', name:'Kayton Flash', image:'images/kayton_flash.webp', banner:FB,
          description:'Le tacticien discret. Spécialiste des opérations clandestines.', seasons:{} },
        { id:'adrian-flash', name:'Adrian Flash', image:'images/adrian_flash3.webp', banner:FB,
          description:'Le loyal absolu. Bras droit de confiance.', seasons:{} },
        { id:'ned-flash', name:'Ned / Eden / Eddy Flash', image:'images/ned_flash.webp', banner:FB,
          description:'Capitaine légendaire qui a libéré le monde de la destruction qui l\'attendait.',
          hasLocalVideo:true, videoUrl:'vidéos/3frèresintro.mp4', seasons:{} },
        { id:'manda-flash', name:'Manda Flash', image:'images/manda_flash.webp', banner:FB,
          description:'La protectrice féroce. Mère, sœur, guerrière.', seasons:{} },
          { id:'zayn-flash', name:'Zayn Flash', image:'images/zayn_flash.webp', banner:FB,
          description:'Ok', seasons:{} }
      ]
    },
    shade: {
      id:'shade', name:'Famille Shade', color:'#9b59b6',
      description:'Mystère et ombres. Ses lois sont gravées dans le sang.',
      image:'images/shade-universe.jpg', banner:'images/shade-banner.jpg',
      characters:[
        { id:'sylvester-shade', name:'Sylvester (Silver) Shade', image:'images/sylvester_shade.jpg', banner:'images/shade-banner.jpg',
          description:'L\'ombre insaisissable. Maître du mystère, il règne sur un empire de secrets. Personne ne transgresse ses lois impunément.',
          hasLawBook:true, lawBookImages:['images/shade-law-1.webp','images/shade-law-2.webp','images/shade-law-3.webp'], seasons:{} }
      ]
    },
    winters: {
      id:'winters', name:'Famille Winters', color:'#3498db',
      description:'Froids comme l\'hiver. Impitoyables en affaires.',
      image:'images/winters-universe.jpg', banner:'images/winters-banner.jpg',
      characters:[
        { id:'jake-winters', name:'Jake Winters', image:'images/jake_winters.jpg', banner:'images/winters-banner.jpg',
          description:'Le second fidèle et brutal.', seasons:{} },
        { id:'oliver-winters', name:'Oliver Winters', image:'images/oliver_winters.jpg', banner:'images/winters-banner.jpg',
          description:'Le leader froid et calculateur.', seasons:{} }
      ]
    },
    escobar: {
      id:'escobar', name:'Escobar', color:'#e67e22',
      description:'L\'empire du cartel. Un homme, une légende, une menace.',
      image:'images/tom_escobar1.webp', banner:'images/tom_escobar1.webp',
      characters:[
        { id:'tom-escobar', name:'Tom Escobar', image:'images/tom_escobar1.webp', banner:'images/tom_escobar1.webp',
          description:'Le chef incontesté du cartel. Redoutable, stratège, imprévisible.', seasons:{} }
      ]
    },
    kingsley: {
      id:'kingsley', name:'Kingsley', color:'#1abc9c',
      description:'Un nom qui résonne dans toute la ville. Zack Kingsley ne fait pas de compromis.',
      image:'images/zack_kingsley.webp', banner:'images/zack_kingsley.webp',
      characters:[
        { id:'zack-kingsley', name:'Zack Kingsley', image:'images/zack_kingsley.webp', banner:'images/zack_kingsley.webp',
          description:'Charismatique et redoutable. Zack Kingsley impose sa loi sans concession.', seasons:{} }
      ]
    },
    independants: {
      id:'independants', name:'Indépendants', color:'#95a5a6',
      description:'Ils n\'appartiennent à aucune famille — mais leur impact sur Los Santos est indéniable.',
      image:'images/poil_carotte.webp', banner:'images/poil_carotte.webp',
      characters:[
        { id:'poil-carotte', name:'Poil de Carotte', image:'images/poil_carotte.webp', banner:'images/poil_carotte.webp',
          description:'L\'imprévisible. Personne ne sait vraiment ce qu\'il prépare.', seasons:{} },
        { id:'axel-leret', name:'Axel Léret', image:'images/axel_leret.webp', banner:'images/axel_leret.webp',
          description:'Un personnage à part entière, avec ses propres ambitions et ses propres règles.', seasons:{} },
        { id:'le-geant', name:'Le Géant', image:'images/le_geant.webp', banner:'images/le_geant.webp',
          description:'Sa stature impose le respect. Sa réputation, la peur.', seasons:{} },
        { id:'gang-gamins', name:'Le Gang des Gamins', image:'images/gang_gamins.webp', banner:'images/gang_gamins.webp',
          description:'Ne les sous-estime pas. Ces gamins ont prouvé que la taille n\'a rien à voir avec le danger.', seasons:{} }
      ]
    }
  },
  social:[
    {id:'twitch',name:'Twitch',desc:'Lives GTA 5 RP sur FanTasTic RP — Rejoins le direct !',url:'https://www.twitch.tv/ipromx',icon:'fab fa-twitch',platform:'twitch',banner:'images/twitch-banner.jpg'},
    {id:'youtube',name:'YouTube',desc:'+1 000 000 abonnés — Toutes les aventures en VOD',url:'https://www.youtube.com/ipromx',icon:'fab fa-youtube',platform:'youtube',banner:'images/youtube-banner.jpg'},
    {id:'discord',name:'Discord',desc:'Communauté FanTasTic RP — Rejoins le serveur !',url:'#',icon:'fab fa-discord',platform:'discord',banner:'images/discord-banner.jpg'},
    {id:'store',name:'Store',desc:'Merch officiel iProMx',url:'https://ipromx.store',icon:'fas fa-store',platform:'youtube',banner:'images/store-banner.jpg'}
  ],

  // ── NOTIFICATIONS (modifier manuellement ici) ────────────────
  // Mettre null pour désactiver, ou remplir l'objet
  notification: {
    // active: false,  // mettre false pour masquer
    active: true,
    label: 'NOUVEL ÉPISODE',      // badge à gauche (ex: "MISE À JOUR", "NOUVEAU")
    text:  'Nouvel épisode sorti : David Flash Saison 1 — Les Débuts dans Los Santos',
    // Lien vers un épisode précis (laisser null pour pas de bouton)
    link: {
      familyId: 'flash',
      charId:   'david-flash',
      season:   'Saison 1',
      epNum:    2            // numéro de l'épisode
    }
    // Pour une URL externe à la place :
    // externalUrl: 'https://...'
    // externalLabel: 'Voir'
  },

  // ── CINÉMATIQUES ─────────────────────────────────────────────
  // Ajouter ici tes cinématiques MP4 locales ou YouTube
  cinematics: [
    // Format : { id, title, desc, image (thumbnail), videoId (YouTube) }
    {
      title: "Zayn Flash - Teaser officiel",
      image: "https://i.ytimg.com/vi/Mp1bkYZ6whA/hqdefault.jpg",
      videoId: "Mp1bkYZ6whA"
    },
    {
      title: "TOM ESCOBAR CONTACTE JAKE WINTERS ! | CINÉMATIQUE",
      image: "https://i.ytimg.com/vi/tYJZLe8fNYs/hqdefault.jpg",
      videoId: "tYJZLe8fNYs"
    },
    {
      title: "Sylvester Shade ! Teaser #2 - GTA 5 RP",
      image: "https://i.ytimg.com/vi/TTOD3ROwR6s/hqdefault.jpg",
      videoId: "TTOD3ROwR6s"
    },
    {
      title: "Nouveau Personnage ! Teaser #1 - GTA 5 RP",
      image: "https://i.ytimg.com/vi/wgZ0_iSvkZ0/hqdefault.jpg",
      videoId: "wgZ0_iSvkZ0"
    },
    {
      title: "L'INVITATION D'ADRIAN FLASH ! CINÉMATIQUE",
      image: "https://i.ytimg.com/vi/nbeGv9_AEyo/hqdefault.jpg",
      videoId: "nbeGv9_AEyo"
    },
    {
      title: "NED EDEN ET EDDY, LE RETOUR DU TRIO ! CINÉMATIQUE",
      image: "https://i.ytimg.com/vi/VujR_-Y-8fo/hqdefault.jpg",
      videoId: "VujR_-Y-8fo"
    },
    {
      title: "JADE DEVIENT HUMAINE ! CINÉMATIQUE ",
      image: "https://i.ytimg.com/vi/KgdeypkzLns/hqdefault.jpg",
      videoId: "KgdeypkzLns"
    },
    {
      title: "LES SOUVENIRS DE NED ! CINÉMATIQUE (LeTigreBL et iProMx)",
      image: "https://i.ytimg.com/vi/bu40TozLx-E/hqdefault.jpg",
      videoId: "bu40TozLx-E"
    },
    {
      title: "PIECE HISTORIQUE (Ned et les salles des FLASH)",
      image: "https://i.ytimg.com/vi/NuXpt4eL0pI/hqdefault.jpg",
      videoId: "NuXpt4eL0pI"
    },
    {
      title: "EDEN FLASH FUIT SES RESPONSABILITÉS ?! | CINÉMATIQUE",
      image: "https://i.ytimg.com/vi/12OM0vXcWy0/hqdefault.jpg",
      videoId: "12OM0vXcWy0"
    },
    {
      title: "LA FIN DE MANDA FLASH ? (MANDA X BASILIC)",
      image: "https://i.ytimg.com/vi/az3c-gahJ9E/hqdefault.jpg",
      videoId: "az3c-gahJ9E"
    },
    {
      title: "Manda Blake - Saison 2 Cinématique !",
      image: "https://i.ytimg.com/vi/c_VcYTzNO1w/hqdefault.jpg",
      videoId: "c_VcYTzNO1w"
    },
    {
      title: "Eddy vs Aaron, le combat le plus terrifiant - part2 ! Cinématique",
      image: "https://i.ytimg.com/vi/r0zwnltnEu8/hqdefault.jpg",
      videoId: "r0zwnltnEu8"
    },
    {
      title: "Ned vs Aaron - Le combat ultime (cinématique)",
      image: "https://i.ytimg.com/vi/qonTgtJUeaE/hqdefault.jpg",
      videoId: "qonTgtJUeaE"
    },
    {
      title: "EDEN ET AARON FLASH VS ADRIAN ! LE FILM",
      image: "https://i.ytimg.com/vi/ygNYMUnW74k/hqdefault.jpg",
      videoId: "ygNYMUnW74k"
    },
    {
      title: "ADRIAN IS BACK ! teaser officiel",
      image: "https://i.ytimg.com/vi/OsxWdAEHw5s/hqdefault.jpg",
      videoId: "OsxWdAEHw5s"
    },
    {
      title: "EDEN FLASH ! (Le Vrai Teaser)",
      image: "https://i.ytimg.com/vi/gnwbjHD4woc/hqdefault.jpg",
      videoId: "gnwbjHD4woc"
    },
    {
      title: "KAYTON VS ADRIAN LE COMBAT DU SIECLE ! CINEMATIQUE",
      image: "https://i.ytimg.com/vi/P09rKJjBZpI/hqdefault.jpg",
      videoId: "P09rKJjBZpI"
    },
    {
      title: "KAYTON ENTRAÎNEMENT AVANT LE COMBAT CONTRE ADRIAN ! CINEMATIQUE",
      image: "https://i.ytimg.com/vi/tXsvgOPPnbE/hqdefault.jpg",
      videoId: "tXsvgOPPnbE"
    },
    {
      title: "KAYTON FLASH S’INTERROGE SUR LE COMBAT CONTRE ADRIAN",
      image: "https://i.ytimg.com/vi/4MQeQGZrl44/hqdefault.jpg",
      videoId: "4MQeQGZrl44"
    },
    {
      title: "ADRIAN FLASH LE REVEIL DU BASILIC",
      image: "https://i.ytimg.com/vi/iUL3jrH04hI/hqdefault.jpg",
      videoId: "iUL3jrH04hI"
    },
    {
      title: "Adrian le nouveau FLASH !",
      image: "https://i.ytimg.com/vi/eGoVTIeMYI0/hqdefault.jpg",
      videoId: "eGoVTIeMYI0"
    },
    {
      title: "TOM ESCOBAR - LE COMBAT FINAL CONTRE AGENT X - LE FILM !",
      image: "https://i.ytimg.com/vi/DGkFc6z9a4Q/hqdefault.jpg",
      videoId: "DGkFc6z9a4Q"
    },
    {
      title: "LES RETROUVAILLES DE TOM ESCOBAR ET ABDOUL !",
      image: "https://i.ytimg.com/vi/epf8EC5_Gxg/hqdefault.jpg",
      videoId: "epf8EC5_Gxg"
    },
    {
      title: "KAYTON FLASH PRISON",
      image: "https://i.ytimg.com/vi/mW9AKO1mKHI/hqdefault.jpg",
      videoId: "mW9AKO1mKHI"
    },
    {
      title: "KAYTON x AARON",
      image: "https://i.ytimg.com/vi/W8nEQ5Oj7jc/hqdefault.jpg",
      videoId: "W8nEQ5Oj7jc"
    },
    {
      title: "KAYTON FLASH LE RETOUR FRACASSANT ! TEASER OFFICIEL",
      image: "https://i.ytimg.com/vi/OWumtU_bDNw/hqdefault.jpg",
      videoId: "OWumtU_bDNw"
    },
    {
      title: "J'AI VOLÉ LE COSTUME DU PÈRE NOEL #1 [COURT-METRAGE] GTAV RP",
      image: "https://i.ytimg.com/vi/Y2QuMsbjQtU/hqdefault.jpg",
      videoId: "Y2QuMsbjQtU"
    },
    {
      title: "DAMON FLASH LE FILM OFFICIEL ! COMBAT FINAL",
      image: "https://i.ytimg.com/vi/TyAXhptUiuE/hqdefault.jpg",
      videoId: "TyAXhptUiuE"
    },
    {
      title: "DAVID JR FLASH ! LE RETOUR ! CINÉMATIQUE GTAV RP ",
      image: "https://i.ytimg.com/vi/lsU0iBzBYrA/hqdefault.jpg",
      videoId: "lsU0iBzBYrA"
    },
    {
      title: "DAMON FLASH SAISON 2 CINÉMATIQUE !",
      image: "https://i.ytimg.com/vi/7Wxij8swW3o/hqdefault.jpg",
      videoId: "7Wxij8swW3o"
    },
    {
      title: "DAMON FLASH CINÉMATIQUE !",
      image: "https://i.ytimg.com/vi/7-p-KcT11MY/hqdefault.jpg",
      videoId: "7-p-KcT11MY"
    },
    {
      title: "LA BATAILLE FINAL DES FLASH ! CINEMATIQUE GTAV RP MOD",
      image: "https://i.ytimg.com/vi/fhNaQkBc2FE/hqdefault.jpg",
      videoId: "fhNaQkBc2FE"
    },
    {
      title: "AARON FLASH L' ATTAQUE ULTIME CONTRE DAVID JR !",
      image: "https://i.ytimg.com/vi/6HmYQLaI9Gc/hqdefault.jpg",
      videoId: "6HmYQLaI9Gc"
    },
    {
      title: "AARON FLASH LE RETOUR DU PHOENIX ! CINÉMATIQUE",
      image: "https://i.ytimg.com/vi/rLS7wJ7_sS8/hqdefault.jpg",
      videoId: "rLS7wJ7_sS8"
    },
    {
      title: "AARON FLASH PRISON ! Clip",
      image: "https://i.ytimg.com/vi/KSx3fytUbwU/hqdefault.jpg",
      videoId: "KSx3fytUbwU"
    },
    {
      title: "AARON FLASH TRAILER OFFICIEL !",
      image: "https://i.ytimg.com/vi/xKt-BIvC5YM/hqdefault.jpg",
      videoId: "xKt-BIvC5YM"
    },
    {
      title: "KEN LE PLUS FORT DES FLASH !",
      image: "https://i.ytimg.com/vi/Q5c-stkNdIM/hqdefault.jpg",
      videoId: "Q5c-stkNdIM"
    },
    {
      title: "David, John, Ken Flash : Face à Face Finale",
      image: "https://i.ytimg.com/vi/pHtx_iHieCk/hqdefault.jpg",
      videoId: "pHtx_iHieCk"
    },
    {
      title: "DOUBLE 2.0",
      image: "https://i.ytimg.com/vi/BlOJijzli10/hqdefault.jpg",
      videoId: "BlOJijzli10"
    },
    {
      title: "TOM ESCOBAR LE FILM OFFICIEL ! LA VÉRITÉ !",
      image: "https://i.ytimg.com/vi/gH5Eioo6FBk/hqdefault.jpg",
      videoId: "gH5Eioo6FBk"
    },
    {
      title: "KEN FLASH LA RELÈVE DU GANG DOUBLE ! #2 !",
      image: "https://i.ytimg.com/vi/S-Ziw2wkNOs/hqdefault.jpg",
      videoId: "S-Ziw2wkNOs"
    },
    {
      title: "KEN FLASH , LA FORTUNE ! GTAV RP #1 SAISON FINALE !",
      image: "https://i.ytimg.com/vi/k29gTJH9Llw/hqdefault.jpg",
      videoId: "k29gTJH9Llw"
    },
    {
      title: "GANG DOUBLE #2 S4 - LA FEMME MYSTÉRIEUSE - GTAV RP [COURT-MÉTRAGE]",
      image: "https://i.ytimg.com/vi/nNPojO9fZFc/hqdefault.jpg",
      videoId: "nNPojO9fZFc"
    },
    {
      title: "GANG DOUBLE SAISON 4 #1 - LA VÉRITÉ ! GTAV RP [COURT-MÉTRAGE]",
      image: "https://i.ytimg.com/vi/aqqLKLpwgUg/hqdefault.jpg",
      videoId: "aqqLKLpwgUg"
    },
    {
      title: "DAVID FLASH VS KEN FLASH ! LE FACE A FACE ! GTAV RP #6",
      image: "https://i.ytimg.com/vi/Ir86G35BFZ4/hqdefault.jpg",
      videoId: "Ir86G35BFZ4"
    },
    {
      title: "GIULIA OU ES TU ?! EPISODE CINÉMATIQUE GTAV RP SAISON 2 #1 ! FR #ROADTO700K",
      image: "https://i.ytimg.com/vi/bOsjL7cTDsQ/hqdefault.jpg",
      videoId: "bOsjL7cTDsQ"
    },
    {
      title: "LE GANG DOUBLE SAISON 4 ! TRAILER OFFICIEL",
      image: "https://i.ytimg.com/vi/r1AoHZ-H5ik/hqdefault.jpg",
      videoId: "r1AoHZ-H5ik"
    },
    {
      title: "LA MORT D'ANGEL ?! GTAV RP SAISON 2 #1",
      image: "https://i.ytimg.com/vi/P04hXwK0YzM/hqdefault.jpg",
      videoId: "P04hXwK0YzM"
    },
    {
      title: "TRAILER OFFICIEL GTAV PRISON RP feat JOHN FLASH !",
      image: "https://i.ytimg.com/vi/ub-9oO4SO3k/hqdefault.jpg",
      videoId: "ub-9oO4SO3k"
    },
    {
      title: "L'ETAPE LA PLUS DURE POUR JOHN FLASH ! GTAV RP LE FILM !",
      image: "https://i.ytimg.com/vi/U3Ri989csgQ/hqdefault.jpg",
      videoId: "U3Ri989csgQ"
    },
    {
      title: 'LE FACE A FACE ? GTAV RP EXCLU',
      image: "https://i.ytimg.com/vi/tOOXC0Bthkw/hqdefault.jpg",
      videoId: "tOOXC0Bthkw"
    },
    {
      title: 'LA FIN DE JOHN FLASH ?! GTAV RP LIVE FR',
      image: "https://i.ytimg.com/vi/FBhW9KNyTyU/hqdefault.jpg",
      videoId: "FBhW9KNyTyU"
    },
    {
      title: 'DAVID FLASH IS BACK ! GTAV RP #0',
      image: "https://i.ytimg.com/vi/gSUZ3nxMBhg/hqdefault.jpg",
      videoId: "gSUZ3nxMBhg"
    }
    // Ajoute d'autres cinématiques ici :
    // { id:'mon-id', title:'Titre', desc:'Description', image:'images/...', videoId:'YOUTUBE_ID' }
  ]
};

const HERO_SLIDES=[
  {familyId:'flash',charId:'ned-flash'},
  {familyId:'kingsley',charId:'zack-kingsley'},
  {familyId:'flash',charId:'adrian-flash'},
  {familyId:'shade',charId:'sylvester-shade'},
  {familyId:'escobar',charId:'tom-escobar'}
];

// ── HELPERS ───────────────────────────────────────────────────
const $   = id  => document.getElementById(id);
const $$  = (s,r=document) => [...r.querySelectorAll(s)];
const esc = s   => String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
const getChar     = (fid,cid) => DATA.universes[fid]?.characters.find(c=>c.id===cid)||null;

// Ordre d'affichage dans "Univers" (tel que demandé)
const CHAR_ORDER = [
  ['kingsley','zack-kingsley'],
  ['flash','zayn-flash'],
  ['shade','sylvester-shade'],
  ['winters','jake-winters'],
  ['flash','ned-flash'],
  ['independants','axel-leret'],
  ['flash','manda-flash'],
  ['flash','adrian-flash'],
  ['winters','oliver-winters'],
  ['independants','gang-gamins'],
  ['flash','kayton-flash'],
  ['flash','damon-flash'],
  ['flash','david-jr-flash'],
  ['flash','aaron-flash'],
  ['escobar','tom-escobar'],
  ['independants','le-geant'],
  ['flash','ken-flash'],
  ['independants','poil-carotte'],
  ['flash','john-flash'],
  ['flash','david-flash'],
];

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
const getTotalEps = c => Object.values(c.seasons||{}).reduce((s,e)=>s+e.length,0);
const hasContent  = c => getTotalEps(c)>0||c.hasLocalVideo||c.hasLawBook;
const getFirstEp  = c => { for(const [s,eps] of Object.entries(c.seasons||{})) if(eps.length) return {season:s,ep:eps[0],idx:0}; return null; };
const fmtTime     = s => { if(isNaN(s)||s<0)return'0:00'; const m=Math.floor(s/60),sec=String(Math.floor(s%60)).padStart(2,'0'); return`${m}:${sec}`; };
const ytThumb     = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

// ── ROUTER ────────────────────────────────────────────────────
const ROUTER = (() => {
  const charSlug = cid => cid.split('-')[0];
  const seasSlug = s   => s.toLowerCase().replace(/\s+/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const findChar = (fid,slug) => DATA.universes[fid]?.characters.find(c=>c.id.startsWith(slug+'-'))||null;
  const findSeas = (fid,cid,slug) => Object.keys(getChar(fid,cid)?.seasons||{}).find(s=>seasSlug(s)===slug)||null;

  function buildURL(fid,cid,season,epNum) {
    return `/${fid}/${charSlug(cid)}/${seasSlug(season)}/ep${epNum}`;
  }
  function parse(path) {
    const p=path.replace(/^\//,'').split('/').filter(Boolean);
    if(!p[0]||!DATA.universes[p[0]]) return {view:'home'};
    const fid=p[0], char=p[1]?findChar(fid,p[1]):null;
    if(!char) return {view:'home'};
    if(!p[2]||!p[3]) return {view:'series',fid,cid:char.id};
    const season=findSeas(fid,char.id,p[2]); if(!season) return {view:'series',fid,cid:char.id};
    const epNum=parseInt(p[3].replace('ep','')); if(isNaN(epNum)) return {view:'series',fid,cid:char.id};
    return {view:'player',fid,cid:char.id,season,epNum};
  }
  function dispatch(route) {
    if(route.view==='player'){
      const char=getChar(route.fid,route.cid);
      const eps=char?.seasons?.[route.season]||[];
      const idx=eps.findIndex(e=>e.num===route.epNum);
      if(idx<0){showHome();return;}
      showPlayerPage(route.fid,route.cid,route.season,idx,false);
    } else if(route.view==='series'){ showHome(); setTimeout(()=>openSeriesModal(route.fid,route.cid),150); }
    else { showHome(); }
  }
  return {
    init() {
      window.addEventListener('popstate',()=>dispatch(parse(location.pathname)));
      const r=parse(location.pathname); if(r.view==='player') dispatch(r);
    },
    goHome() { history.pushState({},'','/'); showHome(); },
    buildURL
  };
})();

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg,type='success') {
  const icons={success:'fa-check-circle',error:'fa-exclamation-circle',warning:'fa-triangle-exclamation',info:'fa-info-circle'};
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  el.innerHTML=`<i class="fas ${icons[type]||icons.info} toast-icon"></i><span class="toast-text">${msg}</span><button class="toast-dismiss" onclick="this.closest('.toast').remove()"><i class="fas fa-times"></i></button>`;
  $('toastContainer').appendChild(el);
  setTimeout(()=>{el.classList.add('leaving');setTimeout(()=>el.remove(),300);},3500);
}

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
  renderNavUser();
  renderNotification();
  renderHero();
  renderUniverses();
  renderCinematics();
  renderHistory();
  renderMyList();
  renderSocial();
  setupNavEvents();
  setupScrollEffects();
  setupSearch();
  startHeroAuto();
  ROUTER.init();
  checkTwitchLive();
  if(AUTH.isGuest()) setTimeout(()=>toast('Mode invité — données non sauvegardées.','warning'),1200);
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
      : `Retrouvez le serveur <strong>FanTasTic RP</strong> en direct sur Twitch.`;
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
    if(subtitle) subtitle.innerHTML     = `Retrouvez le serveur <strong>FanTasTic RP</strong> en direct sur Twitch.`;
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
        <button class="dropdown-item" onclick="openHistory();closeDD()"><i class="fas fa-history"></i> Historique</button>
        <button class="dropdown-item" onclick="openMyList();closeDD()"><i class="fas fa-star"></i> Ma Liste</button>
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
      ${first?`<button class="btn-primary" onclick="playEp('${slide.familyId}','${slide.charId}','${esc(first.season)}',0)"><i class="fas fa-play"></i> Regarder</button>`
             :`<button class="btn-primary" onclick="openSeriesModal('${slide.familyId}','${slide.charId}')"><i class="fas fa-info-circle"></i> Découvrir</button>`}
      <button class="btn-secondary" onclick="openSeriesModal('${slide.familyId}','${slide.charId}')"><i class="fas fa-info-circle"></i> Plus d'infos</button>
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
    return `<div class="card" data-family="${c.familyId}" onclick="openSeriesModal('${c.familyId}','${c.id}')">
      <div class="card-thumb" style="background-image:url('${c.image}')">
        <div class="card-play-icon"><i class="fas fa-${hasContent(c)?'play':'info-circle'}"></i></div>
        ${eps>0?`<div class="card-badge">${eps} EP</div>`:c.hasLocalVideo?`<div class="card-badge" style="background:var(--gold);color:#000;">VIDÉO</div>`:c.hasLawBook?`<div class="card-badge" style="background:#9b59b6;">LOIS</div>`:''}
      </div>
      <div class="card-info"><div class="card-title">${c.name}</div><div class="card-meta">${c.family.name}</div></div>
    </div>`;
  }).join('');  setTimeout(()=>setupCarousel('universesTrack','univPrev','univNext'),50);
}
function filterFamily(fam) {
  $$('.filter-tab').forEach(t=>t.classList.toggle('active',t.dataset.filter===fam));
  renderUniverses(fam);
}

// ── HISTORY ───────────────────────────────────────────────────
function renderHistory() {
  const track=$('historyTrack'), sec=$('secHistory'); if(!track) return;
  const hist=DB.getHistory();
  if(!hist.length){ if(sec) sec.style.display='none'; return; }
  if(sec) sec.style.display='';
  track.innerHTML=hist.map(h=>{
    const char=getChar(h.familyId,h.charId); if(!char) return '';
    const prog=DB.getProgress(h.familyId,h.charId,h.season,h.epNum);
    return `<div class="card wide" onclick="playEp('${h.familyId}','${h.charId}','${esc(h.season)}',${h.epIdx||0})">
      <div class="card-thumb" style="background-image:url('${ytThumb(h.videoId)}')">
        <div class="card-play-icon"><i class="fas fa-play"></i></div>
        <div class="card-progress"><div class="card-progress-bar" style="width:${prog}%"></div></div>
      </div>
      <div class="card-info"><div class="card-title">${char.name}</div><div class="card-meta">EP ${h.epNum} · ${h.season}</div></div>
    </div>`;
  }).join('');
  setTimeout(()=>setupCarousel('historyTrack','histPrev','histNext',272),50);
}

// ── MY LIST ───────────────────────────────────────────────────
function renderMyList() {
  const track=$('myListTrack'), sec=$('secMyList'); if(!track) return;
  const list=DB.getMyList();
  if(!list.length){ if(sec) sec.style.display='none'; return; }
  if(sec) sec.style.display='';
  track.innerHTML=list.map(item=>{
    const char=getChar(item.familyId,item.charId); if(!char) return '';
    return `<div class="card" onclick="openSeriesModal('${item.familyId}','${item.charId}')">
      <div class="card-thumb" style="background-image:url('${char.image}')"><div class="card-play-icon"><i class="fas fa-play"></i></div></div>
      <div class="card-info"><div class="card-title">${char.name}</div><div class="card-meta">${DATA.universes[item.familyId].name}</div></div>
    </div>`;
  }).join('');
  setTimeout(()=>setupCarousel('myListTrack','listPrev','listNext'),50);
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

  const platformMeta = {
    twitch:  { color:'#9147ff', bg:'rgba(145,71,255,0.1)',  border:'rgba(145,71,255,0.3)',  stat:'272K+', statLabel:'Followers',   cta:'Regarder en direct', ctaIcon:'fas fa-play-circle' },
    youtube: { color:'#ff0000', bg:'rgba(255,0,0,0.1)',     border:'rgba(255,0,0,0.3)',     stat:'1M+',   statLabel:'Abonnés',     cta:'Voir la chaîne',     ctaIcon:'fab fa-youtube'     },
    discord: { color:'#7289da', bg:'rgba(114,137,218,0.1)', border:'rgba(114,137,218,0.3)', stat:'∞',     statLabel:'Membres',     cta:'Rejoindre',          ctaIcon:'fab fa-discord'     },
    youtube2:{ color:'#f5a623', bg:'rgba(245,166,35,0.1)',  border:'rgba(245,166,35,0.3)',  stat:'↗',     statLabel:'Disponible',  cta:'Visiter le store',   ctaIcon:'fas fa-shopping-bag'},
  };

  g.innerHTML = DATA.social.map(s => {
    const pm = platformMeta[s.id] || platformMeta[s.platform] || platformMeta.twitch;
    return `
    <a class="soc-card" href="${s.url}" target="_blank" style="
      display:flex;flex-direction:column;
      background:${pm.bg};
      border:1px solid ${pm.border};
      border-radius:var(--radius-lg);
      overflow:hidden;
      text-decoration:none;
      transition:transform .2s,box-shadow .2s;
      cursor:pointer;
      position:relative;
    " onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px ${pm.border}'"
       onmouseout="this.style.transform='';this.style.boxShadow=''">

      <!-- Barre couleur top -->
      <div style="height:3px;background:${pm.color};width:100%;"></div>

      <!-- Bannière -->
      <div style="height:110px;background-image:url('${s.banner}');background-size:cover;background-position:center;position:relative;">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,${pm.bg.replace('0.1','0.85')});"></div>
        <!-- Badge plateforme -->
        <div style="position:absolute;top:12px;left:14px;display:flex;align-items:center;gap:8px;">
          <div style="width:38px;height:38px;border-radius:50%;background:${pm.color};display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:white;box-shadow:0 2px 12px ${pm.border};">
            <i class="${s.icon}"></i>
          </div>
          <span style="font-family:var(--font-display);font-size:.7rem;font-weight:900;letter-spacing:2px;color:white;text-shadow:0 1px 4px rgba(0,0,0,.8);text-transform:uppercase;">${s.name}</span>
        </div>
        <!-- Stat -->
        <div style="position:absolute;bottom:12px;right:14px;text-align:right;">
          <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;color:${pm.color};line-height:1;">${pm.stat}</div>
          <div style="font-family:var(--font-body);font-size:.7rem;color:rgba(255,255,255,.7);margin-top:1px;">${pm.statLabel}</div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;gap:10px;">
        <p style="font-family:var(--font-body);font-size:.9rem;color:var(--text-dim);line-height:1.5;margin:0;flex:1;">${s.desc}</p>
        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:${pm.color};border-radius:30px;color:white;font-family:var(--font-display);font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;align-self:flex-start;">
          <i class="${pm.ctaIcon}" style="font-size:.85rem;"></i>
          ${pm.cta}
        </div>
      </div>
    </a>`;
  }).join('');
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
        ${n.text}
      </span>
      ${actionBtn}
      <button onclick="this.closest('[style]').remove()"
        style="position:absolute;top:8px;right:10px;background:none;border:none;
               color:var(--text-muted);cursor:pointer;font-size:.85rem;padding:2px;">
        <i class="fas fa-times"></i>
      </button>
    </div>`;
  banner.style.display = '';
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
        <div class="card-badge" style="background:rgba(245,166,35,0.85);color:#000;">CINÉ</div>
      </div>
      <div class="card-info"><div class="card-title">${c.title}</div><div class="card-meta">${c.desc||''}</div></div>
    </div>`).join('');
  setTimeout(()=>setupCarousel('cinematicsTrack','cinematicsPrev','cinematicsNext'),50);
}

function playCinematic(idx) {
  const items=DATA.cinematics||[];
  const c=items[idx]; if(!c) return;

  // Destroy existing YT player
  if(ytPlayer&&typeof ytPlayer.destroy==='function'){try{ytPlayer.destroy();}catch(_){} ytPlayer=null;}
  cancelAutoplay();

  const mc=$('mainContent'); if(mc) mc.style.display='none';
  const pp=$('playerPage'); if(!pp) return;
  pp.classList.add('active');
  document.body.style.overflow=''; window.scrollTo(0,0);
  document.title=`${c.title} | iPROMX`;
  try { history.pushState({},``,`/cinematique/${idx}`); } catch(_){}

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
          <div class="player-ep-meta"><span>Cinématique</span><span class="dot"></span><span>FanTasTic RP</span></div>
        </div>
        <div style="font-family:var(--font-body);font-size:.95rem;color:var(--text-dim);line-height:1.6;padding:8px 0 16px;">${c.desc||''}</div>
      </div>
      <div class="player-sidebar">${recommHtml}</div>
    </div>`;

  // Lancer la vidéo
  if(c.videoId) {
    const params={videoId:c.videoId,fid:null,cid:null,season:null,epIdx:null,isCinematic:true};
    if(typeof YT!=='undefined'&&YT.Player) _createYTPlayer(params);
    else window._pendingYT=params;
  }
}

// ── SERIES MODAL ──────────────────────────────────────────────
let curSF=null,curSC=null,curSeason=null,lawPage=0,lawImgs=[];

function openSeriesModal(fid,cid) {
  const char=getChar(fid,cid), u=DATA.universes[fid]; if(!char) return;
  curSF=fid; curSC=cid;
  const modal=$('seriesModal'); modal.classList.add('open');
  document.body.style.overflow='hidden';

  // Hero bg + vidéo locale si présente
  const heroBg=$('seriesHeroBg'), heroVid=$('seriesHeroVideo');
  heroVid.pause();
  heroVid.style.display='none';
  heroBg.style.backgroundImage=`url('${char.banner||u.banner||char.image}')`;

  if(char.hasLocalVideo) {
    // Exactement comme l'original : <source> et <track> statiques dans le HTML,
    // on change juste leur src
    const srcEl   = $('seriesHeroSource');
    const trackEl = $('seriesHeroTrack');

    if(srcEl)   srcEl.src = char.videoUrl;
    if(trackEl) trackEl.src = char.subtitlesUrl || '';

    heroVid.load();
    heroVid.style.display = 'block';
    heroVid.play().catch(()=>{});
    setupModalVideoCtrl(heroVid, !!char.subtitlesUrl);
    $('seriesVideoControls').style.display = '';
  } else {
    $('seriesVideoControls').style.display = 'none';
  }

  $('seriesTitle').textContent=char.name;
  $('seriesFamilyTag').textContent=u.name;
  $('seriesDesc').textContent=char.description;

  const first=getFirstEp(char), inList=DB.isInList(fid,cid);

  // Boutons d'action — PAS de lecteur pour personnages sans contenu
  let actions='';
  if(first) {
    actions+=`<button class="btn-primary" onclick="playEp('${fid}','${cid}','${esc(first.season)}',0)"><i class="fas fa-play"></i> Commencer</button>`;
  }
  if(char.hasLocalVideo) {
    actions+=`<button class="btn-secondary" onclick="openLocalPlayer('${esc(char.videoUrl)}','${esc(char.subtitlesUrl||'')}','${esc(char.name)}')"><i class="fas fa-film"></i> ${first?"Voir l'intro":'Regarder'}</button>`;
  }
  if(char.hasLawBook) {
    actions+=`<button class="btn-secondary" onclick="openLawBook('${cid}')"><i class="fas fa-book"></i> Livre des Lois</button>`;
  }
  actions+=`<button class="btn-icon${inList?' active':''}" onclick="toggleList('${fid}','${cid}',this)" title="${inList?'Retirer de ma liste':'Ajouter à ma liste'}"><i class="fas fa-${inList?'check':'plus'}"></i></button>`;
  $('seriesActionsRow').innerHTML=actions;

  // Épisodes / saisons
  const seasons=Object.keys(char.seasons||{});
  const stabs=$('seriesSeasonTabs'), eplist=$('seriesEpisodesList');
  if(seasons.length) {
    curSeason=seasons[0];
    stabs.innerHTML=seasons.map(s=>`<button class="season-tab${s===curSeason?' active':''}" onclick="selectSeason('${esc(s)}',this)">${s}</button>`).join('');
    renderModalEps(fid,cid,curSeason);
  } else {
    stabs.innerHTML='';
    eplist.innerHTML=`<div class="empty-state"><i class="fas fa-clock"></i><h4>Bientôt disponible</h4><p>Les épisodes arrivent prochainement</p></div>`;
  }
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
    const prog=DB.getProgress(fid,cid,season,ep.num), done=prog>=90;
    return `<div class="episode-item" onclick="playEp('${fid}','${cid}','${esc(season)}',${i})">
      <div class="episode-thumb" style="background-image:url('${ytThumb(ep.videoId)}')">
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
  $('seriesModal')?.classList.remove('open');
  document.body.style.overflow='';
  const v=$('seriesHeroVideo');
  if(v){
    v.pause();
    v.style.display='none';
    // Ne PAS faire v.src='' car la source est sur l'élément <source> enfant
    // Juste vider la source enfant
    const srcEl=$('seriesHeroSource');
    if(srcEl) srcEl.src='';
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
}

function closeLocalPlayer() {
  $('localPlayerModal')?.classList.remove('open');
  document.body.style.overflow='';
  const container=$('localPlayerContainer');
  const v=container?.querySelector('video');
  if(v){v.pause();v.src='';}
  if(container) container.innerHTML='';
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
function openAvatarPicker() {
  let modal = $('avatarPickerModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'avatarPickerModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,4,8,0.97);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;';
    document.body.appendChild(modal);
  }
  const user = AUTH.getCurrentUser();
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--edge);border-radius:var(--radius-lg);padding:28px 32px;max-width:540px;width:100%;position:relative;box-shadow:var(--shadow-arc);">
      <div style="font-family:var(--font-display);font-size:.85rem;font-weight:700;letter-spacing:3px;color:var(--arc);margin-bottom:6px;text-transform:uppercase;">Choisir un avatar</div>
      <div style="font-family:var(--font-body);font-size:.9rem;color:var(--text-muted);margin-bottom:24px;">Sélectionne l'avatar qui te représente</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:24px;">
        ${PRESET_AVATARS.map(av=>`
          <div onclick="selectAvatar('${av.id}',this)"
               data-avid="${av.id}"
               class="avatar-pick-item"
               style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;border-radius:10px;transition:background .15s;">
            <div class="avatar-pick-circle" style="
              width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;
              border:3px solid ${user?.avatarId===av.id?'var(--arc)':'rgba(255,255,255,0.08)'};
              box-shadow:${user?.avatarId===av.id?'0 0 14px var(--arc-glow)':'none'};
              transition:all .2s;background:var(--panel2);">
              <img src="${av.src}" alt="${av.label}"
                   style="width:100%;height:100%;object-fit:cover;display:block;"
                   onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--arc)><i class=fas\\ fa-user></i></div>'">
            </div>
            <span style="font-family:var(--font-display);font-size:.48rem;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;text-align:center;line-height:1.2;">${av.label}</span>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="closeAvatarPicker()" style="flex:1;padding:11px;background:transparent;border:1px solid var(--edge);border-radius:var(--radius);color:var(--text-dim);font-family:var(--font-display);font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">Annuler</button>
        <button onclick="applyAvatar()" id="avatarApplyBtn" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--iron),var(--iron-bright));border:none;border-radius:var(--radius);color:white;font-family:var(--font-display);font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 14px var(--iron-glow);">
          <i class="fas fa-check"></i> Appliquer
        </button>
      </div>
    </div>`;
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
  const doSearch = debounce(e=>{
    const q=e.target.value.trim().toLowerCase(), res=$('searchResults'); if(!res) return;
    if(q.length<2){res.innerHTML='';return;}
    const matches=getAllChars().filter(c=>c.name.toLowerCase().includes(q)||c.family.name.toLowerCase().includes(q));
    res.innerHTML=matches.slice(0,12).map(c=>`
      <div class="search-result-card" onclick="closeSearch();openSeriesModal('${c.familyId}','${c.id}')">
        <div class="search-result-thumb" style="background-image:url('${c.image}')"></div>
        <div class="search-result-info"><h4>${c.name}</h4><p>${c.family.name}</p></div>
      </div>`).join('')||'<div class="empty-state" style="width:100%"><i class="fas fa-search"></i><h4>Aucun résultat</h4></div>';
  }, 150);
  $('searchInput')?.addEventListener('input', doSearch);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){closeSearch();closeSeriesModal();closeSettings();} });
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
  const step=(cw+12)*3;
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
  track.addEventListener('touchend',e=>{const d=sx-e.changedTouches[0].clientX;if(Math.abs(d)>50){if(d>0)nn.click();else np.click();}},{passive:true});
  upd();
}

// ── PAGE SWITCH ───────────────────────────────────────────────
function showHome() {
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

function playEp(fid,cid,season,epIdx) {
  const char=getChar(fid,cid); if(!char) return;
  const eps=char.seasons?.[season]||[];
  if(epIdx<0||epIdx>=eps.length) return;
  closeSeriesModal();
  showPlayerPage(fid,cid,season,epIdx);
}

function showPlayerPage(fid,cid,season,epIdx) {
  const char=getChar(fid,cid), u=DATA.universes[fid]; if(!char||!u) return;
  const eps=char.seasons?.[season]||[], ep=eps[epIdx]; if(!ep) return;

  // Détruire ancien player YT
  if(ytPlayer&&typeof ytPlayer.destroy==='function'){try{ytPlayer.destroy();}catch(_){} ytPlayer=null;}
  cancelAutoplay();

  // Switcher les pages
  const mc=$('mainContent'); if(mc) mc.style.display='none';
  const pp=$('playerPage'); if(!pp) return;
  pp.classList.add('active');
  document.body.style.overflow=''; window.scrollTo(0,0);
  document.title=`${char.name} — EP${ep.num} | iPROMX`;

  // URL propre
  try { history.pushState({},'',(ROUTER.buildURL(fid,cid,season,ep.num))); } catch(_){}

  // Historique
  DB.addHistory({familyId:fid,charId:cid,season,epNum:ep.num,epIdx,videoId:ep.videoId,title:ep.title}); renderHistory();

  // ── Bouton "Fermer" dans la navbar (à côté du logo, bien visible) ──
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

  // Build HTML
  const nextEp=epIdx+1<eps.length?eps[epIdx+1]:null;
  const inList=DB.isInList(fid,cid);
  const seasons=Object.keys(char.seasons||{});

  const stabs=seasons.map(s=>`<button class="player-season-tab${s===season?' active':''}" onclick="switchSeason('${fid}','${cid}','${esc(s)}',this)">${s}</button>`).join('');
  const epList=eps.map((e,i)=>{
    const prog=DB.getProgress(fid,cid,season,e.num), cur=i===epIdx;
    return `<div class="player-ep-item${cur?' current':''}" ${!cur?`onclick="playEp('${fid}','${cid}','${esc(season)}',${i})"`:''}>
      <div class="player-ep-thumb" style="background-image:url('${ytThumb(e.videoId)}')">
        <div class="player-ep-thumb-overlay">${cur?'<div class="player-ep-playing-icon"><i class="fas fa-volume-up"></i></div>':'<i class="fas fa-play"></i>'}</div>
        ${prog>0&&!cur?`<div class="player-ep-progress"><div class="player-ep-progress-fill" style="width:${prog}%"></div></div>`:''}
      </div>
      <div class="player-ep-info"><div class="player-ep-num">Épisode ${e.num}</div><div class="player-ep-name">${e.title}</div></div>
    </div>`;
  }).join('');
  // Sidebar : épisode courant + 4 autres max (5 au total)
  const suggEps=eps.slice(Math.max(0,epIdx-1),epIdx+4);
  const sugg=suggEps.map((e,i)=>{
    const realIdx=eps.indexOf(e), cur=realIdx===epIdx;
    return `<div class="suggestion-card${cur?' current':''}" ${!cur?`onclick="playEp('${fid}','${cid}','${esc(season)}',${realIdx})"`:''}>
      <div class="suggestion-thumb" style="background-image:url('${ytThumb(e.videoId)}')"></div>
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
        <!-- Breadcrumb -->
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
          <div class="player-ep-meta"><span>${season}</span><span class="dot"></span><span>Épisode ${ep.num}</span><span class="dot"></span><span>GTA 5 RP · FanTasTic</span></div>
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
            <div class="upnext-thumb" style="background-image:url('${ytThumb(nextEp.videoId)}')"><div class="upnext-play-btn"><i class="fas fa-play"></i></div></div>
            <div class="upnext-info"><div class="upnext-label">Épisode suivant</div><div class="upnext-title">${nextEp.title}</div><div class="upnext-ep">Épisode ${nextEp.num} · ${season}</div></div>
          </div>`:`<div class="empty-state" style="padding:20px;"><i class="fas fa-flag-checkered"></i><h4>Fin de la saison</h4></div>`}
        </div>
        ${eps.length>1?`<div class="sidebar-section"><div class="sidebar-section-title">Tous les épisodes</div><div class="sidebar-suggestions">${sugg}</div></div>`:''}
      </div>
    </div>`;

  // Monter le player YT dans le container dédié
  const params = {videoId:ep.videoId, fid, cid, season, epIdx};
  if(typeof YT!=='undefined'&&YT.Player) {
    _createYTPlayer(params);
  } else {
    window._pendingYT = params;
  }
}

function _createYTPlayer(params) {
  const {videoId, fid, cid, season, epIdx} = params;
  // Le container doit exister
  const container = $('ytPlayerContainer');
  if(!container) { window._pendingYT=params; return; }

  // Créer un div enfant pour YT (YT remplace ce div par un iframe)
  const div=document.createElement('div');
  div.id='ytDivInner';
  div.style.cssText='width:100%;height:100%;';
  container.innerHTML='';
  container.appendChild(div);

  ytPlayer=new YT.Player('ytDivInner',{
    videoId,
    height:'100%', width:'100%',
    playerVars:{autoplay:1,rel:0,modestbranding:1,iv_load_policy:3,cc_load_policy:0,fs:1},
    events:{
      onReady(e){ e.target.playVideo(); },
      onStateChange(e){ if(e.data===YT.PlayerState.ENDED) onVidEnd(fid,cid,season,epIdx); }
    }
  });
}

function onVidEnd(fid,cid,season,epIdx) {
  const eps=getChar(fid,cid)?.seasons?.[season]||[];
  if(epIdx+1>=eps.length) return;
  startAutoplay(fid,cid,season,epIdx);
}
function startAutoplay(fid,cid,season,epIdx) {
  autoCD=AUTOPLAY_SEC;
  window._autoTarget={fid,cid,season,epIdx:epIdx+1};
  $('autoplayBanner')?.classList.add('visible');
  autoTimer=setInterval(()=>{
    autoCD--;
    const c=$('autoCD'); if(c) c.textContent=autoCD;
    const f=$('autoFill'); if(f) f.style.width=(autoCD/AUTOPLAY_SEC*100)+'%';
    if(autoCD<=0){clearInterval(autoTimer);triggerAutoplay();}
  },1000);
}
function triggerAutoplay(){ cancelAutoplay(); const t=window._autoTarget; if(t) playEp(t.fid,t.cid,t.season,t.epIdx); }
function cancelAutoplay(){ clearInterval(autoTimer);autoTimer=null; $('autoplayBanner')?.classList.remove('visible'); window._autoTarget=null; }
function switchSeason(fid,cid,season,btn){ $$('.player-season-tab').forEach(t=>t.classList.remove('active')); btn?.classList.add('active'); playEp(fid,cid,season,0); }
function togglePlayerList(fid,cid) {
  const inList=DB.isInList(fid,cid);
  if(inList){ DB.removeFromList(fid,cid); const b=$('plListBtn'); if(b){b.innerHTML='<i class="fas fa-plus"></i><span>Ma Liste</span>';b.classList.remove('active','list');} toast('Retiré.','info'); }
  else{ DB.addToList({familyId:fid,charId:cid,name:getChar(fid,cid)?.name}); const b=$('plListBtn'); if(b){b.innerHTML='<i class="fas fa-check"></i><span>Dans ma liste</span>';b.classList.add('active','list');} toast('Ajouté !','success'); }
  renderMyList();
}

// Flush Firestore avant fermeture de l'onglet (évite la perte de données)
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
