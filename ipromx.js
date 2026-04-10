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
      image:'images/flashlogo.webp', banner:FB,
      characters:[
        { id:'david-flash', name:'David Flash', image:'images/letigrebl/david2.webp', banner:'images/letigrebl/david-bannière.webp',
          description:'Chef de gang légendaire ayant tout perdu, de sa liberté à sa famille, il finit par vivre dans l\'ombre pour protéger les siens. Protecteur infatigable, il traverse les épreuves et les époques pour guider ses héritiers jusqu\'à son dernier souffle.',
          seasons:{
    'Saison 1':[
        {num:1,title:'POUR LA PREMIERE FOIS JE TESTE GTAV RP - UN TROLLEUR SUR UN JEU ROLEPLAY ?',videoId:'z_H0tafxHAc'},
        {num:2,title:'GTAV RP #2 - JE FAIS DE L\'ILLEGAL POUR LA PREMIERE FOIS !',videoId:'_fABb3_UqlI'},
        {num:3,title:'ON MENACE DE ME TUER - GTAV RP #3',videoId:'rnlPQz_yZkk'},
        {num:4,title:'GTAV RP #4 - ON KIDNAPPE UN MEC ET L\'OBLIGE A TRAVAILLER POUR NOUS DANS L\'ILLÉGAL !',videoId:'1RT89ZnoIFc'},
        {num:5,title:'GTAV RP #5 - ON CREE NOTRE GANG ET ESSAYE DE NOUS FAIRE RESPECTER ! FIVELIFE',videoId:'bAL5YrzkmPI'},
        {num:6,title:'JE SUIS DEVENU UNE VRAIE RACAILLE + ON RECRUTE 2 MEC DANS NOTRE GANG - GTAV RP #6',videoId:'uJx1Z2AQHnA'},
        {num:7,title:'ON PREPARE NOTRE PLUS GROS COUP QUI PEUT NOUS RENDRE MILLIONAIRE ! GTAV RP #7',videoId:'c02txsFw56U'},
        {num:8,title:'ON VOLE UN TANK ET DEMANDE UNE RANÇON DE 1MILLIONS AUX POLICIERS ! GTAV RP #8',videoId:'CJl7bC9cfxc'},
        {num:9,title:'LE GRAND JOUR , NEGOCIATION AVEC LA POLICE POUR ECHANGE TANK CONTRE 1MILLIONS DOLLARS - GTAV RP #9',videoId:'Dhy2Uz0CkA8'},
        {num:10,title:'COURSE POURSUITE AVEC LA POLICE AVEC 600 000$ DANS LA POCHE - GTAV RP #10',videoId:'2zrMMtsB1r0'},
        {num:11,title:'LES AGENTS SECRETS NOUS ONT RETROUVÉ , JE PERDS MON MEILLEUR AMI GUY TRAGIQUEMENT :\'( - GTAV RP #11',videoId:'kGu8Bqy8Q50'},
        {num:12,title:'JE VAIS ME VENGER DE LA MORT DE GUY MAUD ! - GTAV RP #12',videoId:'r1qBzNm5aHY'},
        {num:13,title:'ACHETER DES ARMES ILLEGALES ET S\'INFILTRER DANS LE FBI POUR SE VENGER DE GUY ! GTAV RP #13',videoId:'OjNnC83AaM4'},
        {num:14,title:'LA FIN DU GANG DOUBLE ? :( GTAV RP #14',videoId:'s-wSTU9i1Lw'},
        {num:15,title:'LE GANG DOUBLE REVIENT EN FORCE ! GTAV RP #15',videoId:'B608R75HNfE'},
        {num:16,title:'C\'ETAIT TROP BEAU POUR ÊTRE VRAI ! RETOURNEMENT DE SITUATION ! GTAV RP #16',videoId:'Rb0XbQdD31g'},
        {num:17,title:'PERDU SEUL DANS LA FORÊT ENTOURÉ D\'ANIMAUX SAUVAGES ! GTAV RP #17',videoId:'vy_Ci-ctl-U'},
        {num:18,title:'TRAILER EPISODE FINAL DU GANG DOUBLE ! GTAV RP',videoId:'b8OeooNJ2lk'},
        {num:19,title:'LE PLUS GROS COUP DU GANG DOUBLE ! VENGEANCE ULTIME  - GTAV RP EPISODE FINAL',videoId:'cxtl5GTsmhE'},
        ],
    'Saison 2':[ 
            {num:20,title:'JE DOIS CHOISIR ENTRE LA FEMME DE MA VIE OU LE GANG DOUBLE ? GTAV RP SAISON 2 #1',videoId:'Eoo3Vpelub4'},
        {num:21,title:'JE RECONSTRUIS LE GANG DOUBLE DANS LE DOS DE MA FEMME - GTAV RP S2 #2',videoId:'u-c7OsaY62M'},
        {num:22,title:'LE GRAND JOUR , VOLER DES VOITURES QUI VALENT DES MILLIONS A DES HOMMES RICHES - GTAV RP S2 #3',videoId:'wbw-dOzIe7Q'},
        {num:23,title:'MA FEMME APPREND QUE J\'AI REFORMÉ LE GANG DOUBLE , VA-T-ELLE ME QUITTER ? GTAV RP S2 #4',videoId:'gyc2K4p3KG4'},
        {num:24,title:'LE JOUR DE LA PAYE , QUE LES CHOSES SÉRIEUSES COMMENCENT ! GTAV RP S2 #5',videoId:'7p01OcCJ62Y'},
        {num:25,title:'ON ME FAIT QUITTER LE GANG DOUBLE DE FORCE :\'( - GTAV RP S2 #6',videoId:'KiUrxBgYMRI'},
        {num:26,title:'DOUBLE C\'EST FINI ?! NON ! JAMAIS DE LA VIE ! EXPLICATON',videoId:'E02ICk8dnJc'},
        {num:27,title:'COMMENT ALEXANDRA S\'EST FAIT KIDNAPPER ? - GTAV RP S2',videoId:'AoKd1OPhb7I'},
        {num:28,title:'DAVID FLASH VA-T\'IL RÉINTÉGRER LE GANG DOUBLE ET SAUVER SA FEMME ? GTAV RP S2 #7',videoId:'VSlcPS0yUgY'},
        {num:29,title:'ALEXANDRA EST-ELLE MORTE ? DES GENS VEULENT DETRUIRE LE GANG DOUBLE ! GTAV RP S2 #8',videoId:'vGKQWWrEn5E'},
        {num:30,title:'ON SE FAIT PASSER POUR DES POLICIERS POUR S\'INFILTRER DANS LE COMMISSARIAT ! GTAV RP S2 #9',videoId:'48d6rARuXcc'},
        {num:31,title:'TRAILER EPISODE 10 ASSAUT DE LA PRISON FEDERAL ! GTAV RP',videoId:'op4u7AXMijM'},
        {num:32,title:'ON ATTAQUE LA PRISON FEDERALE ! GTAV RP #10',videoId:'zBLrb3oA5kY'},
        {num:33,title:'LE GRAND JOUR ! EVASION DE RAY DEFESSE ET DE BOUNDRIL ! GTAV S2 #11',videoId:'vWqf1P05D4k'},
        {num:34,title:'LE PLUS GRAND EVENEMENT DE LA VIE DE DAVID FLASH ! DOUBLE A ACCOMPLI L\'IMPOSSIBLE ! GTAV RP FINAL S2',videoId:'5OAmyfAAbu4'},
        ],  
    'HS 1':[ 
        {num:35,title:'J\'OUVRE MON ENTREPRISE D\'ARMES ILLEGALES - GTAV RP HS #1',videoId:'-28O2WxPClI'},
    ],  
    'Saison 3':[ 
        {num:36,title:'NOTRE MEILLEUR COUP ? LE GANG DOUBLE MILLIONNAIRE ? GTAV RP SAISON 3 #1',videoId:'FDsqTZf8eg4'},
        {num:37,title:'ALEXANDRA ET MON FILS MORTS ? UN NOUVEAU GANG NOUS MENACE ! GTAV RP S3 #2',videoId:'vDm9BvzsuAQ'},
        {num:38,title:'LE GANG SPINNER A ENCORE FRAPPE ! GTAV RP S3 #3',videoId:'VRDxUyr7vgI'},
        {num:39,title:'J\'AI PERDU TOUS LES MEMBRES DU GANG DOUBLE :( ! LE GANG SPINNER VEUT NOUS DETRUIRE ! GTAV S3 #4',videoId:'c1CqiTsd9tA'},
        {num:40,title:'JE PREPARE UN GROS PIEGE AU GANG SPINNER ! GTAV RP S3 #5',videoId:'sYAB_akUuV8'},
        {num:41,title:'J\'ARRETE LA SERIE DU GANG DOUBLE ! LES ABONNES PETENT UN CABLE !',videoId:'NUBlOdmIGg0'},
        {num:42,title:'LE GANG DOUBLE EN PRISON ? GTAV RP S3 #6',videoId:'molx0yNEUNM'},
        {num:43,title:'ON S\'INFILTRE DANS LE QG DU GANG SPINNER - GTAV RP S3 #7',videoId:'R6V_icHGkvc'},
        {num:44,title:'ON SE DEGUISE EN GANG SPINNER POUR RETROUVER LE BOSS ! GTAV RP S3 #8',videoId:'sbhbMxMIvMI'},
        {num:45,title:'LE GRAND JOUR , LE FACE A FACE AVEC LE CHEF SPINNER ! GTAV RP S3 #9',videoId:'2RRBgXB2aDQ'},
        {num:46,title:'LE CHEF SPINNER NOUS DEMANDE DE FAIRE L\'IMPOSSIBLE POUR SURVIVRE ! GTAV RP S3 #10',videoId:'Gf2Zbia3Dps'},
        {num:47,title:'RETOURNEMENT DE SITUATION , LE CHEF SPINNER VA LE REGRETTER ! GTAV RP S3 #11',videoId:'WbfH4Al6AeY'},
        {num:48,title:'LA FIN DU GANG SPINNER OU DU GANG DOUBLE ? EPISODE FINAL SAISON 3 ! GTAV RP #12',videoId:'djbhlQxN4RE'},
        ],  
    'HS 2':[ 
        {num:49,title:'DAVID FLASH SE LANCE DANS DU TRAFIC ILLÉGAL DANS UNE NOUVELLE VILLE ! GTAV RP',videoId:'urOab280d00'},
        {num:50,title:'DAVID FLASH DANS LE CAMPS DES FLICS ? GTAV RP LIVE #1',videoId:'BoAs8IN83xs'},
        {num:51,title:'J\'OUVRE ENFIN MON ENTREPRISE D\'ARMES ILLÉGAUX ! GTAV RP LIVE #2',videoId:'78TonPlT0dk'},
        {num:52,title:'A LA RECHERCHE DE PABLO KEY POUR RÈGLEMENT DE COMPTE  ! GTAV RP LIVE #2',videoId:'W02l-9kobMY'},
        {num:53,title:'GROS CONVOI DE CARGAISONS D\'ARMES ILLÉGALES PLUS DE 5 MILLIONS $  ! GTAV RP LIVE #4',videoId:'PYV2PNYudn8'},
        {num:54,title:'DAVID FLASH DEVIENT UN TUEUR A GAGE ! GTAV RP LIVE #5',videoId:'WLYvqz1wzK4'},
        {num:55,title:'MON PREMIER CONTRAT DE TUEUR A GAGE ! GTAV RP LIVE #6',videoId:'_knXty9Cv-A'},
        {num:56,title:'JE PRÉPARE UNE SURPRISE A MON AMI DOUME PAOLI POUR LES RETROUVAILLES ! GTAV RP LIVE #7',videoId:'MJOIpkzlIOc'},
        {num:57,title:'LE GRAND JOUR , DAVID FLASH TRAVAIL AVEC D\'AUTRE GANG ! GTAV RP LIVE #8 Partie1',videoId:'__8J5xGuEdE'},
        {num:58,title:'LE GRAND JOUR , DAVID FLASH TRAVAIL AVEC D\'AUTRE GANG ! GTAV RP LIVE #8 Partie2',videoId:'PCy6ACpY0XE'},
        ],  
    'Saison 4':[ 
        {num:59,title:'GANG DOUBLE SAISON 4 #1 - LA VÉRITÉ ! GTAV RP [COURT-MÉTRAGE]',videoId:'aqqLKLpwgUg'},
        {num:60,title:'GANG DOUBLE #2 S4 - LA FEMME MYSTÉRIEUSE - GTAV RP [COURT-MÉTRAGE]',videoId:'nNPojO9fZFc'},
        {num:61,title:'DAVID FLASH VA REFORMER LE GANG DOUBLE ! GTAV RP #3 SAISON 4',videoId:'OGhPP6Fb_Us'},
        {num:62,title:'OPÉRATION BRAQUAGE DE BANQUE SOUS TERRAIN - GTAV RP #4 [GANG DOUBLE]',videoId:'UKT4XRH0ZmU'},
        {num:63,title:'LES CHOSES SÉRIEUSES COMMENCENT ! PIRATAGE SYSTÈME CAMERA ! GTAV RP #5',videoId:'FOd15vE2u7c'},
        {num:64,title:'GROS BRAQUAGE DE LA BANQUE CENTRAL PAR SOUS TERRAIN ! GTAV RP #6',videoId:'cSkKh59QQAU'},
        {num:65,title:'DAVID FLASH A FAIT L\'IMPOSSIBLE MAIS SA MALADIE LE MENACE ! GTAV RP #7',videoId:'iK5E34WF5uI'}
    ] 
  }},
        { id:'john-flash', name:'John Flash', image:'images/letigrebl/john.webp', banner:'images/letigrebl/john-bannière.webp',
          description:'Pilote clandestin devenu le plus grand criminel du continent, il a bâti un empire colossal après avoir découvert la vérité sur ses origines. Solitaire et déterminé comme le loup, il a transformé ses tragédies personnelles en une soif de pouvoir absolue, régnant sans partage jusqu\'à la transmission de son héritage.',
          seasons:{
    'Saison 1':[
        {num:1,title:'LES BOSS DES RUES ! GTAV RP #1',videoId:'NGjgos92uSU'},
        {num:2,title:'MA PREMIERE COURSE DE RUE AVEC MA NOUVELLE VOITURE ! GTAV RP #2',videoId:'5u8ihEBUOP8'},
        {num:3,title:'LE FACE A FACE AVEC DAVID FLASH ! GTAV RP #3',videoId:'gtGflOqqt6c'},
        {num:4,title:'LE PIRE CAUCHEMAR DE JOHN LEWIS  ! GTAV RP #4',videoId:'x9rM5-rIFgE'},
        {num:5,title:'L\'EVASION DE JOHN LEWIS ! LA FIN DE DAVID FLASH ? GTAV RP #5',videoId:'PltSSkJoBQY'},
        {num:6,title:'JE SUIS AU BOUT DE MA VIE ! GTA V RP #6',videoId:'rD_7_5fj-tM'},
        {num:7,title:'SUIVRE LES PAS DE SON PERE ! GTAV RP #7',videoId:'fnUvrpOg85U'},
        {num:8,title:'JOHN FLASH EST ENFIN PRET POUR SE VENGER ! GTAV RP #8',videoId:'bxwYVN3Ypy4'},
        {num:9,title:'JOHN FLASH VS THE KING OF STREET DUEL EPISODE FINAL SAISON 1 - GTAV RP #9',videoId:'sA4ZOLRI6wQ'},
    ],
    'Saison 2 Partie 1':[ 
        {num:10,title:'LES BOSS DES RUES ! GTAV RP #1 SAISON 2',videoId:'CCXaXnwWPFA'},
        {num:11,title:'LE RETOUR DE JOHN FLASH ! GTAV RP #1',videoId:'nbpTl-8ElhA'},
        {num:12,title:'ON A REÇUS DU LOURRDD ! GTAV RP #2',videoId:'90a3VGU3Tmk'},
        {num:13,title:'ON A LA FOULE AU CONCESSIONNAIRE ! :o GTAV RP LIVE FR',videoId:'giNlhqB3QMI'},
        {num:14,title:'OMG ON PASSE AU CHOSE SÉRIEUSE AU CONCESSIONNAIRE :o GTAV RP LIVE FR',videoId:'cASimC-eWwo'},
        {num:15,title:'ON EST DÉBORDÉ :O GTAV RP LIVE FR',videoId:'rkOn4HBiL8s'},
        {num:16,title:'OMG REGARDEZ NOTRE TOUT NOUVEAU VÉHICULE DE FONCTION :O GTAV RP LIVE FR',videoId:'dnvHQnoBEH4'},
        {num:17,title:'CE SOIR ON ORGANISE NOTRE PLUS GRAND EVÉNEMENT ! GTAV RP LIVE FR',videoId:'I-N9H34oqVM'},
        {num:18,title:'ON CONTINUE LE BUSINESS ! GTAV RP LIVE FR',videoId:'e-MtFqChIVY'},
        {num:19,title:'J\'AI DROGUE UNE FEMME + GARRY A VOLE TOUT L\'ARGENT DE L\'ENTREPRISE ! GTAV RP LIVE FR',videoId:'nq4mg6SQtUA'},
        {num:20,title:'JOHN FLASH A LA RECHERCHE DE L\'AMOUR + NOUVELLE VOITURE  ! GTAV RP LIVE FR',videoId:'tzjjR7vUrQU'},
        {num:21,title:'JOHN FLASH - UN AMOUR IMPOSSIBLE ?! GTAV RP LIVE FR',videoId:'HQrb853E2ZQ'},
        {num:22,title:'LA VILLE EST OUVERTE POUR TOUT LE MONDE :O ! GTAV RP LIVE FR',videoId:'BEhRxdWcNAs'},
        {num:23,title:'ANGEL M\'A TROMPE :\'( ! GTAV RP LIVE FR',videoId:'YCNXVxQv1RA'},
        {num:24,title:'QU\'EST-CE QUI SE CACHE DANS CETTE MINE ? GARRY TRAUMATISE ! GTAV RP LIVE FR',videoId:'QtcppzPyYvA'},
        {num:25,title:'ON DOIT RETROUVER ANGEL ! ON PASSE AU CHOSE SÉRIEUSES  ! GTAV RP LIVE FR',videoId:'aA_nMNRhVDI'},
        {num:26,title:'JE VAIS CHERCHER DE LA COKE POUR LA VICE PRÉSIDENTE ! GTAV RP LIVE FR',videoId:'PEAtvzOUFMA'},
        {num:27,title:'JE RISQUE DE PERDRE ANGEL :S ! GTAV RP LIVE FR',videoId:'OKr_qeGR2f8'},
        {num:28,title:'LA VICE PRÉSIDENTE DANS MON LIT :O !!!! WTF !!!! GTAV RP LIVE FR',videoId:'edx_TGlbkhY'},
        {num:29,title:'LA VICE PRÉSIDENTE ENCEINTE DE MOI , ANGEL SE DOUTE DE QUELQUE CHOSE ! GTAV RP LIVE FR',videoId:'r47yf3T2qE8'},
        {num:30,title:'ANGEL VEUT TUER MON FILS ET LA VICE PRÉSIDENTE ! GTAV RP LIVE FR',videoId:'23WTYkv6Hho'},
        {num:31,title:'LA MORT DE JOHN FLASH ?',videoId:'YJPf8vjD20k'},
        {num:32,title:'LA FIN DE JOHN FLASH ?! GTAV RP LIVE FR',videoId:'FBhW9KNyTyU'},
        {num:33,title:'LE FACE A FLASH ! GTA V RP ! EXCLU !',videoId:'1uftSWQ73-0'},
        {num:34,title:'LE FACE A FACE ? GTAV RP EXCLU',videoId:'tOOXC0Bthkw'},
        {num:35,title:'SA VA PARTIR EN CACAHUÈTE ? GTAV RP EXCLU',videoId:'NWpRrc2kZYU'},
        {num:36,title:'A LA RECHERCHE DE ANGEL POUR LUI DIRE LA VÉRITÉ SUR GARRY ! GTAV RP EXCLU',videoId:'1ztTH5xkN4o'},
        {num:37,title:'DAVID FLASH VS HENRIC PEPITO !',videoId:'UnVzdySCGqQ'},
        {num:38,title:'L\'ETAPE LA PLUS DURE POUR JOHN FLASH ! GTAV RP LE FILM !',videoId:'U3Ri989csgQ'},
        {num:39,title:'LE GRAND JOUR , LE MARIAGE DE JOHN ET ANGEL + NOUVEAU DÉPART ! GTAV RP FR',videoId:'Rzp_pvHW2tE'},
        {num:40,title:'LE GRAND JOUR , LE MARIAGE DE JOHN ET ANGEL + NOUVEAU DÉPART ! GTAV RP FR',videoId:'kTPMvBA0WMI'},
        {num:41,title:'NOUVELLE VIE POUR JOHN ET ANGEL ! GTAV RP FR',videoId:'JV6rFr94SgE'},
        {num:42,title:'JE SUIS L\'HOMME LE PLUS RECHERCHE DE LA VILLE ! GTAV RP FR',videoId:'9ibAfbEmuOk'},
        {num:43,title:'ANGEL EN PRISON A CAUSE DE MOI ! GTAV RP FR',videoId:'ik33GFgcNnc'},
        {num:44,title:'FAIRE DU PROPRE ET EN MÊME TEMPS DU SALE ! GTAV RP ! FR',videoId:'u7X8Y7nifdI'},
        {num:45,title:'ANGEL ENCEINTE OU PAS !?? GTAV RP FR',videoId:'LDqKxks9s5Q'},
        {num:46,title:'ENJOY LIFE VA ETRE DÉTRUIT PAR UNE MÉTÉORITE ! GTAV RP FR',videoId:'5SHFBQsHHa8'},
        {num:47,title:'ANGEL M\'A T\'ELLE VRAIMENT TRAHI ET TROMPE ? JE MÈNE MON ENQUÊTE ! GTAV RP FR',videoId:'YXAuNZnDCmI'},
        {num:48,title:'JOHN FLASH TRAVAILLE AVEC LE GANG DOUBLE ?! GTAV RP FR',videoId:'MuojJf0T3rA'},
        {num:49,title:'ON VA FAIRE DU SALE ! GTAV RP FR',videoId:'qywY-FFFaK4'},
        {num:50,title:'JE LANCE MA DROGUE MOUKATE ! ! GTAV RP FR',videoId:'RTE2VHCEZ7w'},
        {num:51,title:'ON VA FAIRE LE PLUS GROS BRAQUAGE DU SIÈCLE ! LA CASA DE PAPEL ! GTAV RP FR',videoId:'IWG6SuyCsf0'},
        {num:52,title:'J\'INSTALLE UN TRACEUR SUR ANGEL POUR L\'ESPIONNER ET SAVOIR LA VÉRITÉ ! GTAV RP FR',videoId:'xwI3qnGVgeY'},
        {num:53,title:'MA VILLE A ÉTÉ DETRUITE ! ON VA LA RÉPARER ! GTAV RP FR',videoId:'o5LuP-Ur50A'},
        {num:54,title:'ANGEL A DISPARU ! GTAV RP FR',videoId:'c_VhhL0qCYc'},
        {num:55,title:'ON COMMENCE LES GROS TRAVAUX + ANGEL TOUJOURS PORTÉE DISPARUE  ! GTAV RP FR',videoId:'0mk1Nyvxpl8'},
        {num:56,title:'GROSSE ANNONCE + RETOUR DE LA SAISON 2 JOHN FLASH ! GTAV RP FR',videoId:'6DbUdI8_uAI'},
        {num:57,title:'JOHN FLASH SAISON 2 TRAILER OFFICIEL !',videoId:'oui8-7oH-Y8'},
        ],
    'Saison 2 Partie 2':[ 
        {num:58,title:'LA MORT D\'ANGEL ?! GTAV RP SAISON 2 #1',videoId:'P04hXwK0YzM'},
        {num:59,title:'GARRY A T\'IL TUE JOHN FLASH ?',videoId:'lUnQHvJy-jM'},
        {num:60,title:'ENFERME DANS UN CONTENEUR ! ANGEL MORTE ? GTAV RP SAISON 2 #2',videoId:'bmIJqQi96yQ'},
    ],
    'Saison 3':[ 
        {num:61,title:'JOHN FLASH EN PRISON ! GTAV PRISON RP #1',videoId:'ne9HX6WNgXs'},
        {num:62,title:'LES ANCIENS NOUS VEULENT DU MAL ! GTAV PRISON RP #2',videoId:'zDTgyQCDSW0'},
    ]
    }},
        { id:'ken-flash', name:'Ken Flash', image:'images/letigrebl/ken.webp', banner:'images/letigrebl/ken-bannière.webp',
          description:'Ancien policier devenu criminel par choix, il a repris le flambeau familial pour transformer un gang en une équipe de héros protecteurs. Puissant et déterminé comme le dragon, il a fini par donner sa vie dans un sacrifice ultime pour offrir une chance de paix à ses enfants et au monde.', 
          seasons:{
    'Saison 1 Partie 1':[
        {num:1,title:'QUI EST KEN FLASH ?! GTAV RP ADASTRA 450 SLOTS ! FR',videoId:'exCu9-AzaKs'},
        {num:2,title:'JE DEVIENS VIDEUR ! GTAV RP ADASTRA 450 SLOTS ! FR',videoId:'h_DWnfYPTeg'},
        {num:3,title:'JE VAIS ME FAIRE PASSER POUR UN HOMME RICHE #3 ! GTAV RP - 450 PERSONNES ! FR',videoId:'3Dx5NEwvXy8'},
        {num:4,title:'QU\'ES QUE GIUILIA ME CACHE ? KEN EST AMOUREUX ! FR',videoId:'HReMsKluyJ4'},
        {num:5,title:'QU\'ES QUE GIUILIA ME CACHE ? KEN EST AMOUREUX ! FR',videoId:'jlhhq90wAjQ'},
        {num:6,title:'GIULIA ME TROUVE TROP JEUNE :( ! JE VAIS LUI PROUVER QUE JE SUIS UN HOMME GTAV RP! FR #ROADTO700K',videoId:'RqgzYFw9WdE'},
        {num:7,title:'[PART1] UN GANG ME PROPOSE DU BOULOT SALE ! GIULIA NE DOIT PAS LE SAVOIR ! GTAV RP! FR #ROADTO700K',videoId:'df-zdoTbHkY'},
        {num:8,title:'[PART2] UN GANG ME PROPOSE DU BOULOT SALE ! GIULIA NE DOIT PAS LE SAVOIR ! GTAV RP! FR #ROADTO700K',videoId:'Mss5cVx3Kxk'},
        {num:9,title:'J\'AI POSE UN LAPIN A GIULIA :S ! GTAV RP ADASTRA #7  ! FR #ROADTO700K',videoId:'0Gj0b_7EA34'},
        {num:10,title:'KEN VA T\'IL AVOUER SES SENTIMENTS A GIULIA ?! GTAV RP ADASTRA #8  ! FR #ROADTO700K',videoId:'lHDG3wu6Als'},
        {num:11,title:'UN AMOUR IMPOSSIBLE ?! GTAV RP  #9  ! FR #ROADTO700K',videoId:'7t6PbzYYVMI'},
        {num:12,title:'GIULIA ET KEN , UN VRAI AMOUR   ! GTAV RP  #10  ! FR #ROADTO700K',videoId:'LxX9SXnVK8k'},
    ],
    'Saison 1 Partie 2':[
        {num:13,title:'GIULIA OU ES TU ?! EPISODE CINÉMATIQUE  GTAV RP  SAISON 2 #1  ! FR #ROADTO700K',videoId:'bOsjL7cTDsQ'},
        {num:14,title:'KEN VA SE VENGER !  GTAV RP  SAISON 2 #2  ! FR #ROADTO700K',videoId:'R0sz-GPwZUE'},
        {num:15,title:'QUI EST CETTE FEMME MYSTÉRIEUSE ?!  GTAV RP  SAISON 2 #3  ! FR #ROADTO700K',videoId:'wEC298AlC1o'},
        {num:16,title:'[PART1] GIULIA ENCORE EN VIE ?! JE VAIS A SA RECHERCHE ! GTAV RP  SAISON 2 #4  ! FR #ROADTO700K',videoId:'v3Zxpnh1p4U'},
        {num:17,title:'[PART2] GIULIA ENCORE EN VIE ?! JE VAIS A SA RECHERCHE ! GTAV RP  SAISON 2 #4  ! FR #ROADTO700K',videoId:'JLzqnanJvXs'},
        {num:18,title:'GIULIA M\'A OUBLIÉ :\'( ! GTAV RP #5  ! FR #ROADTO700K',videoId:'Mo33-wJW6pw'},
        {num:19,title:'DAVID FLASH VS KEN FLASH ! LE FACE A FACE ! GTAV RP #6',videoId:'Ir86G35BFZ4'},
        {num:20,title:'GIULIA V\'A T\'ELLE SE SOUVENIR DE KEN ?   - GTAV RP #7 FR',videoId:'Lo9Xe_kGVkg'},
        {num:21,title:'KEN PREND UN PEU DE TEMPS POUR RÉFLÉCHIR - GTAV RP #8 FR',videoId:'f4Rv1iK3TO4'},
        ],
    'Saison 1 Partie 3':[
        {num:22,title:'KEN FLASH IS BACK ! GTAV RP !',videoId:'rFiVADIGAYw'},
        {num:23,title:'GIULIA ET KEN AU SEPTIÈME CIEL ! GTA V RP #2',videoId:'yR-scoxR2os'},
        {num:24,title:'ON COMMENCE NOTRE BUSINESS  ! GTA V RP #3',videoId:'SMycS7_b4_4'},
        {num:25,title:'CE SOIR ON VA PRENDRE DES RISQUE ! GTA V RP #4',videoId:'u1Z_0niFnmg'},
        {num:26,title:'GIULIA ET KEN UN AMOUR PAS COMME LES AUTRES ! GTA V RP #5',videoId:'J971vE3MALY'},
        {num:27,title:'KEN EST PERDU  ! GTA V RP #6',videoId:'Je-eB9H0FbA'},
        {num:28,title:'[REDIF] KEN VA BRAQUER DES BANQUES CE SOIR ! GTAV RP',videoId:'AWyH0A1GTx8'},
        {num:29,title:'KEN FLASH VS AGENT X ! GTAV RP !',videoId:'5XIFuAouWrk'},
        {num:30,title:'KEN FLASH SUR LES TRACE DE SON PÈRE ! GTAV RP',videoId:'m5ccmRJATzQ'},
        {num:31,title:'KEN FLASH L’HÉRITAGE DE DAVID FLASH ! GTAV RP',videoId:'qEPtPfjuSVs'},
        {num:32,title:'KEN A FAIT UNE CONNERIE  ! GTAV RP',videoId:'opbsib6F-e4'},
        {num:33,title:'KEN VS LE BRAQUAGE DU SIÈCLE ! GTAV RP !',videoId:'gCPAHoQMBYE'},
        {num:34,title:'KEN FLASH REPREND DU SERVICE ! INFILTRATION ! GTAV RP',videoId:'F9eeI6bn1DM'},
        {num:35,title:'KEN FLASH RECHERCHER PAR L’ARMÉE ! GTAV RP',videoId:'gHNKOLezRCQ'},
        {num:36,title:'KEN FLASH LE MYTHOMANE (c\'est une maladie donc) ! GTAV RP',videoId:'HWCio9jU6_w'},
        {num:37,title:'KEN FLASH LE MYTHOMANE (c\'est une maladie donc) ! GTAV RP',videoId:'dOMQzDzLjS8'},
        {num:38,title:'KEN FLASH LE MYTHOMANE (c\'est une maladie donc) ! GTAV RP',videoId:'sbymrOkKz3c'},
        {num:39,title:'KEN FLASH PROMU DANS L’ARMÉE GTAV RP',videoId:'Mdiyz9pGG5c'},
        {num:40,title:'ABY MA FRIENDZONE ! GTAV RP',videoId:'9sLakZ-lDH8'},
        {num:41,title:'ABY MA FRIENDZONE ! GTAV RP',videoId:'1n6iywBWM3M'},
    ],
    'Saison 1 Partie 4':[
        {num:42,title:'LA MALADIE DE KEN FLASH ! GTA V RP ! by iProMx #1',videoId:'pJaNjitlPrs'},
        {num:43,title:'L\'ETAT DE KEN FLASH S\'EMPIRE ! GTA V RP ! by iProMx #2',videoId:'68ueJGE17Fk'},
        {num:44,title:'KEN FLASH RECHERCHE PAR TOUTE LA VILLE ! GTA V RP ! by iProMx #3',videoId:'URF-z5UP34I'},
        {num:45,title:'KEN FLASH ASSISTE A SA PROPRE ENTERREMENT ! GTA V RP ! by iProMx #4',videoId:'wPc_o9Hf72w'},
        {num:46,title:'KEN FLASH BIENTOT PAPA ?! GTA V RP ! by iProMx #5',videoId:'N63XpjYrYu4'},
        {num:47,title:'NOUVELLE IDENTITE POUR KEN FLASH ! GTA V RP ! by iProMx #6',videoId:'1nivt1UBPT4'},
        {num:48,title:'PART 1 - KEN FLASH VS PACO ! RETROUVAILLE ! GTA V RP ! by iProMx #7',videoId:'yohgteo6JJw'},
        {num:49,title:'PART 2 - KEN FLASH VS PACO ! RETROUVAILLE ! GTA V RP ! by iProMx #8',videoId:'rtzAQuJftUg'},
        {num:50,title:'LE RETOUR DE KEN FLASH ! NOUVELLE VILLE ! NOUVELLE VIE ! GTA V RP ! by iProMx #9',videoId:'HImjSIoumxU'},
        {num:51,title:'KEN FLASH ACHETE L\'HOPITAL ! RETROUVAILLES AVEC ALESSA ! GTA V RP ! by iProMx #10',videoId:'bo9BEeLzAZU'},
        {num:52,title:'KEN FLASH ET LA DROGUE DE SON PERE ! GTA V RP ! by iProMx #11',videoId:'byEsbbvs7IM'},
        {num:53,title:'KEN FLASH , LA FORTUNE ! GTAV RP #1 SAISON FINALE !',videoId:'k29gTJH9Llw'},
        {num:54,title:'KEN FLASH GERE LA DROGUE MOUKATE ! GTA V RP ! by iProMx #12',videoId:'PJb9TOKZOH0'},
        {num:55,title:'KEN ACHETE DES ARMES ! GTA V RP ! by iProMx #13',videoId:'MjHWbOTvBIQ'},
        {num:56,title:'KEN, TITEUF ET JUAREZ FONT UNE SOIRÉE DANS LEUR VILLA ! GTA V RP ! by iProMx #14',videoId:'OZ7iTCeedt4'},
        {num:57,title:'KEN FLASH SUR LES PAS DE JOHN FLASH ! GTA V RP ! by iProMx #15',videoId:'tfyN6pbl1Cw'},
        {num:58,title:'KEN FLASH BOMBARDE LA VILLE ! GTA V RP ! by iProMx #16',videoId:'qFnB878QQ4w'},
        {num:59,title:'KEN FLASH, UN AMOUR IMPOSSIBLE ?! GTA V RP ! by iProMx #17',videoId:'-42cYApGrKU'},
        {num:60,title:'KEN FLASH VS. GANG ! GTA V RP ! by iProMx #18',videoId:'QhYpaIsTwZ0'},
        {num:61,title:'L\'EMPIRE DE KEN FLASH ! GTA V RP ! by iProMx #19',videoId:'DBgJTIwIkJ8'},
        {num:62,title:'GIULIA SAUVE KEN FLASH ! GTA V RP ! by iProMx #20',videoId:'dmE6lV3NTKI'},
        {num:63,title:'BRAQUAGE DU SIECLE ! GTA V RP ! by iProMx #21',videoId:'Mkyc3mvqVfA'},
        {num:64,title:'KEN ET GIULIA, LE FACE A FACE ! GTA V RP ! by iProMx #22',videoId:'rzkBgMKQCTA'},
        {num:65,title:'KEN FLASH, LE DRAGON ! GTA V RP ! by iProMx #23',videoId:'vqBovrASPIU'},
        {num:66,title:'LA REPRISE DU GANG DOUBLE ! GTA V RP ! by iProMx #24',videoId:'GHaSDqr2QG4'},
        {num:67,title:'LA TRAHISON D\'ESTEBAN ! GTA V RP ! by iProMx #25',videoId:'PjKSfA0cyd4'},
        {num:68,title:'LE MESSAGE DE DAVID FLASH ! GTA V RP ! by iProMx #26',videoId:'54A7cJ42RiQ'},
        {num:69,title:'LEILA ENCEINTE ?! KEN ABANDONNE GIULIA ?! GTA V RP ! by iProMx #27',videoId:'-WnDe5Vb73E'},
        {num:70,title:'KEN ET GIULIA, UN AMOUR EN RECONSTRUCTION ?! GTA V RP ! by iProMx #28',videoId:'hDdnjYoOAwA'},
        {num:71,title:'KEN FLASH ENCORE PAPA ?! GTA V RP ! by iProMx #29',videoId:'W8abCxQrz-0'},
        {num:72,title:'KEN FLASH ENFIN PAPA ?! LA RELEVE ! GTA V RP ! by iProMx #30',videoId:'C4jeRu8P_J0'},
        {num:73,title:'L\'ANNONCE DE GIULIA ! GTA V RP ! by iProMx #31',videoId:'LU7LwmByuTQ'},
        {num:74,title:'LA MORT DE DERECK MCCALISTER ! GTA V RP ! by iProMx #32',videoId:'VzuyMcDoz_4'},
        {num:75,title:'KEN FLASH RECHERCHE PAR TOUTE LA VILLE ! 1 MILLION DE PRIME ! GTA V RP ! by iProMx #33',videoId:'rHjQ-Njhlfg'},
        {num:76,title:'LES FAMILLIES A TRAVERS DE DOUBLE 2.0 ! GTA V RP ! by iProMx #34',videoId:'9fFKnzrdQ3Y'},
        {num:77,title:'LA PRIME S\'ELEVE A 5 MILLIONS ! GTA V RP ! by iProMx #35',videoId:'jSTPbDtS1rE'},
        {num:78,title:'LEILA ACCOUCHE ?! GTA V RP ! by iProMx #36',videoId:'ExolwJX7iVA'},
        {num:79,title:'LA MORT DE KEN FLASH (ou pas) ?! GTA V RP ! by iProMx #37',videoId:'YxgfKEe5KKI'},
        {num:80,title:'DAVID, JOHN ET KEN, LE FACE A FACE ! GTA V RP ! by iProMx #38',videoId:'BaTvecWl2wk'},
        {num:81,title:'KEN FLASH ! LA FINALE ! GTA V RP ! by iProMx #39',videoId:'YdjwSdIcesI'},
    ],
    'Saison 2':[
        {num:82,title:'LE RETOUR DE KEN FLASH ! GTA V RP ! by iProMx #1 S2',videoId:'UOjLYusF2ls'},
        {num:83,title:'LES NOUVEAUX POUVOIRS DU DRAGON ! GTA V RP ! by iProMx #2 S2',videoId:'OJ5JqkbRg_w'},
        {num:84,title:'KEN FLASH VS LE JUGE ! GTA V RP ! by iProMx #3 S2',videoId:'S-S3iqsVPMg'},
        {num:85,title:'KEN FLASH LA DERNIÈRE PRÉPARATION ! GTA V RP ! by iProMx #4 S2',videoId:'4qfjyCL3t9A'},
        {num:86,title:'KEN FLASH CONTRÔLE LA LSPD + BRAQUAGE ! 120 000 000 PRIME ! GTA V RP ! by iProMx #5 S2',videoId:'0HBwBKfY95M'},
        {num:87,title:'KEN FLASH VS DAVID JR ! 300 000 000 PRIME ! GTA V RP ! by iProMx #6 S2',videoId:'d8_pu_G3Yyk'},
        {num:88,title:'KEN FLASH UN MÉCHANT HÉRO ?! GTA V RP ! by iProMx #7 S2',videoId:'21tNh6lcIww'},
        {num:89,title:'LA FIN DE KEN FLASH ?! GTA V RP ! by iProMx #8 S2',videoId:'dAFbobin9X0'},
        {num:90,title:'KEN FLASH DERNIER JOUR AVANT LE GRAND DÉPART ?! GTA V RP ! by iProMx #9 S2',videoId:'oEap9q-vAH4'},
        {num:91,title:'KEN FLASH DERNIER JOUR AVANT LE GRAND DÉPART ?! GTA V RP ! by iProMx #9 S2',videoId:'oEap9q-vAH4'},
        {num:92,title:'KEN FLASH, LES ADIEUX ! GTA V RP ! by iProMx #10 S2',videoId:'4L92knQnHf8'},
    ]
},},
        { id:'aaron-flash', name:'Aaron Flash', image:'images/letigrebl/aaron.webp', banner:'images/letigrebl/aaron-bannière.webp',
          description:'Guerrier au destin tragique devenu roi et protecteur, il a surmonté les trahisons et les pertes pour reconstruire un futur de paix. À l\'image du phénix, il renaît sans cesse de ses cendres pour guider ses fils et affronter ses ennemis, jusqu\'à son ultime sacrifice.',
          seasons:{
    'Saison 1':[
        {num:1,title:'AARON FLASH, LE DERNIER FLASH ! by iProMx #1',videoId:'IyfrWC0DcuI'},
        {num:2,title:'QUI EST VRAIMENT AARON ?! GTA V RP ! by xTremX #2',videoId:'zOBogDfx0Gk'},
        {num:3,title:'AARON FLASH COMMENCE LE BUISNESS ! GTA V RP ! by iProMx #3',videoId:'CjbVW1-TguI'},
        {num:4,title:'AARON FLASH LE PLUS GROS ESCRO DE LS ! GTA V RP ! by iProMx #4',videoId:'MfVts80spNU'},
        {num:5,title:'AARON, UN GRAND MANIPULATEUR ! GTA V RP ! by iProMx #5',videoId:'_FX1fMB7jSY'},
        {num:6,title:'AARON FLASH VS DAVID JR ! GTA V RP ! by iProMx #6',videoId:'eY10iiqTyP8'},
        {num:7,title:'AARON FLASH CONTRÔLE LE PHOENIX ! GTA V RP ! by iProMx #7',videoId:'LYTJJl27l5o'},
        {num:8,title:'AARON FLASH CONTRÔLE LE PHOENIX ! GTA V RP ! by iProMx #8',videoId:'WBhQ6ddycYY'},
        {num:9,title:'REUPLOAD : AARON DELIVRE LE PHOENIX EN LUI POUR NINA ! GTA V RP ! by iProMx #9',videoId:'4Dzdg4jyv4c'},
        {num:10,title:'AARON DELIVRE LE PHOENIX EN LUI POUR NINA ! GTA V RP ! by iProMx #9',videoId:'kYzqCapy3yk'},
        {num:11,title:'AARON DOIT REMETTRE DAVID JR SUR LE DROIT CHEMIN ! GTA V RP ! by xTremX #10',videoId:'uUE_n5VgkqU'},
        {num:12,title:'L\'HERITAGE DE AARON FLASH ! GTA V RP ! by iProMx #11',videoId:'7TYSkSybH6U'},
        {num:13,title:'LA FORTUNE D\'AARON FLASH ! GTA V RP ! by iProMx #12',videoId:'jP0E4KoT448'},
        {num:14,title:'AARON FLASH A TUÉ SON MEILLEUR AMI ! GTA V RP ! by iProMx #13',videoId:'xo8-CkkxKxo'},
        {num:15,title:'AARON FLASH RISQUE DE PERDRE SA SOEUR ! GTA V RP ! by iProMx #14',videoId:'N7VJudtTjwU'},
        {num:16,title:'AARON COMMENCE LE SALE ! GTA V RP ! by iProMx #15',videoId:'U82-lWMexuA'},
        {num:17,title:'AARON RISQUE DE MOURIR ! GTA V RP ! by iProMx #16',videoId:'dQVEbx5Ru-I'},
        {num:18,title:'AARON FLASH, LE PROJET FAST AND FURIOUS ! GTA V RP ! by iProMx #17',videoId:'EIVvUMImZi8'},
        {num:19,title:'AARON FLASH, LE PLUS GROS MANIPULATEUR ! GTA V RP ! by iProMx #18',videoId:'OG5-zTmEvms'},
        {num:20,title:'AARON FLASH BRAQUAGE A LA FAST AND FURIOUS ! GTA V RP ! by iProMx #19',videoId:'iSYWPj7y9Kk'},
        {num:21,title:'AARON FLASH LA GUERRE DES CREW ! GTA V RP ! by iProMx #20',videoId:'9E-KUOKwijc'},
        {num:22,title:'AARON FLASH x DAVID FLASH ! GTA V RP ! by iProMX #21',videoId:'HK-0mZJ2j1A'},
        {num:23,title:'ATTAQUE D\'UN CONVOI DE PLUS DE 100 MILLION DOLLARD ! GTA V RP ! by iProMx #22',videoId:'BZ1KjzJYikg'},
        {num:24,title:'LE JUGEMENT D\'AARON FLASH ! GTA V RP ! by iProMx #23',videoId:'OUwC9i0pF8I'},
        {num:25,title:'L\'EVASION DE AARON FLASH ?! GTA V RP ! by iProMx #24',videoId:'C3F71ZbVYJQ'},
        {num:26,title:'AARON FLASH EN CAVALE ! GTA V RP ! by iProMx #25',videoId:'k4QEthZU4x0'},
        {num:27,title:'LA VENGEANCE D\'AARON FLASH ! GTA V RP ! by iProMx #26',videoId:'8or0Ct5pyr8'},
        {num:28,title:'LE RETOUR DU PHOENIX ?! GTA V RP ! by iProMx #27',videoId:'k_6sNmK2bf8'},
        {num:29,title:'AARON FLASH X FBI ! GTA V RP ! by iProMx #28',videoId:'6s_ZL-j-HKM'},
        {num:30,title:'AARON VS L’IMPOSSIBLE ! GTA V RP ! by iProMx#29',videoId:'Oph8tJni4YI'},
        {num:31,title:'AARON VS DAVID JR, LA SUITE ! GTA V RP ! by iProMx #30',videoId:'y--ZpaoYWoo'},
        {num:32,title:'AARON FLASH INVITE AGENT MOOR ! GTA V RP ! by iProMx #31',videoId:'4fLibEAD9ps'},
        {num:33,title:'AARON FLASH INVITE AGENT MOOR ! GTA V RP ! by iProMx #32',videoId:'2GmWGUrN518'},
        {num:34,title:'AARON TRACE SA SOEUR ! GTA V RP ! by iProMx #33',videoId:'tPNQFOHm9F4'},
        {num:35,title:'AARON A FAIT UNE CONNERIE AVEC AGENT MOOR ! GTA V RP ! by iProMx #34',videoId:'l-j5ccNDO64'},
        {num:36,title:'AARON FLASH CONTRÔLE LA FBI ! GTA V RP ! by iProMx #35',videoId:'Dz3SD_qlxA8'},
        {num:37,title:'AARON FLASH VS LE JUGE ! GTA V RP ! by iProMx #36',videoId:'_nSYg08OoQI'},
        {num:38,title:'AARON FLASH EN DANGER ! GTA V RP ! by iProMx #37',videoId:'-bdYJBbZotQ'},
        {num:39,title:'UNE IDÉE QUI PEUT FAIRE TRÈS MAL ! GTA V RP ! by iProMx #38',videoId:'dgUCoj5xuq4'},
        {num:40,title:'AARON FLASH -  LE MORT VIVANT ! LA VÉRITÉ VA FAIRE MAL ! GTA V RP ! by iProMx #39',videoId:'E6-HshF4iq0'},
        {num:41,title:'SEUL CONTRE TOUS ! GTA V RP ! by iProMx #40',videoId:'2avKYxsYpTU'},
        {num:42,title:'AARON FLASH VS BUNNY ! GTA V RP ! by iProMx #41',videoId:'hFqD0MnIJ34'},
        {num:43,title:'DAVID JR MENACE BALTAZAR ! GTA V RP ! by xTremX #42',videoId:'t_zkjzrYZMM'},
        {num:44,title:'AARON FLASH PIÉGÉ PAR DAVID JR ! GTA V RP ! by iProMx #43',videoId:'fs7eCo_21yc'},
        {num:45,title:'AARON FLASH INFECTÉ ! GTA V RP ! by iProMx #44',videoId:'q-7uBhKKebA'},
        {num:46,title:'AARON FLASH - BRAQUAGE ! GTA V RP ! by iProMx #45',videoId:'-L8dRlRTJHI'},
        {num:47,title:'80 MILLION DE PRIME SUR LA TÊTE D\'AARON ! GTA V RP ! by iProMx #46',videoId:'mqNHGyASQv4'},
        {num:48,title:'AARON FLASH VS DAVID JR ! FINAL by iProMx #47',videoId:'42n3P_OU15I'},
    ],
    'Saison 2':[
        {num:49,title:'LA BATAILLE FINAL DES FLASH ! GTA V RP ! by iProMx #11 S2',videoId:'9iO1wJlbbOY'},
        {num:50,title:'AARON FLASH ENTERREMENT VIE DE GARÇON ! GTA V RP ! by iProMx #12 S2',videoId:'1Je_ursKS20'},
        {num:51,title:'AARON DANS LE MAL ! GTA V RP ! by iProMx #13 S2',videoId:'-JHXDrD99nE'},
        {num:52,title:'LE MARIAGE D\'AARON ET NINA ! GTA V RP ! by iProMx #14 S2',videoId:'2rJB3cCv9as'}
    ]
}, },
        { id:'david-jr-flash', name:'David Jr Flash', image:'images/letigrebl/davidjr.webp', banner:'images/letigrebl/davidjr-bannière.webp',
          description:'Enfant de la pègre devenu un monstre de vengeance, il a semé le chaos et la destruction avant de chercher la paix dans l\'isolement. Tel un cobra changeant de peau, il a fini par troquer sa haine contre un chemin de rédemption, offrant sa vie pour sauver ceux qu\'il combattait autrefois..', 
          seasons:{
    'Saison 1':[
        {num:1,title:'LE RETOUR D\'UNE LEGENDE ! GTA V RP ! by iProMx #1',videoId:'X4l0agpzSqI'},
        {num:2,title:'LES CHOSES  SÉRIEUSES COMMENCENT ! GTA V RP ! by iProMx #2',videoId:'DanPvfSEjck'},
        {num:3,title:'LE RÉVEIL LE PLUS ÉTRANGE DE DAVID JR ! GTA V RP ! by iProMx #3',videoId:'_0rsz-moP-4'},
        {num:4,title:'DAVID JR FLASH ! LA VÉRITÉ DOIT ÉCLATER ! GTA V RP ! by iProMx #4',videoId:'6VF7jvsvz3A'},
        {num:5,title:'LA MORT EST PROCHE + NOUVEAU POUVOIR ! GTA V RP ! by iProMx #5',videoId:'RXcPVscGhFU'},
        {num:6,title:'BONUS: DISCUSSION ENTRE DAVID JR ET GIANNA ! GTA V RP ! (NO MUTE)',videoId:'oZlKvCWx_Sc'},
        {num:7,title:'DAVID JR FLASH CONVOQUÉ A LA LSPD ! GTA V RP ! by iProMx #6',videoId:'_0uIBSnwDHk'},
        {num:8,title:'DAVID JR FLASH, LA PRÉPARATION ULTIME ! GTA V RP ! by iProMx #7',videoId:'k16-ww_ezL4'},
        {num:9,title:'LE GRAND JOUR ! LA TERRE DES FLASH ! GTA V RP ! by iProMx #8',videoId:'sNQ3s-LdJHk'}
    ]
}, },
        { id:'damon-flash', name:'Damon Flash', image:'images/letigrebl/damon.webp', banner:'images/letigrebl/damon-bannière.webp',
          description:'Enfant brisé devenu le « Roi de Los Santos » sous l\'emprise d\'une entité maléfique, il a commis l\'irréparable avant de chercher le pardon sous une fausse identité. Porté par la force du lion, il a fini par vaincre ses démons intérieurs et se sacrifier pour offrir aux autres l\'amour et la paix qu\'il n\'a jamais connus.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'L\'ARRIVÉ DE DAMON FLASH ! by iProMx #1',videoId:'tXoCThA1kOc'},
        {num:2,title:'DAMON FLASH ! LES CONNERIES COMMENCE ! UN NOUVEAU POUVOIR ? GTAV RP ! by iProMx #2',videoId:'xiexAHuPLnc'},
        {num:3,title:'DAMON FLASH ! EN CAVALE ! UN NOUVEAU POUVOIR ? GTAV RP ! by iProMx #3',videoId:'Bky6e_NEG44'},
        {num:4,title:'DAMON FLASH VS LES VAGOS ! GTA V RP ! by iProMx #4',videoId:'MVJEPMmMj3A'},
        {num:5,title:'DAMON FLASH, LE PIRE DES FLASH ! GTA V RP ! by iProMx #5',videoId:'0-NHcsWzU_M'},
        {num:6,title:'DAMON CONTRE TOUS ! DOUBLE PRIME SUR LA TÊTE ! GTA V RP ! by iProMx #6',videoId:'udI1pHZ46Qc'},
        {num:7,title:'DAMON EXPLOSE LES VAGOS ! GTA V RP ! by iProMx #7',videoId:'5BrCr_DYBmk'},
        {num:8,title:'DAMON DEVIENT INCONTRÔLABLE ! GTA V RP ! by iProMx #8',videoId:'q0JevUlqggg'},
        {num:9,title:'DAMON FLASH ! BRAQUAGE ! GTA V RP ! by iProMx #9',videoId:'gwz71I43JsY'},
        {num:10,title:'INFILTRATION BASE MILITAIRE ! GTA V RP ! by iProMx #10',videoId:'nBe6XxYkBvk'},
        {num:11,title:'SUITE DE INFILTRATION BASE MILITAIRE ! GTA V RP ! by iProMx #11',videoId:'RYTh-gQBzCo'},
        {num:12,title:'DAMON FLASH CONTROLE TOUT OU PAS ?! GTA V RP ! by iProMx #12',videoId:'8mHprd0dXGY'},
        {num:13,title:'LA SUITE DE DAMON FLASH CONTROLE TOUT OU PAS ! GTA V RP ! by iProMx #13',videoId:'XjV9IKGBLag'},
        {num:14,title:'DAMON FLASH BEAUCOUP PLUS FORT ?! GTA¨V RP ! by iProMx #14',videoId:'1wDdMPGPhN8'},
        {num:15,title:'DAMON FLASH EN CAVALE ! 10 000 000 DE PRIME ! GTA V RP ! by iProMx #15',videoId:'y0F9g8Lbv8o'},
        {num:16,title:'DAMON FLASH VS GANG DOUBLE ! GTA V RP ! by iProMx #16',videoId:'ueSuP3jLgr0'},
        {num:17,title:'DAMON FLASH DANS LE CORPS DU PRESIDENT ! GTA V RP ! by iProMx #17',videoId:'_lazoeU5x5I'},
        {num:18,title:'DAMON FLASH DANS LE MAL ! GTA V RP ! by iProMx #18',videoId:'0ZiV7Wa97Xk'},
        {num:19,title:'LA MORT DE LOLA ! GTA V RP ! by iProMx #19',videoId:'9TorBcz0j5k'},
        {num:20,title:'LE RÉVEIL DE DAMON APRES DES NUITS TERRIBLE ! GTA V RP ! by iProMx #20',videoId:'JIrAzcyK3Qk'},
        {num:21,title:'DAMON FLASH, NOUVEAU POUVOIR ?! GTA V RP ! by iProMx #21',videoId:'wvUlHrcRSWI'},
        {num:22,title:'DAMON FLASH, LA VÉRITÉ ! GTA V RP ! by iProMx #22',videoId:'GEi1MiXTOYI'},
        {num:23,title:'DAMON FLASH, LE SURVIVANT A 30M $ DE PRIME ! GTA V RP ! by iProMx #23',videoId:'o2mHTwb_WMI'},
        {num:24,title:'DAMON FLASH PRÉSIDENT ! GTA V RP ! by iProMx #24',videoId:'XeVPfOB9vlM'},
        {num:25,title:'LE ROI DAMON , LA MONARCHIE ABSOLUE ! GTA V RP ! by iProMx #25',videoId:'_E7sX18AllQ'},
        {num:26,title:'DAMON FLASH , L\'ATTAQUE ULTIME ! GTA V RP ! by iProMx #26',videoId:'m4i7Ql8kE68'},
        {num:27,title:'DAMON FLASH BATAILLE FINAL CONTRE SA MÈRE ! GTA V RP ! by iProMx #27',videoId:'TpgaMig4SMY'},
    ], 
    'Saison 2':[
        {num:28,title:'DAMON FLASH SAISON 2 CINÉMATIQUE !',videoId:'7Wxij8swW3o'},
        {num:29,title:'DAMON FLASH LE RETOUR ! GTA V RP ! by iProMx #1 S2',videoId:'kZln8jDSDBY'},
        {num:30,title:'DAMON FLASH, LA COURSE DE CHEVAUX ! GTA V RP ! by iProMx #2 S2',videoId:'UC1DxsK2E7I'},
        {num:31,title:'DAMON FLASH PARLE AUX ANIMAUX ! GRAND PRIX KARTING ! GTA V RP ! by iProMx #3 S2',videoId:'Be9FxCL-Scs'},
        {num:32,title:'DAMON FLASH A FAIT UNE CONNERIE ! GTA V RP ! by iProMx #4 S2',videoId:'9MW6jrwveM4'},
        {num:33,title:'DAMON FLASH A ENCORE FAIT UNE CONNERIE ! GTA V RP ! by iProMx #5 S2',videoId:'G0IDqgrz7wA'},
        {num:34,title:'DAMON FLASH CHEZ LES FLICS ! GTA V RP ! by iProMx #6 S2',videoId:'yPe2sJ9yMjg'},
        {num:35,title:'DAMON FLASH, LES ÉPREUVES COMMENCENT ! GTA V RP ! by iProMx #7 S2',videoId:'5f32le2kEvw'},
        {num:36,title:'DAMON FLASH DORT AVEC SA PATRONNE ?! GTA V RP ! by iProMx #8 S2',videoId:'frO8IwsEmrk'},
        {num:37,title:'DAMON FLASH MENTAL 50% + DEMI FINAL DES APPRENTIS AVENTURIERS ! GTA V RP ! by iProMx #9 S2',videoId:'uycdNEXa3ro'},
        {num:38,title:'DAMON FLASH - LA FINALE ! MENTAL 70% ! GTA V RP ! by iProMx #10 S2',videoId:'SsdzX07K0nc'},
        {num:39,title:'DAMON FLASH CONVOQUÉ PAR LA FBI ! GTA V RP ! by iProMx #11 S2',videoId:'U1aAQ-yO2RI'},
        {num:40,title:'PART 1 - DAMON FLASH - PRIME 55M$ - LA FIB DANS LA POCHE ? GTAV RP ! GTA V RP ! by iProMx #12 S2',videoId:'LSFfz1vwowQ'},
        {num:41,title:'PART 2 - DAMON FLASH - PRIME 55M$ - LA FIB DANS LA POCHE ? GTAV RP  ! by iProMx #12 S2 ( Partie 2 )',videoId:'HZnx4U9Vw6w'},
        {num:42,title:'PART 3 - DAMON FLASH - PRIME 55M$ - LA FIB DANS LA POCHE ? GTAV RP ! by iProMx #12 S2 ( Partie 3 )',videoId:'fGAymc_ajQY'},
        {num:43,title:'DAMON FLASH, LES POUVOIRS PRENNENT LE CONTRÔLE ! GTA V RP ! by iProMx #13 S2',videoId:'1b4I9FgX88Q'},
        {num:44,title:'DAMON FLASH - LE MONDE SUR SON DOS ! MENTAL 98% ! GTA V RP ! by iProMx #14 S2',videoId:'dW9Kq0AaAo4'},
    ], 
    'Saison 3':[
        {num:45,title:'DAMON X AARON ! LE RETOUR ! CINEMATIQUE OFFICIEL GTAV RP',videoId:'cO2QWaUnIVc'},
        {num:46,title:'LE RETOUR DE DAMON FLASH ! GTA V RP ! by iProMx #1 S3',videoId:'R_c4vDRNrCE'},
        {num:47,title:'DAMON TROP DE FORCE ! + NOUVEAU POUVOIR ! GTA V RP ! by iProMx #2 S3',videoId:'eqMSUPjT5EI'},
        {num:48,title:'DAMON A DEBLOQUÉ LE MEILLEUR POUVOIR DES FLASH ! GTA V RP ! by iProMx #3 S3',videoId:'e4kGpTC16zE'},
        {num:49,title:'LE TEMPS EST COMPTER ! GTA V RP ! by iProMx #4',videoId:'bc6KVCwg5bY'},
        {num:50,title:'DAMON DOIT REPARER SES ERREURS ! GTA V RP ! by iProMx #5 S3',videoId:'wWL8vGT9DKY'},
        {num:51,title:'DAMON A FAIT UNE GROSSE CONNERIE ! GTA V RP ! by iProMx #6 S3',videoId:'DoosWiG7QvM'},
        {num:52,title:'PART1- DAMON DOIT PARTIR SUR LA TERRE DES FLASH POUR SE FAIRE PARDONNER ! GTA V RP ! by iProMx #7 S3',videoId:'QOdQ939oTDk'},
        {num:53,title:'PART2- DAMON DOIT PARTIR SUR LA TERRE DES FLASH POUR SE FAIRE PARDONNER ! GTA V RP ! by iProMx #7 S3',videoId:'GfAo2jKO4Vo'},
        {num:54,title:'LUCIE A TROMPÉ JACOB AVEC DAMON :O ! GTA V RP ! by iProMx #8 S3',videoId:'cMFVj8RG7_Q'},
        {num:55,title:'LE GRAND JOUR ! LA TERRE DES FLASH ! GTA V RP ! by iProMx #9 S3',videoId:'6OmBw9b_bOw'},
        {num:56,title:'DAMON FLASH ! LE FILM , GUERRE DE FAMILLE ! OFFICIEL GTAV RP',videoId:'hOVdbxCmwgc'},
        {num:57,title:'DAMON FLASH LE FILM OFFICIEL ! COMBAT FINAL',videoId:'TyAXhptUiuE'}
    ]
}, },
        { id:'kayton-flash', name:'Kayton Flash', image:'images/letigrebl/kayton.webp', banner:'images/letigrebl/kayton-bannière.webp',
          description:'Esprit vengeur né de la douleur et devenu démon, il a cherché à anéantir sa propre lignée avant de recevoir une seconde chance inespérée. Transformé en loup-garou luttant contre ses pulsions, il a fini par choisir l\'amour et la rédemption, prouvant que même le plus sombre des monstres peut redevenir humain.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'UN NOUVEAU FLASH ! PREMIER FILS DE KEN FLASH ! GTA V RP ! by iProMx #1',videoId:'Ic56_QKPepo'},
        {num:2,title:'KAYTON FAIT DU SALE CE SOIR ! GTA V RP ! by iProMx #2',videoId:'JH0cbJY3Ueo'},
        {num:3,title:'KAYTON FLASH DANS LES PROBLEMES ! GTA V RP ! by iProMx #3',videoId:'bGZiC5gre_U'},
    ], 
    'Saison 2':[
        {num:4,title:'KAYTON FLASH , LE RETOUR FRACASSANT ! GTA V RP ! by iProMx #1 S2',videoId:'fn-eVAAVPKw'},
        {num:5,title:'KAYTON LE LOUP GAROU ! LA RENCONTRE AVEC REMY ? GTA V RP ! by iProMx #2',videoId:'jphdiP7EKYs'},
        {num:6,title:'KAYTON DIT LA VERITE A ARIA ! LE LOUP DE PLUS EN PLUS FEROCE ! GTA V RP ! by iProMx #3',videoId:'VT72DdVgxzA'},
        {num:7,title:'L\'ENFER SOUS TERRE - KAYTON FLASH ! GTA V RP ! by iProMx #4',videoId:'7bf8DnLZwPU'},
        {num:8,title:'L’ARRIVÉE DE LA FILLE DE GRINCHIAT ! KAYTON FLASH ! GTA V RP ! by iProMx #5',videoId:'00ZDSGI8EgQ'},
        {num:9,title:'KAYTON DE PLUS EN PLUS FÉROCE ! GTA V RP ! by iProMx #6',videoId:'6-ELp9OUHbw'},
        {num:10,title:'KAYTON VA CRÉER SA MEUTE ! GTA V RP ! by iProMx #7',videoId:'tEXgA3MbAz0'},
        {num:11,title:'CINEMATIQUE ! LE RETOUR D\'AARON FLASH ! GTA V RP ! by iProMx !',videoId:'3kOx1rZOtSo'},
        {num:12,title:'PART 1: KAYTON x AARON ! GTA V RP ! by iProMx #8 ',videoId:'cVjxyI0rJdU'},
        {num:13,title:'PART 2: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'sXjcaej7ONY'},
        {num:14,title:'PART 3: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'rtDzdAxhOL4'},
        {num:15,title:'PART 4: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'U_n_OLguMSw'},
        {num:16,title:'PART 5: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'o5v2ZNKZV2Y'},
        {num:17,title:'PART 6: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'FGDS5oUj1kg'},
        {num:18,title:'PART 7: KAYTON x AARON ! GTA V RP ! by iProMx #8',videoId:'UTCR1NxvjVY'},
        {num:19,title:'KAYTON FLASH ! LE GRAND TOURNOI DE F1 ! GTA V RP ! by iProMx #9 PART 1',videoId:'ii5OSsdSH4A'},
        {num:20,title:'KAYTON FLASH ! LE GRAND TOURNOI DE F1 ! GTA V RP ! by iProMx #9 PART 2',videoId:'6LTNDe_Zjic'},
        {num:21,title:'KAYTON FLASH - LE PLUS GROS TOURNOI F1 ! GTA V RP ! by iProMx #10',videoId:'0Z_LGoflqLk'},
        {num:22,title:'KAYTON A RENDEZ-VOUS AVEC AARON FLASH ! GTA V RP ! by iProMx #11',videoId:'kJCez15gXlE'},
        {num:23,title:'LE GRAND JOUR ! LE BRAQUAGE DU MUSEE ! GTA V RP ! by iProMx #12',videoId:'BK2Kj9W9ZzM'},
    ],
    'Saison 3':[
        {num:24,title:'KAYTON FLASH DOIT SURVIVRE EN PRISON ! GTA V RP ! by iProMx #1 S3',videoId:'veNEop8zNDM'},
        {num:25,title:'LE GRAND JOUR ! L\'EVASION DE KAYTON ! GTA V RP  ! by iProMx #2 S3',videoId:'0jIVArQI-wM'},
        {num:26,title:'KAYTON EMPRISONNE SUR UNE ILE ! ON S\'EVADE ! GTA V RP ! by iProMx #3',videoId:'XCsTDICnXzE'},
        {num:27,title:'(REUPLOAD) KAYTON RECUPERE LA BALLE ! INFILTRATION A CAYO ! GTA V RP ! by iProMx #4',videoId:'kbkF6rwNmlQ'},
        {num:28,title:'KAYTON RECUPERE LA BALLE ! INFILTRATION A CAYO ! GTA V RP ! by iProMx #4',videoId:'gvN4KsNk_wk'},
        {num:29,title:'LE FACE A FACE AVEC AARON ! GTA V RP ! by iProMx #5',videoId:'7TettAJlImM'},
        {num:30,title:'LE SORCIER MAUDIT S\'EST ECHAPPE DE LA TERRE DES FLASH ! GTA V RP  ! by iProMx #6',videoId:'tKQxRL_ok9Y'},
        {num:31,title:'KAYTON A PERDU TOUTES LES BALLES ! GTA V RP ! by iProMx #7',videoId:'kZV2_f-UUis'},
        {num:32,title:'PART 2 ! KAYTON A PERDU TOUTES LES BALLES ! GTA V RP ! by iProMx #7',videoId:'pGRaTqafaRQ'},
        {num:33,title:'L\'EQUIPAGE QUITTE LOS SANTOS EN DIRECTION TEXAS POUR LA BALLE ! GTA V RP ! by iProMx #8',videoId:'0IIaMTJjYxw'},
        {num:34,title:'LA FIN DE KAYTON FLASH ! GTA V RP ! by iProMx #9',videoId:'153rhyNkxrI'},
        {num:35,title:'PARTIE 2 ! LA FIN DE KAYTON FLASH ! GTA V RP ! by iProMx #9',videoId:'79XMv8kW9Ag'}
    ]
}, },
        { id:'adrian-flash', name:'Adrian Flash', image:'images/letigrebl/adrian.webp', banner:'images/letigrebl/adrian-bannière.webp',
          description:'Ancien militaire d\'élite brisé par une condamnation injuste, il est devenu un mort-vivant assoiffé de vengeance et de pouvoir. Tel un basilic sombre et indestructible, il a manipulé et terrassé ses ennemis avec une intelligence surhumaine avant de s\'éteindre définitivement lors d\'un ultime combat.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'LE NOUVEAU FLASH ! GTA V RP ! by iProMx #1',videoId:'9-CkiigRt0w'},
        {num:2,title:'LE PREMIER GROS BRAQUAGE D\'ADRIAN FLASH ! GTA V RP ! by iProMx #2',videoId:'8dANlZcVCJc'},
        {num:3,title:'ADRIAN CONVOQUÉ PAR LE FBI ! GTA V RP ! by iProMx #3',videoId:'HvWLUuJBpa0'},
        {num:4,title:'PARTIE 1 - ADRIAN FLASH, GROS BRAQUAGE BIJOUTERIE ! GTA V RP ! by iProMx #4',videoId:'jKKxKcERukI'},
        {num:5,title:'PARTIE 2 - ADRIAN FLASH, GROS BRAQUAGE BIJOUTERIE ! GTA V RP ! by iProMx #4',videoId:'ufzc5Qt7y7w'},
        {num:6,title:'LE RETOUR DE DENIS ! ADRIAN DANS LES PROBLEMES AVEC LE FBI ! GTA V RP ! by iProMx #5',videoId:'sOlNtWyB3Ag'},
        {num:7,title:'BONUS - CONVERSATION ADRIAN ET KYLIE FLASH ! by ItalianGirl ( Lien en description )',videoId:'-6Mz_0OwXA8'},
        {num:8,title:'PARTIE 1 - LE JUGEMENT ! ADRIAN VS DENIS ! GTA V RP ! by iProMx #6',videoId:'0KTCHm1L6Gk'},
        {num:9,title:'PARTIE 2 - LE JUGEMENT ! ADRIAN VS DENIS ! GTA V RP ! by iProMx #6',videoId:'LopyXidGl1w'},
        {num:10,title:'PREPARATION DU PLUS GROS BRAQUAGE ! GTA V RP ! by iProMx #7',videoId:'TRrhOWIgDYo'},
        {num:11,title:'ADRIAN FLASH, LE BRAQUAGE DU SIECLE ! GTA V RP ! by iProMx #8',videoId:'V4xdrwIwego'},
        {num:12,title:'ADRIAN VA SAVOIR LA VERITE SUR DAVID JR FLASH ! GTA V RP ! by iProMx #9',videoId:'nj7dqZEnNj8'},
        {num:13,title:'ADRIAN FLASH, LE BRAQUAGE DE CASINO ! GTA V RP ! by iProMx #10',videoId:'L4mL2DlbovA'},
        {num:14,title:'LE REVEIL DU BASILIC , LE DEBUT DES POUVOIRS ! GTA V RP ! by iProMx #11',videoId:'Y78miycO-JQ'},
        {num:15,title:'LA MORT D\'ADRIAN FLASH ! GTA V RP ! by iProMx #12',videoId:'rqsi6fVmUgE'},
        {num:16,title:'L\'ENTERREMENT D\'ADRIAN FLASH ! CINEMATIQUE ! GTA V RP',videoId:'s5PIZkTvdcU'},
    ],
    'Saison 2':[
        {num:17,title:'ADRIAN FLASH DECOUVRE SES NOUVEAUX POUVOIRS ! GTA V RP ! by iProMx #1 S2',videoId:'Zgd6PNhFnB0'},
        {num:18,title:'PARTIE 1 - ADRIAN DE PLUS EN PLUS FORT ! GTA V RP ! by iProMx #2 S2',videoId:'DwKdv0XFY_A'},
        {num:19,title:'PARTIE 2 - ADRIAN DE PLUS EN PLUS FORT ! GTA V RP ! by iProMx #2 S2',videoId:'401hB4a_PEg'},
        {num:20,title:'LA FIN D\'ADRIAN FLASH ! GTA V RP ! by iProMx #3 S2',videoId:'yVgjsXqfvD0'},
        {num:21,title:'ADRIAN ET LENA DEBUT D\'UNE HISTOIRE D\'AMOUR ? GTA V RP ! by iProMx #4 S2',videoId:'KWbuqkxpzk0'},
        {num:22,title:'KAYTON VS ADRIAN LE COMBAT DU SIECLE ! CINEMATIQUE',videoId:'P09rKJjBZpI'},
    ],
    'Saison 3':[
        {num:23,title:'LE RETOUR D\'ADRIAN FLASH ! PARTIE 1 ! #1 S3',videoId:'VLIMlbJ19eU'},
        {num:24,title:'LE RETOUR D\'ADRIAN FLASH ! PARTIE 2 ! #1 S3',videoId:'ETV4TcSbZos'},
        {num:24,title:'Adrian kidnappe Avery!',sibnetUrl:'https://video.sibnet.ru/shell.php?videoid=6168087',thumb:''},
    ]
}, },
        { id:'ned-flash', name:'Ned, Eden, Eddy Flash', image:'images/letigrebl/ned-eden-eddy.webp', banner:'images/letigrebl/ned-eden-eddy-bannière.webp',
          description:'Frères de sang et d\'esprit, ils forment le Cerbère. Alliant la mémoire d\'Eden, la force obscure d\'Eddy et la détermination du capitaine Ned, ce héros aux trois visages a sacrifié sa liberté pour enchaîner le mal à jamais et veiller sur l\'avenir des siens.',
          hasLocalVideo:true, videoUrl:'vidéos/3frèresintro.mp4', 
          seasons:{
    'Saison 1 (Eden)':[
        {num:1,title:'EDEN FLASH ! LE COMMENCEMENT ! GTA V RP ! by iProMx #1',videoId:'T-ToLtedYSc'},
        {num:2,title:'L\'EVASION DE EDEN FLASH ?! GTA V RP ! by iProMx #2',videoId:'JpuPf1PYOJI'},
        {num:3,title:'LA NOUNOU A T-ELLE PERDU AARON ?! GTA V RP ! by iProMx #3',videoId:'a7SE6ryLdLc'},
        {num:4,title:'NED A FAIT UNE CONNERIE ! GTA V RP ! by iProMx #4',videoId:'BZlewe0rU7A'},
        {num:5,title:'NED A DEPASSÉ LES LIMITES ! GTA V RP ! by iProMx #5',videoId:'knNfPE6Mj_k'},
        {num:6,title:'EDEN SE REVEILLE DANS LA CHAMBRE DE .... ! GTA V RP ! by iProMx #6',videoId:'GJyQmJhVOOY'},
        {num:7,title:'LE TROISIEME VISAGE D\'EDEN FLASH ! GTA V RP ! by iProMx #7',videoId:'pWDWJ9oqZiw'},
        {num:8,title:'EDEN ET NED, LA LIBERATION DU 3EME FLASH ! GTA V RP ! by iProMx #8',videoId:'H4jVA82wVlk'},
        {num:9,title:'LA FIN D\'AARON FLASH ! GTA V RP ! by iProMx #9',videoId:'q05HoWuHMaQ'},
        {num:10,title:'EDEN FLASH VS LE MONDE ! GTA V RP ! by iProMx #10',videoId:'znXWIvR6Pxk'},
        {num:11,title:'EDEN ET NED CONSOLIDE LES LIENS DE L\'EQUIPE ! GTA V RP ! by iProMx #11',videoId:'MHFFnr4w53U'},
        {num:12,title:'LA PREPARATION POUR LA TERRE DES FLASH ! GTA V RP ! by iProMx #12',videoId:'UiFyEvfaick'},
        {num:13,title:'NED A DISPARU ! GTA V RP ! by iProMx #13',videoId:'MnCcbhosqBM'},
        {num:14,title:'NED VA DIRE LA VERITE A ASHLEY  ! GTA V RP ! by iProMx #14',videoId:'Zp6NbKldav8'},
        {num:15,title:'L\'EXPERIENCE SCIENTIFIQUE DE EDEN ! GTA V RP ! by iProMx #15',videoId:'gJHNJAzXmYI'},
        {num:16,title:'LA COMPETITION POUR LA TERRE DES FLASH COMMENCE ! PARTIE 1 ! GTA V RP ! by iProMx #16',videoId:'HEjg3hA00Sk'},
        {num:17,title:'LA COMPETITION POUR LA TERRE DES FLASH COMMENCE ! PARTIE 2 ! GTA V RP ! by iProMx #16',videoId:'R4DoGoSUWWU'}
 ],
    'Saison 2 (Ned Partie1)':[
        {num:18,title:'NED FLASH, LA NOUVELLE FAMILLE ! GTA V RP ! by iProMx S2 #1',videoId:'sbg2qvwNtww'},
        {num:19,title:'LE PREMIER DATE DE NED FLASH ! GTA V RP ! by iProMx S2 #2',videoId:'yF1a5026zXA'},
        {num:20,title:'L\'ALLIANCE ENTRE NED ET ADRIAN ! GTA V RP  ! by iProMx S2 #3',videoId:'4tAsma6BW7k'},
        {num:21,title:'NED FLASH, LA PUISSANCE DU DRAGON ! GTA V RP ! by iProMx S2 #4',videoId:'GGtp5HoJ_WY'},
        {num:22,title:'NED FLASH DECLENCHE UNE GUERRE ! GTA V RP ! by iProMx S2 #5',videoId:'PB2mNgoTA9Y'},
        {num:23,title:'LE RETOUR D\'AARON FLASH !? GTA V RP ! by iProMx S2 #6',videoId:'Bqnsn6HVTIo'},
        {num:24,title:'PARTIE 1 ! NED FLASH, ENTRE L\'AMOUR ET LA HAINE ! GTA V RP ! by iProMx S2 #7',videoId:'upnmDXuU7S8'},
        {num:25,title:'PARTIE 2 ! NED FLASH, ENTRE L\'AMOUR ET LA HAINE ! GTA V RP ! by iProMx S2 #7',videoId:'X3wj8Io_Y-I'},
        {num:26,title:'PARTIE 3 ! NED FLASH, ENTRE L\'AMOUR ET LA HAINE ! GTA 5 RP ! by iProMx S2 #7',videoId:'ltYOBHgzEVM'},
        {num:27,title:'PARTIE 1 - LA CAVALE DE NED FLASH ! GTA V RP ! by iProMx S2 #8',videoId:'o53BQksbvE8'},
        {num:28,title:'PARTIE 2 - LA CAVALE DE NED FLASH ! GTA V RP ! by iProMx S2 #8',videoId:'7CsJ5Xfn6po'},
        {num:29,title:'LA VENGEANCE DE NED FLASH ! GTA V RP ! by iProMx S2 #9',videoId:'eITqh2PI_TY'},
        {num:30,title:'NED FLASH EN CAVALE AVEC 150 MILLIONS SUR LA TÊTE ! GTA V RP ! by iProMx S2 #10',videoId:'jJB1IkyMtWQ'},
        {num:31, title:'NED FLASH, LE RETOUR DES POUVOIRS, 200 MILLIONS DE PRIME MORT OU VIF ! GTA V RP ! by iProMx S2 #11.mp4', sibnetUrl:'https://video.sibnet.ru/shell.php?videoid=6168101', thumb:'images/ned_ep11.png' },
        {num:32,title:'INTEGRALE - LA VENGEANCE DE NED FLASH ! GTA V RP ! by iProMx S2 #12',videoId:'mYseAdImUNc'},
        {num:33,title:'LA PUNITION D\'ADRIAN FLASH ! GTA V RP ! by iProMx  S2 #13',videoId:'NDcPxNZd_XE'},
        {num:34,title:'NED FLASH SEUL CONTRE LE MUR  ! GTA V RP ! by iProMx S2 #14',videoId:'2ngPOKhiT0k'},
        {num:35,title:'NED A FAIT UNE CONNERIE AVEC AVA ! GTA V RP ! by iProMx #15 S2',videoId:'lrKnB5ZL7LM'},
        {num:36,title:'NED VA T-IL SURVIVRE CONTRE ADRIAN ?! GTA V RP ! by iProMx #16 S2',videoId:'1xqYUKBDocM'},
        {num:37,title:'NED FLASH RENCONTRE .... ! GTA V RP ! by iProMx #17 S2',videoId:'528x5qSEhXA'},
        {num:38,title:'LA FIN DE NED FLASH !? GTA V RP ! by iProMx #18 S2',videoId:'5krScKgCwps'},
        {num:39,title:'NED FLASH DANS UN NOUVEAU MONDE ?! GTA V RP ! by iProMx #19 S2',videoId:'04F7DezzIEU'},
        {num:40,title:'NED FLASH, LE MONDE A L\'ENVERS ! GTA V RP ! by iProMx #20 S2',videoId:'1v3kiyxO0Ek'},
        {num:41,title:'NED FLASH EST DEVENU EXTRÊMEMENT PUISSANT ! GTA V RP ! by iProMx #21 S2',videoId:'heGChcFMaoI'},
        {num:42,title:'NED ET JUNE UN NOUVEAU COUPLE ?! GTA V RP by IProMx #22 S2',videoId:'RSljUOn_MY8'},
        {num:43,title:'NED VS AARON, LE COMBAT ULTIME ! by iProMx #23 S2',videoId:'ADD1YJtMHuE'},
        {num:44,title:'AARON VS EDDY : LE COMBAT ! GTA V RP ! by iProMx #24 S2',videoId:'XjJcDbFux1w'}
    ],
    'Saison 3 (Ned Partie2)':[
        {num:45,title:'LA FIN DE MANDA FLASH ET LE RETOUR DE NED ?! by iProMx #1',videoId:'hs-NTLrWWqQ'},
        {num:46,title:'LA FOLIE DE NED FLASH PREND LE DESSUS ! GTA V RP ! by iProMx #2',videoId:'4YEHDw4uMvQ'},
        {num:47,title:'NED SEUL CONTRE TOUS ! GTA V RP ! by iProMx #3',videoId:'vt3smQYAUmA'},
        {num:48,title:'NED FLASH, C\'EST LA GUERRE ! GTA V RP ! by iProMx #4',videoId:'YSnYCryerxI'},
        {num:49,title:'LA TOMBE DE NED FLASH ! GTA V RP ! by iProMx #5',videoId:'bb3WTIPVcM8'},
        {num:50,title:'LE JOUR J ! EPREUVE LABYRINTHE ! GTA V RP ! by iProMx #6',videoId:'joUdGooocds'},
        {num:51,title:'L\'EVASION DE NED FLASH ! GTA V RP ! by iProMx #7',videoId:'6BvOSzBG648'},
        {num:52,title:'NED PRIME DE RETOUR ! GTA V RP ! by iProMx #8',videoId:'j-40QZ_mIO8'},
        {num:53,title:'NED TOURNE LA PAGE ! GTA V RP ! by iProMx #9',videoId:'mkxkyNO0iuw'},
        {num:54,title:'L\'EPREUVE DU LABYRITHE ! GTA V RP ! by iProMx #10',videoId:'MJ_LunVlsX4'},
        {num:55,title:'LA VRAIE EVASION DE NED ! GTA V RP ! by iProMx #11',videoId:'QLtCGrRwNqo'},
        {num:56,title:'NED PART A LA RECHERCHE DE LA VRAIE SIRENE ! GTA V RP ! by iProMx #12',videoId:'9teqh1t2IYA'},
        {num:57,title:'NED A FAIT UNE GROSSE BETISE ! GTA V RP ! by iProMx #13',videoId:'XfuoAs5Nhr0'},
        {num:58,title:'LA MARIAGE DE NED ET DE LA REINE DES SIRENES ! GTA V RP ! by iProMx #14',videoId:'oXGuhlJ34IE'},
        {num:59,title:'NED FLASH, LE ROI DE L\'OCEAN ! GTA V RP ! by iProMx #15',videoId:'cjLcN4yZxUM'},
        {num:60,title:'NED FLASH A ENCORE DES PROBLEMES ! GTA V RP ! by iProMx #16',videoId:'9qUF6LI_MyI'},
        {num:61,title:'EDDY ? TU ES LA ?! GTA V RP ! by iProMx #17',videoId:'sgZ9OroeCTo'},
        {num:62,title:'CASSIE ME DETESTE ! GTA V RP ! by iProMx #18',videoId:'nmJFJbcRaQk'},
        {num:63,title:'NED FLASH VS LE MONSTRE ! GTA V RP ! by iProMx #19',videoId:'n-OR7w4Te2o'},
        {num:64,title:'NED FLASH ET LES POUVOIRS DE LA TACHE ! GTA V RP ! by iProMx #20',videoId:'HI-XqhQ3o7s'},
        {num:65,title:'NED FLASH x KAYTON FLASH ! GTA V RP ! by iProMx #21',videoId:'DgPV2m2T98M'},
        {num:66,title:'NED A FAIT LA CHOSE AVEC JADE MAIS... ! GTA V RP ! by iProMx #22',videoId:'uE2h03_3AuM'},
        {num:67,title:'NED FLASH EST ENCORE DANS DES PROBLÈMES ! GTA V RP ! by iProMx #23',videoId:'bFPvXCSphZI'}
    ],
    'Saison 4 (Ned Partie3)':[
        {num:68,title:'LA VIE APRÈS LA MORT ! GTA V RP ! by iProMx #1',videoId:'7QVDTzxf11Q'},
        {num:69,title:'QUI SUIS-JE ?! GTA V RP ! by iProMx #2',videoId:'kR_ROHHCtDM'},
        {num:70,title:'CODY A FAIT UNE CONNERIE ! GTA V RP ! by iProMx #3',videoId:'0bksrTrNajc'},
        {num:71,title:'VIVRE OU MOURRIR ?! GTA V RP ! by iProMx #4',videoId:'0Z3PmCVGUkM'},
        {num:72,title:'EN QUÊTE DE RÉPONSE ! EST-CE QUE TOUT EST RÉEL ?! GTA V RP ! by iProMx #5',videoId:'nOUeJWZWuyQ'},
        {num:73,title:'LE JOUR J ! QU\'ALLONS-NOUS DÉCOUVRIR ?! GTA V RP ! by iProMx #6',videoId:'7WniFutiFBg'},
        {num:74,title:'LE BAL DE FIN D\'ANNÉE ! GTA V RP ! by iProMx #7',videoId:'Jv4a7gZor4I'},
        {num:75,title:'QUE SE PASSE T-IL ？QUE SUIS-JE ?! GTA V RP ! by iProMx #8',videoId:'1JpMyneuvfI'},
        {num:76,title:'QUE VA-T-IL NOUS ARRIVER CE SOIR ？! GTA V RP ! by iProMx #9',videoId:'2GQWJmtyfzE'},
        {num:77,title:'ON EST DANS LE MAL ! GTA V RP ! by iProMx #10',videoId:'26FtV9a0Ips'},
        {num:78,title:'CONQUETE SUR WORLD OF WARSHIPS  ! SUITE AVEC CODY ! GTA V RP ! by iProMx #11',videoId:'TTKKJ9wsCvU'},
        {num:79,title:'LA CONQUETE DU CLAN DES MERS SUR WORLD OF WARSHIPS ! LA SUITE AVEC CODY !  GTA V RP ! by iProMx #12',videoId:'2sZudL9vCTw'},
        {num:80,title:'LA DÉCOUVERTE D\'UN LOURD SECRET ! GTA V RP ! by iProMx #13',videoId:'Mqbn94rpY3s'},
        {num:81,title:'ENFIN LIBRE CE SOIR ?! GTA V RP ! by iProMx #14',videoId:'Drwm5gns-xE'},
        {num:82,title:'LE RETOUR ! GTA V RP ! by iProMx #15',videoId:'LAss4Be8NTY'},
        {num:83,title:'NED FLASH DE RETOUR ?! GTA V RP ! by iProMx #16',videoId:'I1AUvTghm2k'},
        {num:84,title:'LA MENACE EST DE PLUS EN PLUS GRANDE ! GTA V RP ! by iProMx #17',videoId:'1FRgs1X0fds'},
        {num:85,title:'SUIS-JE MORT ? LA TERRE EST SAUVÉE ?! GTA V RP ! by iProMx #18',videoId:'G_-ld7wWXyU'},
        {num:86,title:'LE VRAI RETOUR DE NED FLASH ! GTA V RP ! by iProMx #19',videoId:'G_Y6VR244lc'},
        {num:87,title:'OUVERTURE DE LA PORTE FINAL DU CERBERE ! ARC DE FIN ! GTA V RP ! by iProMx #20',videoId:'jaYxLESmhgE'},
        {num:88,title:'LA FIN ! GTA V RP ! by iProMx #21',videoId:'rOykw1zHNc0'},
        {num:89,title:'Adrian vs Ned - Au coeur des ténèbres [Le Film]',videoId:'sReaGjD0op4'}
    ]
  }, },

        { id:'manda-flash', name:'Manda Flash', image:'images/letigrebl/manda.webp', banner:'images/letigrebl/manda-bannière.webp',
          description:'Fils d\'un tyran et héritier d\'une lignée brisée, il a été choisi par son oncle pour devenir le nouveau roi de la Terre des Flash. Il a su réellement résister à l\'emprise du basilic, et a aidé Ned à vaincre son propre père, Adrian.',
          seasons:{
    'Saison 1':[
        {num:1,title:'MANDA BLAKE DEBARQUE A LA SCHOOL RP ! GTA 5 RP ! by iProMx #1 S1',videoId:'IjksgVhs4HA'},
        {num:2,title:'LE DEBUT DES MAGOUILLES DE MANDA BLAKE ! GTA 5 RP ! by iProMx #2 S1',videoId:'3aqBRZ5XRM8'},
        {num:3,title:'MANDA COMMENCE LES BETISTES A L\'ECOLE ! GTA 5 RP ! by iProMx #3 S1',videoId:'HPBjrtFeNr4'},
        {num:4,title:'QUI EST VRAIMENT MANDA BLAKE ?! GTA 5 RP ! by iProMx #4 S1',videoId:'0wYIQrbyEco'},
        {num:5,title:'QUE NOUS CACHE MANDA BLAKE ?! GTA 5 RP ! by iProMx #5 S1',videoId:'8aTLvXEZryE'},
        {num:6,title:'MANDA S\'AVENTURE DANS LE PASSAGE ETRANGE ! GTA 5 RP ! by iProMx #6 S1',videoId:'Zu96Ll3eJoo'},
        {num:7,title:'QUE CACHE MANDA DERRIERE SON SOURIRE ? GTA 5 RP ! by iProMx #7 S1',videoId:'5GyrL7z2z2Q'},
        {num:8,title:'LA SORTIE SCOLAIRE et LE RENDEZ VOUS MYSTERIEUX ! GTA 5 RP ! by iProMx #8 S1',videoId:'74_eXd9AQm8'},
        {num:9,title:'MANDA BLAKE DANS LE COMA ! GTA 5 RP ! by iProMx #9 S1',videoId:'Ul3x7eASjIo'},
        {num:10,title:'MANDA BLAKE ENTRE LA VIE ET LA MORT ! GTA 5 RP ! by iProMx #10 S1',videoId:'xBe9vaYyMmo'},
        {num:11,title:'MANDA BLAKE, LA FINALE ! ACTE 1 ! GTA 5 RP ! by iProMx #11 S1',videoId:'MDKOBAoa7MU'},
        {num:12,title:'MANDA BLAKE, LA FINALE ! ACTE 2 ! GTA 5 RP ! by iProMx #12 S1',videoId:'7FF_jmeW7iw'},
    ],
    'Saison 2':[
        {num:13,title:'LE RETOUR DE MANDA BLAKE ! GTA 5 RP ! by iProMx S2 #1',videoId:'EsDO3dqspNI'},
        {num:14,title:'MANDA BLAKE, UN HOMME MYSTERIEUX ! GTA 5 RP ! by iProMx S2 #2',videoId:'ma94iUg1OL0'},
        {num:15,title:'MANDA vs LE BASILIC ! GTA 5 RP ! by iProMx S2 #3',videoId:'9uCOQnhWByw'},
        {num:16,title:'MANDA EST DE PLUS EN PLUS EN DANGER ! GTA 5 RP ! by iProMx S2 #4',videoId:'TV59-8IDR1k'},
        {num:17,title:'MANDA PASSE LE NOUVEL AN ! GTA 5 RP ! by iProMx S2 #5',videoId:'i-1VwSBD_F4'},
        {num:18,title:'MANDA RENCONTRE NED FLASH ! by iProMx S2 #6',videoId:'BZDESYzQ0qA'},
        {num:19,title:'MANDA EST AU PLUS MAL ! GTA V RP ! by iProMx S2 #7',videoId:'8DSdty7XBDM'}
    ]
}, },
          { id:'zayn-flash', name:'Zayn Flash', image:'images/letigrebl/zayn.webp', banner:'images/letigrebl/zayn-bannière.webp',
          description:'Héritier déterminé de la lignée Flash, Zayn a bravé l\'interdiction frappant sa famille en intégrant l\'école de magie Veylar. Son unique but était d\'apprendre la magie des sorciers et d\'obtenir l\'Orion, un artefact puissant capable de libérer son père, Ned Flash, scellé au fond des océans.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'PREMIER JOUR À L’ÉCOLE DE MAGIE VEYLAR ! GTA V RP ! by iProMx #1',videoId:'E8LT9YzXv_I'},
        {num:2,title:'LE LANCEMENT OFFICIEL DE ZAYN FLASH ! GTA V RP ! by iProMx #2',videoId:'Kf1xSWo9p64'},
        {num:3,title:'LES PREMIERS SOUCIS ARRIVENT ! GTA V RP ! by iProMx #3',videoId:'7rEz5xlKNgk'},
        {num:4,title:'UNE FORCE ÉTRANGE VEUT CONTRÔLER ZAYN FLASH ! GTA V RP ! by iProMx #4',videoId:'YCzGr-4XLrI'},
        {num:5,title:'COMMENT ZAYN FLASH VA-T-IL S’EN SORTIR MAINTENANT ?! GTA V RP ! by iProMx #5',videoId:'UyW6muG27wo'},
        {num:6,title:'L’OUVERTURE DE LA GROTTE SECRÈTE CE SOIR ! GTA V RP ! by iProMx #6',videoId:'jH6wKrVLNb8'},
        {num:7,title:'LA MALÉDICTION DE LA TACHE PERSISTE ! GTA V RP ! by iProMx #7',videoId:'g5N38rakDVY'},
        {num:8,title:'LA TACHE HORS DE CONTRÔLE… LE CHAOS ABSOLU ! GTA V RP ! by iProMx #8',videoId:'i4blmQxpP34'},
        {num:9,title:'ZAYN FLASH A FAIT UNE GROSSE BÊTISE ! GTA V RP ! by iProMx #9',videoId:'jD4_-ZNseYQ'},
        {num:10,title:'UN RÉVEIL INATTENDU ! GTA V RP ! by iProMx #10',videoId:'pJiK2R9CWhA'},
        {num:11,title:'L’AVENTURE DE ZAYN FLASH SE POURSUIT ! GTA V RP ! by iProMx #11',videoId:'_tMOw2iNaRI'},
        {num:12,title:'ZAYN FLASH TRAQUÉ PAR UNE PRÉSENCE INEXPLICABLE ! GTA V RP ! by iProMx #12',videoId:'Wx_zZcKjo6s'},
        {num:13,title:'PERDU DANS UN LIEU INCONNU ?! GTA V RP ! by iProMx #13',videoId:'NYWL_KmYIjQ'},
        {num:14,title:'ZAYN FLASH QUITTE L\'ECOLE ! GTA V RP ! by iProMx #14',videoId:'aIvavc2BqX0'},
        {num:15,title:'LE FACE-À-FACE AVEC NED FLASH ! GTA V RP ! by iProMx #15',videoId:'DVVEV3RxOko'},
        {num:16,title:'ZAYN FLASH DE RETOUR DANS CETTE FORÊT MALÉFIQUE ! by iProMx #16',videoId:'BGAhOGnwpx8'},
        {num:17,title:'LE PLAN EST LANCÉ ! GTA V RP ! by iProMx #17',videoId:'cepOLyhDTZo'},
        {num:18,title:'LE JOUR DU BAL EST ENFIN ARRIVÉ ! GTA V RP ! by iProMx #18',videoId:'FGg3bjb3Bjk'},
        {num:19,title:'QUE CACHE-T-ELLE VRAIMENT ? GTA V RP ! by iProMx #19',videoId:'L_jN0Xcf4wU'},
        {num:20,title:'SILVER CONTRE ZAYN : TOUT BASCULE ! GTA V RP ! by iProMx #20',videoId:'Vyhid1onP4c'},
        {num:21,title:'LE COMBAT CONTRE LE DRAGON COMMENCE CE SOIR ! GTA V RP ! by iProMx #21',videoId:'EqMn-ReTkGo'},
        {num:22,title:'L’HEURE DE LA VÉRITÉ A SONNÉ ! GTA V RP ! by iProMx #22',videoId:'IR3Ol3UobSA'},
        {num:23,title:'LE FACE-À-FACE AVEC L’ENNEMI ! GTA V RP ! by iProMx #23',videoId:'emplKTjcTYU'},
        {num:24,title:'LA QUÊTE DE L’ORION POUR SON PÈRE ! GTA V RP ! by iProMx #24',videoId:'fo2gjO1zdvc'},
        {num:25,title:'LA VÉRITÉ EST ENFIN RÉVÉLÉE ! GTA V RP ! by iProMx #25',videoId:'T7OusdlRieI'},
        {num:26,title:'LA BATAILLE COMMENCE ! GTA V RP ! by iProMx #26',videoId:'LAwglU722XE'},
        {num:27,title:'LA GRANDE FINALE ! GTA V RP ! by iProMx #27',videoId:'JR7ZJwPuYjo'}
    ],
     'Saison 2':[
     ],
}, }
      ]
    },
    shade: {
      id:'shade', name:'Famille Shade', color:'#9b59b6',
      characters:[
        { id:'sylvester-shade', name:'Sylvester Shade', 
          image:'images/letigrebl/silver.webp', banner:'images/letigrebl/silver-bannière.webp',
          description:'Maître des ombres et de la manipulation, il voue une haine profonde à la lignée Flash. Il a abandonné toute son humanité en passant un pacte définitif avec La Mort. Désormais lié à lui, il est devenu le Gardien de La Mort.',
          hasLawBook:true, lawBookImages:['images/shade-law-1.webp','images/shade-law-2.webp','images/shade-law-3.webp'], 
          seasons:{
    'Saison 1':[
        {num:1,title:'LE COMMENCEMENT ! LA FAMILLE SHADE ! GTA V RP ! by iProMx S1 #1',videoId:'R-5W88CwVZU'},
        {num:2,title:'DE LA MANIPULATION A L\'ANEANTISSEMENT DES FLASH ! GTA V RP ! by iProMx #2 S1',videoId:'32zOZYmsTWY'},
        {num:3,title:'HOMMAGE A NED FLASH ! UNE DERNIERE FOIS ! GTA V RP ! by iProMx #3',videoId:'Bbl9FOUQxG4'},
        {num:4,title:'ATTAQUE DE L\'ILE DE NED FLASH ! GTA V RP ! by iProMx #4',videoId:'-BtsSS4xATg'},
        {num:5,title:'SYLVERTER APPREND DES NOUVEAUX POUVOIRS ! GTA V RP ! by iProMx #5',videoId:'XvQ9yDLvjls'},
        {num:6,title:'SILVER DECHIRE L\'OMBRE : LA FAILLITE DU SCEAU ! GTA V RP ! by iProMx #6',videoId:'whThMOkWjiQ'},
        {num:7,title:'LA MARIAGE DE SILVER ET JUNE + DATE AVEC EZRA FLASH ! GTA V RP ! by iProMx #7',videoId:'IQN0FY1qwz4'},
        {num:8,title:'SYLVESTER SHADE FACE AUX FILLES DE KAYTON ! GTA V RP ! by iProMx #8',videoId:'231al__2YLg'},
        {num:9,title:'LE SACRIFICE DE SILVER ?! GTA V RP ! by iProMx #9',videoId:'AjxK4i4Qqxo'},
        {num:10,title:'LA CAPTURE D\'UN FLASH ! GTA V RP ! by iProMx #10',videoId:'Vvn5StQfm7Q'},
        {num:11,title:'SYLVESTER SHADE A TOUT PERDU ! GTA V RP ! by iProMx #11',videoId:'kmdnL6rZT34'},
        {num:12,title:'UNE SOIRÉE ÉTRANGE ET LE BAL AVEC ERZA FLASH ! GTA V RP ! by iProMx #12',videoId:'CA-bgJrFR74'},
        {num:13,title:'ERZA FLASH ÉLIMINÉE, SILVER EST EN DANGER ! GTA V RP ! by iProMx #13',videoId:'fUVJu6oj57E'},
        {num:14,title:'UN POUVOIR INCONNU : SILVER DOMINE LA MORT ! GTA V RP ! by iProMx #14',videoId:'PK3hPrjn6v8'},
        {num:15,title:'SILVER VS LA MORT : LA FIN CE SOIR ?! GTA V RP ! by iProMx #15',videoId:'zhdieriLVYM'},
        {num:16,title:'SYLVESTER SHADE : LE NOUVEAU GARDIEN DE LA MORT ?! GTA V RP ! by iProMx #16',videoId:'73PEy-FCGJo'},
        {num:17,title:'SILVER A FAIT UNE ÉNORME CONNERIE ! GTA V RP ! by iProMx #17',videoId:'fA5neA8yN3w'},
        {num:18,title:'SILVER DOIT RETROUVER NED FLASH ! GTA V RP ! by iProMx #18',videoId:'kFJZDDGxF-Q'},
        {num:19,title:'A LA RECHERCHE DE NED ET LE BASSILIC ! GTA V RP ! by iProMx #19',videoId:'6NGpKRdL7k4'},
        {num:20,title:'LE DIVORCE DE SILVER ET JUNE ! GTA V RP ! by iProMx #20',videoId:'nLfZxgzJOMU'},
        {num:21,title:'TOUTE LA VÉRITÉ QU’ON VOUS CACHE SUR SILVER, ELIO ET NED FLASH ! GTA V RP ! by iProMx #21',videoId:'One0u2y8JCw'},
        {num:22,title:'RETOUR DANS LA TOMBE DE NED POUR RETROUVER FREDDY ! GTA V RP ! by iProMx #22',videoId:'pZgL2BHqeiQ'},
        {num:23,title:'LE DEBUT DE LA FIN ! GTA V RP ! by iProMx #23',videoId:'bk0VWJwsixI'},
        {num:24,title:'EXPLORATION DU TERRITOIRE INTERDIT ! GTA V RP ! by iProMx #24',videoId:'NJL0ceDDVIk'},
        {num:25,title:'L\'ULTIME COMBAT CONTRE L\'HUMANITÉ ! GTA V RP ! by iProMx #25',videoId:'zuOp-17egb8'},
        {num:26,title:'LA RENCONTRE AVEC ADRIAN ! GTA V RP ! by iProMx #26',videoId:'8mnOU5cwlNs'},
        {num:27,title:'PIÉGÉ DANS LA PRISON DES MORTS D’ADRIAN ! GTA V RP ! by iProMx #27',videoId:'tgei0KLog_4'},
        {num:28,title:'GTA 5 RP - Debrief Jake Winters + On donne des scènes à Fantastic !',videoId:'vWXHaMMqgrc'},
        {num:29,title:'GTA 5 RP - Ce soir on passe a l\'action ! part 1',videoId:'1rgcqMFk7XA'},
        {num:30,title:'GTA 5 RP - Ce soir on passe a l\'action ! part 2',videoId:'QQ92Vix-ZPc'},
        {num:31,title:'GTA 5 RP - Ce soir, on doit le capturer !',videoId:'guIPmULAhKs'},
        {num:32,title:'GTA 5 RP – Le Grand jour : Le Labyrinthe !',videoId:'MPbC8HGh_-0'},
        {num:33,title:'LE RETOUR DE IPROMX ?!',videoId:'pHE7l20tHMU'}
    ]
}, }
      ]
    },
    winters: {
      id:'winters', name:'Famille Winters', color:'#3498db',
      image:'images/winters-universe.jpg', banner:'images/winters-banner.jpg',
      characters:[
        { id:'jake-winters', name:'Jake Winters', image:'images/letigrebl/jake.webp', banner:'images/letigrebl/jake-bannière.webp',
          description:'Parti à la poursuite du rêve américain, Jake Winters voit son destin basculer lorsqu\'il est contraint de rejoindre l\'armée de Cayo Perico. Plus tard, il rejoint aussi l\'armée des Russes contre Cayo. Hanté par ses origines, il consacre sa vie à rechercher son père, Oliver Winters, tout en traquant la trace de « l’Œil du Faucon », une technologie légendaire capable de tout contrôler. Au fil de sa quête, il réalise que les secrets de son passé et cette puissance technologique sont bien plus liés à sa propre existence qu\'il ne l\'imaginait.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'JE RECOMMENCE GTA 5 RP A ZERO EN HARDCORE ! #1 (Le Fils d\'Oliver Winters)',videoId:'I5WzfTVoX6E'},
        {num:2,title:'GTA 5 RP A ZERO EN HARDCORE ! #2 (On achète quoi comme première voiture les frères ???)',videoId:'dgNFL0mGW00'},
        {num:3,title:'GTA 5 RP A ZERO EN HARDCORE ! #3 (Je détruis la voiture d\'un criminel pour me venger)',videoId:'LghSqq-Ll9I'},
        {num:4,title:'GTA 5 RP A ZERO EN HARDCORE ! #4 (J\'aurais pas du m\'enfuir , je suis dans la merde)',videoId:'ydUPR1VCSPM'},
        {num:5,title:'GTA 5 RP A ZERO EN HARDCORE ! #5 (Je cache de la weed dans mon camion de poubelle)',videoId:'dJ14z_JbEwg'},
        {num:6,title:'GTA 5 RP A ZERO EN HARDCORE ! #6 (Les frères j\'ai fait une grosse connerie !!!)',videoId:'gBletNGZs5A'},
        {num:7,title:'GTA 5 RP A ZERO EN HARDCORE ! #7 (Je m\'infiltre dans le gang le plus chaud de Los Santos)',videoId:'gUCkpnyCWZI'},
        {num:8,title:'GTA 5 RP A ZERO EN HARDCORE ! #8 (J\'ai une prime sur la tête, tout l\'illégal me recherche)',videoId:'4iLzNLQ_J30'},
        {num:9,title:'GTA 5 RP A ZERO EN HARDCORE ! #9 (Oh non ma mère débarque à Los Santos !)',videoId:'_fji-vOtJb0'},
        {num:10,title:'GTA 5 RP A ZERO EN HARDCORE ! #10 (Je me suis fait trahir… )',videoId:'iLoqXeV1s2M'},
        {num:11,title:'GTA 5 RP A ZERO EN HARDCORE ! #11 (J\'ai kidnappé un flic !)',videoId:'8NhWw_5e920'},
        {num:12,title:'GTA 5 RP A ZERO EN HARDCORE ! #12 (Ma mère gâche mon premier Date !)',videoId:'g6u4a77yPb0'},
        {num:13,title:'GTA 5 RP A ZERO EN HARDCORE ! #13 (J\'achète enfin mon Taxi , il est ouf !!!)',videoId:'4J4uucKelhs'},
        {num:14,title:'GTA 5 RP A ZERO EN HARDCORE ! #14 (Cette femme est-elle amoureuse de moi ?)',videoId:'uEEg-pdmmhg'},
        {num:15,title:'GTA 5 RP A ZERO EN HARDCORE ! #15 (J\'ouvre enfin mon entreprise de Taxi)',videoId:'m6c1FRqD3VE'},
        {num:16,title:'GTA 5 RP A ZERO EN HARDCORE ! #16 (J\'achète 3 nouveaux Taxi, ils sont incroyables)',videoId:'wF81Xyz-NEU'},
        {num:17,title:'GTA 5 RP A ZERO EN HARDCORE ! #17 (Je ramène une meuf dans le lit d\'Alvaro , rip)',videoId:'1LBLGuh-fY0'},
        {num:18,title:'GTA 5 RP A ZERO EN HARDCORE ! #18 (On m\'a planté !)',videoId:'Q7x-cOIHdNk'},
        {num:19,title:'GTA 5 RP A ZERO EN HARDCORE ! #19 (J\'ai commencé l\'illégal dans mon taxi, ça paye fort)',videoId:'P2skpB0OolI'},
        {num:20,title:'GTA 5 RP A ZERO EN HARDCORE ! #20 (J\'arnaque des gens avec mon nouveau boîtier taxi)',videoId:'zUDhKKMv5ko'},
        {num:21,title:'GTA 5 RP A ZERO EN HARDCORE ! #21 (J\'investis tout mon argent dans l\'illégal , ça paye ou pas ?)',videoId:'mDjXlAYUyxM'},
        {num:22,title:'GTA 5 RP A ZERO EN HARDCORE ! #22 (J\'ai enfin acheté ma Golf 2 GTI !!!)',videoId:'_T4oC2GD6NE'},
        {num:23,title:'GTA 5 RP A ZERO EN HARDCORE ! #23 (Ma nouvelle villa de luxe !)',videoId:'9hMwzutqrtI'},
        {num:24,title:'GTA 5 RP A ZERO EN HARDCORE ! #24 (J\'accepte une grande mission illégale qui me rapporte gros)',videoId:'bFeU90oRPzc'},
        {num:25,title:'GTA 5 RP A ZERO EN HARDCORE ! #25 (J\'ai cambriolé un magasin de bouteilles de NOS !!!)',videoId:'AyIIhRZxPZ8'},
        {num:26,title:'GTA 5 RP A ZERO EN HARDCORE ! #26 (Je revends les bouteilles de NOS discrètement !)',videoId:'v2NnVNxnwgk'},
        {num:27,title:'GTA 5 RP A ZERO EN HARDCORE ! #27 (Je monte un plan pour l\'évasion d\'Alvaro !)',videoId:'JbdESgztdeo'},
        {num:28,title:'GTA 5 RP A ZERO EN HARDCORE ! #28 (Je me fais recruter dans une entreprise de construction !)',videoId:'y09XMizztnk'},
        {num:29,title:'GTA 5 RP A ZERO EN HARDCORE ! #29 (je fais du repérage dans la Prison pour l\'évasion !)',videoId:'5tbMkXjSLL8'},
        {num:30,title:'GTA 5 RP A ZERO EN HARDCORE ! #30 (Je suis parti trop loin…)',videoId:'Pz-zObLVyEA'},
        {num:31,title:'GTA 5 RP A ZERO EN HARDCORE ! #31 (On a fait le tunnel pour l\'évasion, il est incroyable :O )',videoId:'AfzqAR4g8KM'},
        {num:32,title:'GTA 5 RP A ZERO ! #32 (Grosse embrouille avec la fille d\'Alvaro + le tunnel bientôt terminé)',videoId:'JE3SQPiiFH8'},
        {num:33,title:'GTA 5 RP A ZERO ! #33 (Le tunnel enfin fini !!!)',videoId:'S9eCroqtiEM'},
        {num:34,title:'GTA 5 RP A ZERO ! #34 (Tout le plan est tombé à l\'eau, je suis dans la merde..)',videoId:'_PwLn35I17A'},
        {num:35,title:'GTA 5 RP A ZERO ! #35 (J\'ai enfin modifié ma Golf 2 GTI !)',videoId:'6bsl8Du8bQ0'},
        {num:36,title:'GTA 5 RP A ZERO ! #36 (J\'ai claqué 300 000 $ dans un projet risqué !)',videoId:'fBYbmITlCeQ'},
        {num:37,title:'GTA 5 RP A ZERO ! #37 (Je déclare mes sentiments à Sofia !)',videoId:'RgLfhqEMmIg'},
        {num:38,title:'GTA 5 RP A ZERO ! #38 (Je découvre mon nouveau studio de tournage à 300k $ !)',videoId:'yyMCyIuYO5M'},
        {num:39,title:'GTA 5 RP A ZERO ! #39 (Je me déguise en inconnu et espionne mes employés)',videoId:'kbXsI_0JNo8'},
        {num:40,title:'GTA 5 RP A ZERO ! #40 (Je suis parti trop loin…)',videoId:'Syoayy0MuD0'},
        {num:41,title:'GTA 5 RP A ZERO ! #41 (Sofia enragée après moi + grosse embrouille avec les gars de Cayo !)',videoId:'DZb7pDw1z4Y'},
        {num:42,title:'GTA 5 RP A ZERO ! #42 (Sofia m\'a trahi…)',videoId:'_-CfiOTE51c'},
        {num:43,title:'GTA 5 RP A ZERO ! #43 (Je me venge… Adieu Sofia !)',videoId:'XfQ431R9ZEA'},
        {num:44,title:'GTA 5 RP A ZERO ! #44 (L\'évasion d\'Alvaro !)',videoId:'-xlaf2dGR0c'},
    ],
    'Saison 2':[
        {num:45,title:'GTA 5 RP A ZERO ! Saison 2 - #1 (Une Nouvelle vie !)',videoId:'K7rLIl5Qsr8'},
        {num:46,title:'GTA 5 RP A ZERO ! #2 (Éliminer Alvaro pour 800 000 $ ?!)',videoId:'-eez7ACh1yQ'},
        {num:47,title:'GTA 5 RP A ZERO ! #3 (Je quitte Cayo et j\'achète mon nouveau QG !)',videoId:'qmM0awmc_-s'},
        {num:48,title:'GTA 5 RP A ZERO ! #4 (Je lance ma propre Cam pour Devenir Millionnaire !)',videoId:'Ty75Iduv-yA'},
        {num:49,title:'GTA 5 RP A ZERO ! #5 (Adieu Antonio ! Sofia a des sentiments pour moi ?)',videoId:'lK27F-oZCA8'},
        {num:50,title:'GTA 5 RP A ZERO ! #6 (Je découvre des documents secrets sur ma famille, c\'est choquant)',videoId:'2CTaKIWVsrk'},
        {num:51,title:'GTA 5 RP A ZERO ! #7 (La hackeuse déchiffre le téléphone secret et... :o )',videoId:'DOO4GtLj5OY'},
        {num:52,title:'GTA 5 RP A ZERO ! #8 (Ils finissent tous en prison ? C\'est la merde..)',videoId:'eukwTE44S3E'},
        {num:53,title:'GTA 5 RP A ZERO ! #9 (Je deviens fou et j\'achète la Seat Cupra, c\'est la meilleure voiture)',videoId:'ld9bpNkKGyA'},
        {num:54,title:'GTA 5 RP A ZERO ! #10 (Je retrouve la voiture et la maison d\'Oliver ! Est-il encore en vie ?)',videoId:'cj3A-EQ5cME'},
        {num:55,title:'GTA 5 RP A ZERO ! #11 (Je suis devenu totalement fou !)',videoId:'iXaPmlf8c4Q'},
        {num:56,title:'GTA 5 RP A ZERO ! #12 (La mort est proche !)',videoId:'6U4Y2uydM6A'},
        {num:57,title:'GTA 5 RP A ZERO ! #13 (l\'épreuve la plus difficile de ma vie…)',videoId:'oVoWVd9poto'},
        {num:58,title:'GTA 5 RP A ZERO ! #14 (J\'attaque Cayo !)',videoId:'IFCouWNc5JM'},
        {num:59,title:'GTA 5 RP A ZERO ! #15 (Règlement de comptes avec les filles + La malédiction continue !)',videoId:'2z43rDf8fWQ'},
        {num:60,title:'GTA 5 RP A ZERO ! #16 (Elle est morte a cause de moi :( !)',videoId:'UKV9ODNlXm8'},
        {num:61,title:'GTA 5 RP A ZERO ! #17 (Face-à-face avec l\'assassin de ma mère !)',videoId:'Q5HSSnufasg'},
        {num:62,title:'GTA 5 RP A ZERO ! #18 (Je rencontre Raven et la guerre éclate !)',videoId:'66clRzk92bY'},
        {num:63,title:'GTA 5 RP ! #19 (Infiltration : Ce que j\'ai découvert au LSPD sur ma famille va vous choquer !)',videoId:'z-916xbhAvA'},
        {num:64,title:'GTA 5 RP A ZERO ! #20 (Vous n\'allez pas croire ce qu\'elle a fait !)',videoId:'xhF2b812y34'},
        {num:65,title:'GTA 5 RP A ZERO ! #21 (Il découvre mon identité secrète et ça tourne au drame !)',videoId:'oasjZOyZ3oM'},
        {num:66,title:'GTA 5 RP A ZERO ! #22 (Je me suis fait piéger !)',videoId:'OTw3FX_K6Nc'},
        {num:67,title:'GTA 5 RP A ZERO ! #23 (La vérité sur mon père , Oliver Winters !)',videoId:'g66i_ua0bQc'},
        {num:68,title:'GTA 5 RP A ZERO ! #24 (Mon père est toujours en vie ?!)',videoId:'R0BBgUj0uaw'},
        {num:69,title:'GTA 5 RP A ZERO ! #25 (Jake… Entre la vie et la mort !)',videoId:'rTJxigXXRqY'},
        {num:70,title:'GTA 5 RP A ZERO ! #26 (Je retrouve mon père !)',videoId:'z7soqPJ5AS0'},
        {num:71,title:'GTA 5 RP A ZERO ! #27 (Fin…)',videoId:'AJtJSKq4SAA'},
        {num:72,title:'GTA 5 RP A ZERO ! #28 (Le Jugement de Jake Winters : Prison à Vie ?)',videoId:'9Yx6hKmF76o'},
        {num:73,title:'GTA 5 RP A ZERO ! #29 (Le Dernier Souffle de Jake Winters)',videoId:'7qBa7wL-Oac'},
    ],
    'Saison 3':[
        {num:74,title:'GTA 5 RP A ZERO ! #1 - Saison 3 (Frères d\'hier, ennemis d\'aujourd\'hui)',videoId:'iF7AqvyqAUQ'},
        {num:75,title:'GTA 5 RP A ZERO ! #2 - Saison 3 (Elle est enceinte de moi !?)',videoId:'NP5V8TXbhWY'},
        {num:76,title:'GTA 5 RP A ZERO ! #3 (Ils m’ont volé les voitures de collection… j’suis foutu !)',videoId:'kITIURb2244'},
        {num:77,title:'GTA 5 RP A ZERO ! #4 (On part en Colombie… Lara Winters, on arrive !)',videoId:'aPZ2dyTew8w'},
        {num:78,title:'GTA 5 RP A ZERO ! #5 (Je capture Lara ?!)',videoId:'hbNX3xNxAbY'},
        {num:79,title:'GTA 5 RP A ZERO ! #6 (Je sais enfin toute la vérité sur mon père, Oliver Winters)',videoId:'RpOwbvO_FQU'},
        {num:80,title:'GTA 5 RP A ZERO ! #7 (J\'ai soulevé ma patronne et c\'est la catastrophe !)',videoId:'dkmFJ5Ve8dU'},
        {num:81,title:'GTA 5 RP A ZERO ! #8 (La mort de Raven...!)',videoId:'8xxmeGGg60Y'},
        {num:82,title:'GTA 5 RP A ZERO ! #9 (Je lui propose de se mettre en couple. Va-t-elle accepter ?)',videoId:'J1P-m6i87R4'},
        {num:83,title:'GTA 5 RP A ZERO ! #10 (Ma nouvelle copine part en prison... Je deviens fou !)',videoId:'enhaJYivHOE'},
        {num:84,title:'GTA 5 RP A ZERO ! #11 (Tom Escobar est lié à mon père...)',videoId:'hVqR4OamZgY'},
        {num:85,title:'GTA 5 RP A ZERO ! #12 (Je fais mon enterrement de vie de garçon… Rachel pète un câble !)',videoId:'KQ4UsLPSLfo'},
        {num:86,title:'GTA 5 RP À ZÉRO ! #13 (Le Mariage Piégé de Jake Winters)',videoId:'81Gd5ZIbiDA'},
        {num:87,title:'GTA 5 RP A ZERO ! #14 (Le Nouveau Jake Winters !)',videoId:'tvGdd92K-Pc'},
        {num:88,title:'GTA 5 RP A ZERO ! #15 (Je vais être papa !)',videoId:'t8ua6WCGwyg'},
        {num:89,title:'GTA 5 RP A ZERO ! #16 (On braque le plus gros concessionnaire de luxe !)',videoId:'nwg7lUi_CCY'},
        {num:90,title:'GTA 5 RP A ZERO ! #17 (Adieu Riri…)',videoId:'gLiadvsKNVA'},
        {num:91,title:'GTA 5 RP A ZERO ! #18 (Ils m\'ont tous trahi !)',videoId:'29oNb_Dh3is'},
        {num:92,title:'GTA 5 RP A ZERO ! #19 (Personne ne s’attendait à ce que je fasse ça !)',videoId:'nOExSKVCB3s'},
        {num:93,title:'GTA 5 RP A ZERO ! #20 (Il a osé… tuer mon meilleur ami ?!)',videoId:'AzM9osqc_ic'},
        {num:94,title:'GTA 5 RP A ZERO ! #21 (J’infiltre un gang très dangereux)',videoId:'biQjUPPJunU'},
        {num:95,title:'GTA 5 RP A ZERO ! #22 (Jake Winters, un traître ?)',videoId:'udYwKp-nQco'},
        {num:96,title:'GTA 5 RP A ZERO ! #23 (C\'est la fin , Adieu…)',videoId:'OyS_kxvrs5E'},
        {num:97,title:'GTA 5 RP A ZERO ! #24 (Ma femme me quitte ?)',videoId:'WAlObGdtb_w'},
        {num:98,title:'GTA 5 RP À ZÉRO ! #25 (L\'héritage de Jake Winters) !',videoId:'X6dwuyqMN6Q'},
        {num:99,title:'GTA 5 RP - Jake x Tom : La Rencontre avec Mon Père ! [Fin]',videoId:'r7Rq1RCInqQ'}
    ]
}, },
        { id:'oliver-winters', name:'Oliver Winters', image:'images/letigrebl/oliver.webp', banner:'images/letigrebl/oliver-bannière.webp',
          description:'Parti de rien pour bâtir son propre destin, Oliver Winters a gravi les échelons avec détermination, passant de simple chauffeur de taxi à propriétaire de son propre cinéma. Refusant de céder à l\'emprise de son père, le redoutable chef de Cayo Perico qui voulait faire de lui son héritier, il a choisi la voie de l\'indépendance jusqu\'à l\'affrontement final. Dans un dernier acte de courage, il est parvenu à mettre fin au règne de son père, scellant ainsi l\'histoire d\'un homme qui n\'a jamais voulu de cet héritage sanglant.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'JE RECOMMENCE GTA 5 RP A ZERO SANS TRICHER ! #1 (objectif atteindre le million)',videoId:'oELECDvHano'},
        {num:2,title:'JE RECOMMENCE GTA 5 RP A ZERO SANS TRICHER ! #2 (on achète quoi ?)',videoId:'8oCVicPpHbI'},
        {num:3,title:'JE RECOMMENCE GTA 5 RP A ZERO SANS TRICHER ! #3 (je travaille à la poste)',videoId:'CKmzaqVPK20'},
        {num:4,title:'JE RECOMMENCE GTA 5 RP A ZERO SANS TRICHER ! #4 (je drague la capitaine et ça paye)',videoId:'dZXk4QIX424'},
        {num:5,title:'GTA 5 RP A ZERO SANS TRICHER ! #5 (je deviens taximan enfin ça paye fort )',videoId:'RyyTpW_oALM'},
        {num:6,title:'GTA 5 RP A ZERO SANS TRICHER ! #6 (les gendarmes me font une proposition risquée)',videoId:'Pa8HU500Hn8'},
        {num:7,title:'GTA 5 RP A ZERO SANS TRICHER ! #7 (grosse embrouille)',videoId:'dB0ZUy2CQ6c'},
        {num:8,title:'GTA 5 RP A ZERO SANS TRICHER ! #8 (omg enfin les 10k!!!)',videoId:'zlOSnfk1-ow'},
        {num:9,title:'GTA 5 RP A ZERO SANS TRICHER ! #9 (je drague la commandante son mec rage)',videoId:'L3zDdxlRp_M'},
        {num:10,title:'GTA 5 RP A ZERO SANS TRICHER ! #10 (j\'ai enfin ma 205 GTI elle déchire!!!)',videoId:'O07_0ZsvG8c'},
        {num:11,title:'GTA 5 RP A ZERO SANS TRICHER ! #11 (j\'organise le date d\'un grand patron)',videoId:'1OrdiHT1UXE'},
        {num:12,title:'GTA 5 RP A ZERO ! #12 (je renverse du champagne sur la commandante)',videoId:'lQnVk8ZJ0f4'},
        {num:13,title:'GTA 5 RP A ZERO SANS TRICHER ! #13 (je suis dans la merde)',videoId:'sAz-8Y6wiQ4'},
        {num:14,title:'GTA 5 RP A ZERO ! #14 (on m\'a donné du sale , ça tourne mal)',videoId:'KG7Z7PDQXEs'},
        {num:15,title:'GTA 5 RP A ZERO ! #15 (je me fais chopper en train de vendre du sale)',videoId:'89cxc3Bw61E'},
        {num:16,title:'GTA 5 RP A ZERO ! #16 (je mets ma voiture aux enchères et je fais une folie)',videoId:'1maX_pHaMDM'},
        {num:17,title:'GTA 5 RP A ZERO ! #17 (je revend la 308 à un prix de malade!!)',videoId:'w44Vb2LbqZs'},
        {num:18,title:'GTA 5 RP A ZERO ! #18 (je suis patron du cinéma!!)',videoId:'Bx7L5o48f3A'},
        {num:19,title:'GTA 5 RP A ZERO ! #19 (je déménage et c\'est beaucoup mieux)',videoId:'MQngJS0fb-Y'},
        {num:20,title:'GTA 5 RP A ZERO ! #20 (la foule pour l\'ouverture du cinéma)',videoId:'KF5XlF5SH2w'},
        {num:21,title:'GTA 5 RP A ZERO ! #21 (les gendarmes veulent saisir mon cinéma)',videoId:'gJbENDXe7RY'},
        {num:22,title:'GTA 5 RP A ZERO ! #22 (je fais un énorme succès pour la première diffusion du film)',videoId:'nAtHpBJLF-k'},
        {num:23,title:'GTA 5 RP A ZERO ! #23 (grosse dispute en public contre Jennifer elle a un mec)',videoId:'smxO-zWsDGg'},
        {num:24,title:'GTA 5 RP A ZERO ! #24 (j\'installe du NOS dans mon taxi et ça déchire!!!)',videoId:'9skL9jKaOgE'},
        {num:25,title:'GTA 5 RP A ZERO ! #25 (la vérité sur Jennifer , trahison =\'( je suis triste)',videoId:'ZOUDLp0U8Ec'},
        {num:26,title:'GTA 5 RP A ZERO ! #26 (jme cache dans le coffre pour espionner Jennifer)',videoId:'Vraa_FJLNaY'},
        {num:27,title:'GTA 5 RP A ZERO ! #27 (elle m\'a embrassé =O)',videoId:'qHtsiv4a6Ys'},
        {num:28,title:'GTA 5 RP A ZERO ! #28 (j\'installe un moteur V8 sur mon taxi , c\'est devenu un monstre !)',videoId:'JSlCnyx6Qq8'},
        {num:29,title:'GTA 5 RP A ZERO ! #29 (on me kidnappe ça tourne très mal)',videoId:'tg9iCZksC3c'},
        {num:30,title:'GTA 5 RP A ZERO ! #30 (ils ont détruit mon taxi)',videoId:'8fnYalfo9SU'},
        {num:31,title:'GTA 5 RP A ZERO ! #31 (je défie un policier pour une course , il va être choqué)',videoId:'Wp-1EzkS5m8'},
        {num:32,title:'GTA 5 RP A ZERO ! #32 (je me fais suivre par des véhicules suspects , c\'est la merde)',videoId:'GarRZun1uB8'},
        {num:33,title:'GTA 5 RP A ZERO ! #33 (la police m\'embarque dans une course poursuite)',videoId:'qU7JYJ69yTc'},
        {num:34,title:'GTA 5 RP A ZERO ! #34 (mon premier Go Fast illégal)',videoId:'Aryp5NZtVk0'},
        {num:35,title:'GTA 5 RP A ZERO ! #35 (j\'ai craqué pour la 206 GTI stage 2)',videoId:'k7DfLCV-wx4'},
        {num:36,title:'GTA 5 RP A ZERO ! #36 (Jennifer dort chez moi :O)',videoId:'dzY65f6BujE'},
        {num:37,title:'GTA 5 RP A ZERO ! #37 (on a capturé les gendarmes mais…)',videoId:'hyl4X2TZj94'},
        {num:38,title:'GTA 5 RP A ZERO ! #38 (mon patron découvre que j\'ai modifié mon taxi)',videoId:'wjbjcU9xGPg'},
        {num:39,title:'GTA 5 RP A ZERO ! #39 (mon patron va t-il me virer ou pas ? le stress)',videoId:'K-nsamIbW14'},
        {num:40,title:'GTA 5 RP A ZERO ! #40 (on me vire et saisit mon taxi)',videoId:'5IFEqILpuh8'},
        {num:41,title:'GTA 5 RP A ZERO ! #41 (c\'est parti trop loin, je perds tout)',videoId:'zdzKfpC-Nh0'},
        {num:42,title:'GTA 5 RP A ZERO ! #42 (je finis aux urgences)',videoId:'hKr5vmiCQkg'},
        {num:43,title:'GTA 5 RP A ZERO ! #43 (je me fais embaucher au gouvernement)',videoId:'Rn2fXSa5IJ0'},
        {num:44,title:'GTA 5 RP A ZERO ! #44 (j\'ai retrouvé mon taxi mais …)',videoId:'Kr35irojP6A'},
        {num:45,title:'GTA 5 RP A ZERO ! #45 (je vous montre mon nouveau cinéma il est incroyable)',videoId:'t5d6IkkRmFk'},
        {num:46,title:'GTA 5 RP A ZERO ! #46 (j\'ai tuné ma 206 pour plus de 40 000 euros)',videoId:'TIQKpqPHj3A'},
        {num:47,title:'GTA 5 RP A ZERO ! #47 (ma première journée en tant que garde du corps présidentiel)',videoId:'VHpRDZYOsUk'},
        {num:48,title:'GTA 5 RP A ZERO ! #48 (Toute la vérité sur Oliver Winters)',videoId:'OwOVfDXF3Ng'},
        {num:49,title:'GTA 5 RP A ZERO ! #49 (je me retrouve dans un endroit interdit)',videoId:'t9QySBb2-AE'},
        {num:50,title:'GTA 5 RP A ZERO ! #50 (j\'ai franchi le cap avec Jennifer)',videoId:'b63X8izg20Q'},
        {num:51,title:'GTA 5 RP A ZERO ! #51 (j\'ai embauché des triplés mais...)',videoId:'L0IuU1YrIbM'},
        {num:52,title:'GTA 5 RP A ZERO ! #52 (j\'ouvre un colis interdit et c\'est choquant)',videoId:'tMxCrgjsnVA'},
        {num:53,title:'GTA 5 RP A ZERO ! #53 (je me fais une petite fortune avec le nouveau cinéma)',videoId:'HUvVM6cHZQc'},
        {num:54,title:'GTA 5 RP A ZERO ! #54 (je pète les plombs en plein travail)',videoId:'blkgROh6lsA'},
        {num:55,title:'GTA 5 RP A ZERO ! #55 (règlement de compte avec les triplées , ça part trop loin)',videoId:'8sRY46TT_SU'},
        {num:56,title:'GTA 5 RP A ZERO ! #56 (Les triplés s\'affrontent pour devenir directrice)',videoId:'EvwtEaLajVs'},
        {num:57,title:'GTA 5 RP A ZERO ! #57 (je pars sur l\'ile de Cayo et c\'est la catastrophe)',videoId:'kgvaodqPxes'},
        {num:58,title:'GTA 5 RP A ZERO ! #58 (Oliver face à son père)',videoId:'9qlMGWT_M4s'},
        {num:59,title:'GTA 5 RP A ZERO ! #59 (oh non elle est enceinte !!!)',videoId:'x7apFwQaf9s'},
        {num:60,title:'GTA 5 RP A ZERO ! #60 (je part en voyage d\'affaire à Los Angeles)',videoId:'BSPwteQNeNs'},
        {num:61,title:'GTA 5 RP A ZERO ! #61 (La rencontre avec Tom Escobar)',videoId:'SXUBhU8juLA'},
        {num:62,title:'GTA 5 RP A ZERO ! #62 (Et si j\'ouvrais mon entreprise Uber ?)',videoId:'3b73Co-f8ys'},
        {num:63,title:'GTA 5 RP A ZERO ! #63 (J\'assiste au plus gros braquage de banque et ça tourne très mal)',videoId:'-vlWI6am4-4'},
        {num:64,title:'GTA 5 RP A ZERO ! #64 (je joue au casino , je deviens riche ou pauvre?)',videoId:'OYMt7_kLYpI'},
        {num:65,title:'GTA 5 RP A ZERO ! #65 (je finis au poste de police =( )',videoId:'P8kZPO2Itn4'},
        {num:66,title:'GTA 5 RP A ZERO ! #66 (je fais une grosse folie)',videoId:'pmYY4RwuS0c'},
        {num:67,title:'LA CAVALE D\'OLIVER WINTERS - Episode final [Cinématique]',videoId:'1VXn08iMYWs'},
    ],
    'Saison 2':[
        {num:68,title:'JE RECOMMENCE GTA V RP A ZERO SANS TRICHER A LIBERTY CITY ! #1 SAISON 2',videoId:'Ml8rpu4ROnw'},
        {num:69,title:'GTA V RP A ZERO ! #2 (Un Taximan a New York ,  je suis débordé)',videoId:'2VNcDxIdZa4'},
        {num:70,title:'GTA V RP A ZERO ! #3 (Dois-je rejoindre la police de New York?)',videoId:'4utCrPHyIdc'},
        {num:71,title:'GTA V RP A ZERO ! #4 (je me bagarre contre une meuf)',videoId:'l1Juqsqtd2E'},
        {num:72,title:'GTA V RP A ZERO ! #5 (elle me propose de dormir avec elle dans sa voiture)',videoId:'omxa-ZPgaeo'},
        {num:73,title:'GTA V RP A ZERO ! #6 (je passe le concours pour être policier)',videoId:'RhKIWFOrF1A'},
        {num:74,title:'GTA V RP A ZERO ! #7 (elle m\'embrasse devant Maya)',videoId:'o2F80vDUoCM'},
        {num:75,title:'GTA V RP A ZERO ! #8 (le retour de Jennifer , grosse dispute)',videoId:'gO68uePMxaA'},
        {num:76,title:'GTA V RP A ZERO ! #9 (je suis entre la vie et la mort)',videoId:'ikx_zBfoy_M'},
        {num:77,title:'GTA V RP A ZERO ! #10 (je fous un scandale devant une boite de nuit)',videoId:'X-AKkQu3Qvc'},
        {num:78,title:'GTA V RP A ZERO ! #11 (j\'ai franchi le cap avec Maya)',videoId:'LtFtaXQ1nNM'},
        {num:79,title:'GTA V RP A ZERO ! #12 (je finis derrière les barreaux , c\'est la merde)',videoId:'Sgim5OpFPnQ'},
        {num:80,title:'GTA V RP A ZERO ! #13 (je suis en cavale , recherché par toute la ville)',videoId:'f4KGcByfwB0'},
        {num:81,title:'GTA V RP A ZERO ! #14 (j\'ai une prime de 200 000$ sur la tête :O )',videoId:'V-OAQ9qsTFc'},
        {num:82,title:'GTA V RP A ZERO ! #15 (Oliver Winters ennemi public numéro 1 . Seul contre tous)',videoId:'PuJEx1fDN2k'},
        {num:83,title:'GTA V RP A ZERO ! #16 (je me fais encerclé par tous les flics)',videoId:'zjIa-eqxVwY'},
        {num:84,title:'GTA V RP A ZERO ! #17 (les anciens gendarmes me retrouvent , on me fait du chantage)',videoId:'eZwwj4drnc4'},
        {num:85,title:'GTA V RP A ZERO ! #18 (Le face à face avec mon pire ennemi, la décision ultime)',videoId:'s2Rb1WDiHaI'},
        {num:86,title:'GTA V RP A ZERO ! #19 (Trahison ! Fin)',videoId:'TFqXBGSR_Bg'},
    ],
    'Saison 3':[
        {num:87,title:'GTA V RP A ZERO ! #1 (Nouvelle vie , je deviens pompiste) - Saison 3',videoId:'3g2TQkGc0Xo'},
        {num:88,title:'GTA V RP A ZERO ! #2 (je fais le sale boulot et c\'est pas facile)',videoId:'XHLdGTeZ5jI'},
        {num:89,title:'GTA V RP A ZERO ! #3 (je deviens mécano et je flash sur la golf GTI )',videoId:'RAqAtyrCP8k'},
        {num:90,title:'GTA V RP A ZERO ! #4 (Une Mercedes préparée spécialement pour braquage)',videoId:'UGGh1NqgUjs'},
        {num:91,title:'GTA V RP A ZERO ! #5 (Je passe mon permis Avion pour un gros projet)',videoId:'d1Hc38jhT7s'},
        {num:92,title:'GTA V RP A ZERO ! #6 (Je découvre Las Vegas pour la première fois)',videoId:'zDV5eYHatsw'},
        {num:93,title:'GTA V RP A ZERO ! #7 (Je vends les billets d\'avion , ça cartonne !!!)',videoId:'Rn4bQczDDus'},
        {num:94,title:'GTA V RP A ZERO ! #8 (Je teste l\'auto-tamponneuse et ça déchire !!! )',videoId:'osmp2Q-s2I0'},
        {num:95,title:'GTA V RP A ZERO ! #9 ( Mon premier vol touristique et ça paye)',videoId:'7vSI_XdBV2s'},
        {num:96,title:'GTA V RP A ZERO ! #10 (Oliver le mécano de Las Vegas + elle me raccompagne chez moi)',videoId:'HL4kN0rj4OM'},
        {num:97,title:'GTA V RP A ZERO ! #11 (Lexie me prouve ses sentiments)',videoId:'xEsIQA8oGpE'},
        {num:98,title:'GTA V RP A ZERO ! #12 (J\'ai dormi avec une fille du Cartel Madrazo , je suis dans la merde)',videoId:'DQvQV9HP3_4'},
        {num:99,title:'GTA V RP A ZERO ! #13 (je fais un gros succès en Père Noël + j\'avoue mes sentiments à Lexie)',videoId:'y_sf1USzyvI'},
        {num:100,title:'GTA V RP A ZERO ! #14 (Lexie m\'a trompé ,  je suis brisé)',videoId:'fyrvgASCwF8'},
        {num:101,title:'GTA V RP A ZERO ! #15 (Règlement de compte avec Lexie , je suis choqué)',videoId:'B3BBZwzr-Dg'},
        {num:102,title:'GTA V RP A ZERO ! #16 (J\'espionne ma Patronne , elle fait des trucs chelou)',videoId:'cuj_-3t_gdg'},
        {num:103,title:'GTA V RP A ZERO ! #17 (La Sœur cachée d\'Oliver Winters ?)',videoId:'oBoe7LyipZo'},
        {num:104,title:'GTA V RP A ZERO ! #18 (J\'ai enfin acheté l\'hôtel de luxe à 5 étoiles)',videoId:'rx5UHsvQyzA'},
        {num:105,title:'GTA V RP A ZERO ! #19 (Je règle mes comptes avec le nouveau mec de Lexie)',videoId:'vPhYHATCdDM'},
        {num:106,title:'GTA V RP A ZERO ! #20 (je teste des métiers comme dans la vraie vie , c fou !)',videoId:'XUUS5Q7Sy-0'},
        {num:107,title:'GTA V RP A ZERO ! #21 (L\'ouverture de l\'hôtel 5 Etoiles , on cartonne!)',videoId:'a1VsUt-c2C8'},
        {num:108,title:'GTA V RP A ZERO ! #22 (j\'ai enfin ma nouvelle voiture !)',videoId:'ZIeRj-1vyFs'},
        {num:109,title:'GTA V RP A ZERO ! #23 (j\'ai vendu ma Golf GTI à un prix de malade !)',videoId:'vTJS7ASjsL4'},
        {num:110,title:'GTA V RP A ZERO ! #24 (j\'achète 3 nouvelles voitures uniques !)',videoId:'alCFJ2i4WF8'},
        {num:111,title:'GTA V RP A ZERO ! #25 (mon business de voiture cartonne !)',videoId:'O4IG9MO2OeQ'},
        {num:112,title:'GTA V RP A ZERO ! #26 (Ma nouvelle Fiat peut monter à 300km/h)',videoId:'B36Dk0Q2nnI'},
        {num:113,title:'GTA V RP A ZERO ! #27 (J\'ai acheté la meilleure voiture, la Nissan GTR)',videoId:'eOTohrIpcVY'},
        {num:114,title:'GTA V RP A ZERO ! #28 (Un camion poubelle avec un compartiment secret à l\'intérieur)',videoId:'UHBTrYbZbvA'},
        {num:115,title:'GTA V RP A ZERO ! #29 (Cette Porsche m\'a couté une fortune + ventes aux enchères)',videoId:'THS0Z-th5tw'},
        {num:116,title:'GTA V RP A ZERO ! #30 (je l\'achète ou pas ?)',videoId:'uFFbz6ZWeeo'},
        {num:117,title:'GTA V RP A ZERO ! #31 (j\'installe un programme dans mon nouveau véhicule)',videoId:'_AS9hWR24sc'},
        {num:118,title:'GTA V RP A ZERO ! #32 (Je reçois des véhicules étranges et Lara me refait le look)',videoId:'tQnQEjkPbRA'},
        {num:119,title:'GTA V RP A ZERO ! #33 (j\'achète une voiture de collection + dispute avec Lara)',videoId:'gri2C7H1hwI'},
        {num:120,title:'GTA V RP A ZERO ! #34 (Un Date qui tourne mal ou pas ?)',videoId:'MS_8kYiithk'},
        {num:121,title:'GTA V RP A ZERO ! #35 (On me fait une proposition en OR, j\'accepte ou pas ?)',videoId:'yWXQyE1FEhs'},
        {num:122,title:'GTA V RP A ZERO ! #36 (j\'achète le casino ! je suis a sec)',videoId:'KJc0LRKO8Ew'},
        {num:123,title:'GTA V RP A ZERO ! #37 (Je mets tout mon argent dans ma caisse, je reviens à zéro)',videoId:'7Q7HcdMa5pI'},
        {num:124,title:'GTA V RP A ZERO ! #38 (J\'organise une fête illégale et ça finit très mal)',videoId:'u9538Q6yyE4'},
        {num:125,title:'GTA V RP A ZERO ! #39 (Je suis mis à la rue , c\'est la merde)',videoId:'oVKyz8HC64E'},
        {num:126,title:'GTA V RP A ZERO ! #40 (J\'ai fait une grosse bêtise , je suis recherché)',videoId:'hWDzmrr5Z5g'},
        {num:127,title:'GTA V RP A ZERO ! #41 (je teste des métiers comme dans la vraie vie , pizzaiolo !)',videoId:'Aj8i0eb2hqA'},
        {num:128,title:'GTA V RP A ZERO ! #42 (j\'arrache des distributeurs de billets avec ma Fiat!)',videoId:'i74M7ialE7o'},
        {num:129,title:'GTA V RP A ZERO ! #43 (Je parie ma carte grise contre une BMW M4)',videoId:'dRxZLYRq2s0'},
        {num:130,title:'GTA V RP A ZERO ! #44 (Ma nouvelle Audi RS6 , c\'est un monstre !)',videoId:'1AiLwiU_Pg8'},
        {num:131,title:'GTA V RP A ZERO ! #45 (J\'ouvre le Casino , enfin millionnaires ?)',videoId:'sxo4C4eZKr4'},
        {num:132,title:'GTA V RP A ZERO ! #46 (Ma première folie en tant que millionnaire)',videoId:'7cFqSeyRATE'},
        {num:133,title:'GTA V RP A ZERO ! #47 (J\'achète ma villa de rêve à 500 000$)',videoId:'LlcqUwFvhDo'},
        {num:134,title:'GTA V RP A ZERO ! #48 (J\'achète une Rolls Royce plus chère que ma villa)',videoId:'FeXuw6fa02s'},
        {num:135,title:'GTA V RP A ZERO ! #49 (Je perds énormément d\'argent au casino)',videoId:'OAL97tYjXv8'},
        {num:136,title:'GTA V RP A ZERO ! #50 (On a détruit ma Rolls Royce à 500 000 $)',videoId:'uAakh4ezK8M'},
        {num:137,title:'GTA V RP A ZERO ! #51 (On a brûlé mon casino , j\'ai trop la rage !)',videoId:'g5C8p1LHFDo'},
        {num:138,title:'GTA V RP A ZERO ! #52 (Je revends tous mes véhicules pour acheter des armes lourdes)',videoId:'LQxCTAQF1oI'},
        {num:139,title:'GTA V RP A ZERO ! #53 (c\'est le grand jour , on infiltre Cayo Perico)',videoId:'dvEhgAlDCWU'},
        {num:140,title:'Oliver Winters - Le Combat final contre son père - Le film ! #54',videoId:'y_-uEfyGbGE'}
    ]
}, }
      ]
    },
    escobar: {
      id:'escobar', name:'Escobar', color:'#e67e22',
      image:'images/tom_escobar.png', banner:'images/tom_escobar.png',
      characters:[
        { id:'tom-escobar', name:'Tom Escobar', image:'images/letigrebl/tom.webp', banner:'images/letigrebl/tom-bannière.webp',
          description:'Fils du président et véritable petit prodige, Tom Escobar est un génie qui a toujours eu plusieurs longueurs d\'avance. Il a donné naissance à des inventions incroyables comme les robots Agent X et Iron X ou encore l`\'Oeil du Faucon. Il adore plaisanter et ne cache pas son petit côté charmeur dès qu\'il croise une jolie femme. ',
          seasons:{
    'Saison 1':[
        {num:1,title:'JE ME TRANSFORME EN ENFANT DE 7 ANS ET ROULE DANS UNE LAMBORGHINI DEVANT UN FLIC ! GTAV RP MOD #1',videoId:'TQC_pXz-_YY'},
        {num:2,title:'UN GAMIN DE 7 ANS PAYE 3 MILLIONS DE DOLLARS POUR ENTRER DANS UNE BOÎTE DE NUIT ! GTAV RP MOD #2',videoId:'Oeut24vtKKw'},
        {num:3,title:'JE M\'INFILTRE AU COMMISSARIAT AVEC LE GAMIN POUR RÉCUPÉRER MA LAMBORGHINI ! GTAV RP MOD #3',videoId:'eaysqD3HIko'},
        {num:4,title:'UN GAMIN DE 7 ANS BRAQUE UNE BANQUE AVEC UNE BANANE ! GTAV RP MOD #4',videoId:'f0DYxH3F-1w'},
        {num:5,title:'UN GAMIN DE 7 ANS TRAFIQUANT D\'ARMES ! GTAV RP MOD #5',videoId:'GDhVfuaXO68'},
        {num:6,title:'UN GAMIN DE 7 ANS RECHERCHÉ PAR TOUTE LA POLICE ! GTAV RP MOD #6',videoId:'GmGd_ZZe-uA'},
        {num:7,title:'UN GAMIN DE 7 ANS  KIDNAPPE SA BELLE MÈRE ! GTAV RP MOD #7',videoId:'4pK12uVWSFI'},
        {num:8,title:'UN GAMIN DE 7 ANS DEVIENT POLICIER ET ARRÊTE DES CRIMINELS ! GTAV RP MOD #8',videoId:'LeKOiCu0cak'},
        {num:9,title:'UN GAMIN DE 7 ANS SE FAIT KIDNAPPER PAR DES BANDITS ! GTAV RP MOD #9',videoId:'snC4AOfXDn0'},
        {num:10,title:'UN GAMIN DE 7 ANS SURPREND SA BELLE MÈRE QUI TROMPE SON PÈRE ! GTAV RP MOD #10',videoId:'z0GUWMqIs-E'},
        {num:11,title:'UN GAMIN DE 7 ANS DÉFONCE SA BELLE MÈRE ! GTAV RP MOD #11',videoId:'ljh8ghN1eyw'},
        {num:12,title:'LA POLICE VEUT LA DÉMISSION DU PRÉSIDENT A CAUSE DE SON FILS - GTAV RP MOD #12',videoId:'D5S0RqPVKNc'},
        {num:13,title:'UN GAMIN DE 7 ANS DEVIENT GANGSTER POUR SE VENGER DE SA BELLE MÈRE ! GTAV RP MOD #13',videoId:'fCOL9OyZn68'},
        {num:14,title:'UN GAMIN DE 7 ANS POURSUIVI PAR 10 POLICIERS ! GTAV RP MOD #14',videoId:'ijllR-pSeTQ'},
        {num:15,title:'UN GAMIN DE 7 ANS KIDNAPPE UN VIEUX DE 70 ANS ! GTAV RP MOD',videoId:'D0ipG53DNHE'},
        {num:16,title:'UN GAMIN DE 7 ANS VEND LES VOITURES DE SON PÈRE A 3 MILLIONS DE DOLLARS ! GTAV RP MOD #16',videoId:'tzFak_CLaOc'},
        {num:17,title:'UN GAMIN DE 7 ANS TOMBE AMOUREUX D\'UNE INFIRMIÈRE D’ÉCOLE ! GTAV RP MOD #17',videoId:'RlUuxpzBgYg'},
        {num:18,title:'UN GAMIN DE 7 ANS EN PRISON ? GTAV RP MOD #18',videoId:'U-y8nxYlk-8'},
        {num:19,title:'TOM ESCOBAR FAIT SON PREMIER MEURTRE ! GTAV RP MOD #19',videoId:'q0QcNdrPizI'},
        {num:20,title:'UN GAMIN DE 7 ANS RETOURNE TOUTE LA VILLE ! GTAV RP MOD #20',videoId:'7Xj0kC41rA4'},
        {num:21,title:'UN GAMIN DE 7 ANS ÉLIMINE SA BELLE MÈRE ! GTAV RP MOD #21',videoId:'CtO_rzy4Vp4'},
        {num:22,title:'UN GAMIN DE 7 ANS GÉNIE DU MAL ! GTAV RP MOD #22',videoId:'q2pnLqYuW7g'},
        {num:23,title:'UN GAMIN DE 7 ANS FAIT DU BOUCHE A BOUCHE A L’INFIRMIÈRE DE L\'ECOLE ! GTAV RP MOD #23',videoId:'R0Rai1R0PQU'},
        {num:24,title:'UN GAMIN DE 7 ANS DÉFONCE UN LYCÉEN ! GTAV RP MOD #24',videoId:'a6bETxaIVVE'},
        {num:25,title:'UN GAMIN DE 7 ANS S’ÉVADE DU LYCÉE AVEC SA NOUVELLE COPINE ! GTAV RP MOD #25',videoId:'xRuPEqiOgNA'},
        {num:26,title:'UN GAMIN DÉBARQUE AU LYCÉE AVEC 2 DANSEUSES DE BOÎTE DE NUIT ! GTAV RP MOD #26',videoId:'K5qhBDjnG7w'},
        {num:27,title:'UN GAMIN DE 7 ANS TUE LE PÈRE D\'UN ÉLÈVE ! GTAV RP MOD #27',videoId:'yejT1_G-lvU'},
        {num:28,title:'UN GAMIN DE 7 ANS DÉFONCE UN PROF D’ÉCOLE ! GTAV RP MOD #28',videoId:'ByY_QPMP4vA'},
        {num:29,title:'UN GAMIN DE 7 ANS TUE SA CAVALIÈRE DU BAL PROMO ! GTAV RP MOD #29',videoId:'z_hd6qE_QpQ'},
        {num:30,title:'UN GAMIN DE 7 ANS MOMIFIE LE CORPS DE SA VICTIME ! GTAV RP MOD #30',videoId:'eytyV8fcKY0'},
        {num:31,title:'UN GAMIN DE 7 ANS MILLIONNAIRE RISQUE D’ÊTRE PAUVRE ! GTAV RP MOD #31',videoId:'fmMvQKjOtT8'},
        {num:32,title:'UN GAMIN DE 7 ANS SAUVE SA COPINE DE 10 ANS ! LE DIRECTEUR VEUT NOUS TUER ! GTAV RP MOD #32',videoId:'pPn3y1Y33qk'},
        {num:33,title:'UN GAMIN DE 7 ANS DÉTRUIT TOUTE LA VILLE AVEC UN ROBOT INVINCIBLE ! GTAV RP MOD #33',videoId:'7tnBa0qzRAk'},
        {num:34,title:'UN GAMIN DE 7 ANS CONTRÔLE TOUTE LA VILLE ! GTAV RP #34',videoId:'9nqF26PwVbo'},
        {num:35,title:'UN GAMIN DE 7 ANS HACK TOUTE LA VILLE ! GTAV RP MOD #35',videoId:'dbY2D6lF-YE'},
        {num:36,title:'UN GAMIN DE 7 ANS SAUVE SON PAPA D\'UNE SECRÉTAIRE TUEUSE ! GTAV RP MOD #36',videoId:'Hf8V__WB_jg'},
        {num:37,title:'UN GAMIN DE 7 ANS DÉTRUIT LA MAZE BANK ! GTAV RP MOD #37',videoId:'RgQnUxR6aUs'},
        {num:38,title:'UN GAMIN DE 7 ANS TRANSFORME UNE FEMME EN ROBOT ! GTAV RP MOD #38',videoId:'EtgLaBbjc5s'},
        {num:39,title:'UN GAMIN DEMANDE 1 MILLIARD DE DOLLARS OU DESTRUCTION DE LA VILLE ! GTAV RP MOD #39',videoId:'TcDXJj1qmmc'},
        {num:40,title:'UN GAMIN DE 7 ANS NOUVEAU PRÉSIDENT DE LA VILLE ! GTAV RP MOD #40',videoId:'bmjmoHmhHwc'},
        {num:41,title:'UN GAMIN DE 7 ANS CONTRÔLE TOUTE LA POLICE ! GTAV RP MOD #41',videoId:'KipXFywgZ3g'},
        {num:42,title:'UN GAMIN SURPREND SON PÈRE A EMBRASSER LA VICE PRÉSIDENTE ! GTAV RP MOD #42',videoId:'R-gQp7F499Y'},
        {num:43,title:'UN GAMIN BRAQUE TOUTES LES BANQUES AVEC UNE VOITURE TÉLÉCOMMANDÉ ! GTAV RP MOD #43',videoId:'-PiZ3b8wV5s'},
        {num:44,title:'UN GAMIN DE 12 ANS VOLEUR PROFESSIONNEL ! GTAV RP MOD #1',videoId:'yhPXodchAgI'},
        {num:45,title:'UN GAMIN DE 12 ANS CAMBRIOLE DES MAISONS ! GTAV RP MOD #2',videoId:'xOkem9Tr6eU'},
        {num:46,title:'UN GAMIN DE 12 ANS CAMBRIOLE LA MAISON DE TOM CA TOURNE MAL ! GTAV RP MOD #3',videoId:'-9Y_a0dBDvU'},
        {num:47,title:'DEUX GAMINS FONT DU SALE A LA VICE PRÉSIDENTE ! GTAV RP MOD #4',videoId:'X33PbwgZdjs'},
        {num:48,title:'UN GAMIN DE 7 ANS GÂCHE LE MARIAGE DU PRÉSIDENT ! GTAV RP MOD #44',videoId:'BI2Ah_B7lYk'},
        {num:49,title:'UN GAMIN DE 7 ANS VOLE LA FORMULE 1 DE SON PÈRE ! GTAV RP MOD #45',videoId:'jBRC7-kqAW8'},
        {num:50,title:'UN GAMIN DE 7 ANS JETTE SA BELLE MÈRE AU REQUINS ! GTAV RP MOD #46',videoId:'UH9DFWeKg8A'},
        {num:51,title:'UN GAMIN DE 7 ANS PECHO TOUTE LES FEMMES DE LA VILLE ! GTAV RP MOD #47',videoId:'FhAke-pbL84'},
        {num:52,title:'UN GAMIN DE 7 ANS BRAQUE DES CIVILS AVEC UN PISTOLET LASER ! GTAV RP MOD #48',videoId:'jsKtg5CO_-Q'},
        {num:53,title:'UN GAMIN DE 7 ANS  DÉTRUIT LA VILLE AVEC UN LASER ULTRA PUISSANT ! GTAV RP MOD #49',videoId:'fugCwIX6uHc'},
        {num:54,title:'UN GAMIN DE 7 ANS FAIT DU SALE A LA LIEUTENANTE DANS LA VOITURE ! GTAV RP MOD #50',videoId:'_ASW1WlckTs'},
        {num:55,title:'UN GAMIN DE 7 ANS SE BAT CONTRE SON DIRECTEUR ! GTAV RP MOD #51',videoId:'SqoGWKrNYEI'},
        {num:56,title:'UN GAMIN DE 7 ANS PLANTE DE LA WEED A LA MAISON BLANCHE ! GTAV RP MOD #52',videoId:'S0BELd0jIyo'},
        {num:57,title:'UN GAMIN DE 7 ANS DROGUE LA LIEUTENANTE ! GTAV RP MOD #53',videoId:'qkqyuDtpMH4'},
        {num:58,title:'LA POLICE DÉCOUVRE LE TRAFIC DE WEED A LA MAISON BLANCHE ! GTAV RP MOD #54',videoId:'fMCAeWiumLM'},
        {num:59,title:'UN GAMIN DE 7 ANS ACHÈTE DISNEYLAND A 300 000 000$ ! GTAV RP MOD #55',videoId:'1jjjIG0cS9Y'},
        {num:60,title:'UN GAMIN DE 7 ANS ACHÈTE TOUTES LES VOITURES DE LUXE POUR SON ANNIVERSAIRE ! GTAV RP MOD #56',videoId:'pnQ-rqeh4Lw'},
        {num:61,title:'UN GAMIN DE 7 ANS SE FAIT RÉTRÉCIR A 5 CENTIMÈTRES ! GTAV RP MOD #57',videoId:'U9huzYetF2Y'},
        {num:62,title:'UN GAMIN DE 7 ANS SE FAIT KIDNAPPER PAR SON DIRECTEUR ! GTAV RP MOD #58',videoId:'eSnjHwfZKyk'},
        {num:63,title:'UN GAMIN DE 7 ANS FAIT DU SALE A UNE MEUF MAGNIFIQUE ! GTAV RP MOD #59',videoId:'ZqcqkFUy7KY'},
        {num:64,title:'UN GAMIN DE 7 ANS DÉTRUIT L\'ECOLE ! GTAV RP MOD #60',videoId:'M83QS5S77q0'},
        {num:65,title:'UN GAMIN DE 7 ANS NOUVEAU DIRECTEUR DE L\'ECOLE ! GTAV MOD #61',videoId:'uEC_pZvvFes'},
        {num:66,title:'UN GAMIN DE 7 ANS VOLE LES CLEFS D\'UN PASSAGE SECRET DANS L\'ECOLE ! GTAV RP MOD #62',videoId:'nr3LHgM8i_Q'},
        {num:67,title:'UN GAMIN DE 7 ANS PREND UNE DOUCHE AVEC UNE ETUDIANTE ! GTAV RP MOD #63',videoId:'IjGa8XhAu3E'},
        {num:68,title:'UN GAMIN DE 7 ANS CRÉE UNE TORNADE GÉANTE A L\'ECOLE ! GTAV RP MOD #64',videoId:'TQIU7JEfW_Q'},
        {num:69,title:'UN GAMIN DE 7 ANS FOU LE GROS BORDEL A L\'ECOLE ! ALERTE ROUGE ! GTAV RP MOD #65',videoId:'ncGECxZifYo'},
        {num:70,title:'UN GAMIN DE 7 ANS ENFERME LE DIRECTEUR DANS UNE CAGE ! GTAV RP MOD #66',videoId:'7M10ecZliBw'},
        {num:71,title:'UN GAMIN DE 7 ANS SE TRANSFORME EN DIRECTEUR ET CONTRÔLE L\'ECOLE ! GTAV RP MOD #67',videoId:'K55PXUVOAdU'},
        {num:72,title:'TOM ESCOBAR ! LA VÉRITÉ ! TRAILER OFFICIEL',videoId:'HSPAJ6SvVgg'},
        {num:73,title:'TOM ESCOBAR LE FILM OFFICIEL ! LA VÉRITÉ !',videoId:'gH5Eioo6FBk'},
        {num:74,title:'UN GAMIN DE 7 ANS ENFERME DES ÉLÈVES DANS UN CASIER ! GTAV RP MOD #68',videoId:'3FLQBfu9rcs'},
        {num:75,title:'UN GAMIN DE 7 ANS S’ÉVADE DE L\'ECOLE ET ÇA TOURNE MAL ! GTAV RP MOD #69',videoId:'GQP23czihlM'},
        {num:76,title:'UN GAMIN DE 7 ANS TROUVE ENFIN L\'AMOUR DE SA VIE ! GTAV RP MOD #70',videoId:'_Ste46GQmXQ'},
        {num:77,title:'UN GAMIN DE 7 ANS ACHÈTE UNE MAISON A 500 000$ POUR SA CHÉRIE ! GTAV RP MOD #71',videoId:'Eb3Q-e8jFzI'},
        {num:78,title:'UN GAMIN DE 7 ANS ESPIONNE LA BOITE DE STR*P-TE*SE AVEC UN MINI DRONE ! GTAV RP MOD #72',videoId:'OhGOfghLlmE'},
        {num:79,title:'UN GAMIN DE 7 ANS ACHÈTE UNE BOITE DE NUIT POUR ADULTE +18 ! GTAV RP MOD #73',videoId:'AslZhqaGZlo'},
        {num:80,title:'UN GAMIN DE 7 ANS PAYE UNE FORTUNE POUR UN SHOW PRIVÉ ! GTAV RP MOD #74',videoId:'tATrTP9FSrE'},
        {num:81,title:'UN GAMIN DE 7 ANS RECRUTE DES DANSEUSES POUR SA BOITE ! GTAV RP MOD #75',videoId:'ped4yoCuRHA'},
        {num:82,title:'UN GAMIN DE 7 ANS EMBRASSE UNE FILLE DE 17 ANS ! GTAV RP MOD #76',videoId:'4SSwZV5BoF8'},
        {num:83,title:'UN GAMIN DE 7 ANS TRAHI SA COPINE AVEC D\'AUTRES FEMMES ! GTAV RP MOD #77',videoId:'vDuDmuWEZgg'},
        {num:84,title:'UN GAMIN DE 7 ANS RECOUVRE SES DANSEUSES DE PEINTURE ! GTAV RP MOD #78',videoId:'G9urAoL5JxY'},
        {num:85,title:'UN GAMIN DE 7 ANS VEND DE LA DR*GUE DANS SA BOITE ! GTAV RP MOD #79',videoId:'P7mxD7PQzmw'},
        {num:86,title:'UN GAMIN DE 7 ANS CONTRÔLE UNE VOITURE DE POLICE A DISTANCE ! GTAV RP MOD #80',videoId:'sO8CCpKorek'},
        {num:87,title:'UN GAMIN DE 7 ANS MET UNE CAMERA LA OU IL FAUT PAS ! GTAV RP MOD #81',videoId:'gJhqnnG8dF4'},
        {num:88,title:'UN GAMIN DE 7 ANS SE FIANCE SUR SON NOUVEAU BATEAU DE LUXE ! GTAV RP MOD #82',videoId:'CYpKFQUquy4'},
        {num:89,title:'UN GAMIN DE 7 ANS MONTRE SON QG D\'AVENGERS A ABDOUL ET SONIC ! GTAV RP MOD #83',videoId:'jIEDTK8qDUw'},
        {num:90,title:'UN GAMIN DE 7 ANS ATTAQUE LA PLUS GROSSE BANQUE AVEC SES GADGETS ! GTAV RP MOD #84',videoId:'qQ_BhSZBsJ0'},
        {num:91,title:'UN GAMIN DE 7 ANS REÇOIT UNE MINI LAMBORGHINI ! GTAV RP MOD #85',videoId:'wSrcS4xroo8'},
        {num:92,title:'UN GAMIN DE 7 ANS BRISE LE COUPLE DE SON PÈRE ! GTAV RP MOD #86',videoId:'qQPycoud3dM'},
        {num:93,title:'UN GAMIN DE 7 ANS COMPLOTE POUR REMPLACER SA BELLE MÈRE PAR SONIC ! GTAV RP MOD #87',videoId:'12lZHIUl1Rc'},
        {num:94,title:'UN GAMIN DE 7 ANS RELOOK CETTE FEMME POUR SÉDUIRE SON PÈRE ! GTAV RP MOD #88',videoId:'fAl4zZwmC-M'},
        {num:95,title:'UN GAMIN DE 7 ANS A T\'IL VRAIMENT OSÉ FAIRE ÇA ?! GTAV RP MOD #89',videoId:'B79lH5vtN1Y'},
        {num:96,title:'UN GAMIN DE 7 ANS V.S LE STRING DE GUERRE ! GTAV RP MOD #90',videoId:'J5rN40de-I8'},
        {num:97,title:'UN GAMIN DE 7 ANS FOU LE BORDEL DANS UN QUARTIER DANGEREUX ! GTAV RP MOD #91',videoId:'3V8S19imjrw'},
        {num:98,title:'UN GAMIN DE 7 ANS S\'INFILTRE DANS LA BASE MILITAIRE AVEC SON MINI DRONE ! GTAV RP MOD #92',videoId:'xjxpxag5M8w'},
        {num:99,title:'UN GAMIN DE 7 ANS VOLE UN TANK A LA BASE MILITAIRE ! GTAV RP MOD #93',videoId:'PRFAQH6g1Jk'},
        {num:100,title:'UN GAMIN DE 7 ANS ATTAQUE UN QUARTIER DANGEREUX AVEC UN MINI TANK ! GTAV RP MOD #94',videoId:'Z-w3ZMDDI8U'},
        {num:101,title:'UN GAMIN DE 7 ANS MORT !? GTAV RP MOD #95',videoId:'1AoP05mb51Q'},
        {num:102,title:'UN GAMIN DE 7 ANS RÉVÈLE QU\'IL EST AGENT X ! GTAV RP MOD #96',videoId:'U1lzml3yuzg'},
        {num:103,title:'UN GAMIN DE 7 ANS VEUT 1 MILLIARD DE DOLLARS POUR SON ANNIVERSAIRE ! GTAV RP MOD #97',videoId:'OhA9b9vR4YA'},
        {num:104,title:'UN GAMIN DE 7 ANS VOLE UN CHARIOT DE LINGOTS D\'OR ! GTAV RP MOD #98',videoId:'G0vVZ-f3Uhg'},
        {num:105,title:'UN GAMIN DE 7 ANS DOIT ALLER A LIBERTY CITY POUR LA NASA ! GTAV RP MOD #99',videoId:'BjXfNkDOVjE'},
        {num:106,title:'L\'INCROYABLE ANNIVERSAIRE DE TOM ESCOBAR ! TRAILER OFFICIEL',videoId:'bzpuVp-affc'},
        {num:107,title:'L\'INCROYABLE ANNIVERSAIRE DE TOM ESCOBAR ! GTAV RP MOD #100 FINAL',videoId:'Eqqpyn7J7PA'}
    ],
    'Saison 2':[
        {num:1,title:'UN GAMIN DE 8 ANS DÉCOUVRE LIBERTY CITY (NEW YORK) ! GTAV RP MOD #1 SAISON 2',videoId:'meORtqVQrxM'},
        {num:2,title:'UN GAMIN DE 8 ANS INTÈGRE ENFIN LA NASA ! GTAV RP MOD #2- SAISON 2',videoId:'2GqzhKWtfHU'},
        {num:3,title:'UN GAMIN DE 8 ANS S\'INFILTRE DANS LA ZONE 51 ! GTAV RP MOD #3 - SAISON 2',videoId:'Q_YW9M9Du88'},
        {num:4,title:'UN GAMIN DE 8 ANS CRÉE UN MINI ROBOT POUR SAUVER AGENT X ! GTAV RP MOD #4 - SAISON 2',videoId:'Eu_4wmb_vMM'},
        {num:5,title:'UN GAMIN DE 8 ANS REND FOUS LES POLICIERS AVEC MINI AGENT X ! GTAV RP MOD #5 - SAISON 2',videoId:'SXUaL0lJTqg'},
        {num:6,title:'UN GAMIN DE 8 ANS DÉCOUVRE LE QG D\'AGENT X DÉTRUIT ! GTAV RP #6 - SAISON 2',videoId:'a4bud4ZiL6Y'},
        {num:7,title:'QUELQU\'UN A VOLÉ AGENT X ET TOUT L\'OR ! GTAV RP MOD #7 - SAISON 2',videoId:'9eWCRD8zyNY'},
        {num:8,title:'MON PAPA TROMPE SONIC AVEC UNE DANSEUSE ! GTAV RP MOD #8 - SAISON 2',videoId:'y56zSSlbOFM'},
        {num:9,title:'UN GAMIN DE 8 ANS APPREND QUE SON PAPA N\'EST PLUS PRESIDENT ! GTAV RP MOD #9',videoId:'6okiCRiNeJA'},
        {num:10,title:'UN GAMIN DE 8 ANS RETOURNE A LOS SANTOS EN SOUCOUPE VOLANTE ! GTAV RP MOD #10',videoId:'q0k7EXSfW5Y'},
        {num:11,title:'UN GAMIN DE 8 ANS AIDE UN GANG A BRAQUER UNE BANQUE ! GTAV RP MOD #11',videoId:'0Ivu_4vJkXk'},
        {num:12,title:'UN GAMIN DE 8 ANS SE DÉGUISE EN ALIEN ET REND FOU TOUTE LA VILLE ! GTAV RP MOD #12',videoId:'CRn9zGjZsjQ'},
        {num:13,title:'LA NOUVELLE VOITURE DE TOM ESCOBAR ! GTAV RP MOD #13 - SAISON 2',videoId:'666ERo_kE0A'},
        {num:14,title:'UN GAMIN DE 8 ANS APPREND QUE SA MAMAN A QUITTER SON PAPA ! GTAV RP MOD #14',videoId:'SyAs4aWSQas'},
        {num:15,title:'UN GAMIN DE 8 ANS RETROUVE CELUI QUI A VOLÉ SON OR ! GTAV RP MOD #15',videoId:'oB91HLP5CVI'},
        {num:16,title:'TOM ESCOBAR LE NOUVEAU PRINCE DE LA VILLE ! GTAV RP MOD #16',videoId:'U7MyqVQAtWE'},
        {num:17,title:'TOM ESCOBAR VS AGENT X ! LE FACE A FACE ! GTAV RP MOD #17',videoId:'kjBHN5L2nBs'},
        {num:18,title:'AGENT X VS MINI AGENT X ! LE COMBAT ULTIME ! GTAV RP MOD #18',videoId:'mqquMhcyUVE'},
        {num:19,title:'UN GAMIN DE 8 ANS APPREND QU\'AGENT X VEUT ETRE PRÉSIDENT ! GTAV RP MOD #19',videoId:'gCLxA9BMoZM'},
        {num:20,title:'LA FIN DE TOM ESCOBAR ! TSUNAMI ! GTAV RP MOD #20',videoId:'uPubVUJG9Wg'},
        {num:21,title:'LOS SANTOS SOUS L\'EAU ! TOM A TOUT PERDU ! GTAV RP MOD #21',videoId:'x4cjZgAKjXY'},
        {num:22,title:'UN GAMIN DE 8 ANS ASPIRÉ AU FOND DE L’OCÉAN ! GTAV RP MOD #22',videoId:'NRxZHO9FeuY'},
        {num:23,title:'UN GAMIN DE 8 ANS TROUVE LA LAMBORGHINI DE SES RÊVE A 12 MILLIARD $ ! GTAV RP MOD #23',videoId:'2FSdYhMT67s'},
        {num:24,title:'UN GAMIN DE 8 ANS VOLE LA LAMBO A 12 MILLIARDS $ ! GTAV RP MOD #24',videoId:'8GZUaXS-b80'},
        {num:25,title:'UN GAMIN DE 8 ANS DANS L\'ESPACE ! GTAV RP MOD #25',videoId:'wrPQKJQIZ-k'},
        {num:26,title:'TOM ESCOBAR LE PREMIER ENFANT SUR MARS ! GTAV RP MOD #26',videoId:'BINp6yDlBis'},
        {num:27,title:'UN GAMIN DE 8 ANS ABSORBÉ DANS UN TROU NOIR ! EPISODE FINAL SAISON 2 ! GTAV RP MOD',videoId:'25gTd0F6tK8'}
    ],
    'Saison 3':[
        {num:1,title:'UN GAMIN DE 8 ANS SE RÉVEILLE EN FRANCE A PARIS ! GTAV RP MOD #1 - SAISON 3',videoId:'yRMBSEcYZ6g'},
        {num:2,title:'UN GAMIN DE 8 ANS S’ÉVADE DE PRISON ! LA POLICE DEVIENT FOLLE ! GTAV RP MOD #2 - SAISON 3',videoId:'_q2AY7XBjvo'},
        {num:3,title:'UN GAMIN DE 8 ANS RETROUVE SON PAPA MAIS... ! GTAV RP MOD #3',videoId:'7G82La1dBcw'},
        {num:4,title:'UN GAMIN DE 8 ANS ECHANGE UNE FERRARI POLICE CONTRE DEUX FEMMES ! GTAV RP MOD #4',videoId:'Dw60PvEDm7E'},
        {num:5,title:'UN GAMIN DE 8 ANS FAIT DU SALE A UNE POLICIÈRE DANS SA FERRARI ! GTAV RP MOD #5',videoId:'8ItMaFdhNqM'},
        {num:6,title:'UN GAMIN DE 8 ANS DONNE DE LA WEED A SON PAPA POUR SE FAIRE PARDONNER MS... ! GTAV RP MOD #6',videoId:'wifzyTxc0tY'},
        {num:7,title:'UN GAMIN DE 8 ANS FILME LA SERGENTE A POIL ! GTAV RP MOD #6',videoId:'HSivUwJz1hc'},
        {num:8,title:'UN GAMIN DE 8 ANS DÉFONCE TOUT AVEC SA MINI SULTAN RS ! GTAV RP MOD #7',videoId:'rBjWcms46g8'},
        {num:9,title:'UN GAMIN DE 8 ANS VA T\'IL RETROUVER SA MÉMOIRE GRACE A CETTE FEMME ? GTAV RP MOD #8',videoId:'q4wRM0k1ZHk'},
        {num:10,title:'UN GAMIN DE 8 ANS TOMBE AMOUREUX DE SA PSY ! GTAV RP MOD #8',videoId:'r02V3_NJeO0'},
        {num:11,title:'UN GAMIN DE 8 ANS SE SOUVIENT D\'ABDOUL ! GTAV RP MOD #9',videoId:'kvnry7l0UeE'},
        {num:12,title:'UN GAMIN DE 8 ANS DEVIENT PRÉSIDENT ! GTAV RP MOD #10',videoId:'amj9-F4c33w'},
        {num:13,title:'TOM ESCOBAR RETROUVE LA MÉMOIRE ! GTAV RP MOD #11',videoId:'_vvIgf8FYGY'},
        {num:14,title:'UN GAMIN DE 8 ANS ECHANGE SON LOGICIEL HACK CONTRE UNE PETITE COPINE ! GTAV RP MOD #12',videoId:'hrax7GVndcU'},
        {num:15,title:'UN GAMIN DE 8 ANS FAIT UNE GROSSE SURPRISE A SON PAPA ! GTAV RP MOD #13',videoId:'ggnTafpFybE'},
        {num:16,title:'LA LISTE DES CADEAUX DE TOM ESCOBAR AU PÈRE NOEL ! GTAV RP MOD (BONUS)',videoId:'ijxiF3OIZ78'},
        {num:17,title:'UN GAMIN DE 8 ANS DÉCOUVRE UNE ÎLE SECRÈTE ILLÉGAL ! GTAV RP MOD #14',videoId:'hKbKlHsNWo8'},
        {num:18,title:'UN GAMIN DE 8 ANS CRÉE SON NOUVEAU ROBOT PLUS FORT QU\'AGENT X ! GTAV RP MOD #15',videoId:'-wbQGyRyDNw'},
        {num:19,title:'UN GAMIN DE 8 ANS RENCONTRE UNE GAMINE DE 8 ANS ! GTAV RP MOD #16',videoId:'XWSRzv8WExM'},
        {num:20,title:'UN GAMIN DE 8 ANS OFFRE UNE ARME A SA PETITE COPINE ! GTAV RP MOD #17',videoId:'8gU_vJ-FecE'},
        {num:21,title:'L\'INCROYABLE NOEL DE TOM ESCOBAR ! GTAV RP MOD #18',videoId:'ZmVeClQ-4vM'},
        {num:22,title:'UN GAMIN DE 8 ANS DOIT CAPTURER LE PÈRE NOEL ! GTAV RP MOD #19',videoId:'EG2cjqPVvxw'},
        {num:23,title:'UN GAMIN DE 8 ANS VOLE TOUS LES CADEAUX DU MONDE AU PÈRE NOEL ! GTAV RP MOD #20',videoId:'A6PHShJb86U'},
        {num:24,title:'TOM ET SARAH DÉBALLENT LEURS CADEAUX DE NOEL ÇA TOURNE MAL ! GTAV RP MOD #21',videoId:'P51uZpPgGGA'},
        {num:25,title:'UN GAMIN DE 8 ANS DÉCOUVRE LES 3 NOUVELLES FEMMES DE SON PAPA ! GTAV RP MOD #22',videoId:'pcZjbf19qEE'},
        {num:26,title:'UN GAMIN DE 8 ANS CRÉE LE SYSTÈME DE HACK LE PLUS PUISSANT DU MONDE ! GTAV RP MOD #23',videoId:'QqvLKzaHqpY'},
        {num:27,title:'UN GAMIN DE 8 ANS DEVIENT LE MAÎTRE DE LOS SANTOS ! GTAV RP MOD #24',videoId:'YWzgBwY_0gI'},
        {num:28,title:'UN GAMIN DE 8 ANS CLONE DES GENS AVEC L’ŒIL DU FAUCON ! GTAV RP MOD #25',videoId:'u2IPvXJcHO0'},
        {num:29,title:'UN GAMIN DE 8 ANS KIDNAPPE SA PSY ! GTAV RP MOD #26',videoId:'kTIvE6FnrSg'},
        {num:30,title:'UN GAMIN DE 8 ANS TRANSFORME UNE MEUF EN OBJET ! GTAV RP MOD #27',videoId:'_ruUgjaJy5g'},
        {num:31,title:'UN GAMIN DE 8 ANS RENCONTRE SON GRAND PÈRE POUR LA PREMIÈRE FOIS ! GTAV RP MOD #28',videoId:'wSe8STsRvbQ'},
        {num:32,title:'UN GAMIN DE 8 ANS S\'INFILTRE DANS LA PRISON LA PLUS DANGEREUSE ! GTAV RP MOD #29',videoId:'O6ak92ki2T8'},
        {num:33,title:'UN GAMIN DE 8 ANS RETROUVE SON DIRECTEUR VIVANT ! GTAV RP MOD #30',videoId:'dDHEdCfOc98'},
        {num:34,title:'UN GAMIN DE 8 ANS VA AVOIR UN PETIT FRÈRE OU UNE PETITE SOEUR ! GTAV RP MOD #31',videoId:'F48M8dly0HA'},
        {num:35,title:'UN GAMIN DE 8 ANS LIVRE LES 2 FEMMES DE SON PÈRE A GRINCHIAT POUR LES BOUFFER ! GTAV RP MOD #32',videoId:'sxk56mD_YO8'},
        {num:36,title:'UN GAMIN DE 8 ANS RETROUVE SONIC ! GTAV RP MOD #33',videoId:'_AOlmPIX3iE'},
        {num:37,title:'UN GAMIN DE 8 ANS APPREND QUE SON PAPA RISQUE LA PRISON ! GTAV RP MOD #34',videoId:'oCJHQ73_Nl8'},
        {num:38,title:'C\'EST LA FIN , MON PAPA N\'EST PLUS PRÉSIDENT ! GTAV RP MOD #35',videoId:'MvfZIT7Cscs'},
        {num:39,title:'UN GAMIN DE 8 ANS VA ALLER DANS UNE FAMILLE D\'ACCUEIL ! GTAV RP MOD #36',videoId:'HDVrB28rENg'},
        {num:40,title:'UN GAMIN DE 8 ANS ASSISTE AU JUGEMENT DE SON PAPA CA TOURNE MAL ! GTAV RP MOD #37',videoId:'XNC9C6QlaHI'},
        {num:41,title:'SONIC PRÉSIDENTE ? MON PAPA OFFICIELLEMENT EN PRISON !',videoId:'snQpcHFE3gA'},
        {num:42,title:'UN GAMIN DE 8 ANS ACHÈTE DES GENS POUR LES ELECTIONS PRÉSIDENTIELLES ! GTAV RP MOD #39',videoId:'V9p6uMTDMF8'},
        {num:43,title:'UN GAMIN DE 8 ANS EN CAVALE A CAUSE DU JUGE ! GTAV RP MOD #40',videoId:'Ytcn1LRs7x4'},
        {num:44,title:'UN GAMIN DE 8 ANS PREND 10 PERSONNES EN OTAGE ET DEMANDE 5 MILLIONS $ ! GTAV RP MOD #41',videoId:'fZAZln3rbT4'},
        {num:45,title:'UN GAMIN DE 8 ANS A TOUS LES FLICS DE LA VILLE CONTRE LUI ! LA FUITE ! GTAV RP MOD #42',videoId:'bBSup8u8fxk'},
        {num:46,title:'LE SECRET DE TOM ESCOBAR DÉVOILÉ ? GTAV RP MOD #43',videoId:'VjgrJ9ltVtg'},
        {num:47,title:'UN GAMIN DE 8 ANS SAUVE ABDOUL DE PRISON AVEC IRON X ! GTAV RP MOD #44',videoId:'T5GnJ_4eOzY'},
        {num:48,title:'UN GAMIN DE 8 ANS OFFRE A ABDOUL UN ROBOT PUISSANT MAIS C\'EST TROP PUISSANT XD ! GTAV RP MOD #45',videoId:'a7Hai2WEuH8'},
        {num:49,title:'UN GAMIN DE 8 ANS LIBÈRE SON PAPA DE PRISON ! GTAV RP MOD #46',videoId:'wekmtOmofoY'},
        {num:50,title:'TOM ESCOBAR REMONTE DANS LE TEMPS DANS LES ANNÉES 1860 ! [EXCLU]',videoId:'Av9OEp1K9xk'},
        {num:51,title:'TOM ESCOBAR VA FAIRE LE BRAQUAGE DU SIÈCLE ! GTAV RP MOD #47',videoId:'ACMIROpmf8k'},
        {num:52,title:'UN GAMIN DE 8 ANS PRÉPARE LE BRAQUAGE DU SIÈCLE ! GTAV RP MOD #48',videoId:'fxQnt-B7rxU'},
        {num:53,title:'UN GAMIN DE 8 ANS FAIT PARTICIPER SON PAPA AU BRAQUAGE ! GTAV RP MOD #49',videoId:'D-utZNz9LJo'},
        {num:54,title:'UN GAMIN DE 8 ANS RETROUVE SARAH DANS UN PARC D\'ATTRACTION ! GTAV RP MOD #50',videoId:'t8hZ2vpO7EI'},
        {num:55,title:'LA NOUVELLE MINI VOITURE DE SARAH ET TOM ! GTAV RP MOD #51',videoId:'sKoBbfXZCJg'},
        {num:56,title:'UN GAMIN DE 8 ANS RENCONTRE LE NOUVEAU PRÉSIDENT , CA TOURNE MAL ! GTAV RP MOD #52',videoId:'0lgUqFMeHvM'},
        {num:57,title:'UN GAMIN DE 8 ANS KIDNAPPE LE NOUVEAU PRÉSIDENT ! GTAV RP MOD #52',videoId:'n_colKaIadM'},
        {num:58,title:'UN GAMIN DE 8 ANS CONSTRUIT UNE VOITURE RARE ! GTAV RP MOD #53',videoId:'Po_ONcK9FpU'},
        {num:59,title:'TOM ET SA COPINE BRAQUENT LE YACHT D\'UN MILLIARDAIRE ! GTAV RP MOD #54',videoId:'yKI7hBSxMNg'},
        {num:60,title:'LA NOUVELLE FERRARI DE COLLECTION DE TOM ESCOBAR ! GTAV RP MOD #55',videoId:'sGI4i7b5vrk'},
        {num:61,title:'LA VILLA DE RÊVE DE TOM ET SARAH ! GTAV RP MOD #56',videoId:'j6nx-NfBgfM'},
        {num:62,title:'TOM A UNE PRIME DE 10 000 000$  SUR SA TÊTE ET SE FAIT ARRÊTER PAR LA FIB ! GTAV RP MOD #57',videoId:'UfIyDPiwzdw'},
        {num:63,title:'TOM EN PRISON ! IRON X LE RETOUR ? GTAV RP MOD #58',videoId:'6nKTYBaY8T4'},
        {num:64,title:'TOM DÉCOUVRE SON NOUVEAU QG SPÉCIALEMENT POUR HACK ! GTAV RP MOD #59',videoId:'ch-jYU37IjU'},
        {num:65,title:'TOM ESCOBAR DEVIENT UN VRAI SUPER HÉRO ET SAUVE LA VILLE ! GTAV RP MOD #60',videoId:'B77_EauD1A8'},
        {num:66,title:'TOM S\'INFILTRE DANS L\'USINE A FABRIQUER DES BILLETS ! UN REVE QUI DEVIENT REALITÉ ! GTAV RP MOD #60',videoId:'TTOzlUYqT8g'},
        {num:67,title:'TOM ESCOBAR CONSTRUIT HULK ÇA TOURNE MAL ! GTAV RP MOD #61',videoId:'fvLQLDjlXqc'},
        {num:68,title:'TOM FABRIQUE UN AIMANT ULTRA PUISSANT (c\'est trop lourd) ! GTAV RP MOD #62',videoId:'tCPYyANlZXc'},
        {num:69,title:'TOM EST PARTI TROP LOIN ! GTAV RP MOD #63',videoId:'WLOVgkGgXOY'},
        {num:70,title:'TOM ESCOBAR LE PREMIER GAMIN A AVOIR LA PLAYSTATION 5  ! GTAV RP MOD #64',videoId:'fXMJYNL4ft0'},
        {num:71,title:'L\'INCROYABLE BRAQUAGE DE TOM ESCOBAR - USINE A BILLETS ACT 1  ! GTAV RP MOD #65',videoId:'REfpU06SevI'},
        {num:72,title:'L\'INCROYABLE BRAQUAGE DE TOM ESCOBAR - FABRICATION DES BILLETS ACT 2 ! GTAV RP MOD #66',videoId:'VUBmjUPwTNM'},
        {num:73,title:'L\'INCROYABLE BRAQUAGE DE TOM ESCOBAR - L\'EVASION ET LA TRAHISON ACT FINAL ! GTAV RP MOD #67',videoId:'UoHhyvaf9nY'},
        {num:74,title:'TOUT CE QUE TOM A ACHETÉ AVEC L\'ARGENT DU BRAQUAGE ET RETROUVAILLES AVEC SON PAPA ! GTAV RP MOD #68',videoId:'zGgzpaCPzMI'},
        {num:75,title:'AGENT X RETROUVE TOM ESCOBAR ! LA FIN EST PROCHE ! GTAV RP MOD #69',videoId:'nT705IB96g0'},
        {num:76,title:'LE PÈRE DE TOM DECOUVRE SON QG SECRET MAIS ÇA FINI TRES MAL ! GTAV RP #70',videoId:'66ZkVawcCds'},
        {num:77,title:'UN GAMIN DE 8 ANS ET SON PAPA REPRENNENT LE POUVOIR AU GOUVERNEMENT ! GTAV RP MOD #71',videoId:'VPuG_ydQOCs'},
        {num:78,title:'UN GAMIN DE 8 ANS CHANGE D\'APPARENCE ! GTAV RP MOD #72',videoId:'M7f-L3NSHyE'},
        {num:79,title:'UN GAMIN DE 8 ANS ACHÈTE LE CASINO AVEC SON TONTON REMY LE NAIN ! GTAV RP MOD #73',videoId:'I8oCEC4RFb8'},
        {num:80,title:'UN GAMIN SURPREND SON TONTON FAIRE DU SALE AVEC SA SECRETAIRE ! GTAV RP MOD #74',videoId:'uoWtlEkt_EQ'},
        {num:81,title:'UN GAMIN QUITTE LOS SANTOS POUR ALLER SUR L\'ILE SECRETE DES TRAFIQUANTS ! GTAV RP MOD #75',videoId:'sf1BB9nlGu8'},
        {num:82,title:'TOM CAPTURÉ PAR DES TRAFIQUANTS DANGEREUX ! REMY MORT ? GTAV RP MOD #76',videoId:'B8KV2-XWTRQ'},
        {num:83,title:'UN GAMIN APPREND QUE SON TONTON REMY S’EST FAIT BOUFFER PAR UN T-REX ! GTAV RP MOD #77',videoId:'f2VW-Nzl1gU'},
        {num:84,title:'UN GAMIN LIBÈRE UN DINOSAURE DE SA CAGE + VOLE SON OEUF ! GTAV RP MOD #78',videoId:'UTHtxA-_5TQ'},
        {num:85,title:'UN GAMIN DE 8 ANS IMPRESSIONNE LE GRAND BOSS DES TRAFIQUANTS ! GTAV RP MOD #79',videoId:'PfPCGwso1PM'},
        {num:86,title:'UN GAMIN PREND L\'APPARENCE DE SON TONTON RÉMY POUR PÉCHO ANASTASIA ! GTAV RP MOD #80',videoId:'J1amgqUBC6s'},
        {num:87,title:'RÉMY SURPREND TOM FAIRE DU SALE AVEC ANASTASIA ! GTAV RP MOD #81',videoId:'_MzgLuOVdFQ'},
        {num:88,title:'TOM EST PARTI TROP LOIN , IL MENACE LE BOSS DES TRAFIQUANTS ! GTAV RP MOD #82',videoId:'XZDmM5KB3DQ'},
        {num:89,title:'TOM A FOUTU ANASTASIA ET REMY DANS LE  MAL , LES TRAFIQUANTS PRENNENT POSSESSION DU CASINO ! #83',videoId:'Yl2965QoHh4'},
        {num:90,title:'LE PÈRE DE TOM REDEVIENT PRÉSIDENT ! JE SUIS ENFIN LIBRE ! GTAV RP MOD #84',videoId:'Kng-SATv1LU'},
        {num:91,title:'TOM OFFRE LA VOITURE DE SES RÊVES A ANASTASIA , ELLE TOMBE SOUS LE CHARME ! GTAV RP MOD #85',videoId:'Y-3PyINPT0k'},
        {num:92,title:'TOM RAMÈNE ANASTASIA DANS SA VILLA DE LUXE , SARAH DÉBARQUE ! GTAV RP MOD #86',videoId:'r306dhRTqc8'},
        {num:93,title:'TOM DÉCOUVRE LE SECRET D\'ANASTASIA ! IL EST CHOQUÉ ! GTAV RP MOD #87',videoId:'WpJiuRj0g9c'},
        {num:94,title:'TOM SURPREND UNE CONVERSATION SECRÈTE PAR RAPPORT AU COLIS ET SUR SON VRAI PAPA ! GTAV RP MOD #88',videoId:'y9_6jeq01wg'},
        {num:95,title:'TOM SURPREND SON PAPA EN TRAIN DE SE TAPER LA MEILLEURE AMIE D\'ANASTASIA ! GTAV RP MOD #89',videoId:'YjdvHuWCB6A'},
        {num:96,title:'LE PÈRE DE TOM ORGANISE LA PLUS GROSSE SOIRÉE JAMAIS RÉALISÉE ! PROJET X ! GTAV RP MOD #90',videoId:'JyDK9dcdMjU'},
        {num:97,title:'LE PÈRE DE TOM L’EMMÈNE EN BOÎTE POUR ADULTES, ANASTASIA PÈTE UN CÂBLE ! GTAV RP MOD #91',videoId:'zII1lOR8LFU'},
        {num:98,title:'TOM APPREND QU\'ANASTASIA EST AMOUREUSE DE SON PERE ! GTAV RP MOD #92',videoId:'qfM8LhKgN2U'},
        {num:99,title:'LE PÈRE DE TOM SE TAPE HÉLÉNA , AGENT X DÉBARQUE ?! GTAV RP MOD #93',videoId:'FkSqmtg_8aU'},
        {num:100,title:'TOM FUSIONNE IRON X ET HULK ET ABUSE DES SES POUVOIRS ! GTAV RP MOD #94',videoId:'RpP4j8sbomw'},
        {num:101,title:'TOM SURPREND ANASTASIA ET SON PÈRE EN PLEINE ACTION ! IL PÈTE UN CÂBLE ! GTAV RP MOD#95',videoId:'ZvWi7ducS10'},
        {num:102,title:'TOM RASSEMBLE TOUTES LES MEUFS QUE SON PÈRE S\'EST TAPÉ ! GTAV RP MOD #96',videoId:'0C1Fja_tTPo'},
        {num:103,title:'LE PÈRE DE TOM V.S SES 3 CONQUÊTES, ÇA TOURNE MAL ! GTAV RP MOD #97',videoId:'-oZlUB-_Yag'},
        {num:104,title:'TOM ET ANA SEULS CONTRE AGENT X ! GTAV RP MOD #98',videoId:'zUwJ5kPf398'},
        {num:105,title:'ANASTASIA S\'EST FAIT KIDNAPPER ! LA FIN DE TOM ESCOBAR ?! GTAV RP MOD #99',videoId:'L0PMfVydw9s'},
        {num:106,title:'LA NOUVELLE VOITURE LEGO ULTRA PUISSANTE DE TOM ! GTAV RP MOD BONUS !',videoId:'5NFJV65fzSQ'},
        {num:107,title:'TOM JOUE A CACHE CACHE AVEC DES ADULTES , ÇA PART EN SUCETTE ! GTAV RP BONUS #2',videoId:'PUajky2upz0'},
        {num:108,title:'LA NOUVELLE COLLECTION DE MINI VOITURES DE TOM + CACHE CACHE AU COMICO ! GTAV RP BONUS #3',videoId:'rMGqsCKK_kc'},
        {num:109,title:'LE PLUS GROS CACHE CACHE DE TOM ! ECOLE HANTÉE ! GTAV RP BONUS #4',videoId:'2U8oZk19yZI'},
        {num:110,title:'OMG ! GRINCHIAT A UNE FILLE ! TOM PRIS DANS SON PIEGE ! GTAV RP FINAL BONUS',videoId:'qDEDn4okqO8'},
        {num:111,title:'TOM ESCOBAR - LE COMBAT FINAL CONTRE AGENT X - LE FILM ! #100',videoId:'DGkFc6z9a4Q'}
    ],
    'Saison 4':[
        {num:1,title:'TOM ESCOBAR ET SON PETIT FRERE DE 4 ANS - GTAV RP MOD #1 SAISON 4',videoId:'Mr8iCuM6SHA'},
        {num:2,title:'SONIC DE RETOUR ! ELLE SE TAPE MON PAPA LE PRÉSIDENT ! GTAV RP MOD #2',videoId:'t6P3o3aMqco'},
        {num:3,title:'LA NOUVELLE MCLAREN LEGO PUISSANTE DE TOM + LES PROBLEMES COMMENCENT ! GTAV RP MOD #3',videoId:'vDZr6K_Kso8'},
        {num:4,title:'TOM DÉCOUVRE UN SECRET QU\'IL NE DEVAIT PAS VOIR SUR ANA ! GTAV RP MOD #4',videoId:'Pf8whGHIAe4'},
        {num:5,title:'TOM PERD SA MAISON ET SE RETROUVE A LA RUE ! GTAV RP MOD #5',videoId:'vI3MFwLILa4'},
        {num:6,title:'LE NOUVEAU QG INCROYABLE DE TOM ESCOBAR ! GTAV RP MOD #6',videoId:'X58ChkN3naA'},
        {num:7,title:'LA NOUVELLE COLLECTION DE VOITURES DE LEGO DE TOM ! GTAV RP MOD #7',videoId:'YpYj5vZvm6Y'},
        {num:8,title:'TOM SURPREND ANA ENTRAIN DE SEDUIRE REMY ! GTAV RP MOD #8',videoId:'mIwlZ-LVGUU'},
        {num:9,title:'TOM OUVRE LA PORTE SECRETE DE REMY , ET DECOUVRE UN AUTRE UNIVERS - GTAV RP MOD #9',videoId:'9Ps8XKfNWZI'},
        {num:10,title:'TOM RENCONTRE UNE NOUVELLE PETITE COPINE - GTAV RP MOD #10',videoId:'2HRs0DcuP40'},
        {num:11,title:'TOM APPREND QUE SON EX A UN NOUVEAU PETIT COPAIN - GTAV RP MOD #11',videoId:'BrILZEmH12g'},
        {num:12,title:'TOM TUE LE PETIT COPAIN DE SON EX ! GTAV RP MOD #12',videoId:'U_LWxY_dKog'},
        {num:13,title:'TOM ET REMY VOYAGENT DANS LE TEMPS , RETOUR DANS LE PASSÉ ! GTAV RP (feat RedM) #13',videoId:'1V48CkY0HZs'},
        {num:14,title:'TOM DEVIENT GEANT ET FOUT LE BORDEL DANS TOUTE LA VILLE ! GTAV RP #14 (feat RedM)',videoId:'IdOkjr9WTFQ'},
        {num:15,title:'TOM VOLE UN TRAIN DE LUXE ET DEVIENT L\'ENNEMI NUMERO 1 DE LA VILLE ! GTAV RP #15 (feat RedM)',videoId:'qtx1b7mOHmo'},
        {num:16,title:'TOM RECONSTRUIT TOUT LE SQUID GAME ET PARTICIPE ! GTAV RP MOD',videoId:'m_D1KYgfGe8'},
        {num:17,title:'TOM RETOURNE A LOS SANTOS AVEC UNE POTION POUR DEVENIR ADULTE  ! GTAV RP MOD #16',videoId:'Y0vQx0T2qLo'},
        {num:18,title:'TOM DEVIENT ADULTE PENDANT UNE JOURNÉE ! GTAV RP MOD #17',videoId:'SRliRCiHpcQ'},
        {num:19,title:'TOM A ENFIN REUSSI A PECHO ANASTASIA (elle tombe sous son charme) ! GTAV RP MOD #18',videoId:'GE-ku6LLfPs'},
        {num:20,title:'TOM RAMENE ANASTASIA DANS SON LIT ET... ! GTAV RP MOD #19',videoId:'FiFK8VJ578c'},
        {num:21,title:'HELENA ENCORE EN VIE ET FAIT LIBERER MON PAPA ! (Agent x le retour?) GTAV RP MOD #20',videoId:'0NBFB8Seqd4'},
        {num:22,title:'ANASTASIA APPREND LA VERITÉ SUR MON PAPA ! ÇA TOURNE MAL - GTAV RP MOD #21',videoId:'T7yA-seWVRU'},
        {num:23,title:'TOM ET ANA QUITTENT LOS SANTOS POUR LA FRANCE ! GTAV RP MOD #22',videoId:'uQr6NHxIE80'},
        {num:24,title:'LA FIN ENTRE ANASTASIA ET TOM ESCOBAR ! (elle me quitte) ! GTAV RP MOD #23',videoId:'875_jXJxpdk'},
        {num:25,title:'TOM ESCOBAR EPISODE FINAL SAISON 4 ! #24',videoId:'JAvgPjywXPo'}
    ],
    'Saison 5':[
      {num:1,title:'UN GAMIN DE 9 ANS FILS DU COMMISSAIRE DECOUVRE LA FRANCE ! GTAV RP MOD SAISON 5 #1',videoId:'wZovaH8_feg'},
    ]
}, }
      ]
    },
    kingsley: {
      id:'kingsley', name:'Kingsley', color:'#1abc9c',
      description:'Un nom qui résonne dans toute la ville. Zack Kingsley ne fait pas de compromis.',
      characters:[
        { id:'zack-kingsley', name:'Zack Kingsley', image:'images/letigrebl/zack.webp', banner:'images/letigrebl/zack-bannière.webp',
          description:'Longtemps aveuglé par sa fortune, Zack perd tout le soir de son anniversaire après un incendie. Rejeté par ses parents et trahi par ses faux amis, il se retrouve à la rue et doit repartir de zéro. Il se reconstruit en secret, développant des talents en science et en informatique. Aujourd\'hui à la tête de son propre domaine, King\'s Land, et entouré d\'amis fidèles, il s\'apprête à bouleverser le monde pour prendre sa revanche et prouver sa valeur.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'JE RECOMMENCE GTA 5 RP #1 (en étant le fils d’un milliardaire)',videoId:'_m21CMee_Y8'},
        {num:2,title:'GTA 5 RP À ZÉRO ! #2 (De milliardaire à éboueur…)',videoId:'VpkpwOMGQLo'},
        {num:3,title:'GTA 5 RP À ZÉRO ! #3 (Elle trompe son fiancé avec moi…)',videoId:'Ktgn8zexlGk'},
        {num:4,title:'GTA 5 RP À ZÉRO ! #4 (Je transforme un coin pourri en QG de légende !)',videoId:'ZqBoZB-BQRw'},
        {num:5,title:'GTA 5 RP À ZÉRO ! #5 (Je deviens chauffeur de métro et ça paye fort !)',videoId:'XiU9pPMod9w'},
        {num:6,title:'GTA 5 RP À ZÉRO ! #6 (Elle découvre mon QG secret et elle est choquée !)',videoId:'Qby36eiADDA'},
        {num:7,title:'GTA 5 RP À ZÉRO ! #7 (Elle veut dormir avec moi… j’ai pas vu ça venir 😳)',videoId:'ZD6lPI3CJJQ'},
        {num:8,title:'GTA 5 RP À ZÉRO ! #8 (On infiltre un gang dangereux… et ça paye 💰)',videoId:'SPXJ0UbZs80'},
        {num:9,title:'GTA 5 RP À ZÉRO ! #9 (Je ne la pensais pas comme ça…)',videoId:'HwGLxWGX7S4'},
        {num:10,title:'GTA 5 RP À ZÉRO ! #10 (Le plus grand projet de Zack Kingsley)',videoId:'UNwg5pJuoOY'},
        {num:11,title:'GTA 5 RP À ZÉRO ! #11 (Mon premier braquage en train !)',videoId:'95NdwrjDioM'},
        {num:12,title:'GTA 5 RP À ZÉRO ! #12 (J’achète une île secrète… C’est ouf !🤯)',videoId:'ydcHdy6he-s'},
        {num:13,title:'GTA 5 RP À ZÉRO ! #13 (J’ai investi une fortune dans mon île… le résultat est fou 💰)',videoId:'h82XzqJJ2jg'},
        {num:14,title:'GTA 5 RP À ZÉRO ! #14 (J’ai construit un mini-drone ultra puissant ! 🚀)',videoId:'nMmsDQYZ_rs'},
        {num:15,title:'GTA 5 RP À ZÉRO ! #15 (La jalousie explose… et mon drone évolue dangereusement🔥)',videoId:'LH_65m6zJFQ'},
        {num:16,title:'GTA 5 RP À ZÉRO ! #16 (J’ai créé le système le plus CHEATÉ de FiveM)',videoId:'d25Bq_h_1FM'},
        {num:17,title:'GTA 5 RP À ZÉRO ! #17 (Je deviens le maître du jeu…)',videoId:'OgIyhA0r6Qw'},
        {num:18,title:'GTA 5 RP À ZÉRO ! #18 (Mon île se fait attaquer !)',videoId:'HXBC67CpfIA',youtubeLink:true},
    ]
}, }
      ]
    },
    autres: {
      id:'autres', name:'Autres', color:'#95a5a6',
      characters:[
        { id:'poil-carotte', name:'Poil de Carotte', image:'images/letigrebl/poildecarotte.webp', banner:'images/letigrebl/poildecarotte-bannière.webp',
          description:'Élève turbulent devenu figure du crime, Poil de Carotte a troqué ses bêtises de classe pour des braquages de banques et la gestion d\'une entreprise aérienne. Sa vie, marquée par une relation passionnée avec Jade, bascule entre trahisons amoureuses et séjours en haute sécurité. Après s\'être évadé de la prison la plus dangereuse de Los Santos, il va jusqu\'à simuler son propre décès pour protéger les siens, observant son enterrement dans l\'ombre avant de tenter de reconquérir sa liberté.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'ON VA RÉVOLUTIONNER LE GTAV RP ! LIVE SPÉCIALE  SCHOOL RP',videoId:'1y5Db1-fIdY'},
        {num:2,title:'MON PREMIER JOUR D’ÉCOLE :D ! C\'EST LA RENTRÉE ! GTAV SCHOOL RP #1 ! FR',videoId:'IVtgJWj1HLo'},
        {num:3,title:'ON VA S’ÉVADER DE L"ECOLE !  GTAV SCHOOL RP #2 ! FR',videoId:'LeIHMYSMOIw'},
        {num:4,title:'ON COMMENCE LE TRAFIC + QUE SE CACHE T\'IL DANS L’ASCENSEUR ?! GTAV SCHOOL RP #3 ! FR',videoId:'cW4KzlLhUlo'},
        {num:5,title:'BOUTONEU A DISPARUE ! GTAV SCHOOL RP #4 ! FR',videoId:'ru7Dp3Z0yg8'},
        {num:6,title:'ON A VOLER LA CULOTTE DE L’INFIRMIÈRE XD! GTAV SCHOOL RP #5 ! FR',videoId:'unpSCU06phQ'},
        {num:7,title:'LA BANDE AU COMPLET ! ON DOIT SAUVER BOUTONNEUX ! GTAV SCHOOL RP ! FR',videoId:'Pg2ko4xj-0g'},
        {num:8,title:'OMG LE JOUR DES EXAMENS ! JE VAIS RENDRE FEUILLE BLANCHE ! GTAV SCHOOL RP ! FR',videoId:'3IgIFAuTC5s'},
        {num:9,title:'DERNIER JOUR D’ÉCOLE ! LE BAL DE FIN D’ANNÉE ! GTAV SCHOOL RP ! FR',videoId:'iP7McZdPrvY'},
    ], 
    'Saison 2':[
        {num:10,title:'POIL DE CAROTTE SAISON 2 ! GTAV SCHOOL RP',videoId:'mqF6FasiHv4'},
        {num:11,title:'PREMIER JOUR AU CAMPING DE LOISIRS ! GTAV SCHOOL RP SAISON 2 #1 ! FR',videoId:'48Y5seIYlUo'},
        {num:12,title:'RENCARD AMOUREUX AVEC JADE :O ! GTAV SCHOOL RP SAISON 2 #2 ! FR',videoId:'JPr1boYUZaQ'},
        {num:13,title:'POIL DE CAROTTE EST AMOUREUX ?! ON VA S’ÉVADER DU CAMPING ! GTAV SCHOOL RP SAISON 2 #3 ! FR',videoId:'78sjbAfbXBo'},
        {num:14,title:'LE RETOUR DE POIL DE CAROTTE A GTAV SCHOOL RP FR',videoId:'XWy31qy920E'},
        {num:15,title:'MA PREMIÈRE FOIS AVEC JADE ! ON VA FAIRE UNE BOOM ! GTAV SCHOOL RP FR',videoId:'WuYx2qB4jX8'},
    ], 
    'Saison 3':[
        {num:16,title:'GTAV SCHOOL RP - SAISON 3 WESTERN - RETOUR DE POIL DE CAROTTE',videoId:'xNkrObbc7bk'},
        {num:17,title:'MOI ET JADE C\'EST FINI ? OU PAS ! GTAV SCHOOL RP #1 S3',videoId:'TZrtKhsSv0U'},
        {num:18,title:'L\'AMOUR EST PLUS FORT QUE TOUT ! GTAV SCHOOL RP #2 S3',videoId:'e6v0rIF6lyk'},
        {num:19,title:'POIL DE CAROTTE SEULE AU MONDE :\'( ! GTAV SCHOOL RP #3 S3',videoId:'54xTxchpm8o'},
        {num:20,title:'LE GRAND JOUR , EXAMENS ET BAL FIN D’ANNÉE GTAV SCHOOL RP FINAL ! FR #ROADTO700K',videoId:'h61Mqj1KRmo'},
        {num:21,title:'POIL DE CAROTTE A GRANDI ET A PERDU JADE ! - GTAV RP',videoId:'C5vx8zaKwW0'},
        {num:22,title:'CE SOIR ONT BRAQUE TOUTES LES ÉPICERIES ! - GTAV RP',videoId:'UuL9gR0V6JA'},
        {num:23,title:'LA POLICE NOUS RECHERCHE ! ONT LÂCHE RIEN ! - GTAV RP',videoId:'PldJmlQbs98'},
        {num:24,title:'LE GRAND JOUR ! OUVERTURE DE NOTRE ENTREPRISE AÉRIEN ! - GTAV RP',videoId:'SNoOLm4-ovQ'},
        {num:25,title:'ON A REÇUS UN AVION RARE , JE VAIS LE PILOTER  ! - GTAV RP',videoId:'ijXT6c_Oxy8'},
        {num:26,title:'ON VA BRAQUER LES BANQUES CE SOIR ! GTAV RP Partie 1',videoId:'2vnunUEpW08'},
        {num:27,title:'ON VA BRAQUER LES BANQUES CE SOIR ! GTAV RP Partie 2',videoId:'c89E5f4yEzY'},
        {num:28,title:'ON VA BRAQUER LES BANQUES CE SOIR ! GTAV RP Partie 3',videoId:'LKozljnv-cU'},
        {num:29,title:'POIL DE CAROTTE ET JADE VS LES ZOMBIES ! APOCALYPSE ! AU SECOURS ! GTAV RP',videoId:'gXhOVQhJ16E'},
        {num:30,title:'JE REPREND EN MAIN MA VIE + BIENTÔT LE MARIAGE ! GTAV RP',videoId:'v2nB5_NgADU'},
        {num:31,title:'UN INCONNU M\'ENVOIE DES PHOTOS EN TRAIN DE ... AVEC ALENA ! :S ! GTAV RP',videoId:'_D4NoqJJ18M'},
        {num:32,title:'J\'INSTALLE UN TRACEUR SUR ALENA POUR L\'ESPIONNER ET SAVOIR LA VÉRITÉ ! GTAV RP FR',videoId:'A7qcX5FdDSk'},
        {num:33,title:'LE GRAND JOUR , MARIAGE DE JADE ET PDC ! GTAV RP FR',videoId:'DnrcB3W6lLY'},
        {num:34,title:'JE VAIS ME VENGER D\'ALENA ! GTAV RP FR',videoId:'_uHkSPXuad0'},
        {num:35,title:'LE JOUR DU JUGEMENT DE GREG MOUKATE ! GTAV RP !',videoId:'rgQQ562NtGc'},
        {num:36,title:'JE VAIS ÊTRE TRANSFÉRÉ DANS LA PRISON LA PLUS DANGEREUSE DE LOS SANTOS  ! GTAV RP !',videoId:'5Ia9-rudxM0'},
        {num:37,title:'J\'AI ENVIE DE M’ÉVADER ! GTAV RP !',videoId:'IkubnrShrWU'},
        {num:38,title:'JE ME SUIS ÉVADÉ DE PRISON ! JE DOIS SAUVER JADE ET RASTA   ! GTAV RP !',videoId:'4lum2dNIdhw'},
        {num:39,title:'J\'ASSISTE A MON PROPRE ENTERREMENT ! GTAV RP !',videoId:'k1J7Gan4r90'},
        {num:40,title:'JE DOIS DIRE LA VÉRITÉ A JADE  ! GTAV RP !',videoId:'-Jl6UOh5ISM'}
    ]
}, },
        { id:'axel-leret', name:'Axel Léret', image:'images/letigrebl/axeleret.webp', banner:'images/letigrebl/axeleret-bannière.webp',
          description:'Doyen bienveillant de l\'aventure Survivor, Axel Leret a marqué la compétition par son dévouement envers les autres participants. À 70 ans, il a surmonté toutes les épreuves de survie jusqu\'au vote fatidique de l\'élimination. En quittant l\'aventure, il révèle que son unique but était de remporter le prix pour le reverser intégralement à des associations d\'aide aux enfants, laissant derrière lui l\'image d\'un homme au cœur pur..', 
          seasons:{
    'Saison 1':[
        {num:1,title:'GTA V RP SURVIVOR ! #1 (Survivre dans la Peau d\'un vieux de 70ans)',videoId:'53wP0Z-bTko'},
        {num:2,title:'GTA V RP SURVIVOR ! #2 (Axel Léret un homme mystérieux)',videoId:'t9dpz3EIsZI'},
        {num:3,title:'GTA V RP SURVIVOR ! #3 ',videoId:'F9v75tG33Ew'},
        {num:4,title:'GTA V RP SURVIVOR ! #4 ',videoId:'U9ASMiyls8Y'},
        {num:5,title:'GTA V RP SURVIVOR ! #5 ',videoId:'VyvbzG2Si-M'},
        {num:6,title:'GTA V RP SURVIVOR ! #6 ',videoId:'E29jhEJoTik'},
        {num:7,title:'GTA V RP SURVIVOR ! #7 ',videoId:'U7DElYtUteo'}
    ]
}, },
        { id:'le-geant', name:'Le Géant (Freddy)', image:'images/letigrebl/legeant.webp', banner:'images/letigrebl/legeant-bannière.webp',
          description:'Colosse au visage brûlé et à la voix grave, Géant Freddy terrifie la ville dès son arrivée. Pourtant, derrière cette apparence effrayante se cache un être sensible, passionné de jardinage, qui souffre du jugement permanent des autres. Après avoir frôlé la mort et vécu un amour impossible pour sa patronne, il finit par obtenir une apparence humaine pour tenter de s\'intégrer. Sous le nom de Freddy Grinchiat, il découvre alors la dure réalité de la vie d\'homme, se retrouvant même confronté à la justice et à la cellule.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'UN GÉANT DÉBARQUE EN VILLE ! GTAV RP MOD',videoId:'awNw8oxqu_c'},
        {num:2,title:'UN GÉANT FAIT PEUR A TOUTE LA VILLE , UN HOMME TRES MYSTÉRIEUX ! GTAV RP MOD #2',videoId:'dkhDNWY3NL4'},
        {num:3,title:'LE GÉANT RISQUE DE MOURIR =( ! GTAV RP MOD #3',videoId:'DRj1MKp0pjw'},
        {num:4,title:'UN GÉANT TOMBE AMOUREUX DE SA PATRONNE ! GTAV RP #4',videoId:'5Q88CO4L_gQ'},
        {num:5,title:'UN GÉANT SE TRANSFORME EN HUMAIN ! GTAV RP MOD #5',videoId:'crEsquC5ONM'},
    ],
    'Saison 2':[
        {num:6,title:'L\' ARRIVÉ DE FREDDY GRINCHIAT ! #1',videoId:'yPv6UUIDNo8'},
        {num:7,title:'FREDDY GRINCHIAT EN CELLULE ! GTA V RP ! by iProMx #2',videoId:'94NAp6gqY7c'},
    ]
}, },
        { id:'gang-gamins', name:'Le Gang des Gamins', image:'images/letigrebl/ganggamins.png', banner:'images/letigrebl/ganggamins-bannière.png',
          description:'Le Gang des Gamins sème le chaos avec une insouciance redoutable. Armés de pistolets Nerf, ces enfants n\'hésitent pas à défier les lois et à braquer les plus gros gangs de la ville, prouvant que le désordre n\'a pas d\'âge.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'LE GANG DES GAMINS SUR GTA 5 RP !',videoId:'EKjaehrb24g'},
        {num:2,title:'DES GAMINS BRAQUENT DES GANGS AVEC DES PISTOLETS NERF ! GTA V RP',videoId:'4z42mOj0m3M'},
    ]
}, },
    { id:'le-genie', name:'Le Génie', image:'images/letigrebl/legenie.webp', banner:'images/letigrebl/legenie-bannière.webp',
          description:'Entité aux pouvoirs illimités, le Génie parcourt Los Santos pour exaucer les vœux les plus fous, de la richesse pour les plus démunis aux désirs les plus charnels.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'UN GÉNIE RÉALISE LES VOEUX D\'UNE FEMME ! GTAV RP MOD #1',videoId:'zPxglmYF9Xk'},
        {num:2,title:'UN GÉNIE RÉALISE LES VOEUX D\'UN HOMME PAUVRE ! GTAV RP MOD #2',videoId:'bWQCbcPrY0M'},
        {num:3,title:'UN GÉNIE FAIT ÉVADER UN PRISONNIER DANGEREUX ÇA TOURNE MAL ! GTAV RP MOD #3',videoId:'ZRtdMkyMAjg'},
        {num:4,title:'ELLE COUCHE AVEC UN GENIE POUR DES VOEUX ! GTAV RP MOD #4',videoId:'7MVvgikpcf0'},
    ]
}, },
  { id:'zak-hackeur', name:'Zak le Hackeur', image:'images/letigrebl/zakhackeur.webp', banner:'images/letigrebl/zakhackeur-bannière.webp',
          description:'Génie de l\'informatique opérant depuis son propre QG, le hackeur Zak a brièvement marqué Los Santos par ses capacités hors normes..', 
          seasons:{
    'Saison 1':[
        {num:1,title:'NOUVEAU PERSONNAGE ! GTA V RP ! by iProMx #1',videoId:'gETMpvb9Aek'},
        {num:2,title:'PARTIE 2 ! NOUVEAU PERSONNAGE ! GTA V RP ! by iProMx #1',videoId:'NFNdA_X4yM8'},
        {num:3,title:'ZACK A CREE L\'IMPOSSIBLE ! GTA V RP ! by iProMx #2',videoId:'whBzM5chOTQ'},
        {num:4,title:'LE RETOUR DE ZACK ( + EXPLICATION ) ! GTA V RP ! by iProMx #3',videoId:'SHez_DVaKu8'},
    ]
}, },
{ id:'billy', name:'Billy', image:'images/letigrebl/billy.png', banner:'images/letigrebl/billy-bannière.png',
          description:'Hors-la-loi du Far West, Billy Johnson enchaîne combats clandestins et cavales avec son frère Teddy. Prêt à tout quitter pour s\'enfuir avec Cassidy, ce bandit au grand cœur tente de se forger un nouvel avenir entre les plaines sauvages et les rues de Saint Denis.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'BILLY & TEDDY, LES FRÈRES HORS-LA-LOI ! RED DEAD RP ! #1',videoId:'2pQOm9FwYHM'},
        {num:2,title:'LE DON DES FRERES JOHNSON + COMBATS CLANDESTINS ! RED DEAD RP ! #2',videoId:'Oqfgq1lbRH0'},
        {num:3,title:'BILLY VEUT S\'ENFUIR AVEC CASSIDY ! RED DEAD RP ! by iProMx #3',videoId:'NqNAw4_9J70'},
        {num:4,title:'LE RETOUR DE RED DEAD RP avec IPROMX ! RED DEAD REDEMPTION 2 RP ! by iProMx #1',videoId:'8gvBSxAr9yg'},
        {num:5,title:'DIRECTION SAINT DENIS ! RED DEAD REDEMPTION 2 RP ! by iProMx #2',videoId:'Kx9Swi0o8cM'},
    ]
}, },
{ id:'ryan-johnson', name:'Ryan Johnson', image:'images/letigrebl/ryan.webp', banner:'images/letigrebl/ryan-bannière.webp',
          description:'Fêtard et père biologique du jeune génie Tom Escobar, Ryan Johnson vit pour l\'adrénaline et les excès. Roi des soirées monumentales façon \"Projet X\", il enchaîne les réveils compliqués et les conquêtes risquées au cœur de Los Santos. Ambitieux malgré son style de vie chaotique, il est également le cerveau derrière Racing X, son plus gros projet de courses clandestines.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'RYAN JOHNSON ! LA SOIREE DU SIECLE PROJET X ! GTA V RP ! by iProMx #1',videoId:'B4niyD5lNdI'},
        {num:2,title:'RYAN, LE REVEIL AVEC LA FILLE DE DWAYNE ! GTA V RP ! by iProMx #2',videoId:'GDIaEnIiHU0'},
        {num:3,title:'LE PLUS GROS PROJET DE RYAN JOHNSON ! RACING X ! GTA V RP ! by iProMx #3',videoId:'buMMMtoy8yg'},
        {num:4,title:'RYAN A DORMI AVEC ANASTAISA?! CE SOIR JE PRENDS DES RISQUES GTA V RP ! by iProMx #4',videoId:'VeXNNGRt8JE'},
    ]
}, },
{ id:'leconcierge', name:'Le concièrge', image:'images/letigrebl/leconcierge.webp', banner:'images/letigrebl/leconcierge-bannière.webp',
          description:'Derrière son balai, ce Concierge d\'une école étrange dissimule un livre secret et des connaissances bien plus vastes que ses simples fonctions.', 
          seasons:{
    'Saison 1':[
        {num:1,title:'GTA V SCHOOL RP ! #1 (Je deviens concierge dans une école pas comme les autres)',videoId:'datXzvubQys'},
        {num:2,title:'GTA V SCHOOL RP ! #2 (Le Livre Secret du concierge)',videoId:'kPKtLvGyVC4'},
    ]
}, },
      ]
    }
  },
  social:[
    { id:'youtube',  name:'YouTube Principal',  url:'https://www.youtube.com/@iProMx',             icon:'fab fa-youtube',    color:'#ff0000', bg:'rgba(255,0,0,0.08)',       border:'rgba(255,0,0,0.25)',       cta:'Voir la chaîne',       ctaIcon:'fab fa-youtube'      },
    { id:'youtube2', name:'YouTube Secondaire', url:'https://www.youtube.com/@iProMx_ytb',         icon:'fab fa-youtube',    color:'#ff4444', bg:'rgba(255,68,68,0.07)',     border:'rgba(255,68,68,0.22)',     cta:'Voir la chaîne',       ctaIcon:'fab fa-youtube'      },
    { id:'twitch',   name:'Twitch',             url:'https://www.twitch.tv/ipromx',                icon:'fab fa-twitch',     color:'#9147ff', bg:'rgba(145,71,255,0.08)',    border:'rgba(145,71,255,0.25)',    cta:'Regarder en direct',   ctaIcon:'fas fa-play-circle'  },
    { id:'discord',  name:'Discord',            url:'https://discord.gg/iProMx',                   icon:'fab fa-discord',    color:'#7289da', bg:'rgba(114,137,218,0.08)',   border:'rgba(114,137,218,0.25)',   cta:'Rejoindre le serveur', ctaIcon:'fab fa-discord'      },
    { id:'discord2',  name:'Discord Fantastic',            url:'https://discord.gg/fantasticwl',              icon:'fab fa-discord',    color:'#5064af', bg:'rgba(98, 116, 179, 0.08)',   border:'rgba(114,137,218,0.25)',   cta:'Rejoindre le serveur', ctaIcon:'fab fa-discord'      },
    { id:'tiktok',   name:'TikTok',             url:'https://www.tiktok.com/@ipromx__',            icon:'fab fa-tiktok',     color:'#ff0050', bg:'rgba(255,0,80,0.08)',      border:'rgba(255,0,80,0.25)',      cta:'Voir les vidéos',      ctaIcon:'fab fa-tiktok'       },
    { id:'tiktok2',  name:'TikTok Clips',       url:'https://www.tiktok.com/@ipromxclipofficiel',  icon:'fab fa-tiktok',     color:'#69c9d0e4', bg:'rgba(105,201,208,0.08)',   border:'rgba(105,201,208,0.25)',   cta:'Voir les clips',       ctaIcon:'fab fa-tiktok'       },
    { id:'x',        name:'X (Twitter)',         url:'https://x.com/@iProMxYt',                    icon:'fab fa-x-twitter',  color:'#e7e7e77d', bg:'rgba(255,255,255,0.05)',   border:'rgba(255,255,255,0.15)',   cta:'Suivre',               ctaIcon:'fab fa-x-twitter'    },
    { id:'boutique', name:'Boutique',            url:'https://ipromx.store/',                      icon:'fas fa-store',      color:'#f5a623', bg:'rgba(245,166,35,0.08)',    border:'rgba(245,166,35,0.25)',    cta:'Visiter la boutique',  ctaIcon:'fas fa-shopping-bag' },
    { id:'tebex',    name:'Tebex',               url:'https://ipromx.tebex.io/',                   icon:'fas fa-gamepad',    color:'#00b4d8', bg:'rgba(0,180,216,0.08)',     border:'rgba(0,180,216,0.25)',     cta:'Accéder au Tebex',     ctaIcon:'fas fa-gamepad'      },
    { id:'tierlistflash',    name:'Tier-List Flash',               url:'https://share.google/fI16WAB9w7dv5cFn7',                   icon:'fas fa-list-ol',    color:'#00d80e', bg:'rgba(0, 216, 18, 0.08)',     border:'rgba(0, 216, 148, 0.25)',     cta:'Accéder à la Tier-list Flash',     ctaIcon:'fas fa-list-ol'      },
  ],

  // ── NOTIFICATIONS (modifier manuellement ici) ────────────────
  // Mettre null pour désactiver, ou remplir l'objet
  notification: {
    // active: false,  // mettre false pour masquer
    active: true,
    label: 'NOUVEL ÉPISODE',      // badge à gauche (ex: "MISE À JOUR", "NOUVEAU")
    text:  'Nouvel épisode : (Zack Kingsley) GTA 5 RP À ZÉRO ! #18 (Mon île se fait attaquer !) ',
    // Lien vers un épisode précis (laisser null pour pas de bouton)
    link: {
      familyId: 'kingsley',
      charId:   'zack-kingsley',
      season:   'Saison 1',
      epNum:    18           // numéro de l'épisode
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
      title: "Zayn Flash - Exploration Ned (Cinématique)",
      image: "images/letigrebl/zaynnedocean.webp",
      sibnetUrl:'https://video.sibnet.ru/shell.php?videoid=6167747', 
    },
    {
      title: "Zayn Flash - Teaser officiel",
      image: "images/letigrebl/zaynteaser.png",
      videoId: "Mp1bkYZ6whA"
    },
    {
      title: "Silver - Flashback : La Transformation d'Adrian après l'Attaque de Kayton ! (Teaser GTAV RP)",
      image: "images/letigrebl/silver-flashbackadrianciné.webp",
      videoId: "y9datfzLTEo"
    },
    {
      title: "TOM ESCOBAR CONTACTE JAKE WINTERS ! | CINÉMATIQUE",
      image: "images/letigrebl/tomadulteciné.png",
      videoId: "tYJZLe8fNYs"
    },
    {
      title: "Sylvester Shade ! Teaser #2 - GTA 5 RP",
      image: "images/letigrebl/silvershadeciné2.png",
      videoId: "TTOD3ROwR6s"
    },
    {
      title: "Nouveau Personnage ! Teaser #1 - GTA 5 RP",
      image: "images/letigrebl/silvershadeciné.webp",
      videoId: "wgZ0_iSvkZ0"
    },
    {
      title: "Adrian vs Ned - Au coeur des ténèbres [Le Film]",
      image: "images/letigrebl/nedadrianciné.webp",
      videoId: "sReaGjD0op4"
    },
    {
      title: "HOMMAGE AUX FLASH (IPROMX) CINÉMATIQUE!",
      image: "images/letigrebl/hommageflashciné.png", //https://i.ytimg.com/vi/3fPWr6JvPIk/hqdefault.jpg
      videoId: "3fPWr6JvPIk"
    },
    {
      title: "L'INVITATION D'ADRIAN FLASH ! CINÉMATIQUE",
      image: "images/letigrebl/adrianinvitation.webp",
      videoId: "2o6xdAIi0BM"
    },
    {
      title: "NED EDEN ET EDDY, LE RETOUR DU TRIO ! CINÉMATIQUE",
      image: "images/letigrebl/nededeneddyprime.webp",
      videoId: "VujR_-Y-8fo"
    },
    {
      title: "JADE DEVIENT HUMAINE ! CINÉMATIQUE ",
      image: "images/letigrebl/nedjadecoeurciné.png",
      videoId: "KgdeypkzLns"
    },
    {
      title: "LES SOUVENIRS DE NED ! CINÉMATIQUE (LeTigreBL et iProMx)",
      image: "images/letigrebl/nedsouvenirs.webp",
      videoId: "bu40TozLx-E"
    },
    {
      title: "PIECE HISTORIQUE (Ned et les salles des FLASH)",
      image: "https://i.ytimg.com/vi/NuXpt4eL0pI/hqdefault.jpg",
      videoId: "NuXpt4eL0pI"
    },
    {
      title: "EDEN FLASH FUIT SES RESPONSABILITÉS ?! | CINÉMATIQUE",
      image: "images/letigrebl/edenfuitciné.webp",
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
      image: "images/letigrebl/eddyaaronfightciné.webp",
      videoId: "r0zwnltnEu8"
    },
    {
      title: "Ned vs Aaron - Le combat ultime (cinématique)",
      image: "images/letigrebl/aaronnedfight.webp",
      videoId: "qonTgtJUeaE"
    },
    {
      title: "La fin de Ned Flash !? GTA V cinématique",
      image: "https://i.ytimg.com/vi/mlOHJK8qNaA/hqdefault.jpg",
      videoId: "mlOHJK8qNaA"
    },
    {
      title: "EDEN ET AARON FLASH VS ADRIAN ! LE FILM",
      image: "https://i.ytimg.com/vi/ygNYMUnW74k/hqdefault.jpg",
      videoId: "ygNYMUnW74k"
    },
    {
      title: "ADRIAN IS BACK ! teaser officiel",
      image: "images/letigrebl/adrianback.webp",
      videoId: "OsxWdAEHw5s"
    },
    {
      title: "EDEN FLASH ! (Le Vrai Teaser)",
      image: "images/letigrebl/edenteaser.webp",
      videoId: "gnwbjHD4woc"
    },
    {
      title: "KAYTON VS ADRIAN LE COMBAT DU SIECLE ! CINEMATIQUE",
      image: "images/letigrebl/kaytonadrianfight.webp",
      videoId: "P09rKJjBZpI"
    },
    {
      title: "KAYTON ENTRAÎNEMENT AVANT LE COMBAT CONTRE ADRIAN ! CINEMATIQUE",
      image: "images/letigrebl/kaytonentrainement.webp",
      videoId: "tXsvgOPPnbE"
    },
    {
      title: "KAYTON FLASH S’INTERROGE SUR LE COMBAT CONTRE ADRIAN",
      image: "images/letigrebl/kaytonpenseciné.webp",
      videoId: "4MQeQGZrl44"
    },
    {
      title: "ADRIAN FLASH LE REVEIL DU BASILIC",
      image: "images/letigrebl/adrianprimeciné.webp",
      videoId: "iUL3jrH04hI"
    },
    {
      title: "Adrian le nouveau FLASH !",
      image: "images/letigrebl/adriannewflashciné.webp",
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
      title: "OPÉRATION 1 000 000 000 $ ! (Agent X)",
      image: "images/letigrebl/agentx5ciné.webp",
      videoId: "6mcf03Lqz-o"
    },
    {
      title: "IS BACK ... (Agent X)",
      image: "images/letigrebl/agentx4ciné.webp",
      videoId: "KEnJgBBLcHY"
    },
    {
      title: "MERCI (Agent X)",
      image: "images/letigrebl/agentx3ciné.webp",
      videoId: "9C0j1_9StNg"
    },
    {
      title: "AGENT X !",
      image: "images/letigrebl/agentx2ciné.webp",
      videoId: "iXInEFoZvHU"
    },
    {
      title: "AGENT X ! NIVEAU 1 !",
      image: "images/letigrebl/agentx1ciné.webp",
      videoId: "Nk--17wGMPU"
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
      image: "images/letigrebl/kaytonretourciné.webp",
      videoId: "OWumtU_bDNw"
    },
    {
      title: "J'AI VOLÉ LE COSTUME DU PÈRE NOEL #1 [COURT-METRAGE] GTAV RP",
      image: "https://i.ytimg.com/vi/Y2QuMsbjQtU/hqdefault.jpg",
      videoId: "Y2QuMsbjQtU"
    },
    {
      title: "DAMON FLASH LE FILM OFFICIEL ! COMBAT FINAL",
      image: "images/letigrebl/damonkaytonfightciné.webp",
      videoId: "TyAXhptUiuE"
    },
    {
      title: "DAVID JR FLASH ! LE RETOUR ! CINÉMATIQUE GTAV RP ",
      image: "images/letigrebl/djrretourciné.webp",
      videoId: "lsU0iBzBYrA"
    },
    {
      title: "DAMON FLASH SAISON 2 CINÉMATIQUE !",
      image: "https://i.ytimg.com/vi/7Wxij8swW3o/hqdefault.jpg",
      videoId: "7Wxij8swW3o"
    },
    {
      title: "DAMON FLASH CINÉMATIQUE !",
      image: "images/letigrebl/damonciné.webp",
      videoId: "7-p-KcT11MY"
    },
    {
      title: "LA BATAILLE FINAL DES FLASH ! CINEMATIQUE GTAV RP MOD",
      image: "https://i.ytimg.com/vi/fhNaQkBc2FE/hqdefault.jpg",
      videoId: "fhNaQkBc2FE"
    },
    {
      title: "DAVID JR ATTAQUE",
      image: "https://i.ytimg.com/vi/qGc_ExPOyeI/hqdefault.jpg",
      videoId: "qGc_ExPOyeI"
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
  ['autres','axel-leret'],
  ['autres','leconcierge'],
  ['flash','manda-flash'],
  ['flash','adrian-flash'],
  ['winters','oliver-winters'],
  ['autres','gang-gamins'],
  ['autres','zak-hackeur'],
  ['autres','ryan-johnson'],
  ['flash','kayton-flash'],
  ['autres','billy'],
  ['flash','damon-flash'],
  ['flash','david-jr-flash'],
  ['flash','aaron-flash'],
  ['autres', 'le-genie'],
  ['escobar','tom-escobar'],
  ['autres','le-geant'],
  ['flash','ken-flash'],
  ['autres','poil-carotte'],
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
const ytThumb = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const epThumb = ep => ep.thumb || (ep.videoId ? ytThumb(ep.videoId) : 'images/flash.jpg');

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
        ${eps>0?`<div class="card-badge">${eps} EPISODES</div>`:c.hasLocalVideo?`<div class="card-badge" style="background:var(--gold);color:#000;">VIDÉO</div>`:c.hasLawBook?`<div class="card-badge" style="background:#9b59b6;">LOIS</div>`:''}
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
    const progData=DB.getProgress(h.familyId, h.charId, h.season, h.epNum), prog=progData.pct;
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
        ${n.text}
      </span>
      ${actionBtn}

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
          <div class="player-ep-meta"><span>Cinématique</span><span class="dot"></span><span>FanTasTic RP</span></div>
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

function openSeriesModal(fid,cid) {
  const char=getChar(fid,cid), u=DATA.universes[fid]; if(!char) return;
  curSF=fid; curSC=cid;
  const modal=$('seriesModal'); modal.classList.add('open');
  modal.style.display = 'block'; // forcer l'affichage
  document.body.style.overflow='hidden';
  modal.scrollTop = 0; // Remonte en haut pour voir la bannière

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
  closeBtn.onclick = () => closeSeriesModal();

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
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,4,8,0.97);backdrop-filter:blur(16px);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto;overflow-x:hidden;';
    document.body.appendChild(modal);
  }
  const user = AUTH.getCurrentUser();
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--edge);border-radius:var(--radius-lg);padding:20px 16px;max-width:540px;width:100%;position:relative;box-shadow:var(--shadow-arc);">
      <div style="font-family:var(--font-display);font-size:.85rem;font-weight:700;letter-spacing:3px;color:var(--arc);margin-bottom:6px;text-transform:uppercase;">Choisir un avatar</div>
      <div style="font-family:var(--font-body);font-size:.9rem;color:var(--text-muted);margin-bottom:24px;">Sélectionne l'avatar qui te représente</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:12px;margin-bottom:20px;max-height:55vh;overflow-y:auto;overflow-x:hidden;padding-right:4px;">
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
    res.innerHTML=matches.slice(0,20).map(c=>`
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
  const char = getChar(fid, cid); 
  if (!char) return;

  const eps = char.seasons?.[season] || [];
  if (epIdx < 0 || epIdx >= eps.length) return;
  const ep = eps[epIdx];
  // Si youtubeLink:true → ouvrir la vidéo YouTube originale (avec pubs, pour soutenir le créateur)
  if(ep.youtubeLink && ep.videoId) {
    window.open('https://www.youtube.com/watch?v='+ep.videoId, '_blank');
    return;
  }
  closeSeriesModal();
  showPlayerPage(fid,cid,season,epIdx);
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

function _createYTPlayer(params) {
  const {videoId, sibnetUrl, fid, cid, season, epIdx, isCinematic} = params;
  const container = $('ytPlayerContainer');
  if(!container) { window._pendingYT=params; return; }
  container.innerHTML='';

  if (sibnetUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = sibnetUrl;
    
    // 1. On regroupe tout dans 'allow' pour supprimer l'avertissement de la console
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
    
    // 2. On ajuste la sandbox : on ajoute 'allow-forms' et 'allow-pointer-lock' 
    // Cela permet aux scripts internes de Sibnet de ne pas crash en boucle.
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms allow-pointer-lock');
    
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;will-change:transform;transform:translateZ(0);background:#000;';
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

// ── DETECTION IOS (Pour Eliya) ────────────────────────────────
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