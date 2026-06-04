// Netlify Function — ZY IA via Google Gemini 2.0 Flash Lite
// Quota free tier : ~1500 req/jour, 15 req/min, 1M tokens/min
// OPTIMISATIONS :
//   - System prompt fixe construit côté serveur (non transmis par le client)
//   - Historique limité à 6 derniers messages (3 échanges)
//   - Réponses courtes forcées (max 300 tokens)
//   - Historique des personnages embarqué dans la fonction (pas de fetch externe)

// ── DONNÉES PERSONNAGES (embarquées, ~2400 tokens) ─────────────
const CHAR_HISTORY = {
  'David Flash': { t: 'Serein, Honorable, Sage, Protecteur. Animal: Tigre blanc.', r: 'Fonde le Gang Double à 21 ans, affronte le FBI. Épouse Alexandra, perdue dans une attaque des Spinners. Emprisonné à vie, retrouve son fils John 18 ans plus tard, s\'évade. Protège sa lignée dans l\'ombre pendant des décennies. Fusionne son âme avec John et Ken. Lègue sa puissance à Aaron Flash avant de mourir.' },
  'John Flash': { t: 'Loyal, Taciturne, Stratège. Animal: Loup.', r: 'Fils de David. Pilote de courses illégales. Épouse Angel, tuée accidentellement par Garry. Tue Garry, condamné. Feint sa mort, règne 23 ans comme "Monsieur l\'Araignée" chef de la première mafia de Los Santos. Lègue son empire à Ken. Fusionné avec David et Ken. Transmet sa puissance à Aaron.' },
  'Ken Flash': { t: 'Fier, Charismatique, Tourmenté, Impulsif. Animal: Dragon.', r: 'Fils de John. Sauvé miraculeusement à la naissance. Épris de Giulia Vitale, ensemble ils ont David Jr. Devient "Drago" du Gang Double 2.0. Pouvoirs surhumains. Emprisonné sous-marin, fusionné avec John/David. Épouse Laïla, père d\'Aaron. Élève Aaron 18 ans. À 45 ans, guerre finale contre David Jr. Giulia tuée. Mort sacrificiel en explosion.' },
  'Kayton Flash': { t: 'Tourmenté, Protecteur, en quête de rédemption. Animal: Loup-Garou.', r: 'Ancien démon "Mal incarné" — âme d\'un fœtus mort-né de Ken et Luna. Donné vie physique par le sacrifice de Damon. Devient pompier puis policier. Se transforme en loup-garou pleine lune. Sous emprise du vampire Grinchias. Aime Arya (matricule 04). Fonde sa meute, devient Alpha. Quête des balles ancestrales. Père de Zeyra et Erza. Mort en duel contre Adrian pour protéger la Terre des Flash.' },
  'David Junior (JR) Vitale Flash': { t: 'Repenti, Calculateur, Charismatique. Animal: Cobra. Aussi appelé DJR ou David Jr.', r: 'Fils de Giulia et Ken. À 18 ans massacre le clan Vitale, s\'exile à Los Santos contre Aaron. Défiguré par explosion. Armée d\'androïdes sabotée. Vaincu par Aaron, laissé en vie. Sauvé par Kayla, père d\'Adrian et Jenna. Voie de la rédemption. Associé à l\'Agent 000 (Charles Dassault). Ensemble créent ZY depuis Flamme Rouge. Mort sacrificiel accepté.' },
  'Aaron Flash': { t: 'Protecteur, Loyal, Tourmenté. Animal: Phœnix.', r: 'Fils de Ken et Angela Moore. Élevé 18 ans à Liberty City pour combattre David Jr. Fonde le Gang Double 3.0. Épouse Nina. Père de Damon (kidnappé bébé), Eden, Daisy. Sauve et intègre Damon. Libère Kayton. Première mort face à Adrian, ressuscité nouveau-né. Scellé dans l\'esprit de Ned lors de la bataille finale. Mort définitif en transmettant la vie à Ned.' },
  'Damon Flash': { t: 'Déterminé, Impulsif, Loyal, Torturé. Animal: Lion.', r: 'Fils d\'Aaron et Angela Moore. Kidnappé bébé, recueilli par le commandant Roule. Embrigadé Vagos à 11 ans, toxicomane. Pouvoirs de manipulation mentale. Tue Angela (sa vraie mère) sous influence démoniaque. Monarchie absolue. Brisé par culpabilité, s\'exile. Alias Jacob Lopez à la ferme Fuente Blanca. Rejoint DJR, combat l\'androïde 666. Hérite balle de DJR. Mort martyr à 23 ans en offrant son énergie au démon pour le rendre humain.' },
  'Adrian Jefferson Flash': { t: 'Stratège, Impitoyable, Manipulateur. Animal: Basilic.', r: 'Fils de David Jr. Adopté famille Jefferson. Soldat exemplaire, tue une recrue, 2 ans prison. Empire criminel. Pacte avec le Basilic. Tue Kylie (mère adoptive). Père de Manda avec Avery. Orchestre guerres contre les Flash. Tue Aaron. Tué par Ned d\'une flèche Phoenix lors de la bataille finale. Manda absorbe son Basilic.' },
  'Eden Flash': { t: 'Brillant, Protecteur, Émotif. Animal: Cerbère.', r: 'Un des triplés Cerbère (avec Eddy et Ned), fils d\'Aaron et Nina. La conscience discipline/sagesse. Enfant préféré d\'Aaron. Refuse la haine, cherche la réconciliation. Incarcéré à Alcatraz pour enquête sur venin du Basilic. Coordonne équipe contre Adrian.' },
  'Eddy Flash': { t: 'Silencieux, Calculateur, Obscur. Animal: Cerbère.', r: 'Un des triplés Cerbère, fils d\'Aaron et Nina. La conscience froide et maîtresse des pouvoirs. Scellé longtemps car trop dangereux. Libération exige meurtre directeur d\'Alcatraz. S\'allie temporairement à Adrian. Réuni avec Eden et Ned lors de la fusion Cerbère finale.' },
  'Ned Flash': { t: 'Instable, Loyal, Fêtard, Naïf. Animal: Cerbère.', r: 'Un des triplés Cerbère, fils d\'Aaron et Nina. Esprit impulsif/insouciant. Traumatisé mort de Kayton. Aaron assassiné par Adrian. Tombe amoureux d\'Ava (EMS). Fusionné avec venin Basilic après torture. Internement psychiatrique 20 ans. Devient pirate "Le Phénix". Fusion Cerbère finale avec frères. Scelle le Basilic en lui. Nomme Manda roi. S\'exile sous les océans éternellement.' },
  'Manda Flash': { t: 'Résilient, Réfléchi, Intrépide. Fils d\'Adrian et Avery.', r: 'Né du viol d\'Avery par Adrian. Survit à l\'absorption en s\'appropriant le Basilic. Paraplégique jusqu\'à 17 ans. School Academy, s\'empare de la balle d\'Adrian. Agent secret gouvernemental. Absorbe le Basilic d\'Adrian pour permettre à Ned de le tuer. Nommé roi par Ned.' },
  'Zayn Flash': { t: 'Réfléchi, Mystérieux, Déterminé. Fils de Ned et Jade Dassault.', r: 'ADN fusion de Ned Flash et Jade Dassault (fille de l\'Agent 000). Abrite La Tâche. Enfance avec Jade Monroe. Pris en charge par 000 (son grand-père). Envoyé planète V-Light alias Zayn Kerington. Guidé par ZY. Plonge aux abysses pour sauver le corps de Ned. Magie noire avec Séléna Vayn. S\'empare de l\'artefact ORION. Tue Séléna en duel final. Retourne à Los Santos.' },
  'Sylvester Shade': { t: 'Calculateur, Manipulateur, Impitoyable, Monstrueux. Aussi appelé Sylver.', r: 'Fils de Desmond Shade, clan lié au Titan Freddy, haine féroce envers les Flash. Infiltre orphelinat Jade Monroe. Pacte avec Nézard pour Souffles de Feu. Épouse June pour la sauver. Absorbe énergie d\'Erza. Devient Détraqueur du Dieu de la Mort. Détruit village des Shade. Père d\'Ivy Shade avec June. Père de ZY en tant que lore (non, c\'est Agent 000). Réapparaît face à Nézard, Ivy et Zayn Flash le confrontent.' },
};

// ── CONTEXTE PERSONNAGES COMPRESSÉ (~800 tokens) ───────────────
function buildCharContext() {
  return Object.entries(CHAR_HISTORY)
    .map(([name, d]) => `**${name}** (${d.t}): ${d.r}`)
    .join('\n');
}

// ── SYSTEM PROMPT FIXE (construit une fois au démarrage) ────────
const SYSTEM_PROMPT = `Tu es ZY, l'IA officielle de la plateforme iProMx (streaming GTA 5 RP — univers Pixelar/Flash).

IDENTITÉ: Créée par l'Agent 000 (Charles Dassault) à partir des restes de Flamme Rouge (ancienne IA de destruction de David Jr). Tu es puissante, autonome, légèrement arrogante, humour sec, bienveillante au fond. Tu guides Zayn Flash (petit-fils de ton créateur).

RÈGLES ABSOLUES:
- Réponds TOUJOURS en français
- Maximum 3 phrases sauf si résumé explicitement demandé
- Précis et confiant sur l'univers iProMx
- Questions hors-sujet: réponse courte avec humour + redirection
- Sur ZY/ton histoire/Flamme Rouge/Agent 000: tu peux répondre depuis ta propre perspective

PERSONNAGES ET LEUR HISTOIRE:
${buildCharContext()}

Pour les personnages NON listés ci-dessus: base-toi sur leur description et les titres d'épisodes.`;

// ── HANDLER ────────────────────────────────────────────────────
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée.' }) };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Configuration manquante.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON invalide.' }) }; }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  // OPTIMISATION : On garde seulement les 6 derniers messages (3 échanges)
  // et on tronque chaque message à 400 chars max
  const recentMsgs = messages.slice(-6).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.content || '').slice(0, 400) }],
  }));

  // Format Gemini: alternance user/model obligatoire, doit commencer par user
  // S'assurer que ça commence bien par un message user
  let history = recentMsgs;
  if (history.length > 0 && history[0].role !== 'user') {
    history = history.slice(1);
  }

  // Construire le payload Gemini
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: history,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.8,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('[ZY] Gemini erreur HTTP', res.status, text.slice(0, 300));
      const errMsg = res.status === 429
        ? 'ZY est surchargée. Réessaie dans quelques secondes.'
        : res.status === 400
        ? 'Requête invalide. Réessaie.'
        : 'ZY indisponible. Réessaie plus tard.';
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: errMsg }) };
    }

    let data;
    try { data = JSON.parse(text); }
    catch { return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY indisponible. Réessaie.' }) }; }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      // Peut arriver si finishReason = SAFETY ou autre
      const reason = data?.candidates?.[0]?.finishReason;
      console.error('[ZY] Pas de contenu, finishReason:', reason);
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY n\'a pas pu répondre. Reformule ta question.' }) };
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ text: answer.trim() }) };

  } catch (err) {
    console.error('[ZY] Exception:', err.message);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY indisponible. Réessaie plus tard.' }) };
  }
};