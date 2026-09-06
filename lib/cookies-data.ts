export type CookiesBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "check"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type CookiesSection = {
  id: string;
  number: number;
  title: string;
  blocks: CookiesBlock[];
};

export const COOKIES_EFFECTIVE_DATE_FR = "5 septembre 2026";

export const COOKIES_SECTIONS_FR: CookiesSection[] = [
  {
    id: "qui-sommes-nous",
    number: 1,
    title: "Qui sommes-nous ?",
    blocks: [
      {
        type: "p",
        text: "Le site linqfolio.com est édité par LINQFOLIO SAS, société immatriculée en France (coordonnées détaillées dans les mentions légales). La présente politique explique comment nous utilisons des cookies et technologies comparables lorsque vous consultez ce site marketing et ses formulaires (newsletter).",
      },
    ],
  },
  {
    id: "definition",
    number: 2,
    title: "Qu'est-ce qu'un « cookie » ?",
    blocks: [
      {
        type: "p",
        text: "Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site. Les cookies permettent de reconnaître votre navigateur, de mémoriser des préférences ou (lorsque vous l'acceptez) de mesurer l'audience et les campagnes marketing de façon limitée.",
      },
      {
        type: "p",
        text: "Nous utilisons aussi le stockage local du navigateur (localStorage) pour certaines préférences d'interface qui ne sont pas des cookies HTTP mais ont un effet comparable côté terminal.",
      },
    ],
  },
  {
    id: "traceurs",
    number: 3,
    title: "Quels traceurs utilisons-nous ?",
    blocks: [
      {
        type: "p",
        text: "Table récapitulative de ce qui est écrit sur votre terminal. Nos compteurs d'audience internes n'y figurent pas : ils n'écrivent rien du tout, ni cookie ni clé de stockage. Ils sont décrits à la section suivante.",
      },
      {
        type: "table",
        headers: ["Nom", "Support", "Finalité", "Base / consentement", "Durée"],
        rows: [
          [
            "linqfolio-consent",
            "localStorage",
            "Mémoriser votre réponse au bandeau (indispensable au mécanisme de consentement lui-même).",
            "Exempté de consentement : sans lui, impossible de retenir que vous avez refusé.",
            "6 mois, puis la question est reposée",
          ],
          [
            "linqfolio-lang",
            "localStorage",
            "Retenir la langue choisie (français ou anglais) via le sélecteur du site.",
            "Exempté : préférence d'affichage que vous avez explicitement exprimée.",
            "Persistant",
          ],
          [
            "linqfolio-theme",
            "localStorage",
            "Retenir le thème clair ou sombre choisi via le sélecteur du site.",
            "Exempté : préférence d'affichage que vous avez explicitement exprimée.",
            "Persistant",
          ],
          [
            "_ga",
            "Cookie HTTP (Google Analytics 4)",
            "Distinguer les visiteurs pour reconnaître une visite de retour et mesurer la provenance du trafic, campagnes imprimées par QR code comprises.",
            "Consentement (bouton « Accepter » du bandeau). Non déposé avant votre accord, ni si vous refusez.",
            "13 mois",
          ],
          [
            "_ga_<identifiant de mesure>",
            "Cookie HTTP (Google Analytics 4)",
            "Conserver l'état de la session en cours (début, durée, pages enchaînées).",
            "Consentement (bouton « Accepter » du bandeau). Non déposé avant votre accord, ni si vous refusez.",
            "13 mois",
          ],
        ],
      },
    ],
  },
  {
    id: "mesure-audience",
    number: 4,
    title: "Comment nous mesurons l'audience",
    blocks: [
      {
        type: "p",
        text: "Nous mesurons l'audience de deux façons, qui ne relèvent pas du même régime juridique et ne voient pas les mêmes choses. La première fonctionne pour tout le monde parce qu'elle ne conserve rien de vous ; la seconde attend votre accord parce qu'elle en conserve.",
      },
      {
        type: "h3",
        text: "4.1 Compteurs internes — sans cookie, sans consentement",
      },
      {
        type: "p",
        text: "Chaque page vue incrémente des compteurs hébergés sur notre propre infrastructure, en Irlande. Ces compteurs ne contiennent que des additions : une ligne par jour et par indicateur, un nombre dedans. « 412 pages d'accueil vues aujourd'hui », « 31 clics vers l'App Store », « 18 refus du bandeau ».",
      },
      {
        type: "check",
        items: [
          "Aucun cookie, aucune clé de stockage local, rien n'est écrit sur votre terminal.",
          "Aucun identifiant : ni de visiteur, ni de session, ni d'empreinte de navigateur.",
          "Aucune adresse IP conservée. La vôtre atteint notre serveur, comme pour toute requête web, et sert uniquement à limiter les rejeux automatiques ; elle n'est ni écrite ni journalisée par ce mécanisme.",
          "Aucune ligne individuelle : il n'existe nulle part d'enregistrement correspondant à votre visite, seulement un total auquel elle a ajouté un.",
          "Aucune transmission à un tiers. Les compteurs restent sur nos serveurs.",
          "Aucun suivi entre sites : le dispositif ne connaît que linqfolio.com.",
        ],
      },
      {
        type: "p",
        text: "Ce cumul de conditions est exactement celui que la CNIL pose pour la mesure d'audience exemptée de consentement : finalité unique, résultats strictement anonymes, périmètre limité au seul éditeur, pas de recoupement. Le résultat n'est pas anonymisé après coup — il est anonyme dès l'écriture, puisqu'il n'y a jamais eu que des nombres.",
      },
      {
        type: "p",
        text: "Ce que cela nous permet de savoir est volontairement pauvre : des totaux. Combien de visites, quelles pages, quelle proportion de nos lecteurs refuse le bandeau, quels supports imprimés amènent du monde. Jamais un parcours, jamais un profil, jamais un retour de visite.",
      },
      {
        type: "h3",
        text: "4.2 Google Analytics 4 — uniquement après votre accord",
      },
      {
        type: "p",
        text: "Google Analytics nous donne ce que les compteurs ne peuvent pas donner : la suite des gestes d'une même visite. Quelle section retient l'attention, à quel endroit de la page on abandonne, combien d'arguments il faut lire avant de cliquer vers une boutique d'applications.",
      },
      {
        type: "p",
        text: "Cet outil suppose des cookies et un traitement par un tiers. La CNIL ne lui accorde pas l'exemption décrite plus haut : il n'est donc ni chargé, ni exécuté, ni contacté tant que vous n'avez pas cliqué « Accepter ». Avant votre réponse comme après un refus, votre navigateur ne prend aucun contact avec Google.",
      },
      {
        type: "p",
        text: "Si vous acceptez, les cookies _ga et _ga_<identifiant de mesure> sont déposés et les données sont traitées par Google Ireland Limited en qualité de sous-traitant, avec anonymisation de l'adresse IP. Nous n'activons ni les signaux publicitaires, ni la personnalisation des annonces, ni le partage avec les produits publicitaires de Google : ces paramètres restent refusés en permanence, y compris après votre acceptation.",
      },
      {
        type: "h3",
        text: "Pourquoi deux dispositifs plutôt qu'un",
      },
      {
        type: "p",
        text: "Parce qu'un seul mentirait. Si nous ne mesurions que les personnes ayant accepté, chaque chiffre décrirait une fraction de notre public sans que nous sachions laquelle. Les compteurs internes donnent le volume réel et le taux de refus ; Google Analytics donne le détail sur ceux qui l'ont accepté. C'est en rapportant le second au premier que nous savons ce que le second vaut.",
      },
    ],
  },
  {
    id: "newsletter",
    number: 5,
    title: "Newsletter",
    blocks: [
      {
        type: "p",
        text: "L'inscription à la newsletter suppose votre adresse e-mail et une case à cocher d'acceptation distincte du bandeau cookies. Les données sont traitées conformément à la politique de confidentialité.",
      },
      {
        type: "p",
        text: "Le formulaire n'utilise aucun cookie. La langue de la page et l'emplacement du formulaire sont enregistrés avec votre demande, afin de vous écrire dans la bonne langue.",
      },
    ],
  },
  {
    id: "retrait-consentement",
    number: 6,
    title: "Comment retirer ou modifier votre consentement ?",
    blocks: [
      {
        type: "p",
        text: "Le panneau ci-dessous indique votre réponse actuelle sur Google Analytics et permet d'en changer d'un clic, à tout moment. Le changement prend effet immédiatement : en cas de retrait, les cookies _ga déjà déposés sont effacés dans la foulée, sans que vous ayez à recharger la page.",
      },
      {
        type: "p",
        text: "Les compteurs internes de la section 4.1 ne comportent pas de bouton de refus, et c'est volontaire : il n'y aurait rien à refuser. Ils ne conservent aucune donnée vous concernant, donc rien qui puisse être retiré, consulté ou supprimé — un droit d'opposition supposerait qu'il existe quelque part une trace de vous, ce qui n'est pas le cas.",
      },
      {
        type: "p",
        text: "Pour exercer vos droits sur les données personnelles que nous détenons par ailleurs (inscription à la newsletter, échanges avec le support), écrivez à dpo@linqfolio.com.",
      },
    ],
  },
  {
    id: "mise-a-jour",
    number: 7,
    title: "Mise à jour",
    blocks: [
      {
        type: "p",
        text: "Dernière mise à jour : 5 septembre 2026. Nous adapterons cette politique si nos traitements ou les cookies utilisés évoluent.",
      },
    ],
  },
];

export const COOKIES_EFFECTIVE_DATE_EN = "September 5, 2026";

export const COOKIES_SECTIONS_EN: CookiesSection[] = [
  {
    id: "qui-sommes-nous",
    number: 1,
    title: "Who we are",
    blocks: [
      {
        type: "p",
        text: "The website linqfolio.com is published by LINQFOLIO SAS, a company registered in France (full details in the legal notice). This policy explains how we use cookies and similar technologies when you visit this marketing website and its forms (newsletter).",
      },
    ],
  },
  {
    id: "definition",
    number: 2,
    title: "What is a \"cookie\"?",
    blocks: [
      {
        type: "p",
        text: "A cookie is a small text file placed on your device (computer, smartphone, tablet) when you visit a website. Cookies let us recognize your browser, remember preferences, or (when you agree to it) measure audience traffic and marketing campaigns to a limited extent.",
      },
      {
        type: "p",
        text: "We also use browser local storage (localStorage) for certain interface preferences that are not HTTP cookies but have a comparable effect on your device.",
      },
    ],
  },
  {
    id: "traceurs",
    number: 3,
    title: "What trackers do we use?",
    blocks: [
      {
        type: "p",
        text: "Summary table of what gets written to your device. Our internal audience counters do not appear here: they write nothing at all, no cookie and no storage key. They are described in the next section.",
      },
      {
        type: "table",
        headers: ["Name", "Type", "Purpose", "Basis / consent", "Duration"],
        rows: [
          [
            "linqfolio-consent",
            "localStorage",
            "Remember your answer to the banner (essential to the consent mechanism itself).",
            "Exempt from consent: without it, we could not remember that you declined.",
            "6 months, then we ask again",
          ],
          [
            "linqfolio-lang",
            "localStorage",
            "Remember the language you picked (French or English) with the site's switcher.",
            "Exempt: a display preference you expressed yourself.",
            "Persistent",
          ],
          [
            "linqfolio-theme",
            "localStorage",
            "Remember the light or dark theme you picked with the site's switcher.",
            "Exempt: a display preference you expressed yourself.",
            "Persistent",
          ],
          [
            "_ga",
            "HTTP cookie (Google Analytics 4)",
            "Tell visitors apart, so a returning visit can be recognised and traffic sources measured, printed QR code campaigns included.",
            "Consent (the banner's \"Accept\" button). Not set before you agree, nor if you decline.",
            "13 months",
          ],
          [
            "_ga_<measurement ID>",
            "HTTP cookie (Google Analytics 4)",
            "Keep the state of the current session (start, duration, pages visited in sequence).",
            "Consent (the banner's \"Accept\" button). Not set before you agree, nor if you decline.",
            "13 months",
          ],
        ],
      },
    ],
  },
  {
    id: "mesure-audience",
    number: 4,
    title: "How we measure traffic",
    blocks: [
      {
        type: "p",
        text: "We measure traffic in two ways, which fall under different legal regimes and do not see the same things. The first works for everyone because it keeps nothing about you; the second waits for your agreement because it does keep something.",
      },
      {
        type: "h3",
        text: "4.1 Internal counters — no cookie, no consent",
      },
      {
        type: "p",
        text: "Every page view increments counters hosted on our own infrastructure, in Ireland. These counters hold nothing but additions: one row per day and per indicator, a number inside it. \"412 home pages viewed today\", \"31 clicks to the App Store\", \"18 banner refusals\".",
      },
      {
        type: "check",
        items: [
          "No cookie, no local storage key, nothing is written to your device.",
          "No identifier: not for a visitor, not for a session, not a browser fingerprint.",
          "No IP address kept. Yours reaches our server, as it does for any web request, and is used only to limit automated replays; this mechanism neither writes nor logs it.",
          "No individual row: nowhere does a record of your visit exist, only a total your visit added one to.",
          "No transmission to a third party. The counters stay on our servers.",
          "No cross-site tracking: the system knows nothing but linqfolio.com.",
        ],
      },
      {
        type: "p",
        text: "That set of conditions is exactly the one the CNIL requires for audience measurement exempt from consent: a single purpose, strictly anonymous results, a scope limited to the publisher alone, no cross-referencing. The result is not anonymised after the fact — it is anonymous from the moment it is written, since there were only ever numbers.",
      },
      {
        type: "p",
        text: "What this lets us know is deliberately poor: totals. How many visits, which pages, what share of our readers declines the banner, which printed materials bring people in. Never a journey, never a profile, never a returning visit.",
      },
      {
        type: "h3",
        text: "4.2 Google Analytics 4 — only after you agree",
      },
      {
        type: "p",
        text: "Google Analytics gives us what counters cannot: the sequence of gestures within a single visit. Which section holds attention, where on the page people give up, how many arguments they read before clicking through to an app store.",
      },
      {
        type: "p",
        text: "That tool requires cookies and processing by a third party. The CNIL does not grant it the exemption described above: it is therefore neither loaded, nor executed, nor contacted until you click \"Accept\". Before you answer and after a refusal, your browser makes no contact with Google at all.",
      },
      {
        type: "p",
        text: "If you accept, the _ga and _ga_<measurement ID> cookies are set and data is processed by Google Ireland Limited acting as a processor, with IP address anonymization. We enable neither advertising signals, nor ad personalization, nor sharing with Google's advertising products: those settings stay denied at all times, including after you accept.",
      },
      {
        type: "h3",
        text: "Why two systems rather than one",
      },
      {
        type: "p",
        text: "Because one alone would lie. If we only measured the people who accepted, every figure would describe a fraction of our audience without our knowing which one. The internal counters give the real volume and the refusal rate; Google Analytics gives the detail on those who accepted it. Setting the second against the first is how we know what the second is worth.",
      },
    ],
  },
  {
    id: "newsletter",
    number: 5,
    title: "Newsletter",
    blocks: [
      {
        type: "p",
        text: "Signing up for the newsletter requires your email address and a separate consent checkbox, distinct from the cookie banner. Data is processed in accordance with the privacy policy.",
      },
      {
        type: "p",
        text: "The form uses no cookie. The page language and the form's location are recorded with your request, so that we write to you in the right language.",
      },
    ],
  },
  {
    id: "retrait-consentement",
    number: 6,
    title: "How to withdraw or change your consent",
    blocks: [
      {
        type: "p",
        text: "The panel below shows your current answer on Google Analytics and lets you change it in one click, at any time. The change takes effect immediately: if you withdraw, the _ga cookies already set are cleared straight away, with no need to reload the page.",
      },
      {
        type: "p",
        text: "The internal counters in section 4.1 come with no decline button, and that is deliberate: there would be nothing to decline. They keep no data about you, so there is nothing to withdraw, access, or erase — a right to object would presuppose that a trace of you exists somewhere, and it does not.",
      },
      {
        type: "p",
        text: "To exercise your rights over the personal data we do hold (newsletter sign-up, exchanges with support), write to dpo@linqfolio.com.",
      },
    ],
  },
  {
    id: "mise-a-jour",
    number: 7,
    title: "Update",
    blocks: [
      {
        type: "p",
        text: "Last updated: September 5, 2026. We will update this policy if our processing activities or the cookies we use change.",
      },
    ],
  },
];
