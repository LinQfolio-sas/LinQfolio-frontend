export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "check"; items: string[] };

export type PolicySection = {
  id: string;
  number: number;
  title: string;
  blocks: PolicyBlock[];
};

export const CONFIDENTIALITE_EFFECTIVE_DATE_FR = "10 mai 2026";
export const CONFIDENTIALITE_EFFECTIVE_DATE_EN = "May 10, 2026";

export const CONFIDENTIALITE_SECTIONS_FR: PolicySection[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction et responsable du traitement",
    blocks: [
      {
        type: "p",
        text: "La présente Politique de Confidentialité (ci-après la « Politique ») explique comment LINQFOLIO SAS (ci-après « nous », « LINQFOLIO ») collecte, utilise, traite et protège vos données personnelles lorsque vous utilisez notre plateforme LinQfolio (ci-après la « Plateforme »).",
      },
      { type: "h3", text: "Responsable du traitement des données" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS",
          "Société par Actions Simplifiée au capital de 3 000€",
          "Constituée le 6 janvier 2026 par acte sous seing privé",
          "Siège social : 142 rue de Rivoli, 75001 Paris, France",
          "RCS Paris : 102 625 183",
          "SIRET : 10262518300011",
          "TVA intracommunautaire : FR83102625183",
          "Email : dpo@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "Nous nous engageons à respecter la vie privée et à protéger vos données conformément au Règlement (UE) 2016/679 du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (RGPD) et à la loi n° 78-17 du 6 janvier 1978 dite « Informatique et Libertés ».",
      },
    ],
  },
  {
    id: "donnees-collectees",
    number: 2,
    title: "Données personnelles collectées",
    blocks: [
      { type: "p", text: "Nous collectons les catégories de données suivantes :" },
      { type: "h3", text: "2.1 Données obligatoires à l'inscription" },
      {
        type: "list",
        items: [
          "Adresse email",
          "Nom d'utilisateur/identifiant",
          "Mot de passe (stocké de manière sécurisée)",
          "Prénom et nom (optionnels)",
          "Date de création du compte",
        ],
      },
      { type: "h3", text: "2.2 Données liées au contenu" },
      {
        type: "list",
        items: [
          "Avis, critiques et notes de livres publiés",
          "Listes de livres créées",
          "Commentaires sur les publications d'autres utilisateurs",
          "Photos de livres ou d'espaces de lecture",
          "Historique de vos lectures et interactions",
        ],
      },
      { type: "h3", text: "2.3 Données techniques" },
      {
        type: "list",
        items: [
          "Adresse IP",
          "Type de navigateur et système d'exploitation",
          "Pages visitées et durée de visite",
          "Données de session et cookies",
          "Informations de localisation approximatives (non précises)",
        ],
      },
      { type: "h3", text: "2.4 Données de communication" },
      {
        type: "list",
        items: [
          "Messages d'erreurs et requêtes de support",
          "Correspondances avec notre équipe support",
          "Notifications et alertes",
        ],
      },
    ],
  },
  {
    id: "utilisation",
    number: 3,
    title: "Utilisation des données personnelles",
    blocks: [
      { type: "p", text: "Vos données sont utilisées pour les finalités suivantes :" },
      { type: "h3", text: "3.1 Fourniture du service" },
      {
        type: "list",
        items: [
          "Créer et gérer votre compte",
          "Vous permettre de publier et partager des contenus",
          "Afficher votre profil et vos interactions à d'autres utilisateurs",
          "Traiter vos demandes et réclamations",
        ],
      },
      { type: "h3", text: "3.2 Amélioration de la Plateforme" },
      {
        type: "list",
        items: [
          "Analyser l'utilisation de la Plateforme",
          "Développer et tester de nouvelles fonctionnalités",
          "Corriger les bugs et problèmes techniques",
          "Optimiser les performances",
        ],
      },
      {
        type: "p",
        text: "Base légale : L'amélioration de la Plateforme repose sur notre intérêt légitime (Art. 6.1.f RGPD) à fournir un service fiable et performant. Lorsque nous mettons en place des mesures d'audience nécessitant des traceurs non essentiels, nous appliquons les règles de consentement requises.",
      },
      { type: "h3", text: "3.3 Communications" },
      {
        type: "list",
        items: [
          "Envoyer des notifications relatives à votre compte",
          "Informer des mises à jour et modifications de la Plateforme",
          "Vous contacter pour des raisons de support",
          "Vous envoyer des informations légales ou réglementaires",
        ],
      },
      { type: "h3", text: "3.4 Sécurité et conformité légale" },
      {
        type: "list",
        items: [
          "Détecter et prévenir les abus, fraudes ou comportements illégaux",
          "Appliquer nos Conditions Générales d'Utilisation",
          "Respecter les obligations légales",
          "Protéger les droits et la sécurité de nos utilisateurs",
        ],
      },
      {
        type: "p",
        text: "Important : LINQFOLIO ne vend pas vos données personnelles et ne les cède pas à des tiers à des fins publicitaires ou commerciales. Des prestataires peuvent toutefois être amenés à traiter certaines données pour notre compte (hébergement, sécurité, support), dans le cadre de contrats encadrant la sous-traitance (voir section 5 et 7.4).",
      },
    ],
  },
  {
    id: "base-legale",
    number: 4,
    title: "Base légale du traitement",
    blocks: [
      { type: "p", text: "Le traitement de vos données personnelles repose sur les bases légales suivantes :" },
      {
        type: "p",
        text: "Méthode : chaque finalité est rattachée à une base juridique précise dans nos registres internes. Les paragraphes ci-dessous résument les situations les plus courantes ; lorsque plusieurs bases sont mentionnées, la base applicable dépend de la nature du traitement concerné (compte, sécurité, newsletter, traceurs optionnels, etc.).",
      },
      { type: "h3", text: "4.1 Consentement" },
      {
        type: "p",
        text: "Lorsque la loi l'exige (par exemple pour certaines communications électroniques ou pour les traceurs non strictement nécessaires), nous recueillons un consentement préalable, granulaire lorsque pertinent, et vous pouvez le retirer à tout moment sans affecter la licéité des traitements fondés sur d'autres bases avant retrait. Les réglages du compte et le bandeau cookies permettent d'exercer ces choix lorsqu'ils sont disponibles sur la Plateforme concernée.",
      },
      { type: "h3", text: "4.2 Exécution du contrat" },
      {
        type: "p",
        text: "Le traitement est nécessaire pour exécuter les Conditions Générales d'Utilisation et fournir les services.",
      },
      { type: "h3", text: "4.3 Obligations légales" },
      {
        type: "p",
        text: "Nous devons traiter certaines données pour respecter nos obligations légales et réglementaires.",
      },
      { type: "h3", text: "4.4 Intérêts légitimes" },
      {
        type: "p",
        text: "Nous traitons certaines données dans nos intérêts légitimes, notamment la sécurité de la Plateforme et la prévention des abus.",
      },
      { type: "h3", text: "4.5 Notification de violation de données" },
      {
        type: "p",
        text: "Conformément aux articles 33 et 34 du RGPD, en cas de violation de données à caractère personnel susceptible d'engendrer un risque élevé pour vos droits et libertés, LINQFOLIO s'engage à vous en informer dans les meilleurs délais, et à notifier l'autorité de contrôle compétente (CNIL) dans un délai de 72 heures suivant la prise de connaissance de la violation.",
      },
    ],
  },
  {
    id: "partage",
    number: 5,
    title: "Partage des données",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO ne vend pas vos données personnelles et ne les cède pas à des tiers pour leur prospection commerciale ou publicitaire.",
      },
      { type: "h3", text: "5.1 Accès par des prestataires et partages encadrés" },
      {
        type: "p",
        text: "Des données peuvent être communiquées à des prestataires agissant pour notre compte et sur nos instructions (sous-traitance au sens du RGPD), uniquement dans la mesure nécessaire à la finalité poursuivie :",
      },
      {
        type: "list",
        items: [
          "Prestataires techniques : hébergement, sécurité, maintenance, support client, sous contrats prévoyant confidentialité et obligations équivalentes à celles du RGPD",
          "Autorités légales : si légalement obligé par des autorités publiques (police, justice)",
          "Protection des droits : pour défendre nos droits légaux ou ceux de nos utilisateurs",
        ],
      },
      { type: "h3", text: "5.2 Données publiques" },
      {
        type: "p",
        text: "Votre profil, avis, critiques et listes sont publics par défaut et visibles aux autres utilisateurs. Vos données personnelles (email, mot de passe) ne sont jamais partagées publiquement.",
      },
    ],
  },
  {
    id: "conservation",
    number: 6,
    title: "Durée de conservation des données",
    blocks: [
      { type: "p", text: "Les données sont conservées selon les durées suivantes :" },
      { type: "h3", text: "6.1 Pendant l'utilisation active" },
      {
        type: "p",
        text: "Votre compte et vos données sont conservés tant que votre compte reste actif.",
      },
      { type: "h3", text: "6.2 Après suppression du compte" },
      {
        type: "list",
        items: [
          "Données du compte : supprimées sous 30 jours suivant la demande de suppression, puis conservées en archive intermédiaire pendant 3 ans pour le respect des obligations légales (prescription civile)",
          "Contenus publics : les avis/critiques peuvent être conservés de manière anonymisée à titre statistique et archive",
          "Données de log / journaux techniques : conservées 12 mois à compter de leur collecte, conformément aux obligations de conservation des données de connexion, puis supprimées",
          "Données de facturation (le cas échéant) : conservées 10 ans à compter de la clôture de l'exercice comptable, conformément aux obligations comptables et fiscales (Art. L. 123-22 du Code de commerce)",
        ],
      },
      { type: "h3", text: "6.3 Données inactives" },
      {
        type: "p",
        text: "Les comptes inactifs pendant plus de 24 mois peuvent être supprimés. Un avertissement sera envoyé par email avant suppression.",
      },
    ],
  },
  {
    id: "securite",
    number: 7,
    title: "Sécurité des données",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO met en œuvre des mesures de sécurité robustes pour protéger vos données :",
      },
      { type: "h3", text: "7.1 Mesures techniques" },
      {
        type: "check",
        items: [
          "Chiffrement SSL/TLS pour toutes les transmissions de données",
          "Chiffrement des mots de passe en base de données (hachage sécurisé)",
          "Pare-feu et systèmes de détection d'intrusion",
          "Sauvegardes régulières et redondance des données",
          "Audits de sécurité périodiques",
        ],
      },
      { type: "h3", text: "7.2 Mesures organisationnelles" },
      {
        type: "list",
        items: [
          "Accès limité aux données pour le personnel autorisé",
          "Contrats de confidentialité avec tous les prestataires",
          "Formation du personnel à la protection des données",
          "Procédures d'incident et de notification",
        ],
      },
      { type: "h3", text: "7.3 Votre responsabilité" },
      {
        type: "p",
        text: "Vous êtes responsable de la confidentialité de votre mot de passe. Ne le partagez jamais. Signalez immédiatement tout accès non autorisé à support@linqfolio.com.",
      },
      { type: "h3", text: "7.4 Sous-traitants" },
      {
        type: "p",
        text: "Conformément à l'article 28 du RGPD, LINQFOLIO s'assure que ses sous-traitants présentent des garanties suffisantes quant à la mise en œuvre de mesures techniques et organisationnelles appropriées. Un contrat de sous-traitance conforme aux exigences du RGPD est conclu avec chaque sous-traitant ayant accès aux données personnelles des Utilisateurs.",
      },
    ],
  },
  {
    id: "cookies",
    number: 8,
    title: "Cookies et technologies de suivi",
    blocks: [
      {
        type: "p",
        text: "Nous utilisons des cookies et technologies comparables conformément au cadre applicable (notamment directives CNIL sur les traceurs et RGPD). Le détail par nom, finalité et base juridique est aligné sur la Politique relative aux cookies et traceurs du site marketing lorsque vous consultez les pages concernées. Nous ne déployons pas de cookies publicitaires de régies tierces.",
      },
      { type: "h3", text: "8.1 Mécanisme de consentement (bandeau)" },
      {
        type: "p",
        text: "linqfolio-consent (stockage local, exempté de consentement) : Finalité : mémoriser votre réponse au bandeau, acceptation comme refus. Sans cette clé, un refus ne pourrait pas être retenu et la question vous serait reposée à chaque page. Durée : 6 mois, au terme desquels la question est reposée.",
      },
      { type: "h3", text: "8.2 Préférences d'interface" },
      {
        type: "list",
        items: [
          "linqfolio-lang (stockage local, exempté) : Finalité : retenir la langue choisie, français ou anglais. Durée : persistant jusqu'à effacement des données du site.",
          "linqfolio-theme (stockage local, exempté) : Finalité : retenir le thème clair ou sombre choisi. Durée : persistant jusqu'à effacement des données du site.",
        ],
      },
      { type: "h3", text: "8.3 Compteurs d'audience internes (sans consentement)" },
      {
        type: "p",
        text: "Chaque page vue incrémente des compteurs hébergés sur notre propre infrastructure, en Irlande : une ligne par jour et par indicateur, un nombre dedans. Rien n'est écrit sur votre terminal — ni cookie, ni clé de stockage local. Aucun identifiant de visiteur ou de session n'est créé, aucune adresse IP n'est conservée, aucune ligne individuelle n'existe, et rien n'est transmis à un tiers.",
      },
      {
        type: "p",
        text: "Ce dispositif ne traite donc aucune donnée personnelle au repos : le résultat est anonyme dès l'écriture, puisqu'il n'y a jamais eu que des nombres. Il remplit les conditions posées par la CNIL pour une mesure d'audience exemptée de consentement — finalité unique, résultats strictement anonymes, périmètre limité à notre seul site, aucun recoupement.",
      },
      {
        type: "p",
        text: "Votre adresse IP atteint notre serveur, comme pour toute requête web, et sert uniquement à limiter les rejeux automatiques. Elle n'est ni écrite ni journalisée par ce mécanisme.",
      },
      { type: "h3", text: "8.4 Google Analytics 4 (consentement requis)" },
      {
        type: "p",
        text: "Google Analytics suppose des cookies et un traitement par un tiers. La CNIL ne lui accorde pas l'exemption décrite en 8.3 : il n'est ni chargé, ni exécuté, ni contacté tant que vous n'avez pas accepté sur le bandeau. Avant votre réponse comme après un refus, votre navigateur ne prend aucun contact avec Google.",
      },
      {
        type: "list",
        items: [
          "_ga (consentement requis) : Finalité : distinguer les visiteurs, donc reconnaître une visite de retour et rattacher une inscription à la campagne qui l'a amenée. Durée : 13 mois.",
          "_ga_<identifiant de mesure> (consentement requis) : Finalité : conserver l'état de la session en cours. Durée : 13 mois.",
        ],
      },
      {
        type: "p",
        text: "Après acceptation, les données sont traitées par Google Ireland Limited en qualité de sous-traitant, avec anonymisation de l'adresse IP. Les signaux publicitaires, la personnalisation des annonces et le partage avec les produits publicitaires de Google restent refusés en permanence, y compris après votre acceptation. Les cookies sont effacés immédiatement si vous retirez votre accord.",
      },
      { type: "h3", text: "8.5 Newsletter" },
      {
        type: "p",
        text: "Le formulaire d'inscription n'utilise aucun cookie. Votre adresse, la langue de la page et l'emplacement du formulaire sont enregistrés avec votre demande, sur la base du consentement que vous donnez en la soumettant.",
      },
      { type: "h3", text: "8.6 Réseaux sociaux" },
      {
        type: "p",
        text: "Les liens vers nos comptes Instagram, TikTok, X, LinkedIn et Discord sont de simples liens sortants. Aucun pixel, bouton de partage ni contenu embarqué de ces plateformes n'est chargé sur le site : elles ne vous voient qu'à partir du moment où vous cliquez.",
      },
      { type: "h3", text: "8.7 Gestion et retrait du consentement" },
      {
        type: "p",
        text: "La page « Politique relative aux cookies » affiche votre réponse actuelle sur Google Analytics et permet d'en changer d'un clic, à tout moment. Le retrait prend effet immédiatement et efface les cookies _ga déjà déposés. Vous pouvez également supprimer l'ensemble des données du site depuis les paramètres de votre navigateur.",
      },
      {
        type: "p",
        text: "Les compteurs de la section 8.3 ne comportent pas de refus : ils ne conservent rien vous concernant, il n'y a donc ni trace à consulter, ni trace à supprimer.",
      },
      {
        type: "p",
        text: "Rappel : pas de cookies publicitaires ; pas de cession de données à des régies publicitaires pour leur compte propre.",
      },
    ],
  },
  {
    id: "droits-rgpd",
    number: 9,
    title: "Vos droits RGPD",
    blocks: [
      {
        type: "p",
        text: "Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :",
      },
      { type: "h3", text: "9.1 Droit d'accès" },
      {
        type: "p",
        text: "Vous pouvez demander une copie de vos données personnelles que nous détenons ; nous traitons la demande dans les délais prévus au RGPD (voir section 9.7).",
      },
      { type: "h3", text: "9.2 Droit de rectification" },
      {
        type: "p",
        text: "Vous pouvez corriger ou mettre à jour vos données inexactes ou incomplètes via les paramètres de votre compte.",
      },
      { type: "h3", text: "9.3 Droit à l'oubli (suppression)" },
      {
        type: "p",
        text: "Vous pouvez demander la suppression de votre compte et de vos données personnelles. Voir section 6.2 pour les détails sur la conservation des contenus publics.",
      },
      { type: "h3", text: "9.4 Droit à la limitation du traitement" },
      {
        type: "p",
        text: "Vous pouvez demander à restreindre le traitement de vos données dans certaines circonstances.",
      },
      { type: "h3", text: "9.5 Droit à la portabilité" },
      {
        type: "p",
        text: "Vous pouvez demander une copie de vos données dans un format lisible et structuré.",
      },
      { type: "h3", text: "9.6 Droit d'opposition" },
      {
        type: "p",
        text: "Vous pouvez vous opposer au traitement de vos données à certaines fins, notamment le marketing.",
      },
      { type: "h3", text: "9.7 Comment exercer vos droits" },
      {
        type: "p",
        text: "Pour exercer vos droits, écrivez à dpo@linqfolio.com avec par exemple le sujet : « Demande RGPD, droit d'accès », « Demande RGPD, effacement », « Demande RGPD, limitation », etc. Nous répondons sans retard excessif et, sauf cas complexes prévus par la réglementation, au plus tard dans le délai légal applicable (couramment un mois à compter de la demande, avec possibilité de prolongation motivée).",
      },
    ],
  },
  {
    id: "transferts",
    number: 10,
    title: "Transferts internationaux",
    blocks: [
      {
        type: "p",
        text: "LinQfolio héberge ses données dans l'Union Européenne pour assurer la conformité au RGPD.",
      },
      { type: "h3", text: "10.1 Localisation des données" },
      {
        type: "p",
        text: "Les serveurs de la Plateforme sont hébergés par Amazon Web Services (AWS), dans la région eu-west-1 (Irlande), au sein de l'Union Européenne. Vos données ne sont pas transférées en dehors de l'UE, sauf si légalement obligatoire.",
      },
      { type: "h3", text: "10.2 Transferts exceptionnels" },
      {
        type: "p",
        text: "Si un transfert hors UE s'avère nécessaire, nous mettrons en place les garanties appropriées (clauses contractuelles types de la Commission européenne, décision d'adéquation) conformément aux articles 44 à 49 du RGPD.",
      },
    ],
  },
  {
    id: "enfants",
    number: 11,
    title: "Données des enfants",
    blocks: [
      {
        type: "p",
        text: "La Plateforme est réservée aux personnes âgées d'au moins 16 ans. Aucune personne de moins de 16 ans n'est autorisée à créer un compte.",
      },
      {
        type: "p",
        text: "Cet âge est supérieur au seuil de 15 ans retenu par la France en application de l'article 8 du RGPD et de l'article 45 de la loi Informatique et Libertés, seuil en dessous duquel le consentement au traitement des données doit être donné ou autorisé par le titulaire de l'autorité parentale. En retenant 16 ans, LINQFOLIO n'a pas à recueillir de consentement parental : tous ses utilisateurs consentent valablement seuls.",
      },
      { type: "h3", text: "11.1 Protection des mineurs" },
      {
        type: "list",
        items: [
          "Nous n'utilisons jamais de données d'enfants à des fins marketing",
          "Les parents ou représentants légaux peuvent nous contacter à support@linqfolio.com pour exercer les droits de leur enfant",
          "Tout utilisateur peut signaler un compte détenu par une personne de moins de 16 ans depuis l'application",
        ],
      },
      { type: "h3", text: "11.1 bis Procédure applicable à un compte de moins de 16 ans" },
      {
        type: "p",
        text: "Lorsque LINQFOLIO a connaissance, par un signalement ou par tout autre moyen, qu'un compte est détenu par une personne de moins de 16 ans : le titulaire est informé par courrier électronique du motif de la clôture, de la date d'effet et de la possibilité d'obtenir au préalable une copie de ses contenus ; un délai d'au moins quinze (15) jours sépare cette information de la suppression effective, sauf lorsque la sécurité de la personne concernée impose d'agir sans délai ; le profil, les publications, les commentaires et les messages sont ensuite effacés de manière irréversible, seules étant conservées les données que la loi impose de garder, pour la durée qu'elle prévoit. Le titulaire de l'autorité parentale peut exercer à tout moment les droits de l'enfant auprès de support@linqfolio.com et introduire une réclamation auprès de la CNIL. Cette procédure s'applique sans préjudice du droit à l'effacement prévu à l'article 17.1.f du RGPD, qui vise expressément les données collectées auprès d'un enfant.",
      },
      { type: "h3", text: "11.2 Mineurs et droit français / Union européenne" },
      {
        type: "p",
        text: "Pour les services offerts directement aux enfants au sens du RGPD, des règles spécifiques peuvent s'appliquer. Pour les autres utilisateurs, l'âge minimal peut être plus élevé selon le pays ; LINQFOLIO adapte ses âges seuils et mécanismes dès lors qu'une réglementation applicable impose une autorisation parentale ou une information aux détenteurs de l'autorité parentale. En cas de doute sur l'âge réel, nous pouvons suspendre le compte le temps de vérifications proportionnées.",
      },
    ],
  },
  {
    id: "modifications",
    number: 12,
    title: "Modifications de cette Politique",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO peut modifier cette Politique de Confidentialité pour l'adapter aux évolutions légales, techniques ou organisationnelles.",
      },
      { type: "h3", text: "12.1 Notifications des modifications" },
      {
        type: "list",
        items: [
          "Les modifications substantielles seront annoncées par email et/ou notification in-app et publiées sur cette page",
          "Un délai de préavis raisonnable sera respecté avant la date d'effet des changements substantiels : en routine commerciale, un préavis d'au moins sept (7) jours calendaires, sauf obligation légale ou mesure de sécurité urgente imposant un délai plus court (avec information proportionnée)",
          "Pour les traitements fondés sur le consentement, un amendement substantiel peut exiger un nouveau recueil lorsque la loi l'impose ; à défaut d'opposition dans les modalités indiquées, la poursuite d'usage après entrée en vigueur peut constituer l'acceptation des seuls changements contractuels, sous réserve de vos droits",
        ],
      },
      { type: "h3", text: "12.2 Dernière mise à jour" },
      {
        type: "p",
        text: "Cette Politique a été mise à jour le 10 mai 2026.",
      },
    ],
  },
  {
    id: "contact",
    number: 13,
    title: "Contacts et réclamations",
    blocks: [
      { type: "h3", text: "Contact du responsable des données" },
      {
        type: "p",
        text: "Pour toute question, demande RGPD ou réclamation : dpo@linqfolio.com. Précisez en objet la nature de votre demande (ex. « Confidentialité », « Exercice de droits », « Réclamation traitement ») pour orienter votre dossier.",
      },
      {
        type: "p",
        text: "Accusé de réception ou première réponse : sous deux jours ouvrés en général pour les demandes courantes ; délais RGPD pour la réponse complète comme indiqué en section 9.7.",
      },
      { type: "h3", text: "Informations légales" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS, Société par Actions Simplifiée",
          "142 rue de Rivoli, 75001 Paris, France",
          "Capital social : 3 000€",
          "RCS Paris : 102 625 183",
          "SIRET : 10262518300011",
          "TVA intracommunautaire : FR83102625183",
        ],
      },
      { type: "h3", text: "Autorité de contrôle" },
      {
        type: "p",
        text: "Si vous estimez que vos droits RGPD n'ont pas été respectés, vous pouvez déposer une réclamation auprès de l'autorité de contrôle compétente : CNIL (Commission Nationale de l'Informatique et des Libertés), 3 Place de Fontenoy, 75007 Paris, France (www.cnil.fr).",
      },
    ],
  },
];

export const CONFIDENTIALITE_SECTIONS_EN: PolicySection[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction and Data Controller",
    blocks: [
      {
        type: "p",
        text: "This Privacy Policy (the “Policy”) explains how LINQFOLIO SAS (“we,” “LINQFOLIO”) collects, uses, processes, and protects your personal data when you use our platform, LinQfolio (the “Platform”).",
      },
      { type: "h3", text: "Data controller" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS",
          "A Société par Actions Simplifiée (simplified joint-stock company) with capital of €3,000",
          "Incorporated on January 6, 2026 by private deed",
          "Registered office: 142 rue de Rivoli, 75001 Paris, France",
          "Paris Trade and Companies Register (RCS Paris): 102 625 183",
          "SIRET: 10262518300011",
          "Intra-Community VAT number: FR83102625183",
          "Email: dpo@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "We are committed to respecting your privacy and protecting your data in accordance with Regulation (EU) 2016/679 of April 27, 2016 on the protection of natural persons with regard to the processing of personal data (GDPR) and French Law No. 78-17 of January 6, 1978, known as the “Data Protection Act” (Loi Informatique et Libertés).",
      },
    ],
  },
  {
    id: "donnees-collectees",
    number: 2,
    title: "Personal Data We Collect",
    blocks: [
      { type: "p", text: "We collect the following categories of data:" },
      { type: "h3", text: "2.1 Data required at sign-up" },
      {
        type: "list",
        items: [
          "Email address",
          "Username/handle",
          "Password (stored securely)",
          "First and last name (optional)",
          "Account creation date",
        ],
      },
      { type: "h3", text: "2.2 Content-related data" },
      {
        type: "list",
        items: [
          "Reviews, write-ups, and ratings of the books you publish",
          "Reading lists you create",
          "Comments on other users’ posts",
          "Photos of books or reading spaces",
          "History of your reading activity and interactions",
        ],
      },
      { type: "h3", text: "2.3 Technical data" },
      {
        type: "list",
        items: [
          "IP address",
          "Browser type and operating system",
          "Pages visited and time spent on the site",
          "Session data and cookies",
          "Approximate (non-precise) location information",
        ],
      },
      { type: "h3", text: "2.4 Communication data" },
      {
        type: "list",
        items: [
          "Error messages and support requests",
          "Correspondence with our support team",
          "Notifications and alerts",
        ],
      },
    ],
  },
  {
    id: "utilisation",
    number: 3,
    title: "Use of Personal Data",
    blocks: [
      { type: "p", text: "Your data is used for the following purposes:" },
      { type: "h3", text: "3.1 Providing the service" },
      {
        type: "list",
        items: [
          "Create and manage your account",
          "Let you publish and share content",
          "Display your profile and interactions to other users",
          "Handle your requests and complaints",
        ],
      },
      { type: "h3", text: "3.2 Improving the Platform" },
      {
        type: "list",
        items: [
          "Analyze how the Platform is used",
          "Develop and test new features",
          "Fix bugs and technical issues",
          "Optimize performance",
        ],
      },
      {
        type: "p",
        text: "Legal basis: Improving the Platform relies on our legitimate interest (Art. 6(1)(f) GDPR) in providing a reliable, high-performing service. Where we implement audience-measurement tools that require non-essential trackers, we apply the required consent rules.",
      },
      { type: "h3", text: "3.3 Communications" },
      {
        type: "list",
        items: [
          "Send notifications about your account",
          "Inform you of updates and changes to the Platform",
          "Contact you for support purposes",
          "Send you legal or regulatory information",
        ],
      },
      { type: "h3", text: "3.4 Security and legal compliance" },
      {
        type: "list",
        items: [
          "Detect and prevent abuse, fraud, or unlawful conduct",
          "Enforce our Terms of Use",
          "Comply with legal obligations",
          "Protect the rights and safety of our users",
        ],
      },
      {
        type: "p",
        text: "Important: LINQFOLIO does not sell your personal data and does not transfer it to third parties for advertising or commercial purposes. Service providers may, however, process certain data on our behalf (hosting, security, support) under contracts governing data processing arrangements (see Sections 5 and 7.4).",
      },
    ],
  },
  {
    id: "base-legale",
    number: 4,
    title: "Legal Basis for Processing",
    blocks: [
      { type: "p", text: "The processing of your personal data relies on the following legal bases:" },
      {
        type: "p",
        text: "Method: each purpose is linked to a specific legal basis in our internal records of processing activities. The paragraphs below summarize the most common situations; where several bases are mentioned, the basis that applies depends on the nature of the processing involved (account, security, newsletter, optional trackers, etc.).",
      },
      { type: "h3", text: "4.1 Consent" },
      {
        type: "p",
        text: "Where the law requires it (for example, for certain electronic communications or for trackers that are not strictly necessary), we obtain prior consent, granular where relevant, and you may withdraw it at any time without affecting the lawfulness of processing based on other grounds before withdrawal. Account settings and the cookie banner let you exercise these choices where available on the relevant Platform.",
      },
      { type: "h3", text: "4.2 Performance of the contract" },
      {
        type: "p",
        text: "Processing is necessary to perform the Terms of Use and to provide the services.",
      },
      { type: "h3", text: "4.3 Legal obligations" },
      {
        type: "p",
        text: "We must process certain data to comply with our legal and regulatory obligations.",
      },
      { type: "h3", text: "4.4 Legitimate interests" },
      {
        type: "p",
        text: "We process certain data in our legitimate interests, in particular the security of the Platform and the prevention of abuse.",
      },
      { type: "h3", text: "4.5 Data breach notification" },
      {
        type: "p",
        text: "In accordance with Articles 33 and 34 of the GDPR, in the event of a personal data breach likely to result in a high risk to your rights and freedoms, LINQFOLIO undertakes to inform you as soon as possible, and to notify the competent supervisory authority (the CNIL, France’s data protection authority) within 72 hours of becoming aware of the breach.",
      },
    ],
  },
  {
    id: "partage",
    number: 5,
    title: "Sharing of Data",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO does not sell your personal data and does not transfer it to third parties for their own marketing or advertising purposes.",
      },
      { type: "h3", text: "5.1 Access by service providers and controlled disclosures" },
      {
        type: "p",
        text: "Data may be disclosed to service providers acting on our behalf and under our instructions (processors within the meaning of the GDPR), only to the extent necessary for the purpose pursued:",
      },
      {
        type: "list",
        items: [
          "Technical service providers: hosting, security, maintenance, customer support, under contracts providing for confidentiality and obligations equivalent to those of the GDPR",
          "Legal authorities: where legally required to do so by public authorities (police, courts)",
          "Protection of rights: to defend our legal rights or those of our users",
        ],
      },
      { type: "h3", text: "5.2 Public data" },
      {
        type: "p",
        text: "Your profile, reviews, write-ups, and lists are public by default and visible to other users. Your personal data (email, password) is never shared publicly.",
      },
    ],
  },
  {
    id: "conservation",
    number: 6,
    title: "Data Retention Periods",
    blocks: [
      { type: "p", text: "Data is retained for the following periods:" },
      { type: "h3", text: "6.1 While your account is active" },
      {
        type: "p",
        text: "Your account and your data are retained for as long as your account remains active.",
      },
      { type: "h3", text: "6.2 After account deletion" },
      {
        type: "list",
        items: [
          "Account data: deleted within 30 days of the deletion request, then kept in an intermediate archive for 3 years to comply with legal obligations (the civil statute of limitations)",
          "Public content: reviews and write-ups may be retained in anonymized form for statistical and archival purposes",
          "Log data / technical logs: retained for 12 months from collection, in accordance with connection-data retention obligations, then deleted",
          "Billing data (where applicable): retained for 10 years from the close of the accounting year, in accordance with accounting and tax obligations (Art. L. 123-22 of the French Commercial Code)",
        ],
      },
      { type: "h3", text: "6.3 Inactive data" },
      {
        type: "p",
        text: "Accounts inactive for more than 24 months may be deleted. A warning will be sent by email before deletion.",
      },
    ],
  },
  {
    id: "securite",
    number: 7,
    title: "Data Security",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO implements robust security measures to protect your data:",
      },
      { type: "h3", text: "7.1 Technical measures" },
      {
        type: "check",
        items: [
          "SSL/TLS encryption for all data transmissions",
          "Password encryption in the database (secure hashing)",
          "Firewalls and intrusion-detection systems",
          "Regular backups and data redundancy",
          "Periodic security audits",
        ],
      },
      { type: "h3", text: "7.2 Organizational measures" },
      {
        type: "list",
        items: [
          "Access to data limited to authorized personnel",
          "Confidentiality agreements with all service providers",
          "Staff training on data protection",
          "Incident-response and notification procedures",
        ],
      },
      { type: "h3", text: "7.3 Your responsibility" },
      {
        type: "p",
        text: "You are responsible for keeping your password confidential. Never share it. Report any unauthorized access immediately to support@linqfolio.com.",
      },
      { type: "h3", text: "7.4 Processors" },
      {
        type: "p",
        text: "In accordance with Article 28 of the GDPR, LINQFOLIO ensures that its processors provide sufficient guarantees regarding the implementation of appropriate technical and organizational measures. A data processing agreement compliant with GDPR requirements is entered into with each processor that has access to Users’ personal data.",
      },
    ],
  },
  {
    id: "cookies",
    number: 8,
    title: "Cookies and Tracking Technologies",
    blocks: [
      {
        type: "p",
        text: "We use cookies and similar technologies in accordance with the applicable framework (in particular the CNIL’s guidelines on trackers and the GDPR). Details by name, purpose, and legal basis are aligned with the Cookie Policy of the marketing website when you visit the relevant pages. We do not deploy third-party advertising cookies.",
      },
      { type: "h3", text: "8.1 Consent mechanism (banner)" },
      {
        type: "p",
        text: "linqfolio-consent (local storage, exempt from consent): Purpose: remember your answer to the banner, whether you accepted or declined. Without this key, a refusal could not be remembered and you would be asked again on every page. Duration: 6 months, after which we ask again.",
      },
      { type: "h3", text: "8.2 Interface preferences" },
      {
        type: "list",
        items: [
          "linqfolio-lang (local storage, exempt): Purpose: remember the language you picked, French or English. Duration: persistent until you clear the site's data.",
          "linqfolio-theme (local storage, exempt): Purpose: remember the light or dark theme you picked. Duration: persistent until you clear the site's data.",
        ],
      },
      { type: "h3", text: "8.3 Internal audience counters (no consent)" },
      {
        type: "p",
        text: "Every page view increments counters hosted on our own infrastructure, in Ireland: one row per day and per indicator, a number inside it. Nothing is written to your device — no cookie, no local storage key. No visitor or session identifier is created, no IP address is kept, no individual row exists, and nothing is passed to a third party.",
      },
      {
        type: "p",
        text: "This system therefore processes no personal data at rest: the result is anonymous from the moment it is written, since there were only ever numbers. It meets the conditions the CNIL sets for audience measurement exempt from consent — a single purpose, strictly anonymous results, a scope limited to our site alone, no cross-referencing.",
      },
      {
        type: "p",
        text: "Your IP address reaches our server, as it does for any web request, and is used only to limit automated replays. This mechanism neither writes nor logs it.",
      },
      { type: "h3", text: "8.4 Google Analytics 4 (consent required)" },
      {
        type: "p",
        text: "Google Analytics requires cookies and processing by a third party. The CNIL does not grant it the exemption described in 8.3: it is neither loaded, nor executed, nor contacted until you accept on the banner. Before you answer and after a refusal, your browser makes no contact with Google at all.",
      },
      {
        type: "list",
        items: [
          "_ga (consent required): Purpose: tell visitors apart, so a returning visit can be recognised and a sign-up connected to the campaign that brought it. Duration: 13 months.",
          "_ga_<measurement ID> (consent required): Purpose: keep the state of the current session. Duration: 13 months.",
        ],
      },
      {
        type: "p",
        text: "After acceptance, data is processed by Google Ireland Limited acting as a processor, with IP address anonymization. Advertising signals, ad personalization, and sharing with Google's advertising products stay denied at all times, including after you accept. The cookies are cleared immediately if you withdraw your consent.",
      },
      { type: "h3", text: "8.5 Newsletter" },
      {
        type: "p",
        text: "The sign-up form uses no cookie. Your address, the page language, and the form's location are recorded with your request, on the basis of the consent you give by submitting it.",
      },
      { type: "h3", text: "8.6 Social networks" },
      {
        type: "p",
        text: "The links to our Instagram, TikTok, X, LinkedIn, and Discord accounts are plain outbound links. No pixel, share button, or embedded content from those platforms is loaded on the site: they only see you from the moment you click.",
      },
      { type: "h3", text: "8.7 Managing and withdrawing consent" },
      {
        type: "p",
        text: "The Cookie Policy page shows your current answer on Google Analytics and lets you change it in one click, at any time. Withdrawal takes effect immediately and clears the _ga cookies already set. You can also delete all of the site's data from your browser settings.",
      },
      {
        type: "p",
        text: "The counters in section 8.3 come with no refusal option: they keep nothing about you, so there is no trace to access and none to erase.",
      },
      {
        type: "p",
        text: "Reminder: no advertising cookies; no transfer of data to advertising networks for their own purposes.",
      },
    ],
  },
  {
    id: "droits-rgpd",
    number: 9,
    title: "Your GDPR Rights",
    blocks: [
      {
        type: "p",
        text: "In accordance with the GDPR, you have the following rights over your personal data:",
      },
      { type: "h3", text: "9.1 Right of access" },
      {
        type: "p",
        text: "You may request a copy of the personal data we hold about you; we process the request within the timeframes set out in the GDPR (see Section 9.7).",
      },
      { type: "h3", text: "9.2 Right to rectification" },
      {
        type: "p",
        text: "You can correct or update inaccurate or incomplete data through your account settings.",
      },
      { type: "h3", text: "9.3 Right to erasure (“right to be forgotten”)" },
      {
        type: "p",
        text: "You may request the deletion of your account and your personal data. See Section 6.2 for details on the retention of public content.",
      },
      { type: "h3", text: "9.4 Right to restriction of processing" },
      {
        type: "p",
        text: "You may request that we restrict the processing of your data in certain circumstances.",
      },
      { type: "h3", text: "9.5 Right to data portability" },
      {
        type: "p",
        text: "You may request a copy of your data in a readable, structured format.",
      },
      { type: "h3", text: "9.6 Right to object" },
      {
        type: "p",
        text: "You may object to the processing of your data for certain purposes, in particular marketing.",
      },
      { type: "h3", text: "9.7 How to exercise your rights" },
      {
        type: "p",
        text: "To exercise your rights, write to dpo@linqfolio.com with, for example, the subject line: “GDPR Request, Right of Access,” “GDPR Request, Erasure,” “GDPR Request, Restriction,” etc. We respond without undue delay and, except in complex cases provided for by the regulations, no later than the applicable legal deadline (typically one month from the request, with the possibility of a reasoned extension).",
      },
    ],
  },
  {
    id: "transferts",
    number: 10,
    title: "International Transfers",
    blocks: [
      {
        type: "p",
        text: "LinQfolio hosts its data within the European Union to ensure GDPR compliance.",
      },
      { type: "h3", text: "10.1 Data location" },
      {
        type: "p",
        text: "The Platform’s servers are hosted by Amazon Web Services (AWS), in the eu-west-1 region (Ireland), within the European Union. Your data is not transferred outside the EU, except where legally required.",
      },
      { type: "h3", text: "10.2 Exceptional transfers" },
      {
        type: "p",
        text: "Should a transfer outside the EU become necessary, we will implement appropriate safeguards (European Commission standard contractual clauses, adequacy decision) in accordance with Articles 44 to 49 of the GDPR.",
      },
    ],
  },
  {
    id: "enfants",
    number: 11,
    title: "Children’s Data",
    blocks: [
      {
        type: "p",
        text: "The Platform is reserved for people aged 16 and over. No one under the age of 16 is permitted to create an account.",
      },
      {
        type: "p",
        text: "This age is higher than the threshold of 15 set by France under Article 8 of the GDPR and Article 45 of the Data Protection Act, below which consent to data processing must be given or authorized by the holder of parental authority. By setting the threshold at 16, LINQFOLIO does not need to obtain parental consent: all of its users validly consent on their own.",
      },
      { type: "h3", text: "11.1 Protection of minors" },
      {
        type: "list",
        items: [
          "We never use children’s data for marketing purposes",
          "Parents or legal guardians may contact us at support@linqfolio.com to exercise their child’s rights",
          "Any user can report an account held by someone under 16 from within the app",
        ],
      },
      { type: "h3", text: "11.1 bis Procedure applicable to an account held by someone under 16" },
      {
        type: "p",
        text: "When LINQFOLIO becomes aware, through a report or by any other means, that an account is held by someone under 16: the account holder is informed by email of the reason for the closure, its effective date, and the option to obtain a copy of their content beforehand; at least fifteen (15) days elapse between this notice and the actual deletion, except where the safety of the person concerned requires immediate action; the profile, posts, comments, and messages are then irreversibly deleted, with only the data that the law requires us to keep being retained, for the period it provides for. The holder of parental authority may exercise the child’s rights at any time by contacting support@linqfolio.com and may lodge a complaint with the CNIL. This procedure applies without prejudice to the right to erasure set out in Article 17(1)(f) of the GDPR, which expressly covers data collected from a child.",
      },
      { type: "h3", text: "11.2 Minors and French / European Union law" },
      {
        type: "p",
        text: "For services offered directly to children within the meaning of the GDPR, specific rules may apply. For other users, the minimum age may be higher depending on the country; LINQFOLIO adjusts its age thresholds and mechanisms whenever applicable regulations require parental authorization or notice to holders of parental authority. If there is doubt about a user’s actual age, we may suspend the account while we carry out proportionate checks.",
      },
    ],
  },
  {
    id: "modifications",
    number: 12,
    title: "Changes to This Policy",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO may amend this Privacy Policy to reflect legal, technical, or organizational developments.",
      },
      { type: "h3", text: "12.1 Notice of changes" },
      {
        type: "list",
        items: [
          "Material changes will be announced by email and/or in-app notification and published on this page",
          "A reasonable notice period will be given before material changes take effect: in the ordinary course of business, at least seven (7) calendar days’ notice, except where a legal obligation or an urgent security measure requires a shorter period (with proportionate notice)",
          "For processing based on consent, a material amendment may require us to collect your consent again where the law so requires; absent an objection made in the manner indicated, continuing to use the Platform after the change takes effect may constitute acceptance of the contractual changes only, without prejudice to your rights",
        ],
      },
      { type: "h3", text: "12.2 Last updated" },
      {
        type: "p",
        text: "This Policy was last updated on May 10, 2026.",
      },
    ],
  },
  {
    id: "contact",
    number: 13,
    title: "Contact and Complaints",
    blocks: [
      { type: "h3", text: "Data Protection Officer contact information" },
      {
        type: "p",
        text: "For any question, GDPR request, or complaint: dpo@linqfolio.com. Please specify the nature of your request in the subject line (e.g., “Privacy,” “Exercising my rights,” “Processing complaint”) to help us route your case.",
      },
      {
        type: "p",
        text: "Acknowledgment or initial response: generally within two business days for routine requests; GDPR timeframes apply to the full response, as indicated in Section 9.7.",
      },
      { type: "h3", text: "Legal information" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS, Société par Actions Simplifiée (simplified joint-stock company)",
          "142 rue de Rivoli, 75001 Paris, France",
          "Share capital: €3,000",
          "Paris Trade and Companies Register (RCS Paris): 102 625 183",
          "SIRET: 10262518300011",
          "Intra-Community VAT number: FR83102625183",
        ],
      },
      { type: "h3", text: "Supervisory authority" },
      {
        type: "p",
        text: "If you believe that your GDPR rights have not been respected, you may lodge a complaint with the competent supervisory authority: the CNIL (Commission Nationale de l’Informatique et des Libertés, France’s data protection authority), 3 Place de Fontenoy, 75007 Paris, France (www.cnil.fr).",
      },
    ],
  },
];
