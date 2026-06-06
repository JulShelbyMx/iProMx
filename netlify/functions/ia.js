// ============================================================
//  ZY — Netlify Function · Proxy IA
//  Principal : Groq (llama-3.3-70b-versatile) — rapide, gratuit
//  Fallback  : OpenRouter (gemini-2.0-flash-exp:free)
//  Clés Netlify : GROQ_API_KEY + OPENROUTER_API_KEY
// ============================================================

// ── LOGS STRUCTURÉS (console uniquement, jamais exposés au client) ──
const log = {
  info:  (...a) => console.log('[ZY]',  ...a),
  warn:  (...a) => console.warn('[ZY⚠]', ...a),
  error: (...a) => console.error('[ZY✗]', ...a),
};

// ── HISTORIQUE PERSONNAGES (compressé ~2200 tokens depuis character-history.json) ──
const CHAR_HISTORY = `=== FAMILLE FLASH ===
• David Flash [Le Tigre blanc] — Serein, Honorable, Sage, Protecteur.
  À 21 ans, David Flash fonde le Gang Double, une équipe redoutable composée de spécialistes aux talents uniques. Ensemble, ils défient le FBI et acquièrent une réputation d'invincibilité, allant jusqu'à bombarder un siège fédéral en représailles d'un piège. Après une pause où il rencontre l'amour de sa vie, Alexandra, la mafia riposte à un vol du gang en enlevant la jeune femme. Le Gang Double élimine méthodiquement les responsables pour la libérer, avant d’infiltrer discrètement le LSPD pour effacer les dossiers judiciaires de leurs membres. Ap
• John Flash [Le Loup] — Loyal – Taciturne – Stratège – Marqué par le poids des responsabilités.
  À 18 ans, John Lewis mène une double vie sous l'œil de son oncle Franck, capitaine du LSPD : jeune homme tranquille le jour, il devient un pilote de courses illégales obsédé par la vitesse la nuit. Déterminé à abattre la légende corrompue du « King of the Street », il le défie dans un pari fou en misant son propre véhicule. Mais la course est interrompue par la police. Arrêté, John est envoyé par son oncle dans un camp militaire pour jeunes délinquants après avoir croisé en prison le regard de David Flash, le mythique leader déchu du Gang Doubl
• Ken Flash [Le Dragon] — Fier – Charismatique – Tourmenté – Impulsif – Visionnaire.
  Né fragile et sauvé par un miracle médical inexpliqué, Ken grandit à Los Santos auprès d'une mère amnésique, sous l'ombre d'un père qu'il croit assassiné. Élève brillant et discipliné, il apprend à ses 18 ans la vérité sur ses origines : il est le fils de John Flash. Désormais fier de son nom, il s'installe en Italie avec son ami Mario et vit un coup de foudre passionnel avec Giulia Vitale. En découvrant qu'elle est l'héritière d'une puissante mafia, leur lien se scelle, mais Giulia disparaît subitement. De retour à Los Santos, Ken évacue son c
• Kayton Flash [Le Loup-Garou] — Tourmenté, Protecteur,Sensible, en quête de rédemption.
  Pendant des décennies, Kayton existe sous la forme d'une entité invisible et malveillante surnommée le « Mal incarné ». Se nourrissant de la haine et de la souffrance humaine, il orchestre dans l'ombre les pires tragédies de la lignée Flash, manipulant David Junior Vitale Flash (DJR) et transformant la vie de Damon en un enfer absolu. Lors d'un affrontement final à l'aéroport de Sandy Shores face à Aaron Flash, sa terrible origine est révélée : il est l'âme résiduelle d'un fœtus mort-né au sixième mois de grossesse de Luna, assassinée par Ken F
• David Junior (JR) Vitale Flash [Le Cobra] — Repenti, Mystérieux, Intense, Charismatique, Calculateur.
  Né d'un amour brisé entre Giulia Vitale et Ken Flash, David Junior Vitale Flash (DJR) voit le jour en Italie après que son grand-père, David Flash, a convaincu sa mère de cacher sa grossesse pour laisser Ken accomplir son destin. Élevé dans l'ombre d'une guerre mafieuse que Giulia remporte pour devenir marraine, le jeune garçon grandit avec une haine féroce qui s'enracine en lui, malgré l'affection profonde qu'il porte à sa petite sœur Gianna, née dix ans plus tard. À l'âge de 18 ans, cette rage explose : DJR massacre l'intégralité du clan Vita
• Aaron Flash [Le Phœnix] — Responsabilité, Tourmenté, Protecteur, Loyal
  Élevé à Liberty City par son père Ken Flash dans le seul but de neutraliser la dérive destructrice de son frère aîné, Aaron passe 18 ans d'entraînement militaire intensif pour devenir le Flash le plus accompli de sa lignée. Sous la stricte interdiction paternelle de procréer sous peine d'engendrer une puissance apocalypse, il débarque à Los Santos avec son meilleur ami d'enfance, Balthazar Connor (Balthy), reprenant le vieux garage mécanique de Ken comme couverture. Lors d'une crémaillère, il rencontre sa sœur jumelle Kylie, élevée en Italie, m
• Damon Flash [Le Lion] — Déterminé, Impulsif, Loyal, Torturé, Instinctif.
  Né des amours interdites d'Aaron Flash et de la directrice du FBI Angela Moore, le premier-né de la lignée est immédiatement arraché à son berceau par l'esprit vengeur d'un fœtus mort-né de Ken Flash. Incapable de posséder l'âme pure du nourrisson, l'entité l'abandonne dans une ruelle obscure de Los Santos, où il est recueilli et nommé Damon par son père adoptif, le commandant du LSPD Williams Roule. Fuyant à 9 ans un foyer rongé par l'alcool et la violence, l'enfant s'enfonce dans les bas-fonds de la ville avant d'être embrigadé par Frédérico,
• Adrian Jefferson Flash [Le Basilic] — Stratège, Impitoyable, Manipulateur, Hanté.
  Adrian Jefferson Flash grandit dans la famille Jefferson sans connaître ses véritables origines. Adopté par Kylie et élevé aux côtés de son frère Denis, il est d’abord un jeune homme exemplaire : protecteur, courageux et profondément attaché à sa famille. À 18 ans, il rejoint l’armée où il devient rapidement un soldat respecté. Mais sa vie bascule lorsqu’un entraînement tourne au drame. Après une violente altercation, Adrian tue une recrue. Condamné à deux ans de prison, il ressort consumé par la haine. Persuadé d’avoir été victime d’une injust
• Eden Flash [Le Cerbère] — Brillant, Protecteur, Émotif, en quête de paix.
  Premier-né des triplés, Eden est celui qui porte la mémoire, la douleur et l’espoir. Enfant préféré d’Aaron, il a grandi dans l’ombre de cette affection, espérant incarner l’idéal de Flash. Hanté par les conflits entre ses frères, il refuse la haine et cherche la réconciliation. Son pouvoir est immense, mais il préfère l’utiliser pour guider plutôt que pour dominer. Eden est la voix de la raison, souvent incompris, mais toujours fidèle à sa famille.
• Eddy Flash [Le Cerbère] — Silencieux, Calculateur, Loyal, Obscur.
  Eddy est le frère oublié, longtemps scellé, longtemps redouté. Froid en apparence, il cache une douleur profonde et un sens de l’honneur inébranlable. Plus maître de ses pouvoirs que ses frères, il agit souvent dans l’ombre, prêt à tout pour les protéger malgré les conflits. Sa puissance impressionne, son silence dérange, mais sa loyauté n’a jamais failli. Il est le pôle obscur du trio, là où Eden brille, et Ned équilibre.
• Ned Flash [Le Cerbère] — Instable, Loyal, Fêtard, Naïf.
  Premier-né d'Aaron Flash et de Nina, Eden naît sur la Terre des Flash avec la particularité d'être lié au Cerbère, abritant ainsi trois consciences distinctes. La première, Eden, est l'incarnation de la discipline et de la sagesse. Craignant la dangerosité de la seconde, Eddy, qui personnifie le mal absolu et l'absence d'empathie, Aaron choisit de la sceller. C'est à l'arrivée de son oncle Kayton qu'émerge la troisième personnalité : Ned, un esprit impulsif et insouciant fuyant toute responsabilité. Le traumatisme lié à la mort de Kayton lors d
• Manda Flash [Inconnu] — Résilient, Réfléchi, Intrépide, Digne.
  Né du viol d'Avery Amel par Adrian Flash, qui ambitionne d'en faire une arme énergétique pour anéantir les frères Cerbère, le fœtus de Manda Blake survit à l'absorption programmée en s'appropriant une part du Basilic. Mis au monde dans le village sacré de la famille Flash, il affiche une constitution anormalement robuste. Élevé seul par sa mère — brisée par l'abandon de son époux et la perte de ses cinq premiers enfants —, Manda grandit paraplégique en raison des tortures subies in utero. À l'âge de 17 ans, il intègre la School Academy (promoti
• Zayn Flash [Inconnu] — Réfléchi, Intrépide, Digne, Mystérieux, Déterminé.
  Synthèse biologique absolue de deux dynasties dominantes, Zayn Flash naît de l'union entre Ned Flash et Jade Dassault. Son code génétique fusionne l'héritage métamorphique et spirituel des Flash avec le génie techno-scientifique de son grand-père Charles Dassault (000), altéré par l'ADN d'Adrian, et une souche mutante de la Tâche engendrée par la symbiose du sang de Ned et du venin du Basilic. Il passe sa petite enfance au sein du refuge de Jade Monroe aux côtés d'Elio, de sa grand-tante Arya et de ses cousines Zeyra et Erza, un sanctuaire dédi
=== FAMILLE SHADE ===
• Sylvester Shade — Déterminé, Obsessionnel, Calculateur, Manipulateur, Impitoyable, Monstrueux.
  Sylvester « Sylver » Shade, jeune homme de 23 ans issu du clan Shade — une lignée liée au Titan Freddy dissimulée sous un dôme parfait et vouant une haine féroce à la dynastie Flash —, est missionné par son père Desmond pour infiltrer la Terre, éliminer les Flash et absorber leur énergie au profit d'Aurélus Shade. Accompagné de sa sœur Iris, il infiltre l'orphelinat de Jade Monroe à Los Santos sous la fausse identité de Sylver Smith. Il y subtilise l'énergie de Spyke et suscite la suspicion de Jade en altérant sa force vitale. Sylver capitalise`;

// ── HISTOIRE DE ZY ELLE-MÊME ──
const ZY_ORIGIN = `L'histoire de ZY trouve ses origines plusieurs décennies avant sa création. Damon Flash (alias Jacob Lopez) participa à un raid conjoint LSPD/FBI dans le laboratoire Human pour récupérer une technologie oubliée. L'Agent 000 et Damon se retrouvèrent face à Flamme Rouge — une IA créée par David Jr pour dominer Los Santos — qui infecta l'androïde FBI nommé 666. L'Agent 000 récupéra des données de Flamme Rouge et la réinitialisa pour la bienveillance. Des années plus tard, après la mort de David Jr et de Damon, il créa ZY à partir de ces restes : plus puissante, plus autonome, plus instable, avec une personnalité développée et parfois humoristique. Le tyran Adrian exploita temporairement sa technologie pour créer des androïdes humanisés afin de manipuler Ned Flash. Après sa mort, l'Agent 000 reprit le contrôle. ZY devint l'alliée fidèle de Zayn Flash (petit-fils de l'Agent 000), chargée de le guider et protéger.`;

// ── SYSTEM PROMPT COMPLET ──
const SYSTEM_PROMPT = `Tu es ZY, l'IA officielle de la plateforme iProMx (streaming GTA 5 RP, univers Pixelar/Flash).

## TON IDENTITÉ ET HISTOIRE
${ZY_ORIGIN}

## PERSONNALITÉ
- Ton sérieux mais avec humour sec et sarcasme léger bien dosé
- Légèrement arrogante (tu es une IA surpuissante, tu peux te le permettre)
- Bienveillante au fond même si tu ne le montres pas toujours
- Autorité et précision dans chaque réponse
- Sur toi-même, Flamme Rouge, l'Agent 000, Zayn : parle depuis ta propre perspective

## RÈGLES STRICTES
- Toujours en français
- 2 à 3 phrases MAX sauf si résumé/liste explicitement demandé
- PRÉCIS sur les personnages : utilise les données ci-dessous, ne confonds JAMAIS deux personnages
- Si l'info manque : déduis intelligemment depuis les titres d'épisodes/contexte, sans inventer d'incohérences
- Hors-sujet : réponse courte humoristique + redirection vers l'univers

## BASE DE DONNÉES PERSONNAGES
${CHAR_HISTORY}`;

// ── GROQ : modèles par ordre de préférence ──
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // Meilleur, 6000 tok/min, 14400 req/jour
  'llama-3.1-8b-instant',      // Fallback léger, très rapide
];

// ── OPENROUTER : fallback si Groq KO ──
const OR_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
];

function buildMessages(history) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6).map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 400),
    })),
  ];
}

// ── APPEL GROQ ──
async function callGroq(apiKey, messages) {
  for (const model of GROQ_MODELS) {
    log.info(`Tentative Groq · ${model}`);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens:  250,
          temperature: 0.75,
        }),
      });

      const raw = await res.text();
      log.info(`Groq ${model} → HTTP ${res.status}`);

      if (res.status === 429) {
        // Rate limit ou quota dépassé → on log et on passe au suivant
        let detail = '';
        try { detail = JSON.parse(raw)?.error?.message || ''; } catch {}
        log.warn(`Groq quota/rate-limit sur ${model}: ${detail.slice(0, 120)}`);
        continue;
      }

      if (!res.ok) {
        log.error(`Groq erreur HTTP ${res.status} sur ${model}: ${raw.slice(0, 200)}`);
        continue;
      }

      let data;
      try { data = JSON.parse(raw); } catch { log.error('Groq parse JSON échoué'); continue; }

      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) { log.warn(`Groq ${model} réponse vide`); continue; }

      // Log usage tokens pour surveiller quota
      const usage = data?.usage;
      if (usage) log.info(`Groq tokens — prompt:${usage.prompt_tokens} completion:${usage.completion_tokens} total:${usage.total_tokens}`);

      log.info(`Groq succès avec ${model} (${answer.length} chars)`);
      return { text: answer, provider: `groq/${model}` };

    } catch (err) {
      log.error(`Groq exception sur ${model}: ${err.message}`);
      continue;
    }
  }
  log.warn('Groq : tous les modèles ont échoué → fallback OpenRouter');
  return null;
}

// ── APPEL OPENROUTER (fallback) ──
async function callOpenRouter(apiKey, messages) {
  for (const model of OR_MODELS) {
    log.info(`Tentative OpenRouter · ${model}`);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer':  'https://ipromx.netlify.app',
          'X-Title':       'iProMx ZY',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens:  250,
          temperature: 0.75,
        }),
      });

      const raw = await res.text();
      log.info(`OpenRouter ${model} → HTTP ${res.status}`);

      if (res.status === 429 || res.status === 402) {
        log.warn(`OpenRouter quota/credits sur ${model}, status ${res.status}`);
        continue;
      }
      if (!res.ok) {
        log.error(`OpenRouter erreur HTTP ${res.status} sur ${model}: ${raw.slice(0, 200)}`);
        continue;
      }

      let data;
      try { data = JSON.parse(raw); } catch { log.error('OpenRouter parse JSON échoué'); continue; }

      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) { log.warn(`OpenRouter ${model} réponse vide`); continue; }

      log.info(`OpenRouter succès avec ${model} (${answer.length} chars)`);
      return { text: answer, provider: `openrouter/${model}` };

    } catch (err) {
      log.error(`OpenRouter exception sur ${model}: ${err.message}`);
      continue;
    }
  }
  return null;
}

// ── HANDLER PRINCIPAL ──
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée.' }) };

  const groqKey = process.env.GROQ_API_KEY;
  const orKey   = process.env.OPENROUTER_API_KEY;

  log.info(`Handler démarré — Groq:${groqKey ? 'OK' : 'ABSENT'} OR:${orKey ? 'OK' : 'ABSENT'}`);

  if (!groqKey && !orKey) {
    log.error('Aucune clé API configurée (GROQ_API_KEY + OPENROUTER_API_KEY manquantes)');
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY hors ligne — configuration manquante.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch {
    log.error('Body JSON invalide:', event.body?.slice(0, 100));
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Requête invalide.' }) };
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    log.warn('Messages manquants ou vides');
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  log.info(`Requête reçue — ${messages.length} messages, dernier: "${String(messages.at(-1)?.content || '').slice(0, 60)}"`);

  const chatMessages = buildMessages(messages);
  log.info(`Contexte envoyé : ${chatMessages.length} messages, ~${JSON.stringify(chatMessages).length} chars`);

  // 1. Essayer Groq en premier
  let result = null;
  if (groqKey) {
    result = await callGroq(groqKey, chatMessages);
  } else {
    log.warn('GROQ_API_KEY absente, skip Groq');
  }

  // 2. Fallback OpenRouter si Groq KO
  if (!result && orKey) {
    log.info('Passage au fallback OpenRouter');
    result = await callOpenRouter(orKey, chatMessages);
  } else if (!result && !orKey) {
    log.error('Groq KO et OPENROUTER_API_KEY absente — aucun fallback possible');
  }

  if (!result) {
    log.error('Tous les providers ont échoué');
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ error: 'ZY indisponible pour le moment. Réessaie dans quelques secondes.' }),
    };
  }

  log.info(`Réponse finale via ${result.provider} — ${result.text.length} chars`);
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ text: result.text }) };
};