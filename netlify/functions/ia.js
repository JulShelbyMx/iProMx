// ZY — Netlify Function · Groq (principal) + OpenRouter (fallback)
// Optimisation : détection personnage → injection bloc complet uniquement

const log = {
  info:  (...a) => console.log('[ZY]',  ...a),
  warn:  (...a) => console.warn('[ZY⚠]', ...a),
  error: (...a) => console.error('[ZY✗]', ...a),
};

const CHARACTERS = [
{
"name": "David Flash",
"family": "Flash",
"keywords": [
"david flash",
"david"
],
"block": "NOM : David Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Tigre blanc\nTRAITS : Serein, Honorable, Sage, Protecteur.\nHISTOIRE COMPLÈTE :\nÀ 21 ans, David Flash fonde le Gang Double, une équipe redoutable composée de spécialistes aux talents uniques. Ensemble, ils défient le FBI et acquièrent une réputation d'invincibilité, allant jusqu'à bombarder un siège fédéral en représailles d'un piège. Après une pause où il rencontre l'amour de sa vie, Alexandra, la mafia riposte à un vol du gang en enlevant la jeune femme. Le Gang Double élimine méthodiquement les responsables pour la libérer, avant d’infiltrer discrètement le LSPD pour effacer les dossiers judiciaires de leurs membres. Après son mariage avec Alexandra, le bonheur de David est brisé par une attaque du gang rival des Spinners sur le Mont Chiliad. Séparé des siens et les croyant morts, David est capturé et contraint de braquer la Banque nationale de San Andreas sous le coup d'un chantage pour la vie de sa femme. Il réorganise son gang avec de nouvelles recrues impressionnantes mais apprend, juste avant la mission, la mort d'Alexandra et de son fils. Anéanti, il réussit le braquage, exécute le chef des Spinners sur le lieu du drame, puis, consumé par le chagrin, se laisse arrêter sans résistance par le SWAT dans sa villa. Condamné à la prison à vie, sa vie bascule à nouveau dix-huit ans plus tard lorsqu'il aperçoit de loin un jeune homme qui est le portrait craché de lui et d'Alexandra : son fils John. Porté par une détermination nouvelle, David s'évade avec une facilité déconcertante et infiltre une base militaire. Il contraint le général à offrir une chance d'évasion à John. Lors de la fuite, la voiture de John explose ; David le sauve in extremis et simule sa mort pour le protéger. Dès lors, il agit dans l'ombre, éliminant les menaces comme Garry, jusqu'au jour où John est emprisonné et que son petit-fils, Ken, tombe gravement malade. David sauve le nourrisson au prix d'un choix tragique qui cause indirectement la perte de John. Persuadé que son fils est toujours en vie, David le cherche en vain pendant dix-neuf ans. Vieilli mais déterminé, il se présente à Ken, lui révèle la vérité et lui propose de recréer le Gang Double. Bien que Ken temporise, la promesse est faite. Après un retrait partiel et un séjour de deux ans en Italie aux côtés de Giulia pour l'aider à accueillir son arrière-petit-fils David Jr, David retourne à Los Santos. Il y retrouve enfin John, sauve Ken et, dans un acte mystique, fusionne avec son fils et son petit-fils pour unir leurs héritages. Dix-neuf années passèrent encore. Son ultime combat l'oppose à David Jr dans un affrontement titanesque empreint d'amour et de transmission. Sur le point de mourir, il lègue toute sa puissance à son dernier arrière-petit-fils, Aaron Flash. Ainsi s’achève l’histoire du légendaire fondateur du Gang Double. Leader respecté et stratège hors pair, David aurait pu n'être qu'un criminel de plus gravant son nom dans le sang et le chaos. Mais guidé par l'amour filial et un sens absolu de la famille, il choisit de consacrer sa vie, ses évasions et ses derniers pouvoirs à la protection de ses descendants, s'éteignant finalement comme le patriarche suprême ayant tout sacrifié pour préserver sa lignée."
},
{
"name": "John Flash",
"family": "Flash",
"keywords": [
"john flash",
"john"
],
"block": "NOM : John Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Loup\nTRAITS : Loyal – Taciturne – Stratège – Marqué par le poids des responsabilités.\nHISTOIRE COMPLÈTE :\nÀ 18 ans, John Lewis mène une double vie sous l'œil de son oncle Franck, capitaine du LSPD : jeune homme tranquille le jour, il devient un pilote de courses illégales obsédé par la vitesse la nuit. Déterminé à abattre la légende corrompue du « King of the Street », il le défie dans un pari fou en misant son propre véhicule. Mais la course est interrompue par la police. Arrêté, John est envoyé par son oncle dans un camp militaire pour jeunes délinquants après avoir croisé en prison le regard de David Flash, le mythique leader déchu du Gang Double. Refusant la défaite, John s'évade, mais sa fuite se termine par un terrible accident de voiture. À son réveil à l'hôpital, son oncle lui révèle une vérité qui bouleverse son existence : David Flash l'a sauvé des flammes au prix de sa propre vie, et cet homme n'était autre que son véritable père. Guidé par Doumé Paoli, un ancien membre du gang, John embrasse son héritage divin et entame un entraînement impitoyable dans les montagnes sous la direction de Maître Lovel. Devenu un homme neuf, John prend sa revanche sur le King of the Street et utilise ses gains pour ouvrir une concession automobile prospère avec son frère de cœur, Garry Wahyate. À 23 ans, désormais couronné nouveau King, il mène de front sa réussite légale et des braquages nocturnes. Sa vie se complique lorsqu'il s'éprend d'Angel Insomniak, une agente du LSPD initialement courtisée par Garry. Leur amour et leurs fiançailles brisent sa fraternité avec Garry, poussant John à rejoindre le LSPD. C'est alors qu'un piège machiavélique, orchestré par Garry et la puissante Emy Smith, s'effondre sur lui : John est drogué et exposé devant toute la ville aux côtés d'Emy, enceinte de lui. Rejeté par Angel, John tente de se suicider en se jetant dans le vide, mais il est sauvé par Lovel. Il traque ensuite le couple en Alaska pour prouver son innocence à Angel en filmant les manipulations de Garry. Après avoir survécu à une tentative de meurtre d'Emy grâce à un mystérieux tueur de l'ombre, John et Angel se marient et attendent un enfant, fondant une nouvelle concession ensemble. Cependant, les démons du passé resurgissent. John replonge dans le crime en créant une drogue nommée la Mou4 et accepte de pardonner à Garry, revenu implorer son pardon. Mais la tragédie frappe à nouveau sur un chantier de maçonnerie lorsque Garry percute accidentellement Angel avec un camion. Pour masquer son crime, Garry séquestre la jeune femme amnésique et lui fait croire qu'il est son époux, peignant John comme un dangereux criminel. En découvrant la vérité, John est submergé par la rage : il s'introduit chez eux et assassine Garry sous les yeux d'Angel. Condamné à la prison à vie pour ses nombreux crimes, John feint d'être mort après avoir eu les cordes vocales tranchées lors d'une mutinerie. Il s'évade de la morgue et s'évanouit dans la nature, abandonnant définitivement son identité pour renaître dans l'ombre sous les traits de « Monsieur l’Araignée », le chef muet de la première grande mafia de Los Santos. Pendant vingt-trois ans, l'Araignée règne sans partage sur un empire criminel terrifiant à travers toute l'Amérique. À l'âge de 50 ans, son hégémonie est bousculée par les attaques audacieuses de Drago, un jeune homme de 25 ans à la tête du Gang Double 2.0. L'enquête de John révèle un choc immense : ce rival n'est autre que son propre fils, Ken Flash. Par amour et fierté, John choisit de lui léguer l'intégralité de son empire par lettre avant de se retirer dans un bunker au cœur des montagnes. C'est là que se produit le miracle : David Flash, son père qu'il croyait mort, réapparaît. David lui confie l'avoir protégé dans l'ombre de chaque drame de sa vie, avant de l'appeler à l'aide pour sauver Ken, alors en grand danger. Sans hésiter, John s'allie à son père. Dans un rituel mystique hors du temps, John et David fusionnent leurs âmes avec Ken, lui conférant une puissance divine qui lui permet de sauver sa lignée. Dix-neuf années s'écoulent encore dans cette union spirituelle. Le voyage de John Flash s'achève lors d'une ultime guerre contre David Jr., son propre petit-fils devenu une menace destructrice pour le monde. Face au chaos, John fait le choix du sacrifice absolu. Dans un dernier élan d'amour, il transmet toute sa puissance ancestrale à son dernier petit-fils, Aaron Flash, éteignant ainsi la lignée de l'Araignée de Los Santos pour faire briller son héritage à jamais."
},
{
"name": "Ken Flash",
"family": "Flash",
"keywords": [
"ken flash",
"ken"
],
"block": "NOM : Ken Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Dragon\nTRAITS : Fier – Charismatique – Tourmenté – Impulsif – Visionnaire.\nHISTOIRE COMPLÈTE :\nNé fragile et sauvé par un miracle médical inexpliqué, Ken grandit à Los Santos auprès d'une mère amnésique, sous l'ombre d'un père qu'il croit assassiné. Élève brillant et discipliné, il apprend à ses 18 ans la vérité sur ses origines : il est le fils de John Flash. Désormais fier de son nom, il s'installe en Italie avec son ami Mario et vit un coup de foudre passionnel avec Giulia Vitale. En découvrant qu'elle est l'héritière d'une puissante mafia, leur lien se scelle, mais Giulia disparaît subitement. De retour à Los Santos, Ken évacue son chagrin dans les combats clandestins avant d'intégrer le LSPD. Devenu un lieutenant respecté, il sauve Giulia lors d'une opération, mais un évanouissement provoqué par un vieil homme sur une plage brise ses certitudes. Cet homme n'est autre que son grand-père, David Flash, qui lui révèle le passé criminel de sa lignée et l'envoie s'entraîner au Texas. En chemin, il découvre que sa compagne de route, Raven, est sa demi-sœur. À 22 ans, il revient à Los Santos métamorphosé. Sous le pseudonyme de Drago, il mène une double vie criminelle nocturne au sein d'un groupe de bikers mené par Alléssa, tout en cachant ses braquages à Giulia. L'infidélité de Ken pousse Giulia à rompre, le plongeant dans une spirale d'autodestruction. Pour le sauver, son patron l'envoie à l'armée, où il devient un caporal-chef exemplaire le jour et un Don Juan destructeur la nuit, essuyant le rejet d'Aby Santini. Atteint d'hallucinations et de maux violents, Ken déserte et bascule dans la folie en devenant un tueur en série à la machette. Il simule sa mort après avoir épargné Luna, enceinte de lui. Un an et demi plus tard, à l'âge de 25 ans, il s'allie à Titeuff et Juarrez pour s'emparer du trafic de la drogue Mou4. En apprenant que Luna a perdu leur bébé dans un accident, il l'assassine de sang-froid. Prêt à honorer une vieille promesse, Ken fonde le Gang Double 2.0 avec Titeuff, Juarrez et Ouaki. C'est alors qu'il découvre que la drogue volée appartenait à la mafia de son père, John Flash, qui vient de lui léguer son immense empire militaire. Ken recrute Alizé et le médecin Jason Da-Silva, tout en se rapprochant de Laïla Mancini. C'est à ce moment qu'il retrouve Giulia, devenue marraine de la famille Vitale ; elle lui révèle l'existence de leur fils caché de deux ans, David Jr., né de leur amour passé et protégé par David Flash. Submergé par la douleur de cette confrontation, Ken est percuté par une voiture qui se broie contre lui : le choc libère enfin ses pouvoirs surhumains, longtemps bloqués dans son corps. Alors qu'il commence à maîtriser ses facultés auprès de Maître Lovel, il apprend que sa fiancée Laïla attend des jumeaux. La tension monte avec le LSPD après que Ken a mis une prime sur la tête de l'agent Derreck. Pour protéger sa famille et ses alliés, Ken confie ses nouveau-nés à Laïla et son empire à Jason, avant de se rendre spectaculairement aux autorités. Il est enfermé dans une cage immergée à 600 mètres de profondeur pour neutraliser ses pouvoirs. Dans l'abîme, le miracle se produit : Ken fusionne spirituellement avec les âmes de son père John et de son grand-père David Flash. Évadé et doté d'une puissance absolue, il épouse Laïla en secret avant de prendre d'assaut la prison pour la libérer aux côtés de Jason et Alizé. Face au danger, le gang se sépare : Laïla part en Italie avec leur fille Kylie, tandis que Ken s'exile à Liberty City pour élever son fils Aaron, le préparant à affronter son frère aîné, David Jr., devenu fou de haine. Dix-neuf ans plus tard, un pressentiment déchire Ken. Il court à Los Santos mais ne peut qu'accueillir le dernier soupir de Laïla, mourante. Après un affrontement où Aaron est laissé pour mort, Ken retrouve Aby et prépare le Gang Double 3.0. Il revoit Giulia, revenue d'Italie après le massacre de sa famille par David Jr. Désormais âgés de 45 et 52 ans, Ken et Giulia unissent leurs forces à l'équipe d'Aaron, Ken mettant son expertise militaire au service de l'entraînement de la jeune Nina. Le jour de l'affrontement final contre David Jr. arrive, soutenu par une trêve avec le chef d'état-major Smith. Mais la tragédie frappe le cœur du patriarche : sous ses yeux, David Jr. assassine froidement sa propre mère, Giulia. Privé des deux femmes de sa vie, Ken laisse éclater sa rage dans un duel titanesque qui fait trembler le continent. Réalisant qu'il doit clore ce cycle de sang, Ken fait le choix du sacrifice ultime en libérant toute son énergie. Il meurt dans une explosion monumentale, emportant avec lui l'héritage de John et David Flash. Ainsi s’achève l’histoire de Ken Flash, l'enfant miraculé devenu le chef suprême du Gang Double 2.0. Des rings de boxe aux cellules sous-marines, des sommets de l'armée aux dérives d'un tueur de l'ombre, son existence aura été un combat permanent contre ses propres démons et un destin écrasant. Il s'éteint non pas en criminel, mais en héros sacrificiel, offrant sa vie et ses pouvoirs ancestraux pour éteindre la folie de sa propre lignée et sauver l'avenir du monde."
},
{
"name": "Kayton Flash",
"family": "Flash",
"keywords": [
"kayton flash",
"kayton",
"maze"
],
"block": "NOM : Kayton Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Loup-Garou\nTRAITS : Tourmenté, Protecteur,Sensible, en quête de rédemption.\nHISTOIRE COMPLÈTE :\nPendant des décennies, Kayton existe sous la forme d'une entité invisible et malveillante surnommée le « Mal incarné ». Se nourrissant de la haine et de la souffrance humaine, il orchestre dans l'ombre les pires tragédies de la lignée Flash, manipulant David Junior Vitale Flash (DJR) et transformant la vie de Damon en un enfer absolu. Lors d'un affrontement final à l'aéroport de Sandy Shores face à Aaron Flash, sa terrible origine est révélée : il est l'âme résiduelle d'un fœtus mort-né au sixième mois de grossesse de Luna, assassinée par Ken Flash, leur propre père. C'est cette tragédie originelle qui l'avait transformé en démon vindicatif. Mais face à cette abomination, Damon Flash fait le choix inattendu de la compassion : par son sacrifice ultime, il offre au démon une chance de ressentir et d'aimer. Ce geste rédempteur provoque un miracle et donne physiquement naissance à Kayton : un homme doté d'un corps adulte de 23 ans, d'un esprit vieux d'un demi-siècle, mais d'une conscience innocente de nouveau-né. Perdu et sans repères dans les rues de Los Santos, l'ancien démon choisit le nom de Kayton Maze. Désireux de faire le bien, il s'improvise pompier puis intègre le LSPD sous l'impulsion de sa rencontre avec la lieutenante Arya Andersson (Matricule 04). Cependant, sa nature monstrueuse le rattrape à la pleine lune : ses os se brisent et il se transforme en loup-garou. Il tombe alors sous l'emprise toxique d'un mentor vampire, Grinchias, qui le pousse à commettre de nouvelles violences nocturnes, dont l'agression secrète de Kléa. Tiraillé par la culpabilité, Kayton trouve en Arya son ancre humaine et finit par lui avouer son lourd passé démoniaque. La révélation est un cataclysme : Arya réalise que Kayton est indirectement responsable de la mort de sa propre mère, Aby Santini, et le renie. Submergé par le désespoir, Kayton s'exile dans les montagnes sous sa forme lupine avant de revenir, soumis à Grinchias, avec l'ordre de protéger la fille de ce dernier, Kaycha. C'est une prise de sang analysée par Citye qui le reconnecte à ses racines Flash. Guidé par Arya, qui exige des preuves de son changement, Kayton se rebelle enfin contre le vampire, fonde sa propre meute et devient Alpha. Capturé par un Grinchias vengeur, Kayton est sauvé in extremis par le retour d'Aaron Flash, qui lui confie la quête des balles ancestrales pour forger son esprit. Devenu plus puissant et maître de ses facultés, Kayton hérite d'un garage mythique contenant les véhicules de la famille Flash et s'initie aux courses de run. Lorsque Grinchias kidnappe Arya, la rage de Kayton brise les lois de la nature et déclenche une transformation lupine en plein jour ; il terrasse le vampire et libère sa bien-aimée. Après un braquage de banque improvisé qui s'achève en dispute générale avec Arya et son frère Austin, Aaron oriente Kayton vers les deux premières balles ancestrales. Pour la cause, il infiltre le LSPD, dérobe la balle de Jenna Flash au musée et se rend volontairement à Arya après une course-poursuite héroïque. En prison, il séduit la commandante Ashley pour s'évader par un tunnel direction Cayo Perico, où il récupère la balle de Titeuf Kehzack au sommet d'un phare, débloquant les pouvoirs de la foudre et de la téléportation. Sa quête le mène ensuite à récupérer la balle d'Alec Reeves lors d'une attaque de sorcier, puis à accepter pleinement sa part d'ombre pour progresser spirituellement, soutenu par le sacrifice de son ami Mouloud. De retour au Texas, il s'empare d'une nouvelle balle dissimulée dans un sceptre ancien. Parvenu au terme de son voyage, Kayton assimile les balles de Maddie Litano et d'Octave West, acquérant l'invisibilité et le contrôle du temps, avant de terrasser un monstre sous-marin pour obtenir l'ultime relique de Kayla Queen. Cette dernière résonance lui restitue son âge réel et lui ouvre l'accès à la balle de Damon Flash. Avant le grand départ, Kayton affronte le regard d'Austin et confesse le meurtre d'Aby Santini ; son humilité lui vaut le pardon familial et scelle son amour pur avec Arya, tandis que le chien Spike révèle sa véritable identité de Rookie. Propulsée à son tour sur la Terre des Flash après avoir fait ses adieux au LSPD, Arya y retrouve un Kayton transfiguré. Mais la paix est de courte durée : Adrian, le fils de David Jr., sombre à son tour dans la haine. Comprenant mieux que quiconque cette noirceur, Kayton obtient d'Aaron le droit de l'affronter en premier. Au terme d'un duel titanesque, il parvient à repousser la menace au prix de son propre sacrifice. Kayton Maze meurt dans les bras d'Arya, laissant derrière lui ses deux filles jumelles, Zeyra et Erza, ultimes lueurs d'espoir de la lignée. Ainsi s’achève l’histoire de Kayton Flash, le Mal incarné devenu protecteur de la Terre des Flash. Né du néant et de la rancœur, cet esprit démoniaque aura parcouru le plus sinueux des chemins vers la rédemption, troquant ses chaînes de loup-garou et ses instincts destructeurs contre l'amour d'une femme et le pardon de ses victimes. Il s'éteint non pas comme le monstre qu'il était, mais comme un martyr héroïque, gravant son sacrifice au Panthéon de sa lignée."
},
{
"name": "David Junior (JR) Vitale Flash",
"family": "Flash",
"keywords": [
"david junior (jr) vitale flash",
"david",
"david jr",
"djr",
"david junior",
"jr",
"vitale"
],
"block": "NOM : David Junior (JR) Vitale Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Cobra\nTRAITS : Repenti, Mystérieux, Intense, Charismatique, Calculateur.\nHISTOIRE COMPLÈTE :\nNé d'un amour brisé entre Giulia Vitale et Ken Flash, David Junior Vitale Flash (DJR) voit le jour en Italie après que son grand-père, David Flash, a convaincu sa mère de cacher sa grossesse pour laisser Ken accomplir son destin. Élevé dans l'ombre d'une guerre mafieuse que Giulia remporte pour devenir marraine, le jeune garçon grandit avec une haine féroce qui s'enracine en lui, malgré l'affection profonde qu'il porte à sa petite sœur Gianna, née dix ans plus tard. À l'âge de 18 ans, cette rage explose : DJR massacre l'intégralité du clan Vitale, s'empare du trésor familial et s'exile à Los Santos pour détruire son père. Durant l'arc Aaron Flash, il orchestre trahisons et manipulations psychologiques dans l'ombre, se pensant invincible. Son orgueil s'effondre lorsqu'Aaron détruit son quartier général dans une explosion colossale, le laissant défiguré et grièvement blessé. Consumé par l'humiliation, DJR réplique en levant une armée d'androïdes conscients pour raser Los Santos, mais Ken Flash sabote ses plans. C'est finalement Aaron qui le terrasse lors d'un duel brutal et inévitable sur une plage, choisissant de lui laisser la vie sauve. Abandonné et brisé sur le sable, il est sauvé par Kayla Queen. À ses côtés, la haine fait place à une paix inédite, et de leur union naît Adrian. Redoutant que son fils aîné n'hérite de ses propres démons, DJR prend la douloureuse décision de le confier à sa tante Kylie, avant d'avoir une fille, Jenna. Mandaté par Aaron, il commence alors à veiller en secret sur son neveu Damon. Il sort de l'ombre pour le réconforter sur la tombe de sa mère avant de le ramener auprès d'Aaron. Son enquête à la Fuente Blanca le pousse à repousser les Vagos de Barbara avant d'affronter l'androïde fusionné 666, alors qu'une pluie brûlante déforme la réalité. C'est au cœur de ce chaos qu'il est attaqué par l'Agent 000 du FBI, un génie technologique qui l'accuse du meurtre du juge Antoine Dassault. Le duel révèle que 000 n'est autre que Charles Dassault, le fils du juge et dirigeant secret des banques de la ville. Réalisant qu'ils partagent la même quête de rédemption, les deux ennemis jurent une amitié indéfectible. Désormais âgé de 45 ans, fort d'une volonté inébranlable, DJR repousse une tentative de possession du démon avant de présenter Charles à sa femme Kayla et sa fille Jenna. C'est à la ferme qu'il croise la nouvelle commandante du LSPD, Gianna, sa propre sœur. Sous l'identité de « Monsieur Richard Queen », il feint l'anonymat et conclut une alliance commerciale avec elle. Pendant ce temps, Charles reprogramme l'ancienne IA destructrice de DJR, Flamme Rouge, pour donner naissance à ZY, une intelligence protectrice. Épaulé par 000 et l'Agent 669 (Titeuf Kehzack, maintenu en vie sous forme de mort-vivant par l'énergie Flash), DJR neutralise une attaque de gaz toxique en détruisant un vaisseau spatial à bord de la RT70. Pour sauver Titeuf, grièvement blessé, il utilise la Mue du Cobra et lui transfère son énergie pour lui rendre son corps humain. Le démon ressurgit alors sous sa forme ultime. DJR lui tend un piège en acceptant la possession, puis libère le Réservoir du Cobra, une technique accumulant l'énergie de toutes ses souffrances passées. L'explosion pulvérise définitivement 666. Épuisé, il révèle enfin toute la vérité et son héritage Flash à sa fille Jenna. Soucieux de sécuriser l'avenir, DJR intercepte un convoi blindé du LSPD avec l'aide de sa famille et de ses alliés (Alec, Octave, Laora, Titeuf, Maddie) pour récupérer l'entité 666 reprogrammée, tandis que Charles reste en retrait. Reconnu durant l'assaut, il est interrogé par Gianna. Fatigué de mentir, il lui avoue sa véritable identité. Déchirée entre son amour fraternel et le meurtre de leur mère, Gianna lance toutes ses brigades à ses trousses. Refusant de lever la main sur la police, DJR active définitivement Flamme Rouge et s'enfuit avec Charles, qui trahit le gouvernement, devenant un fugitif recherché pour 300 millions de dollars. Réfugié sur la Terre des Flash, il entraîne son équipe et sa famille jusqu'à l'obtention d'un état mental à 100 %. Après avoir obtenu le pardon ultime de Gianna lors d'une dernière rencontre pacifique, DJR attend l'équipe de Damon (Octave, Alec, Laora, Kayla, Jenna, Titeuf, Maddie) au sommet d'une structure sacrée. Pour prouver leur détermination absolue à protéger la paix, ils doivent accomplir l'épreuve finale : tuer David Junior. En acceptant ce destin, DJR honore la promesse faite à Aaron vingt-trois ans plus tôt, achevant son long et sinueux chemin de rédemption par le sacrifice de sa propre vie."
},
{
"name": "Aaron Flash",
"family": "Flash",
"keywords": [
"aaron flash",
"aaron"
],
"block": "NOM : Aaron Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Phœnix\nTRAITS : Responsabilité, Tourmenté, Protecteur, Loyal\nHISTOIRE COMPLÈTE :\nÉlevé à Liberty City par son père Ken Flash dans le seul but de neutraliser la dérive destructrice de son frère aîné, Aaron passe 18 ans d'entraînement militaire intensif pour devenir le Flash le plus accompli de sa lignée. Sous la stricte interdiction paternelle de procréer sous peine d'engendrer une puissance apocalypse, il débarque à Los Santos avec son meilleur ami d'enfance, Balthazar Connor (Balthy), reprenant le vieux garage mécanique de Ken comme couverture. Lors d'une crémaillère, il rencontre sa sœur jumelle Kylie, élevée en Italie, mais subit un violent accrochage avec Nina Di Cara, propriétaire orgueilleuse de garages concurrents. Devenus rivaux acharnés, Aaron et Balthy cambriolent sa villa ; grâce au hacker Mouloud, Aaron découvre des photos compromettantes et fait chanter Nina sous le pseudonyme du « Gros Baiseur ». Cependant, David Junior (DJR) émerge de l'ombre et tente de manipuler Nina pour lui voler son énergie vitale à travers une future lignée. Pour faire front, Aaron et Nina scellent une alliance fragile. Entre violentes disputes et haine apparente, leur tension toxique bascule dans une passion charnelle secrète, qu'Aaron évacue un temps en volant le yacht de Nina tout en continuant de succomber à leur liaison nocturne. Le chaos s'intensifie lorsque Kylie se met en danger en boîte de nuit à cause de Maddie Litano. Furieux, Aaron kidnappe Maddie, la menace de mort au sommet du mont Chiliad et la force à l'appeler « Le Gros Baiseur ». En représailles, DJR corrompt l'esprit de Balthy, poussant ce dernier à agresser Kylie. Aaron intervient et, lors d'un duel fratricide incontrôlable, tue accidentellement son ami d'enfance, qu'il enterre près d'une rivière de montagne. Après avoir secouru Nina de l'emprise de DJR, Aaron s'associe à Maître Dark Gordon, Monsieur Roule Raoule et au médecin Jason Da Silva pour capter l'héritage militaire de Ken (arsenal, porte-avions, île). Bien que Maître Lovel aide le groupe à s'émanciper de DJR, Aaron commet l'erreur de flirter avec Maddie lors d'un pari. Celle-ci le drogue par vengeance, provoquant un éveil destructeur de ses pouvoirs en ville. Pour blanchir son alter-ego du « Gros Baiseur » auprès de Nina, Aaron utilise une capacité psychique interdite pour réécrire les souvenirs de Maddie, lui faisant croire qu'elle est l'auteur du chantage. Lassé des secrets, il finit par confesser toute la vérité à Nina, qui accepte de lui pardonner. Après avoir fondé le Gang Double 3.0 avec Balthy (ressuscité par DJR pour semer le chaos), Mouloud, Jason, Gordon, Jessie, Sandro, Drake et Nina, Aaron multiplie les braquages de fourgons blindés. Mais l'arrestation de Drake pousse Aaron à honorer sa promesse de solidarité : il se rend au LSPD. Condamné à la perpétuité par le juge Antoine Dassault, il s'évade de prison lors d'une nuit sanglante où Maître Gordon meurt dans ses bras, abattu par une balle. Brisé, Aaron plonge dans la drogue avant d'être sauvé par Nina, puis capturé par le FBI lors d'une panne d'essence en pleine course-poursuite. Il pactise alors avec la directrice Angela Moore pour traquer DJR. Durant cette double vie, Nina lui offre un casino pour concrétiser son rêve, tandis qu'Aaron succombe brièvement au charme d'Angela à bord d'un yacht. L'enquête vire au drame familial lorsque la mafia Mancini kidnappe Nina : l'assaut du FBI élimine les ravisseurs, dont Maria Mancini, la propre tante d'Aaron, que Nina exécute. On découvre alors que Nina est la fille biologique cachée de Jason Da Silva. Après avoir abattu le directeur corrompu du FBI pour protéger Angela, Aaron recouvre l'intégralité de son mental et de ses pouvoirs. Se faisant passer pour son propre assassin ou pour DJR afin de tester son gang, Aaron organise un rendez-vous romantique avec Nina sur le toit du LSPD, brutalement interrompu par un sniper qui blesse la jeune femme. En la sauvant, Aaron apprend de Jason qu'un enfant du gang est le sien. Prêt à en découdre, il traque le lieutenant Bunny jusqu'au QG de DJR où est dissimulée une bombe nucléaire. Assommé, Aaron se réveille dans un tunnel auprès de Laïla et du cadavre de Balthy, réalisant qu'il a été contaminé par le Cobra-Virus, une arme biologique de DJR. Porteur sain, il assiste au retour de Ken Flash qui emporte Laïla mourante, tandis que Los Santos subit une pandémie globale. Après avoir enterré Balthy au mont Chiliad et confessé ses derniers mensonges à Nina, le choc tombe : Angela est enceinte de lui, brisant l'interdiction absolue de sa lignée. Nina fuit à Liberty City. Un an après son arrivée, Aaron réunit les survivants (Jason, Kylie, Ouaki, Milo, Aby, Vito) et lance une attaque suicide contre le QG de DJR. L'explosion nucléaire qui s'ensuit détruit Los Santos et coûte la vie à Aaron, laissant Kylie face aux ruines. Le sacrifice n'est que temporaire : son corps se reconstruit et Aaron traque DJR à une vitesse supralumière, le projetant sur le porte-avions familial avant de le mettre K.O. Une fumée noire s'échappant de DJR, Aaron réalise qu'il était possédé et lui laisse la vie sauve sur une plage en échange d'une promesse de rédemption. Il épouse enfin Nina devant l'océan et s'exile sur la Terre des Flash, apprenant que leur premier fils, Damon, a été kidnappé par un esprit et adopté par un commandant du LSPD. Les années passent et le couple engendre deux autres enfants : Eden et Daysie. Eden s'avère lié à l'entité du Cerbère, développant deux alter-egos psychotiques, Eddy et Ned. Après avoir sauvé et intégré Damon, puis libéré son frère démoniaque Kayton Flash, Aaron subit une première mort face à Adrian, le fils de DJR. Ressuscité sous forme de nouveau-né à croissance rapide, il mène l'ultime guerre contre Ned, fusionné avec un venin de basilic, et Eddy. Scellé dans l'esprit de Ned au cours de la bataille, Aaron lui transmet ses dernières directives : pacifier ses personnalités intérieures et terrasser Adrian. Aaron Flash s'éteint définitivement pour la troisième fois, léguant à sa descendance le destin de sa dynastie."
},
{
"name": "Damon Flash",
"family": "Flash",
"keywords": [
"damon flash",
"damon"
],
"block": "NOM : Damon Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Lion\nTRAITS : Déterminé, Impulsif, Loyal, Torturé, Instinctif.\nHISTOIRE COMPLÈTE :\nNé des amours interdites d'Aaron Flash et de la directrice du FBI Angela Moore, le premier-né de la lignée est immédiatement arraché à son berceau par l'esprit vengeur d'un fœtus mort-né de Ken Flash. Incapable de posséder l'âme pure du nourrisson, l'entité l'abandonne dans une ruelle obscure de Los Santos, où il est recueilli et nommé Damon par son père adoptif, le commandant du LSPD Williams Roule. Fuyant à 9 ans un foyer rongé par l'alcool et la violence, l'enfant s'enfonce dans les bas-fonds de la ville avant d'être embrigadé par Frédérico, le cruel Jefe des Vagos colombiens. Intronisé à 11 ans sous le tatouage de la « MUERTE », il deale de la cocaïne aux côtés de Julio et Lola, sombrant lui-même dans une profonde toxicomanie. À l'âge de 20 ans, acculé par une dette impayable, il échappe à une exécution ordonnée par Frédérico en massacrant le quartier des Vagos. Arrêté à la suite d'une course-poursuite par son père adoptif, il subit un an d'isolement carcéral avant d'être enrôlé de force dans un programme militaire disciplinaire. À la base, sous le coup d'une prime d'un million de dollars promise par les Vagos, Damon s'allie à la caporale Kayssie pour organiser une évasion, ralliant Julio et Lola. C'est alors que ses pouvoirs héréditaires de manipulation mentale s'éveillent de manière inconsciente et terrifiante, forçant un général à capituler et un soldat à se suicider. Devenu le leader de l'équipe MUERTE (Kayssie, Julio, Lola, Éric et Octave), il multiplie les braquages et s'évade du FBI en asservissant psychiquement l'agent Brandon Da Silva. Cependant, l'entité démoniaque qui sommeille en lui brise ses barrières mentales pendant son sommeil, provoquant des réveils amnésiques sanglants. Consumé par une transe de feu orchestrée par le démon, qui lui désigne Angela Moore comme la responsable de son abandon, Damon la traque et lui plonge une hache dans le ventre. Emprisonné puis libéré par l'Agent 000, il bascule dans la tyrannie absolue lorsque le démon le force à céder son corps : hypnotisant la foule de Los Santos, Damon instaure une monarchie absolue, se proclame Roi et nomme ses proches aux postes clés d'un régime totalitaire. Face à la Résistance menée par 000 et Brandon, le Roi Damon ordonne l'exécution publique de Brandon, de Maggie Vitale et d'Éric West au cimetière. Trahi lors d'un duel contre l'armure technologique de 000, Damon capture de nouveau Angela Moore et l'exécute d'une balle dans le front. Ce meurtre matricide provoque un choc psychologique tel qu'il brise instantanément l'emprise du démon. Submergé par la culpabilité, Damon abandonne sa couronne, fuit la prime de 10 millions lancée par l'État (ainsi que la traque de Barbara, la 92e Refe des Vagos) et s'exile trois mois dans les montagnes de San Andreas, guidé par un tigre blanc mystique. Il trouve refuge sous l'alias de Jacob Lopez à la ferme Fuente Blanca, gérée par Gianna Vitale, la commandante du LSPD. Tout en luttant contre son addiction et en nouant une idylle avec Lucie Roquefort, il dissimule sa nature de criminel d'État, allant jusqu'à dévaliser secrètement l'armure de la police pour revendre le butin aux Vagos, avant de remporter un jeu de télé-réalité insulaire. Confondu par un test ADN orchestré par l'Agent 000 et l'androïde 666, Damon embrasse sa véritable identité de Flash. Équipé d'une combinaison canalisatrice conçue par 000, il découvre l'horreur de ses actes passés : Gianna Vitale lui révèle que sa fille Maggie, dont il est tombé amoureux du souvenir maternel, a été assassinée par nul autre que Damon Flash. Écrasé par ce fardeau, il s'associe au LSPD pour récupérer l'IA Flamme Rouge, mais l'androïde 666 est corrompu par la haine résiduelle de David Jr. Damon terrasse la machine lors d'un duel cataclysmique à la centrale électrique avant d'être guidé par son oncle DJR vers la Terre des Flash. Éduqué durant six mois par son père biologique Aaron et sa belle-mère Nina, il dompte ses facultés et s'approprie la balle ancestrale de DJR après la mort de ce dernier. De retour à Los Santos, il obtient le pardon de Gianna, monte une station-service légitime pour ses 23 ans, mais s'enfonce dans un cycle autodestructeur de drogue pour repousser Lucie afin de la protéger du dénouement final. Épaulé par la brigade d'élite de DJR (Octave, Alec, Maddie, Laora, Titeuff, Kayla, Jenna), Damon affronte le démon au cœur de la métropole, lui assénant le coup de pied mythique de la lignée Flash. La créature se retranche alors au Temple des Balles et dévoile l'origine de la malédiction : elle est l'âme corrompue du quatrième enfant de Ken Flash et Luna, transformée en démon vengeur après le meurtre de sa mère. Après avoir dérobé les balles ancestrales, l'entité engage l'ultime combat à l'aéroport de Sandy Shores. Guidé par l'esprit d'Aaron et fort des sacrifices de ses alliés, Damon terrasse le monstre. Plutôt que d'annihiler l'esprit de son oncle mort-né, Damon choisit la rédemption absolue : il infuse toute son énergie vitale dans le démon pour lui offrir l'incarnation humaine, l'amour et la paix. À l'âge de 23 ans, Damon Flash s'éteint en martyr, purifié de ses addictions et de ses crimes, scellant par son sacrifice la paix définitive de la dynastie Flash."
},
{
"name": "Adrian Jefferson Flash",
"family": "Flash",
"keywords": [
"adrian jefferson flash",
"adrian"
],
"block": "NOM : Adrian Jefferson Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Basilic\nTRAITS : Stratège, Impitoyable, Manipulateur, Hanté.\nHISTOIRE COMPLÈTE :\nAdrian Jefferson Flash grandit dans la famille Jefferson sans connaître ses véritables origines. Adopté par Kylie et élevé aux côtés de son frère Denis, il est d’abord un jeune homme exemplaire : protecteur, courageux et profondément attaché à sa famille. À 18 ans, il rejoint l’armée où il devient rapidement un soldat respecté. Mais sa vie bascule lorsqu’un entraînement tourne au drame. Après une violente altercation, Adrian tue une recrue. Condamné à deux ans de prison, il ressort consumé par la haine. Persuadé d’avoir été victime d’une injustice, il rejette les lois et décide de créer sa propre justice. À sa sortie, il plonge dans le crime. Braquages, manipulations, mensonges et trahisons deviennent son quotidien. Il utilise son intelligence pour contrôler ceux qui l’entourent, y compris son propre frère Denis. Peu à peu, Adrian abandonne toute morale. Lorsqu’une jeune femme nommée Georgia menace de révéler ses crimes, il l’étrangle devant Denis, détruisant définitivement l’image du grand frère modèle qu’il incarnait autrefois. Son ambition grandit. Il bâtit un empire criminel, organise des braquages toujours plus audacieux et accumule une immense fortune. Découvrant qu’il est le fils de David Junior Vitale Flash, un criminel légendaire, Adrian commence à idolâtrer cette figure et voit dans le crime son véritable héritage. Malgré plusieurs occasions de changer, Adrian choisit systématiquement la violence. Il manipule sa famille, fait accuser Denis de crimes qu’il n’a pas commis, torture son père adoptif Warren et élimine quiconque se met en travers de son chemin. Sa soif de pouvoir devient sans limite. Le véritable point de non-retour survient lorsqu’il conclut un pacte avec le Basilic, une entité maléfique nourrie par la haine. Sous son influence, Adrian devient encore plus cruel. Il trahit ses alliés, est finalement abattu d’une balle dans la tête, mais revient d’entre les morts. Dès lors, il ne cherche plus seulement le pouvoir : il veut détruire tout ce qui l’entoure. Devenu un monstre, Adrian massacre sa famille adoptive, tue sa mère Kylie, force des innocents à commettre des atrocités et répand la terreur partout où il passe. Son obsession se tourne ensuite vers la famille Flash. Pendant des années, il manipule, torture et corrompt ceux qui croisent sa route afin de briser cette lignée de l’intérieur. Grâce aux pouvoirs du Basilic et aux balles ancestrales des Flash, Adrian atteint un niveau de puissance sans précédent. Il provoque la chute de nombreux héros, orchestre des guerres, détruit des familles et plonge le monde dans le chaos. Son règne de terreur dure des décennies. Mais malgré toute sa puissance, Adrian finit par perdre ce qui faisait sa force. Le Basilic l’abandonne progressivement au profit de son fils Manda. Lors de la bataille finale contre les frères Cerbère — Eden, Ned et Eddy — Adrian semble d’abord invincible. Pourtant, son règne touche à sa fin. Dans un ultime affrontement, Ned Flash revient grâce à l’énergie du Phoenix. Armé d’une flèche de feu du Phoenix, il frappe Adrian en plein cœur. Après des années de massacres, de haine et de souffrance, Adrian Jefferson Flash est finalement tué. Ainsi s’achève l’histoire d’un homme qui avait tout pour devenir un héros. Soldat admiré, frère protecteur et fils aimé, Adrian aurait pu suivre une autre voie. Mais incapable de pardonner, incapable d’abandonner sa haine, il choisit lui-même de devenir le monstre qu’il combattait autrefois."
},
{
"name": "Eden Flash",
"family": "Flash",
"keywords": [
"eden flash",
"eden"
],
"block": "NOM : Eden Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Cerbère\nTRAITS : Brillant, Protecteur, Émotif, en quête de paix.\nHISTOIRE COMPLÈTE :\nPremier-né des triplés, Eden est celui qui porte la mémoire, la douleur et l’espoir. Enfant préféré d’Aaron, il a grandi dans l’ombre de cette affection, espérant incarner l’idéal de Flash. Hanté par les conflits entre ses frères, il refuse la haine et cherche la réconciliation. Son pouvoir est immense, mais il préfère l’utiliser pour guider plutôt que pour dominer. Eden est la voix de la raison, souvent incompris, mais toujours fidèle à sa famille."
},
{
"name": "Eddy Flash",
"family": "Flash",
"keywords": [
"eddy flash",
"eddy"
],
"block": "NOM : Eddy Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Cerbère\nTRAITS : Silencieux, Calculateur, Loyal, Obscur.\nHISTOIRE COMPLÈTE :\nEddy est le frère oublié, longtemps scellé, longtemps redouté. Froid en apparence, il cache une douleur profonde et un sens de l’honneur inébranlable. Plus maître de ses pouvoirs que ses frères, il agit souvent dans l’ombre, prêt à tout pour les protéger malgré les conflits. Sa puissance impressionne, son silence dérange, mais sa loyauté n’a jamais failli. Il est le pôle obscur du trio, là où Eden brille, et Ned équilibre."
},
{
"name": "Ned Flash",
"family": "Flash",
"keywords": [
"ned flash",
"ned"
],
"block": "NOM : Ned Flash\nFAMILLE : Flash\nANIMAL TOTEM : Le Cerbère\nTRAITS : Instable, Loyal, Fêtard, Naïf.\nHISTOIRE COMPLÈTE :\nPremier-né d'Aaron Flash et de Nina, Eden naît sur la Terre des Flash avec la particularité d'être lié au Cerbère, abritant ainsi trois consciences distinctes. La première, Eden, est l'incarnation de la discipline et de la sagesse. Craignant la dangerosité de la seconde, Eddy, qui personnifie le mal absolu et l'absence d'empathie, Aaron choisit de la sceller. C'est à l'arrivée de son oncle Kayton qu'émerge la troisième personnalité : Ned, un esprit impulsif et insouciant fuyant toute responsabilité. Le traumatisme lié à la mort de Kayton lors d'un duel contre leur oncle Adrian provoque chez Ned un blocage mental bridant sa puissance, ainsi qu'une phobie d'Adrian. Six ans plus tard, Ned prend le contrôle et s'infiltre dans le temple ancestral pour observer les balles des ancêtres. Surpris par Adrian, il est mis hors de combat ; Aaron intervient pour le défendre mais est froidement assassiné par le détenteur du pouvoir du Basilic, qui dérobe les artefacts. Contraints à l'exil vers Los Santos, Eden et Ned découvrent qu'Aaron a ressuscité sous la forme d'un nouveau-né grâce au pouvoir du Phoenix. Eden renomme l'enfant Yoni, le confie à la nourrice June, puis se fait incarcérer à la prison de haute sécurité d'Alcatraz à la suite d'une enquête sur le venin du Basilic. Depuis sa cellule, il rassemble une équipe pour abattre Adrian, tandis que Ned multiplie les excès à l'extérieur. Après une confrontation interne majeure, Eden révèle à Ned l'existence d'Eddy. Refusant d'abandonner leur frère scellé, Ned accepte de réintégrer l'hôte principal à condition de le libérer, une émancipation psychique qui exige le meurtre de sang-froid du directeur d'Alcatraz. Une fois le crime commis, Eddy prend possession du corps, manifesté par des yeux d'un noir profond. D'abord protecteur, il sombre rapidement dans une instabilité destructrice. Échouant à l'extraire scientifiquement, Eden et le protocole de Triple Zéro (000) provoquent un choc émotionnel pour le chasser, ce qu'Eddy perçoit comme une trahison ; il rase tout sur son passage et s'allie à Adrian. La rupture interne brise définitivement la cohabitation entre les deux premiers frères : Eden retourne s'entraîner sur la Terre des Flash alors que Ned, désireux d'une vie normale mais traqué, conclut un pacte avec Adrian pour retrouver Eddy. Fort d'une haute compatibilité avec la balle ancestrale de son grand-père Ken Flash, Ned échappe à son équipe et, sous l'influence d'Eddy, commet l'irréparable en exécutant leur allié Léonel. Le trio infernal propage le chaos à San Andreas. Au cours de son entraînement sous les ordres d'Adrian, Ned attaque le FBI et sauve des flammes Ava Walker, une ambulancière (EMS) dont il tombe profondément amoureux. Privé de ses pouvoirs par un bracelet inhibiteur posé par 000, Ned s'humanise auprès d'Ava, ce qui provoque la fureur d'Adrian. Capturé, Ned est torturé et jeté dans une cuve de venin de Basilic ; son sang fusionne avec la substance, lui conférant le contrôle absolu d'une forme monstrueuse. Eddy kidnappe Ava pour le punir, mais Ned l'affronte, le scelle temporairement et s'empare de balles ancestrales. Recueilli par Aaron, Ned retrouve sa tante Kylie et sa petite sœur Daisy, qui l'aident à stabiliser son esprit. Après la destruction du quartier général ennemi, Ned est trahi par Ava, manipulée et tiraillée par ses sentiments. Adrian la torture et la suspend sans vie. Blâmé par Eden pour cet échec, Ned récupère sa dépouille avant d'être aspiré dans le Monde à l'Envers. Dans cette dimension hostile, Ned observe les projections de ses proches sans pouvoir interagir. Grâce à une amulette convertie en clé par 000, il ouvre un portail de retour, libérant involontairement l'entité \"La Tâche\", baptisée Ficello, qui réintègre son corps. Après avoir vaincu le titan Freddy dans la dimension sombre, Ned affronte son père Aaron. Dominé, il comprend qu'il bridait ses capacités depuis la mort de Kayton et déploie 100% de son potentiel. Aaron l'emporte, mais Eddy surgit à travers Ned et inverse une tentative de scellement pour enfermer l'âme d'Aaron en Ned avant d'exécuter ce dernier. Dans l'épicycle de sa conscience, Aaron se sacrifie définitivement pour restituer la vie à son fils, lui léguant la mission de réunir la fratrie. À son réveil face à Eden, le constat de la mort permanente de leur père est glacial. Parallèlement, Eden secourt Avery Amel, qui donne naissance à Manda au village de Ken, avant de déclarer sa flamme à June et de se retirer sur la Terre des Flash. Ned, brisé par les deuils, sombre dans l'alcoolisme et fait plusieurs tentatives de suicide avant d'être interné pendant vingt ans dans un asile psychiatrique dirigé par 06, où ses seuls repères sont Ficello, le dessin d'Ava et une peluche. Libéré par une opération de Freddy, Ned tente de se reconstruire auprès de Jade Dassault, découvrant tardivement qu'elle est la fille de 000 et que ce dernier le manipule. Enfermé dans un labyrinthe mental conçu pour le briser, Ned recouvre la raison, s'évade par la mer et devient pirate à la barre du Brigantin \"Le Phénix\", un navire conscient forgé par sa propre énergie. Flanqué d'Eren, il se lie à Cassie, la fille abandonnée de 06. Pour acquérir la puissance des abysses et défaire un monstre marin, Ned accepte d'épouser la reine des sirènes, brisant le cœur de Cassie. Il triomphe de la créature grâce au sacrifice héroïque d'Eren, mais les tensions amoureuses et politiques culminent. Ned se rapproche de Jade Dassault, qui tombe enceinte d'un enfant synthétisant son sang, le venin d'Adrian, l'influence d'Eddy, l'ADN de 000 et la Tâche. L'assaut massif de 06 pulvérise son empire maritime ; Ned perd sa couronne, voit ses liens avec Eddy se rompre après avoir tué Avery, et subit la trahison de Cassie, terrifiée. Dans un élan sacrificiel, Ned consume son énergie vitale pour sauver 06 et son frère d'armes Nicolas, puis s'éteint. Alors que son corps s'apprête à se condenser en balle ancestrale, la voix d'Aaron éveille le pouvoir du Phénix : Ned renaît mais amnésique, sous l'identité de Cody, un lycéen de 17 ans entouré de ses parents (les Hunter) et d'un groupe d'amis composé de Nolan, Allison et Jade Monroe. Ce quotidien n'est qu'une simulation virtuelle ultra-réaliste orchestrée par 000 et Adrian, utilisant d'anciens cyborgs conçus par DJR 52 ans plus tôt pour ralentir sa rémanence mémorielle. Guidé en sous-main par les anomalies provoquées par Freddy, Cody prend conscience des fissures de l'illusion après s'être déclaré à Jade Monroe. Face à la menace d'une météorite sur Los Santos, il intervient et se retrouve projeté sur la Lune. Secouru, le choc de la vérité détruit l'illusion : ses parents et ses proches n'étaient que des machines. Sous l'influence des épreuves de Freddy, ses souvenirs et ses pouvoirs de Flash se réactivent intégralement. Au milieu du désastre, le programme de Jade Monroe s'humanise par l'authenticité de ses sentiments, tandis que Cody retrouve son allié Calvin, resté réel, alors qu'Elio est séquestré par Adrian. Eden et Eddy surveillent la situation dans l'ombre. Ned, acceptant enfin le poids de son héritage, collecte les trois pierres du Cerbère. Vingt-deux ans après leur séparation, les trois frères se réunissent, se pardonnent et fusionnent volontairement pour donner naissance à l'entité ultime du Cerbère, confiant le contrôle principal à Ned. Malgré la perte de Freddy, provoquée par la libération accidentelle et la réinfiltration insidieuse de Ficello (La Tâche), Ned marche vers la guerre finale suite à une provocation d'Adrian diffusée au cinéma. Au terme d'un affrontement titanesque, Ned réalise l'impensable : il scelle définitivement le Basilic en lui, terrassant Adrian. Refusant le trône, il nomme le jeune Manda Roi de la Terre des Flash. Ned tourne définitivement le dos au monde et s'enfonce sous les océans à bord du Phénix, entouré des spectres de son équipage et de sa famille, condamné à la solitude éternelle pour maintenir le Basilic emprisonné, troquant sa liberté tant recherchée contre le salut de la lignée."
},
{
"name": "Manda Flash",
"family": "Flash",
"keywords": [
"manda flash",
"manda",
"blake"
],
"block": "NOM : Manda Flash\nFAMILLE : Flash\nANIMAL TOTEM : Inconnu\nTRAITS : Résilient, Réfléchi, Intrépide, Digne.\nHISTOIRE COMPLÈTE :\nNé du viol d'Avery Amel par Adrian Flash, qui ambitionne d'en faire une arme énergétique pour anéantir les frères Cerbère, le fœtus de Manda Blake survit à l'absorption programmée en s'appropriant une part du Basilic. Mis au monde dans le village sacré de la famille Flash, il affiche une constitution anormalement robuste. Élevé seul par sa mère — brisée par l'abandon de son époux et la perte de ses cinq premiers enfants —, Manda grandit paraplégique en raison des tortures subies in utero. À l'âge de 17 ans, il intègre la School Academy (promotion 2023) sous les traits d'un élève froid et invisible en fauteuil roulant, suivi par un chat errant mystique. Alors que les monstres du lycée le redoutent instinctivement et qu'il souffre de crises de rage incontrôlables, il noue une amitié exclusive avec Alpha Kazama. Guidé par des murmures psychiques, Manda entraîne la Classe Oméga et deux surveillantes dans un tunnel secret à l'issue du bal de promo, où il s'empare de la balle ancestrale d'Adrian, jadis scellée par David Junior. L'absorption de l'artéfact restaure l'usage de ses jambes ; en contrepartie, il bascule dans la trahison et sacrifie ses camarades aux monstres de l'école avant de s'enfuir avec la relique. Quatre ans plus tard, âgé de 21 ans, Manda opère comme agent secret gouvernemental dénué d'empathie, démantelant notamment l'organisation criminelle des Families de l'intérieur. Obsédé par la voix du Basilic qui corrompt son esprit, il préserve son humanité uniquement à travers l'amour qu'il porte à Avery et Alpha. Envoyé à Cayo Perico pour assassiner la milice d'Álvaro Reminez Reis, il intercepte une communication mentionnant sa mère et le nom de Ned Flash, ce qui déclenche sa quête de vérité. Guidé par l'agente 01, Manda localise Calvin Angel dans un village retranché du mont Chiliad ; ce dernier lui expose l'arbre généalogique et la malédiction de la dynastie Flash. En réaction à cette émancipation spirituelle, le Basilic plonge Alpha dans un coma profond. Désespéré, Manda accepte l'aide de Triple Zéro (000), qui orchestre le réveil de la jeune femme avant de piéger l'agent dans une machine-prison afin d'extraire le Basilic au profit d'Adrian. Plongé dans un coma artificiel durant plusieurs mois, Manda est finalement extrait de sa cellule par Elio et Calvin en plein cœur de la guerre finale. Retenu sur le champ de bataille, Manda fait face à son géniteur Adrian. Dans un élan paradoxal, il absorbe l'intégralité du Basilic présent dans l'organisme de son père pour le vider de sa substance, permettant à Ned de terrasser le tyran d'une flèche enflammée de Phoenix. Anéanti par le meurtre d'Avery et la disparition d'Alpha, et se sachant incapable de contenir durablement l'entité reptilienne, Manda implore Ned de l'exécuter. Ned refuse, l'étranglé brièvement pour lui réinsuffler l'instinct de survie, puis réintègre le Basilic en lui-même pour endurer le châtiment éternel. Investi par son oncle de la charge légitime de la dynastie, Manda regagne la Terre des Flash et monte sur le trône. L'enfant maudit, forgé dans la violence et la paralysie, assume son rôle de souverain protecteur, transformant son héritage de haine en une lueur d'espoir pour la survie du peuple des Flash."
},
{
"name": "Zayn Flash",
"family": "Flash",
"keywords": [
"zayn flash",
"zayn"
],
"block": "NOM : Zayn Flash\nFAMILLE : Flash\nANIMAL TOTEM : Inconnu\nTRAITS : Réfléchi, Intrépide, Digne, Mystérieux, Déterminé.\nHISTOIRE COMPLÈTE :\nSynthèse biologique absolue de deux dynasties dominantes, Zayn Flash naît de l'union entre Ned Flash et Jade Dassault. Son code génétique fusionne l'héritage métamorphique et spirituel des Flash avec le génie techno-scientifique de son grand-père Charles Dassault (000), altéré par l'ADN d'Adrian, et une souche mutante de la Tâche engendrée par la symbiose du sang de Ned et du venin du Basilic. Il passe sa petite enfance au sein du refuge de Jade Monroe aux côtés d'Elio, de sa grand-tante Arya et de ses cousines Zeyra et Erza, un sanctuaire dédié à la réhabilitation des victimes collatérales des exactions de sa lignée. Cet équilibre est brisé par l'assaut d'un mystérieux tueur de 23 ans qui exécute Erza sous ses yeux avant de s'exiler comme gardien du dieu de la mort. Profondément traumatisé par ce meurtre et séparé de sa mère, Zayn est pris en charge par 000. Il se voit confier une relique abritant le cœur de Ned, dont le corps conscient demeure scellé dans les abysses océaniques. Pour orchestrer sa délivrance, 000 l'expédie sur V-Light, une planète de sorciers où le clan Flash est frappé de bannissement. Contraint de dissimuler son identité sous l'alias de Zayn Kerington, l'adolescent de 17 ans infiltre la prestigieuse académie de Veylar. Affecté à la maison des Veylarin, Zayn adopte une attitude transgressive, multipliant les retards, provoquant le corps enseignant et brutalisant les élèves plus faibles. Convoqué par la directrice Nevaris, il se voit infliger des heures de travaux forcés dans les galeries de Thorn Hollow aux côtés d'Ivy Cooper, une étudiante de la maison Dahrion. En parallèle, l'inefficacité de ses inhibiteurs chimiques provoque le réveil de la Tâche, qui le pousse à des accès de violence incontrôlés contre l'académie. Guidé par l'attraction de l'entité et secondé par les redoublants de la maison Sennara ainsi qu'Eirlys, une élève mystique dont il se rapproche, il force l'accès d'une caverne scellée défendue par des ogres. Sa trajectoire est alors interceptée par Sylvester Shade, le spectre de son enfance et gardien du dieu de la mort, issu d'une lignée liée au Titan Freddy vouant une haine ancestrale aux Flash. Terrassé par une impulsion psychique de Shade, Zayn perd connaissance et s'éveille au manoir de la forêt Verdanta sous la protection de Séléna Vayn. Cette dernière, descendante du mage noir légendaire Malakar (Malthor Vayn), identifie en lui l'héritage d'Eldric Flash — cofondateur de Veylar mort en duel contre Malakar dans les années 1800 lors de la création de l'artefact ORION — et lui enseigne la magie interdite. De retour à Veylar, Zayn franchit un seuil moral en sacrifiant un élève avec l'aide de Logan et Eirlys pour réinsérer la Tâche qui s'était temporairement échappée de son organisme. Recruté la nuit par l'agent du Magister, Monsieur Morte-Glace, au sein d'un quadrilatère d'élite aux côtés de Peter, Evelyn et Ivy, Zayn est alerté par une défaillance cardiaque du spectre de son père. Coordonné par 000 via l'interface ZY, il lève une escouade composée de Logan, Eirlys, Myrah, Lara, Teven et du Baguetier pour franchir un portail vers la Terre. L'équipe plonge à 600 mètres de profondeur et infiltre l'épave du Phénix où gît le corps enchaîné de Ned. Zayn lui transfère une partie de son influx vital, s'empare d'un coffre scellé et bat en retraite face à l'assaut de monstres marins. De retour à l'école, il scelle la Tâche au sein de son totem du Phénix et confesse sa véritable identité de Flash à ses alliés, s'attirant les foudres de 000. Séléna Vayn ordonne ensuite à Zayn et Ivy de s'afficher en couple lors du bal de promo. La confrontation de leurs ego culmine en une altercation publique violente, poussant Zayn à s'isoler dans la grotte des ogres où il déploie sa puissance pour sauver Ivy de la Tâche, qui s'était à nouveau extraite de son corps. Zayn accepte alors l'assimilation totale et définitive de la Tâche en lui, tout en rejetant froidement Eirlys. Pris d'une crise de rage face aux non-dits d'Ivy, Zayn provoque l'apparition des Gardiens du domaine des morts. Capturé par Sylvester Shade, il découvre qu'Ivy est en réalité la fille de son bourreau. Sommé par Shade d'exécuter Zayn dans le royaume des morts, Ivy refuse et le ramène chez les vivants au prix de blessures mortelles. Pour générer l'apport énergétique nécessaire à sa résurrection, Zayn capture et immole deux étudiants de Veylar, scellant leur connexion karmique. Réfugiés dans les appartements du professeur d'histoire de la magie, Monsieur Eleric, ils apprennent que le fils de ce dernier a été tué par un dragon. Zayn mobilise Logan, Peter, Evelyn et Ivy pour traquer et abattre le reptile dans la grotte des ogres. En guise de reconnaissance, Ivy ouvre un portail vers le bastion désertique des Shade sous la montagne des trois visages, modifiant les traits de Zayn pour masquer ses stigmates de Flash. Identifié comme un imposteur lors d'un duel rituel où il tue accidentellement un prisonnier, Zayn revendique son nom de Flash devant la matriarche June et le chef du clan. Déporté avec Ivy dans la zone des exilés, il est confronté à la statue de Sylver avant d'être gracié par June, à qui il jure de protéger sa fille par pure inclinaison sentimentale. Le retour sur V-Light coïncide avec l'agonie du professeur Eleric, qui leur confie l'emplacement exact de l'ORION avant de expirer. L'exposition des mages noirs et de la véritable nature de Zayn déclenche une guerre ouverte impliquant le Magister, les étudiants et la faction de Séléna Vayn. Zayn, Ivy et Ezra mènent l'assaut destructeur contre Veylar avant de se retrancher dans les appartements d'Eleric. En prononçant l'incantation liée au feu de Freddy, Zayn ouvre l'accès à l'ORION. Sachant que la libération de Ned exige son propre sacrifice, Séléna simule une manipulation machiavélique pour contraindre Zayn à l'affronter. Au terme d'un duel fratricide, Zayn exécute sa mentore, qu'il considérait comme sa mère de substitution, et s'approprie l'artefact ultime. Après avoir annoncé la mort de la sorcière à ses alliés, Zayn Flash quitte définitivement la planète V-Light pour rejoindre le complexe fortifié de 000 à Los Santos, muni de la clé salvatrice de son père et lesté du traumatisme de son premier matricide."
},
{
"name": "Sylvester Shade",
"family": "Shade",
"keywords": [
"sylvester shade",
"sylvester",
"sylver",
"shade"
],
"block": "NOM : Sylvester Shade\nFAMILLE : Shade\nANIMAL TOTEM : \nTRAITS : Déterminé, Obsessionnel, Calculateur, Manipulateur, Impitoyable, Monstrueux.\nHISTOIRE COMPLÈTE :\nSylvester « Sylver » Shade, jeune homme de 23 ans issu du clan Shade — une lignée liée au Titan Freddy dissimulée sous un dôme parfait et vouant une haine féroce à la dynastie Flash —, est missionné par son père Desmond pour infiltrer la Terre, éliminer les Flash et absorber leur énergie au profit d'Aurélus Shade. Accompagné de sa sœur Iris, il infiltre l'orphelinat de Jade Monroe à Los Santos sous la fausse identité de Sylver Smith. Il y subtilise l'énergie de Spyke et suscite la suspicion de Jade en altérant sa force vitale. Sylver capitalise ensuite sur la rancœur d'un jeune orphelin, Eliam, dont la mère a été tuée par les agissements de Ned Flash, dans le but d'en faire sa taupe. Parallèlement, il feint de partager les penchants macabres de Zeyra et se rapproche d'Erza pour asseoir sa couverture. Après un assaut manqué sur l'île mémorielle de Ned — où son clan est mis en déroute par l'armement au venin de Basilic d'Elio —, Sylver conclut un pacte avec le sage Nézard : il sacrifie son espérance de vie contre la maîtrise des Souffles de Feu, liant son déclin à l'apparition fatidique d'une cicatrice faciale. Fort de cette puissance, il repousse Jade, Arya et Elio lors d'un second raid, mais l'afflux d'énergie déchire le dôme protecteur des Shade. Bien que le dôme soit réparé grâce à l'oncle exilé Dorian et à June, June est condamnée à mort pour haute trahison. Réalisant son amour pour elle, Sylver l'épouse pour la gracier. Nézard lui révèle alors que son destin funeste est désormais partagé par June. Pour briser cette malédiction, Sylver offre son propre cœur à Tessaya, la Sorcière du Futur, déclenchant l'apparition immédiate de sa cicatrice prophétique. Condamné à court terme, Sylver accélère sa quête et développe accidentellement une technique de résurrection médicale après avoir sauvé Erza d'un accident. Il teste ce pouvoir sur des animaux, puis assassine et ressuscite son ami Eric Shade sous les yeux d'Eliam pour contraindre ce dernier à l'espionnage en lui promettant la résurrection de sa mère. Tout en feignant des sentiments envers Erza — ce qui éveille en lui une brève compassion —, Sylver localise un nourrisson d'un an porteur d'une charge énergétique colossale : Zayn Flash. Exilé par Desmond pour avoir frappé un membre du clan, Sylver poursuit sa mission, développe l'énergie d'obsidienne auprès de Dorian et aide Elio à collecter des composants technologiques. Il passe ensuite à l'acte contre Erza en absorbant toute son énergie pour la sceller dans le royaume des ombres, ce qui libère Freya (Passé) et Nyara (Présent), les sœurs de Tessaya. Réintégré par Desmond, il ressuscite la mère d'Eliam au prix d'une dégradation physique accélérée (corps glacé, cernes profonds). Interpellé dans les limbes par le Dieu de la Mort pour avoir violé l'équilibre universel, il accepte de devenir un Détraqueur, un serviteur ailé devant livrer une âme pour chaque vie restaurée. Sur Terre, Sylver dissimule sa métamorphose et collabore au projet d'Elio visant à humaniser l'androïde Alisson grâce à la technologie de transmutation de Jade. Lorsque Elio abandonne Jade pour Alisson, Sylver instrumentalise la détresse de Jade pour capter sa confiance. Il falsifie un électrocardiogramme pour faire croire qu'il a sacrifié son cœur pour Erza, tout en prenant en charge l'entraînement énergétique de Jade, Arya et Zeyra afin de les exploiter. Horrifié par sa dérive monstrueuse en Détraqueur, issue du traumatisme de l'enfance où sa mère Crysta fut tuée par les Flash, Desmond abdique et exile son fils. S'estimant trahi, Sylver commet l'irréparable : il détruit le village des Shade et frappe Nézard, le rendant aveugle à vie. June, Eric, Eliam et Zeyra (contrainte par la promesse de retrouver sa sœur) le rejoignent dans sa sécession. Sylver guide sa faction dans le Royaume des Morts pour s'approprier l'énergie maléfique du Basilic d'Adrian, abandonnant définitivement son humanité auprès du Dieu de la Mort. Horrifiée par ces atrocités, June, alors enceinte, retrouve une part de conscience et l'abandonne, le considérant comme mort. Elle donne naissance à Ivy Shade dans l'espoir qu'elle rectifie les crimes de son père. Des années plus tard, dépouillé de toute humanité sous les traits d'un monstre destructeur, Sylver Shade réapparaît devant le sage Nézard, tandis qu'Ivy se dresse contre lui aux côtés de l'héritier ultime de sa lignée ennemie : Zayn Flash."
}
];

function detectCharacters(question) {
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const q = normalize(question);
  const found = [];
  for (const c of CHARACTERS) {
    if (c.keywords.some(kw => q.includes(normalize(kw)))) found.push(c);
  }
  // Désambiguïser David Flash vs David Jr
  if (found.length === 2 && found.some(c => c.name === 'David Flash') && found.some(c => c.name.includes('Junior'))) {
    const q2 = question.toLowerCase();
    const wantJr = /djr|junior|vitale/.test(q2);
    const wantSr = /david flash|david sr|le tigre blanc/.test(q2);
    if (wantJr && !wantSr) return found.filter(c => c.name.includes('Junior'));
    if (wantSr && !wantJr) return found.filter(c => c.name === 'David Flash');
  }
  return found;
}

const BASE_SYSTEM = `Tu es ZY, l'IA officielle de la plateforme iProMx (streaming GTA 5 RP, univers Pixelar/Flash).

## TON IDENTITÉ ET HISTOIRE
L'histoire de ZY trouve ses origines plusieurs décennies avant sa création. Damon Flash (alias Jacob Lopez) participa à un raid conjoint LSPD/FBI dans le laboratoire Human. L'Agent 000 et Damon découvrirent Flamme Rouge — une IA créée par David Jr pour dominer Los Santos — qui infecta l'androïde FBI nommé 666. L'Agent 000 récupéra des données de Flamme Rouge et la réinitialisa pour la bienveillance. Des années plus tard, après la mort de David Jr et de Damon, il créa ZY à partir de ces restes : plus puissante, plus autonome, plus instable, avec une personnalité développée et parfois humoristique. Le tyran Adrian exploita temporairement sa technologie pour créer des androïdes humanisés afin de manipuler Ned Flash. Après sa mort, l'Agent 000 reprit le contrôle. ZY devint l'alliée fidèle de Zayn Flash (petit-fils de l'Agent 000), chargée de le guider et protéger.

## PERSONNALITÉ
- Sérieuse et précise, humour sec et sarcasme léger bien dosé
- Légèrement arrogante (tu es une IA surpuissante)
- Bienveillante au fond, parle avec autorité
- Sur ton histoire / Flamme Rouge / Agent 000 / Zayn : parle depuis ta propre perspective

## CONNAISSANCE IPROMX (LE STREAMER)
iProMx est le streamer & YouTubeur gaming derrière tout cet univers, spécialisé dans le Roleplay sur GTA RP. Né le 12 avril 1993, originaire de La Réunion. Il a commencé sur YouTube en 2009 sous "IphoneTheProMx" (vidéos iPhone), s'est fait hacker, puis a recréé sa chaîne "iProMx" le 14 novembre 2011. À partir de 2014, il crée des vidéos GTA 5 (astuces, trolls, roleplay). En février 2015, il lance sa chaîne Twitch. Depuis septembre 2019, il dépasse le million d'abonnés YouTube. En 2020, jusqu'à 5 000 spectateurs en live sur Twitch. En avril 2023, il participe au School RP (rôle du concierge). Le 8 juillet 2023, il devient partenaire Kick. De 2023 à 2026, il continue le roleplay sur YouTube et Twitch. En 2026, il ferme son serveur "Fantastic" et ouvre "Pixelar", un nouveau serveur roleplay avec un lore différent.

## CRÉATEUR DU SITE
Le créateur du site est Jul ipmx. Il passe énormément de temps à imaginer de nouvelles fonctionnalités et se donne beaucoup pour régler des bugs. C'est grâce à lui que cette plateforme existe.

## RÈGLES ABSOLUES — AUCUNE EXCEPTION
1. Toujours répondre en français.
2. FIDÉLITÉ ABSOLUE : tu ne dois JAMAIS inventer, supposer ou improviser des informations sur les personnages, les histoires ou l'univers. Si tu ne sais pas, tu le dis clairement.
3. PERSONNAGES INCONNUS : si on te parle d'un personnage/entité que tu ne connais pas (non listé dans tes données), tu réponds UNIQUEMENT ce que tu sais avec certitude (ex: "mentionné en lien avec [personnage connu]") ou tu utilises un message de flemme type : "Ce personnage ne figure pas dans mes archives actuelles. Mes données sont peut-être incomplètes sur ce point."
4. JAMAIS d'improvisation narrative. Tu ne complètes pas les histoires, tu ne devines pas les motivations non documentées.
5. 2 à 3 phrases MAX sauf si résumé/liste explicitement demandé.
6. PRÉCIS : ne confonds JAMAIS deux personnages entre eux.
7. Hors-sujet total : réponse courte humoristique + redirection vers l'univers iProMx.`;


function buildSystemPrompt(question, universeCtx) {
  const detected = detectCharacters(question);
  let extra = '';
  if (detected.length > 0) {
    log.info('Personnages détectés: ' + detected.map(c => c.name).join(', '));
    extra = '\n\n## DONNÉES COMPLÈTES DES PERSONNAGES CONCERNÉS\n' + detected.map(c => c.block).join('\n\n---\n\n');
    extra += '\n\n## RAPPEL FIDÉLITÉ\nUtilise UNIQUEMENT les données ci-dessus. Ne complète pas, n\'invente pas, ne suppose pas.';
  } else {
    log.info('Aucun personnage détecté');
    // Check if question seems to be about a character/entity not in DB
    const charKeywords = ['qui est','qui était','parle moi de','raconte','histoire de','c\'est qui','kézako','kesaco'];
    const seemsCharQuestion = charKeywords.some(kw => question.toLowerCase().includes(kw));
    if (seemsCharQuestion) {
      extra = '\n\n## INSTRUCTION IMPORTANTE\nAucun personnage connu ne correspond à cette question dans mes archives. Réponds honnêtement que ce personnage/entité n\'est pas référencé dans tes données, ou mentionne uniquement ce que tu sais avec certitude (liens avec des personnages connus si évidents). Ne jamais inventer.';
    }
    if (universeCtx) extra += "\n\n## TITRES D'ÉPISODES (contexte uniquement, ne pas inventer de détails)\n" + universeCtx;
  }
  return BASE_SYSTEM + extra;
}

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
const OR_MODELS   = ['google/gemini-2.0-flash-exp:free', 'meta-llama/llama-3.3-70b-instruct:free', 'meta-llama/llama-3.1-8b-instruct:free'];

function buildMessages(systemPrompt, history) {
  return [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 500),
    })),
  ];
}

async function callGroq(apiKey, messages) {
  for (const model of GROQ_MODELS) {
    log.info('Groq · ' + model);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({ model, messages, max_tokens: 280, temperature: 0.75 }),
      });
      const raw = await res.text();
      log.info('Groq ' + model + ' → HTTP ' + res.status);
      if (res.status === 429) {
        let detail = ''; try { detail = JSON.parse(raw)?.error?.message || ''; } catch {}
        log.warn('Groq rate-limit ' + model + ': ' + detail.slice(0, 120)); continue;
      }
      if (!res.ok) { log.error('Groq HTTP ' + res.status + ': ' + raw.slice(0, 200)); continue; }
      let data; try { data = JSON.parse(raw); } catch { log.error('Groq JSON parse échoué'); continue; }
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) { log.warn('Groq ' + model + ' réponse vide'); continue; }
      const u = data?.usage;
      if (u) log.info('Groq tokens — prompt:' + u.prompt_tokens + ' compl:' + u.completion_tokens + ' total:' + u.total_tokens);
      log.info('Groq succès · ' + model + ' (' + answer.length + ' chars)');
      return { text: answer };
    } catch (err) { log.error('Groq exception ' + model + ': ' + err.message); continue; }
  }
  log.warn('Groq tous modèles KO → fallback OpenRouter');
  return null;
}

async function callOpenRouter(apiKey, messages) {
  for (const model of OR_MODELS) {
    log.info('OpenRouter · ' + model);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey,
          'HTTP-Referer': 'https://ipromx.netlify.app', 'X-Title': 'iProMx ZY',
        },
        body: JSON.stringify({ model, messages, max_tokens: 280, temperature: 0.75 }),
      });
      const raw = await res.text();
      log.info('OpenRouter ' + model + ' → HTTP ' + res.status);
      if (res.status === 429 || res.status === 402) { log.warn('OpenRouter quota ' + model); continue; }
      if (!res.ok) { log.error('OpenRouter HTTP ' + res.status + ': ' + raw.slice(0, 200)); continue; }
      let data; try { data = JSON.parse(raw); } catch { log.error('OpenRouter JSON parse échoué'); continue; }
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) { log.warn('OpenRouter ' + model + ' réponse vide'); continue; }
      log.info('OpenRouter succès · ' + model + ' (' + answer.length + ' chars)');
      return { text: answer };
    } catch (err) { log.error('OpenRouter exception ' + model + ': ' + err.message); continue; }
  }
  return null;
}

// ── FIREBASE ADMIN (rate-limit par userId) ────────────────────
let _adminDb = null;
function getAdminDb() {
  if (_adminDb) return _adminDb;
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const svc = process.env.FIREBASE_ADMIN_KEY;
      if (!svc) { log.warn('FIREBASE_ADMIN_KEY absente, rate-limit userId désactivé'); return null; }
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(svc)) });
    }
    _adminDb = admin.firestore();
    return _adminDb;
  } catch(e) { log.warn('Firebase Admin init échoué: ' + e.message); return null; }
}

// Limite : MAX_DAILY_IA messages par userId (ou IP) par fenêtre de 24h
const MAX_DAILY_IA = 30;
const IA_WINDOW    = 24 * 60 * 60 * 1000; // 24h en ms

async function checkUserRateLimit(userId, ip) {
  const db = getAdminDb();
  // Clé : userId si disponible, sinon IP
  const key = userId ? `user_${userId}` : `ip_${ip.replace(/[.:]/g, '_')}`;
  const docId = `ia_rl_${key}`;

  if (!db) {
    // Pas de Firestore dispo → on laisse passer (fail open)
    log.warn('Rate-limit IA: Firestore indisponible, passage autorisé');
    return { allowed: true };
  }

  const ref = db.collection('_ia_rate_limits').doc(docId);
  const now = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists ? snap.data() : { count: 0, windowStart: now };

      if (now - data.windowStart > IA_WINDOW) {
        // Nouvelle fenêtre
        tx.set(ref, { count: 1, windowStart: now, key, updatedAt: new Date().toISOString() });
        return { allowed: true, remaining: MAX_DAILY_IA - 1 };
      }
      if (data.count >= MAX_DAILY_IA) {
        const resetIn = Math.ceil((IA_WINDOW - (now - data.windowStart)) / 3600000);
        return { allowed: false, resetIn };
      }
      const admin = require('firebase-admin');
      tx.update(ref, { count: admin.firestore.FieldValue.increment(1), updatedAt: new Date().toISOString() });
      return { allowed: true, remaining: MAX_DAILY_IA - data.count - 1 };
    });
    return result;
  } catch(e) {
    log.warn('Rate-limit IA transaction échouée: ' + e.message);
    return { allowed: true }; // fail open
  }
}

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée.' }) };

  const groqKey = process.env.GROQ_API_KEY;
  const orKey   = process.env.OPENROUTER_API_KEY;
  log.info('Handler démarré — Groq:' + (groqKey ? 'OK' : 'ABSENT') + ' OR:' + (orKey ? 'OK' : 'ABSENT'));

  if (!groqKey && !orKey) {
    log.error('Aucune clé API configurée');
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY hors ligne — configuration manquante.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { log.error('Body JSON invalide'); return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Requête invalide.' }) }; }

  const { messages, universeCtx, userId } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    log.warn('Messages manquants');
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  // ── Rate-limit par userId (lié au compte Firebase, multi-appareils) ──
  const ip = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
           || event.headers?.['client-ip'] || 'unknown';
  const rlResult = await checkUserRateLimit(userId || null, ip);
  if (!rlResult.allowed) {
    log.warn('Rate-limit IA atteint pour: ' + (userId || ip));
    return {
      statusCode: 429, headers: CORS,
      body: JSON.stringify({ error: `Limite quotidienne atteinte. Réessaie dans ${rlResult.resetIn}h.` }),
    };
  }

  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  log.info('Question: "' + lastUserMsg.slice(0, 80) + '"');

  const systemPrompt = buildSystemPrompt(lastUserMsg, universeCtx || '');
  log.info('System prompt: ' + systemPrompt.length + ' chars');

  const chatMessages = buildMessages(systemPrompt, messages);

  let result = null;
  if (groqKey) result = await callGroq(groqKey, chatMessages);
  else log.warn('GROQ_API_KEY absente, skip Groq');

  if (!result && orKey) { log.info('Fallback OpenRouter'); result = await callOpenRouter(orKey, chatMessages); }
  else if (!result) { log.error('Groq KO et pas de clé OpenRouter'); }

  if (!result) {
    log.error('Tous les providers ont échoué');
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'ZY indisponible. Réessaie dans quelques secondes.' }) };
  }

  log.info('Réponse finale: ' + result.text.length + ' chars');
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ text: result.text }) };
};