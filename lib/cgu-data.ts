export type CguBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "check"; items: string[] };

export type CguArticle = {
  id: string;
  number: number;
  title: string;
  blocks: CguBlock[];
};

export const CGU_EFFECTIVE_DATE_FR = "10 mai 2026";

export const CGU_ARTICLES_FR: CguArticle[] = [
  {
    id: "objet",
    number: 1,
    title: "Objet et présentation de la société",
    blocks: [
      {
        type: "p",
        text: "Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») ont pour objet de définir les conditions d'accès et d'utilisation de la plateforme LinQfolio (ci-après la « Plateforme »), exploitée par la société LINQFOLIO SAS, société par actions simplifiée au capital de 3 000 euros (€), constituée le 6 janvier 2026 par acte sous seing privé, immatriculée au RCS de Paris sous le numéro 102 625 183, dont le siège social est situé au 142 rue de Rivoli, 75001 Paris.",
      },
      {
        type: "list",
        items: [
          "SIRET : 10262518300011",
          "TVA intracommunautaire : FR83102625183",
          "Email : support@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "Conformément à son objet social, LINQFOLIO conçoit, développe et exploite des solutions numériques destinées à la mise en relation de lecteurs et au partage de contenus culturels et littéraires.",
      },
      {
        type: "p",
        text: "La Plateforme LinQfolio est un réseau social littéraire permettant de créer un profil, publier avis, critiques et listes, suivre d'autres lecteurs et interagir.",
      },
    ],
  },
  {
    id: "acceptation",
    number: 2,
    title: "Acceptation des CGU",
    blocks: [
      {
        type: "p",
        text: "L'accès à la Plateforme et son utilisation sont subordonnés à l'acceptation complète et sans réserve des présentes CGU.",
      },
      {
        type: "p",
        text: "Lors de la création d'un compte, l'Utilisateur reconnaît avoir pris connaissance des CGU et les accepte en cochant la case prévue à cet effet (« J'accepte les CGU »). En cas de désaccord, l'Utilisateur doit s'abstenir d'utiliser la Plateforme.",
      },
      { type: "h3", text: "Modifications des CGU" },
      {
        type: "list",
        items: [
          "LINQFOLIO se réserve le droit de modifier les CGU pour les adapter aux évolutions légales, techniques ou fonctionnelles.",
          "Les modifications substantielles feront l'objet d'une information préalable raisonnable (email, notification in-app).",
          "L'utilisation postérieure à l'entrée en vigueur vaut acceptation.",
        ],
      },
      {
        type: "p",
        text: "Les présentes CGU constituent un contrat électronique au sens de l'article 1127-1 du Code civil. L'acceptation des CGU par voie électronique a la même valeur juridique qu'une signature manuscrite. L'Utilisateur reconnaît que l'acceptation des CGU emporte son adhésion pleine et entière à l'ensemble de leurs stipulations, sans exception ni réserve.",
      },
    ],
  },
  {
    id: "acces",
    number: 3,
    title: "Conditions d'accès au service",
    blocks: [
      { type: "h3", text: "3.1 Âge et capacité" },
      {
        type: "p",
        text: "L'utilisation de la Plateforme est réservée aux personnes physiques âgées d'au moins 16 ans. Si la loi du pays de résidence de l'Utilisateur prévoit un âge minimum supérieur, cet âge s'applique.",
      },
      {
        type: "p",
        text: "La création d'un compte par une personne de moins de 16 ans est interdite. LINQFOLIO se réserve le droit de suspendre puis de clôturer, après information de l'Utilisateur, tout compte dont il apparaît que le titulaire n'a pas atteint cet âge, et de supprimer les données associées dans les conditions prévues par la Politique de Confidentialité.",
      },
      {
        type: "p",
        text: "L'Utilisateur qui constate la présence sur la Plateforme d'un compte détenu par une personne de moins de 16 ans est invité à le signaler au moyen de la fonction de signalement de compte prévue à cet effet, ou à l'adresse support@linqfolio.com.",
      },
      { type: "h3", text: "3.2 Disponibilité géographique" },
      {
        type: "p",
        text: "La Plateforme est disponible en France et dans l'Union Européenne. LINQFOLIO ne garantit pas la disponibilité, la conformité ou le support de la Plateforme en dehors de ces territoires. L'accès depuis des pays tiers se fait sous la seule responsabilité de l'Utilisateur, dans le respect des lois locales applicables.",
      },
      { type: "h3", text: "3.3 Modèle freemium" },
      {
        type: "p",
        text: "L'inscription et les fonctionnalités principales de la Plateforme sont gratuites. Aucune transaction payante n'est disponible au lancement.",
      },
      {
        type: "p",
        text: "LINQFOLIO se réserve le droit d'introduire à l'avenir des fonctionnalités payantes ou des abonnements premium. Le cas échéant, les Utilisateurs en seront informés au préalable par email ou notification in-app, avec un délai raisonnable avant la mise en œuvre. L'accès aux fonctionnalités payantes sera toujours soumis à un consentement explicite de l'Utilisateur.",
      },
    ],
  },
  {
    id: "compte",
    number: 4,
    title: "Création et gestion du compte",
    blocks: [
      { type: "h3", text: "4.1 Inscription" },
      {
        type: "p",
        text: "Pour utiliser la Plateforme, l'Utilisateur doit créer un compte en fournissant des informations exactes, complètes et à jour (email valide, identifiant, mot de passe). L'Utilisateur s'engage à maintenir ces informations à jour. Les informations manifestement fausses ou trompeuses peuvent entraîner la suppression du compte.",
      },
      { type: "h3", text: "4.2 Authentification" },
      {
        type: "p",
        text: "L'inscription peut s'effectuer par la création d'un compte avec email et mot de passe. LINQFOLIO pourra proposer à l'avenir des méthodes d'authentification complémentaires, telles que la connexion via des fournisseurs tiers (OAuth / connexion sociale, par exemple Google, Apple, etc.). L'utilisation de ces méthodes sera soumise aux conditions d'utilisation des fournisseurs concernés.",
      },
      { type: "h3", text: "4.3 Sécurité du compte" },
      {
        type: "p",
        text: "L'Utilisateur est seul responsable de la confidentialité de ses identifiants et de toutes les activités réalisées via son compte. Il doit signaler immédiatement tout accès non autorisé à support@linqfolio.com. LINQFOLIO décline toute responsabilité en cas de perte ou d'usurpation de compte due à une négligence de l'Utilisateur.",
      },
      { type: "h3", text: "4.4 Restriction et suspension" },
      {
        type: "p",
        text: "LinQfolio peut refuser, suspendre ou supprimer un compte sans préavis en cas de violation grave des CGU, activité suspecte, ou motif légitime (sécurité, inactivité prolongée).",
      },
    ],
  },
  {
    id: "contenus",
    number: 5,
    title: "Contenus et usages interdits",
    blocks: [
      { type: "h3", text: "5.1 Contenus autorisés" },
      {
        type: "p",
        text: "L'Utilisateur peut publier des contenus liés à l'univers littéraire : avis, critiques, notes, listes de livres, commentaires, photos de livres ou d'espaces de lecture.",
      },
      { type: "h3", text: "5.2 Usages strictement interdits" },
      { type: "p", text: "L'Utilisateur s'engage à ne pas publier de contenu :" },
      {
        type: "list",
        items: [
          "contraire aux lois et règlements en vigueur (incitation à la haine, violence, discrimination, harcèlement, apologie de crimes, etc.) ;",
          "portant atteinte aux droits de tiers (droit d'auteur, marques, droit à l'image, vie privée, diffamation, injure) ;",
          "promouvant ou facilitant la contrefaçon et le piratage d'œuvres (diffusion non autorisée d'extraits substantiels, partage de fichiers ebooks piratés) ;",
          "assimilable à du spam ou à des pratiques de manipulation (faux avis, faux comptes, automates, sollicitations commerciales non autorisées).",
        ],
      },
      { type: "h3", text: "5.3 Modération et signalements" },
      {
        type: "p",
        text: "LINQFOLIO peut, sans obligation générale de surveillance, retirer tout contenu illicite signalé ou suspendre/supprimer un compte en cas de violation grave ou répétée. Les signalements se font via le bouton dédié ou à l'adresse support@linqfolio.com.",
      },
      { type: "h3", text: "5.4 Responsabilité de l'Utilisateur" },
      {
        type: "p",
        text: "L'Utilisateur est seul responsable des contenus qu'il publie sur la Plateforme. Il garantit LINQFOLIO contre toute réclamation, action ou recours de tiers résultant de la publication de ses contenus. L'Utilisateur s'engage à indemniser LINQFOLIO de tout préjudice subi et à prendre en charge tous les frais, dommages et intérêts, y compris les honoraires d'avocat, résultant d'une violation des présentes CGU.",
      },
    ],
  },
  {
    id: "propriete",
    number: 6,
    title: "Propriété intellectuelle",
    blocks: [
      { type: "h3", text: "6.1 Droits de l'Utilisateur" },
      {
        type: "p",
        text: "L'Utilisateur conserve l'intégralité de ses droits sur les contenus qu'il crée et publie.",
      },
      { type: "h3", text: "6.2 Licence accordée à LINQFOLIO" },
      {
        type: "p",
        text: "En publiant, l'Utilisateur concède à LINQFOLIO une licence non exclusive, mondiale et gratuite pour héberger, reproduire, afficher, adapter (formats techniques), indexer et archiver ses contenus afin d'exploiter la Plateforme pendant leur mise en ligne. La licence cesse pour chaque contenu retiré par l'Utilisateur ou à la suppression du compte, sous réserve des durées légales de conservation ou des mentions prévues dans la Politique de Confidentialité pour les contenus rendus anonymes ou nécessaires à la défense de LINQFOLIO.",
      },
      { type: "h3", text: "6.3 Propriété de LINQFOLIO" },
      {
        type: "p",
        text: "La Plateforme, ses marques, logos, algorithmes et contenus éditoriaux sont la propriété exclusive de LINQFOLIO. Toute reproduction ou usage non autorisé est interdit.",
      },
    ],
  },
  {
    id: "donnees",
    number: 7,
    title: "Données personnelles et cookies",
    blocks: [
      {
        type: "p",
        text: "Le traitement des données personnelles est régi par la Politique de Confidentialité accessible sur la Plateforme, conforme au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 dite « Informatique et Libertés ».",
      },
      {
        type: "p",
        text: "Conformément aux articles 15 à 22 du RGPD, l'Utilisateur dispose des droits suivants sur ses données personnelles, qu'il peut exercer auprès de dpo@linqfolio.com :",
      },
      {
        type: "check",
        items: [
          "Droit d'accès à vos données (Art. 15)",
          "Droit de rectification (Art. 16)",
          "Droit à l'effacement / droit à l'oubli (Art. 17)",
          "Droit à la limitation du traitement (Art. 18)",
          "Droit à la portabilité des données (Art. 20)",
          "Droit d'opposition (Art. 21)",
          "Droit de ne pas faire l'objet d'une décision automatisée (Art. 22)",
        ],
      },
      {
        type: "p",
        text: "En cas de difficulté dans l'exercice de vos droits, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      },
    ],
  },
  {
    id: "responsabilite",
    number: 8,
    title: "Responsabilité de LINQFOLIO",
    blocks: [
      { type: "h3", text: "8.1 Services « en l'état »" },
      {
        type: "p",
        text: "La Plateforme est fournie « en l'état » et « selon disponibilité », sans garantie d'absence d'erreurs, d'interruptions ou de compatibilité parfaite.",
      },
      { type: "h3", text: "8.2 Non-responsabilité sur les contenus tiers" },
      {
        type: "p",
        text: "En qualité d'hébergeur (LCEN), LINQFOLIO n'est pas responsable des contenus publiés par les Utilisateurs (avis inexacts, offensants, illégaux). L'Utilisateur utilise la Plateforme à ses risques et périls.",
      },
      { type: "h3", text: "8.3 Limitation de responsabilité" },
      {
        type: "p",
        text: "LINQFOLIO ne pourra être tenue responsable que des dommages directs, certains et prévisibles qui lui sont exclusivement imputables. Sont exclus :",
      },
      {
        type: "list",
        items: [
          "les dommages indirects ou immatériels (perte de chance, de profits, de données, préjudice moral) ;",
          "les dysfonctionnements dus à un usage défaillant de l'Utilisateur ou à du matériel tiers.",
        ],
      },
      { type: "h3", text: "8.4 Force majeure" },
      {
        type: "p",
        text: "LINQFOLIO ne saurait être tenue responsable de l'inexécution totale ou partielle de ses obligations au titre des présentes CGU si cette inexécution est imputable à un cas de force majeure au sens de l'article 1218 du Code civil, notamment en cas de catastrophe naturelle, incendie, défaillance des réseaux de télécommunication, panne d'électricité, guerre, grève, pandémie, ou toute autre circonstance indépendante de la volonté de LINQFOLIO.",
      },
    ],
  },
  {
    id: "resiliation",
    number: 9,
    title: "Suspension, résiliation et fermeture de compte",
    blocks: [
      { type: "h3", text: "9.1 Par l'Utilisateur" },
      {
        type: "p",
        text: "L'Utilisateur peut fermer son compte via les paramètres. Les contenus publics (avis anonymisés) peuvent être conservés pour raisons légales.",
      },
      { type: "h3", text: "9.2 Par LINQFOLIO" },
      {
        type: "p",
        text: "LINQFOLIO peut suspendre ou supprimer un compte sans préavis en cas de violation grave des CGU ou pour motifs légitimes (sécurité, inactivité supérieure à 24 mois).",
      },
      { type: "h3", text: "9.3 Conséquences" },
      {
        type: "p",
        text: "Après suppression, l'accès à la Plateforme est définitivement fermé. Les données seront supprimées selon le calendrier décrit dans la Politique de Confidentialité (délai de 30 jours).",
      },
    ],
  },
  {
    id: "liens",
    number: 10,
    title: "Liens externes et services tiers",
    blocks: [
      {
        type: "p",
        text: "Pour l'instant, LINQFOLIO ne prend pas en charge les liens externes vers des services tiers.",
      },
    ],
  },
  {
    id: "duree",
    number: 11,
    title: "Durée et modifications des services",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO peut modifier, améliorer ou interrompre les services (maintenance, évolutions, nouvelles fonctionnalités) avec une information préalable raisonnable.",
      },
      {
        type: "p",
        text: "Les modifications substantielles seront annoncées par email, notification in-app ou bannière sur la Plateforme, avec un délai de préavis raisonnable avant leur entrée en vigueur (en routine, au moins sept jours calendaires, sauf obligation légale ou mesure de sécurité urgente nécessitant un délai plus court).",
      },
      {
        type: "p",
        text: "En cas de désaccord avec des modifications majeures qui vous concernent, vous pouvez résilier votre compte avant la date d'effet selon les options prévues dans l'application ou sur demande au support.",
      },
    ],
  },
  {
    id: "litiges",
    number: 12,
    title: "Droit applicable et litiges",
    blocks: [
      { type: "h3", text: "12.1 Droit applicable" },
      {
        type: "p",
        text: "Les présentes CGU sont régies par le droit français. Elles sont également soumises aux dispositions du Règlement (UE) 2022/2065 du 19 octobre 2022 relatif à un marché unique des services numériques (« Digital Services Act » ou « DSA »).",
      },
      { type: "h3", text: "12.2 Juridiction compétente" },
      {
        type: "p",
        text: "Tout litige sera soumis aux tribunaux compétents du ressort de la Cour d'appel de Paris, nonobstant pluralité de défendeurs ou appel en garantie, sauf compétence exclusive ou règles applicables aux consommateurs.",
      },
      { type: "h3", text: "12.3 Médiation" },
      {
        type: "p",
        text: "Conformément aux articles L. 611-1 et suivants du Code de la consommation, l'Utilisateur consommateur peut, après tentative préalable de résolution avec LINQFOLIO, recourir gratuitement à la médiation de la consommation. Les coordonnées du médiateur de la consommation désigné, ainsi que les modalités de saisine, sont ou seront publiées dans les mentions légales et conservées à jour tant que LINQFOLIO relève du champ d'application pertinent du Code de la consommation. À titre complémentaire, une réclamation peut être déposée sur la plateforme européenne de règlement en ligne des litiges (ec.europa.eu/consumers/odr).",
      },
      { type: "h3", text: "12.4 Tentative de règlement amiable" },
      {
        type: "p",
        text: "Avant toute action en justice, les parties s'engagent à tenter une résolution amiable en adressant une réclamation écrite à support@linqfolio.com.",
      },
    ],
  },
  {
    id: "contact",
    number: 13,
    title: "Contacts et support",
    blocks: [
      {
        type: "p",
        text: "Pour toute question, demande ou réclamation relative aux présentes CGU, notre équipe est disponible à l'adresse support@linqfolio.com. Indiquez en objet le thème de votre message (par exemple « CGU, question générale », « CGU, réclamation » ou « Support technique ») pour accélérer le traitement. Vous recevez en général un accusé ou une première réponse sous deux jours ouvrés pour les demandes courantes.",
      },
      {
        type: "p",
        text: "Pour les données personnelles et les droits RGPD, écrivez à dpo@linqfolio.com. Voir la Politique de Confidentialité pour le détail des traitements.",
      },
    ],
  },
];

export const CGU_EFFECTIVE_DATE_EN = "May 10, 2026";

export const CGU_ARTICLES_EN: CguArticle[] = [
  {
    id: "objet",
    number: 1,
    title: "Purpose and company information",
    blocks: [
      {
        type: "p",
        text: "The purpose of these Terms of Use (the \"Terms\") is to set out the conditions under which the LinQfolio platform (the \"Platform\") may be accessed and used. The Platform is operated by LINQFOLIO SAS, a French simplified joint-stock company (société par actions simplifiée) with share capital of €3,000, formed on January 6, 2026 by private deed, registered with the Paris Trade and Companies Register (RCS) under number 102 625 183, with its registered office at 142 rue de Rivoli, 75001 Paris.",
      },
      {
        type: "list",
        items: [
          "SIRET: 10262518300011",
          "Intra-Community VAT number: FR83102625183",
          "Email: support@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "In line with its corporate purpose, LINQFOLIO designs, develops, and operates digital solutions for connecting readers with one another and sharing cultural and literary content.",
      },
      {
        type: "p",
        text: "The LinQfolio Platform is a literary social network that lets you create a profile, post reviews, critiques, and lists, follow other readers, and interact with them.",
      },
    ],
  },
  {
    id: "acceptation",
    number: 2,
    title: "Acceptance of the Terms",
    blocks: [
      {
        type: "p",
        text: "Access to and use of the Platform are conditioned on full, unreserved acceptance of these Terms.",
      },
      {
        type: "p",
        text: "When creating an account, the User confirms having read the Terms and accepts them by checking the box provided for that purpose (\"I accept the Terms of Use\"). If the User does not agree, they must refrain from using the Platform.",
      },
      { type: "h3", text: "Changes to the Terms" },
      {
        type: "list",
        items: [
          "LINQFOLIO reserves the right to amend the Terms to reflect legal, technical, or functional changes.",
          "Material changes will be announced with reasonable advance notice (email, in-app notification).",
          "Continued use of the Platform after a change takes effect constitutes acceptance of that change.",
        ],
      },
      {
        type: "p",
        text: "These Terms constitute an electronic contract within the meaning of article 1127-1 of the French Civil Code. Accepting the Terms electronically carries the same legal weight as a handwritten signature. By accepting the Terms, the User acknowledges that they are agreeing fully and unconditionally to all of their provisions, without exception or reservation.",
      },
    ],
  },
  {
    id: "acces",
    number: 3,
    title: "Conditions of access to the service",
    blocks: [
      { type: "h3", text: "3.1 Age and legal capacity" },
      {
        type: "p",
        text: "Use of the Platform is reserved for individuals aged at least 16. Where the law of the User's country of residence sets a higher minimum age, that higher age applies.",
      },
      {
        type: "p",
        text: "A person under 16 may not create an account. LINQFOLIO reserves the right to suspend and then close, after notifying the User, any account whose holder appears not to have reached this age, and to delete the associated data under the conditions set out in the Privacy Policy.",
      },
      {
        type: "p",
        text: "A User who becomes aware of an account on the Platform held by a person under 16 is encouraged to report it using the account-reporting feature provided for that purpose, or by writing to support@linqfolio.com.",
      },
      { type: "h3", text: "3.2 Geographic availability" },
      {
        type: "p",
        text: "The Platform is available in France and the European Union. LINQFOLIO does not guarantee the availability, compliance, or support of the Platform outside these territories. Access from other countries is at the User's sole responsibility, and the User must comply with the local laws that apply.",
      },
      { type: "h3", text: "3.3 Freemium model" },
      {
        type: "p",
        text: "Registration and the Platform's core features are free of charge. No paid transactions are available at launch.",
      },
      {
        type: "p",
        text: "LINQFOLIO reserves the right to introduce paid features or premium subscriptions in the future. Should this happen, Users will be informed beforehand by email or in-app notification, with reasonable notice before the change takes effect. Access to any paid feature will always require the User's explicit consent.",
      },
    ],
  },
  {
    id: "compte",
    number: 4,
    title: "Creating and managing your account",
    blocks: [
      { type: "h3", text: "4.1 Registration" },
      {
        type: "p",
        text: "To use the Platform, the User must create an account by providing accurate, complete, and up-to-date information (a valid email address, a username, and a password). The User agrees to keep this information up to date. Information that is clearly false or misleading may result in the account being deleted.",
      },
      { type: "h3", text: "4.2 Authentication" },
      {
        type: "p",
        text: "Registration can be completed by creating an account with an email address and password. LINQFOLIO may offer additional authentication methods in the future, such as signing in through third-party providers (OAuth / social sign-in, for example Google or Apple). Use of these methods will be subject to the terms of use of the relevant providers.",
      },
      { type: "h3", text: "4.3 Account security" },
      {
        type: "p",
        text: "The User is solely responsible for keeping their login credentials confidential and for all activity carried out through their account. They must report any unauthorized access to support@linqfolio.com immediately. LINQFOLIO accepts no liability for the loss or takeover of an account resulting from the User's negligence.",
      },
      { type: "h3", text: "4.4 Restriction and suspension" },
      {
        type: "p",
        text: "LinQfolio may refuse, suspend, or delete an account without notice in the event of a serious breach of the Terms, suspicious activity, or another legitimate reason (security, prolonged inactivity).",
      },
    ],
  },
  {
    id: "contenus",
    number: 5,
    title: "Content and prohibited uses",
    blocks: [
      { type: "h3", text: "5.1 Permitted content" },
      {
        type: "p",
        text: "The User may post content related to the world of books and reading: reviews, critiques, ratings, book lists, comments, and photos of books or reading spaces.",
      },
      { type: "h3", text: "5.2 Strictly prohibited uses" },
      { type: "p", text: "The User agrees not to post content that:" },
      {
        type: "list",
        items: [
          "violates applicable laws and regulations (incitement to hatred, violence, discrimination, or harassment, glorification of crime, etc.);",
          "infringes the rights of third parties (copyright, trademarks, right to one's image, privacy, defamation, insult);",
          "promotes or facilitates the counterfeiting or piracy of works (unauthorized distribution of substantial excerpts, sharing of pirated ebook files);",
          "amounts to spam or manipulative practices (fake reviews, fake accounts, bots, unauthorized commercial solicitation).",
        ],
      },
      { type: "h3", text: "5.3 Moderation and reporting" },
      {
        type: "p",
        text: "LINQFOLIO may, without any general obligation to monitor content, remove any unlawful content that is reported, or suspend or delete an account in the event of a serious or repeated breach. Reports can be made using the dedicated button or by writing to support@linqfolio.com.",
      },
      { type: "h3", text: "5.4 User responsibility" },
      {
        type: "p",
        text: "The User is solely responsible for the content they post on the Platform. The User indemnifies LINQFOLIO against any claim, action, or proceeding brought by a third party arising from the content they post. The User agrees to compensate LINQFOLIO for any loss suffered and to cover all costs, damages, and expenses, including attorneys' fees, arising from a breach of these Terms.",
      },
    ],
  },
  {
    id: "propriete",
    number: 6,
    title: "Intellectual property",
    blocks: [
      { type: "h3", text: "6.1 The User's rights" },
      {
        type: "p",
        text: "The User retains all of their rights in the content they create and post.",
      },
      { type: "h3", text: "6.2 License granted to LINQFOLIO" },
      {
        type: "p",
        text: "By posting content, the User grants LINQFOLIO a non-exclusive, worldwide, royalty-free license to host, reproduce, display, adapt (for technical formats), index, and archive that content in order to operate the Platform for as long as it remains online. This license ends for each piece of content the User removes, or when the account is deleted, subject to statutory retention periods or the provisions of the Privacy Policy for content that has been anonymized or that is needed for LINQFOLIO's defense.",
      },
      { type: "h3", text: "6.3 LINQFOLIO's property" },
      {
        type: "p",
        text: "The Platform and its trademarks, logos, algorithms, and editorial content are the exclusive property of LINQFOLIO. Any unauthorized reproduction or use is prohibited.",
      },
    ],
  },
  {
    id: "donnees",
    number: 7,
    title: "Personal data and cookies",
    blocks: [
      {
        type: "p",
        text: "The processing of personal data is governed by the Privacy Policy available on the Platform, in compliance with Regulation (EU) 2016/679 of April 27, 2016 (GDPR) and French law no. 78-17 of January 6, 1978 on data processing, data files, and civil liberties (\"Informatique et Libertés\").",
      },
      {
        type: "p",
        text: "Under articles 15 to 22 of the GDPR, the User has the following rights over their personal data, which they can exercise by writing to dpo@linqfolio.com:",
      },
      {
        type: "check",
        items: [
          "Right of access to your data (Art. 15)",
          "Right to rectification (Art. 16)",
          "Right to erasure / \"right to be forgotten\" (Art. 17)",
          "Right to restriction of processing (Art. 18)",
          "Right to data portability (Art. 20)",
          "Right to object (Art. 21)",
          "Right not to be subject to an automated decision (Art. 22)",
        ],
      },
      {
        type: "p",
        text: "If you have difficulty exercising your rights, you may file a complaint with the CNIL (www.cnil.fr), the French data protection authority.",
      },
    ],
  },
  {
    id: "responsabilite",
    number: 8,
    title: "LINQFOLIO's liability",
    blocks: [
      { type: "h3", text: "8.1 Services provided \"as is\"" },
      {
        type: "p",
        text: "The Platform is provided \"as is\" and \"as available,\" with no guarantee that it will be free of errors or interruptions, or perfectly compatible with every device.",
      },
      { type: "h3", text: "8.2 No liability for third-party content" },
      {
        type: "p",
        text: "As a hosting provider within the meaning of the French Digital Economy Act (LCEN), LINQFOLIO is not responsible for content posted by Users (inaccurate, offensive, or unlawful reviews). The User uses the Platform at their own risk.",
      },
      { type: "h3", text: "8.3 Limitation of liability" },
      {
        type: "p",
        text: "LINQFOLIO can only be held liable for direct, certain, and foreseeable damages that are exclusively attributable to it. The following are excluded:",
      },
      {
        type: "list",
        items: [
          "indirect or non-material damages (loss of opportunity, loss of profits, loss of data, emotional distress);",
          "malfunctions caused by the User's improper use or by third-party equipment.",
        ],
      },
      { type: "h3", text: "8.4 Force majeure" },
      {
        type: "p",
        text: "LINQFOLIO cannot be held liable for the total or partial failure to perform its obligations under these Terms where that failure results from a force majeure event within the meaning of article 1218 of the French Civil Code, including natural disaster, fire, telecommunications network failure, power outage, war, strike, pandemic, or any other circumstance beyond LINQFOLIO's control.",
      },
    ],
  },
  {
    id: "resiliation",
    number: 9,
    title: "Suspension, termination, and account closure",
    blocks: [
      { type: "h3", text: "9.1 By the User" },
      {
        type: "p",
        text: "The User can close their account from the settings. Public content (anonymized reviews) may be retained for legal reasons.",
      },
      { type: "h3", text: "9.2 By LINQFOLIO" },
      {
        type: "p",
        text: "LINQFOLIO may suspend or delete an account without notice in the event of a serious breach of the Terms or for legitimate reasons (security, inactivity exceeding 24 months).",
      },
      { type: "h3", text: "9.3 Consequences" },
      {
        type: "p",
        text: "Once an account is deleted, access to the Platform is permanently closed. Data will be deleted according to the schedule described in the Privacy Policy (a 30-day period).",
      },
    ],
  },
  {
    id: "liens",
    number: 10,
    title: "External links and third-party services",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO does not currently support external links to third-party services.",
      },
    ],
  },
  {
    id: "duree",
    number: 11,
    title: "Duration and changes to the services",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO may modify, improve, or discontinue the services (maintenance, updates, new features) with reasonable advance notice.",
      },
      {
        type: "p",
        text: "Material changes will be announced by email, in-app notification, or a banner on the Platform, with reasonable notice before they take effect (ordinarily at least seven calendar days, except where a legal obligation or an urgent security measure requires a shorter period).",
      },
      {
        type: "p",
        text: "If you disagree with a major change that affects you, you can close your account before the change takes effect, using the options available in the app or by contacting support.",
      },
    ],
  },
  {
    id: "litiges",
    number: 12,
    title: "Governing law and disputes",
    blocks: [
      { type: "h3", text: "12.1 Governing law" },
      {
        type: "p",
        text: "These Terms are governed by French law. They are also subject to Regulation (EU) 2022/2065 of October 19, 2022 on a Single Market For Digital Services (the \"Digital Services Act\" or \"DSA\").",
      },
      { type: "h3", text: "12.2 Competent courts" },
      {
        type: "p",
        text: "Any dispute will be submitted to the courts with jurisdiction over the Paris Court of Appeal, regardless of multiple defendants or third-party proceedings, except where exclusive jurisdiction or consumer-protection rules apply.",
      },
      { type: "h3", text: "12.3 Mediation" },
      {
        type: "p",
        text: "Under articles L. 611-1 et seq. of the French Consumer Code, a consumer User may, after first attempting to resolve the matter with LINQFOLIO, refer the dispute free of charge to consumer mediation. The contact details of the designated consumer mediator, along with how to refer a dispute, are or will be published in the legal notice and kept up to date for as long as LINQFOLIO falls within the relevant scope of the French Consumer Code. In addition, a complaint may be filed on the European Union's online dispute resolution platform (ec.europa.eu/consumers/odr).",
      },
      { type: "h3", text: "12.4 Attempt at amicable settlement" },
      {
        type: "p",
        text: "Before taking any legal action, the parties agree to attempt an amicable resolution by sending a written complaint to support@linqfolio.com.",
      },
    ],
  },
  {
    id: "contact",
    number: 13,
    title: "Contact and support",
    blocks: [
      {
        type: "p",
        text: "For any question, request, or complaint relating to these Terms, our team is available at support@linqfolio.com. Please state the topic of your message in the subject line (for example \"Terms, general question,\" \"Terms, complaint,\" or \"Technical support\") to help us handle it faster. You will generally receive an acknowledgment or an initial reply within two business days for routine requests.",
      },
      {
        type: "p",
        text: "For personal data and GDPR rights, write to dpo@linqfolio.com. See the Privacy Policy for details of our data processing.",
      },
    ],
  },
];
