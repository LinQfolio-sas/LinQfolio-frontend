export type FaqCategoryId =
  | "general"
  | "compte"
  | "bibliotheque"
  | "reading-dna"
  | "communaute"
  | "confidentialite"
  | "site";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
};

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const FAQ_CATEGORIES_FR: FaqCategory[] = [
  { id: "general", label: "Général" },
  { id: "compte", label: "Compte" },
  { id: "bibliotheque", label: "Livres & bibliothèque" },
  { id: "reading-dna", label: "Reading DNA" },
  { id: "communaute", label: "Communauté & échanges" },
  { id: "confidentialite", label: "Confidentialité" },
  { id: "site", label: "Site linqfolio.com" },
];

export const FAQ_CATEGORIES_EN: FaqCategory[] = [
  { id: "general", label: "General" },
  { id: "compte", label: "Account" },
  { id: "bibliotheque", label: "Books & library" },
  { id: "reading-dna", label: "Reading DNA" },
  { id: "communaute", label: "Community & swaps" },
  { id: "confidentialite", label: "Privacy" },
  { id: "site", label: "linqfolio.com website" },
];

export const FAQ_ITEMS_FR: FaqItem[] = [
  // Général
  {
    id: "general-1",
    category: "general",
    question: "Qu’est-ce que LinQfolio ?",
    answer:
      "LinQfolio est une application de réseau social littéraire : profils de lecteurs, ajout rapide par scan ISBN, avis, Reading DNA, clubs de lecture, messagerie et propositions d’échange entre lecteurs.",
  },
  {
    id: "general-2",
    category: "general",
    question: "Sur quelles plateformes utiliser LinQfolio ?",
    answer:
      "LinQfolio est disponible sur iOS et Android via les stores officiels. Le site linqfolio.com présente le produit ; l’expérience principale est pensée sur mobile.",
  },
  {
    id: "general-3",
    category: "general",
    question: "Comment fonctionne l’échange de livres ?",
    answer:
      "Vous proposez des livres depuis votre bibliothèque personnelle, parcourez les annonces des autres lecteurs et utilisez la messagerie pour convenir d’un échange. LinQfolio facilite la mise en relation ; l’envoi ou la remise en main propre dépend de votre accord.",
  },

  // Compte
  {
    id: "compte-1",
    category: "compte",
    question: "Comment réinitialiser mon mot de passe ?",
    answer:
      "Dans l’application : Paramètres > Sécurité, puis l’option de réinitialisation. Vous recevrez un e-mail de confirmation. Sur l’écran de connexion, utilisez aussi « Mot de passe oublié ».",
  },
  {
    id: "compte-2",
    category: "compte",
    question: "Comment modifier mon profil ?",
    answer:
      "Ouvrez votre profil, appuyez sur Modifier le profil, puis mettez à jour votre photo, nom affiché, bio et liens.",
  },
  {
    id: "compte-3",
    category: "compte",
    question: "Comment supprimer mon compte ?",
    answer:
      "Paramètres > Supprimer le compte. Cette action est définitive. Pour toute question sur vos données avant suppression, contactez dpo@linqfolio.com.",
  },
  {
    id: "compte-4",
    category: "compte",
    question: "Je n’arrive plus à me connecter",
    answer:
      "Essayez « Mot de passe oublié ». Si le problème persiste, écrivez à support@linqfolio.com depuis l’adresse liée au compte, avec une description du message d’erreur.",
  },
  {
    id: "compte-5",
    category: "compte",
    question: "Changer la langue ou le mode sombre",
    answer:
      "Dans Paramètres, modifiez la langue d’affichage et activez le mode sombre. Les changements s’appliquent immédiatement dans l’application.",
  },
  {
    id: "compte-6",
    category: "compte",
    question: "Exporter ou gérer mes données personnelles",
    answer:
      "Paramètres > Données : consentements, export de vos données et options associées. La politique de confidentialité détaille vos droits RGPD.",
  },

  // Livres & bibliothèque
  {
    id: "bibliotheque-1",
    category: "bibliotheque",
    question: "Sauvegarder un livre pour plus tard",
    answer:
      "Depuis la fiche d’un livre, ajoutez-le à une liste de lecture ou aux favoris pour le retrouver dans Ma bibliothèque.",
  },
  {
    id: "bibliotheque-2",
    category: "bibliotheque",
    question: "Gérer mes listes de lecture",
    answer:
      "Sur votre profil, section Listes de lecture : créez des listes, ouvrez leur détail et ajoutez des livres depuis les fiches ou l’exploration.",
  },
  {
    id: "bibliotheque-3",
    category: "bibliotheque",
    question: "Publier un avis sur un livre",
    answer:
      "Ouvrez la fiche du livre, appuyez sur Écrire une critique, notez le livre et publiez votre texte.",
  },
  {
    id: "bibliotheque-4",
    category: "bibliotheque",
    question: "Découvrir des livres ou des lecteurs",
    answer:
      "Utilisez l’onglet Explorer pour rechercher des livres et parcourir des suggestions. L’accueil met en avant l’activité de la communauté.",
  },
  {
    id: "bibliotheque-5",
    category: "bibliotheque",
    question: "Suivre ma progression de lecture",
    answer:
      "Depuis la fiche livre, marquez un livre comme possédé ou lu, et indiquez au moment de votre avis si vous l’avez terminé ou abandonné. Ma bibliothèque regroupe vos listes, vos livres possédés et vos livres lus.",
  },

  // Reading DNA
  {
    id: "reading-dna-1",
    category: "reading-dna",
    question: "Qu’est-ce que le Reading DNA ?",
    answer:
      "Le Reading DNA construit votre profil de lecture à partir de vos goûts et explique pourquoi un livre vous correspond.",
  },
  {
    id: "reading-dna-2",
    category: "reading-dna",
    question: "Démarrer le parcours Reading DNA",
    answer:
      "Lancez le parcours depuis l’application : choisissez des livres aimés et rejetés, puis laissez l’analyse se générer.",
  },
  {
    id: "reading-dna-3",
    category: "reading-dna",
    question: "Voir mes scores de compatibilité",
    answer:
      "Consultez les écrans Profil DNA, Scanner DNA et Recommandations DNA pour les matchs et suggestions personnalisées.",
  },
  {
    id: "reading-dna-4",
    category: "reading-dna",
    question: "Mettre à jour mon Reading DNA",
    answer:
      "Vous pouvez relancer le parcours et scanner de nouveaux livres pour affiner vos recommandations.",
  },
  {
    id: "reading-dna-5",
    category: "reading-dna",
    question: "Le scan ISBN ne fonctionne pas",
    answer:
      "Améliorez la lumière et cadrez le code-barres. Sinon, recherchez par titre ou ISBN dans Explorer, ou saisissez l’ISBN manuellement.",
  },

  // Communauté & échanges
  {
    id: "communaute-1",
    category: "communaute",
    question: "Rejoindre ou créer un club de lecture",
    answer:
      "Parcourez les clubs depuis l’accueil ou Explorer, rejoignez un club existant ou lancez le parcours de création.",
  },
  {
    id: "communaute-2",
    category: "communaute",
    question: "Discuter avec d’autres lecteurs",
    answer:
      "Ouvrez la messagerie depuis l’icône en haut de l’application pour démarrer ou suivre vos conversations.",
  },
  {
    id: "communaute-3",
    category: "communaute",
    question: "Signaler un abus ou un comportement suspect",
    answer:
      "Utilisez les actions de signalement dans l’application quand elles sont disponibles, puis contactez support@linqfolio.com pour un suivi.",
  },
  {
    id: "communaute-4",
    category: "communaute",
    question: "Utiliser l’onglet Échanges",
    answer:
      "Dans l’onglet Échanges : parcourez les annonces à proximité, publiez la vôtre et suivez les étapes pour faire ou examiner une offre.",
  },
  {
    id: "communaute-5",
    category: "communaute",
    question: "Suivre un lecteur",
    answer:
      "Ouvrez son profil via la recherche ou un post, puis appuyez sur Suivre. Son activité publique apparaît selon ses réglages de confidentialité.",
  },

  // Confidentialité
  {
    id: "confidentialite-1",
    category: "confidentialite",
    question: "Comment LinQfolio traite-t-il mes données ?",
    answer:
      "Le traitement est décrit dans la politique de confidentialité (RGPD) : finalités, durées, droits d’accès et de suppression. Contact DPO : dpo@linqfolio.com.",
  },
  {
    id: "confidentialite-2",
    category: "confidentialite",
    question: "Cookies sur linqfolio.com",
    answer:
      "Le site utilise des cookies nécessaires et, avec votre accord, des cookies optionnels pour les tests de présentation et la newsletter. Voir la politique cookies.",
  },
  {
    id: "confidentialite-3",
    category: "confidentialite",
    question: "Qui édite LinQfolio ?",
    answer:
      "LINQFOLIO SAS. Coordonnées et hébergeur dans les mentions légales. Support : support@linqfolio.com.",
  },

  // Site linqfolio.com
  {
    id: "site-1",
    category: "site",
    question: "À quoi sert la newsletter du site ?",
    answer:
      "Elle vous informe des actualités LinQfolio (lancement, fonctionnalités). Inscription en bas de page ; désinscription via les liens des e-mails.",
  },
  {
    id: "site-2",
    category: "site",
    question: "Différence entre le site et l’application",
    answer:
      "linqfolio.com présente le produit, la FAQ, les pages légales et la newsletter. L’application mobile concentre bibliothèque, communauté, échanges et messagerie.",
  },
];

export const FAQ_ITEMS_EN: FaqItem[] = [
  // General
  {
    id: "general-1",
    category: "general",
    question: "What is LinQfolio?",
    answer:
      "LinQfolio is a literary social networking app: reader profiles, quick ISBN-scan adding, reviews, Reading DNA, reading clubs, messaging, and book-swap proposals between readers.",
  },
  {
    id: "general-2",
    category: "general",
    question: "Which platforms can I use LinQfolio on?",
    answer:
      "LinQfolio is available on iOS and Android through the official app stores. The linqfolio.com website presents the product; the core experience is designed for mobile.",
  },
  {
    id: "general-3",
    category: "general",
    question: "How does book swapping work?",
    answer:
      "You offer books from your personal library, browse other readers’ listings, and use messaging to arrange a swap. LinQfolio makes the introduction; shipping or handing the book over in person is up to your agreement.",
  },

  // Account
  {
    id: "compte-1",
    category: "compte",
    question: "How do I reset my password?",
    answer:
      "In the app: Settings > Security, then the reset option. You’ll receive a confirmation email. On the sign-in screen, you can also use “Forgot password.”",
  },
  {
    id: "compte-2",
    category: "compte",
    question: "How do I edit my profile?",
    answer:
      "Open your profile, tap Edit profile, then update your photo, display name, bio, and links.",
  },
  {
    id: "compte-3",
    category: "compte",
    question: "How do I delete my account?",
    answer:
      "Settings > Delete account. This action is permanent. For any questions about your data before deleting it, contact dpo@linqfolio.com.",
  },
  {
    id: "compte-4",
    category: "compte",
    question: "I can’t sign in anymore",
    answer:
      "Try “Forgot password.” If the problem persists, email support@linqfolio.com from the address linked to your account, describing the error message.",
  },
  {
    id: "compte-5",
    category: "compte",
    question: "Changing the language or dark mode",
    answer:
      "In Settings, change the display language and turn on dark mode. Changes apply immediately in the app.",
  },
  {
    id: "compte-6",
    category: "compte",
    question: "Exporting or managing my personal data",
    answer:
      "Settings > Data: consents, exporting your data, and related options. The privacy policy details your GDPR rights.",
  },

  // Books & library
  {
    id: "bibliotheque-1",
    category: "bibliotheque",
    question: "Saving a book for later",
    answer:
      "From a book’s page, add it to a reading list or your favorites to find it again in My library.",
  },
  {
    id: "bibliotheque-2",
    category: "bibliotheque",
    question: "Managing my reading lists",
    answer:
      "On your profile, in the Reading lists section: create lists, open their details, and add books from book pages or Explore.",
  },
  {
    id: "bibliotheque-3",
    category: "bibliotheque",
    question: "Posting a review on a book",
    answer:
      "Open the book’s page, tap Write a review, rate the book, and publish your text.",
  },
  {
    id: "bibliotheque-4",
    category: "bibliotheque",
    question: "Discovering books or readers",
    answer:
      "Use the Explore tab to search for books and browse suggestions. The home feed highlights community activity.",
  },
  {
    id: "bibliotheque-5",
    category: "bibliotheque",
    question: "Tracking my reading progress",
    answer:
      "From a book’s page, mark a book as owned or read, and note when writing your review whether you finished it or gave up on it. My library brings together your lists, your owned books, and your read books.",
  },

  // Reading DNA
  {
    id: "reading-dna-1",
    category: "reading-dna",
    question: "What is Reading DNA?",
    answer:
      "Reading DNA builds your reading profile from your tastes and explains why a book is a good match for you.",
  },
  {
    id: "reading-dna-2",
    category: "reading-dna",
    question: "Starting the Reading DNA journey",
    answer:
      "Launch the journey from the app: choose books you loved and books you passed on, then let the analysis run.",
  },
  {
    id: "reading-dna-3",
    category: "reading-dna",
    question: "Viewing my compatibility scores",
    answer:
      "Check the DNA Profile, DNA Scanner, and DNA Recommendations screens for matches and personalized suggestions.",
  },
  {
    id: "reading-dna-4",
    category: "reading-dna",
    question: "Updating my Reading DNA",
    answer:
      "You can restart the journey and scan new books to fine-tune your recommendations.",
  },
  {
    id: "reading-dna-5",
    category: "reading-dna",
    question: "The ISBN scan isn’t working",
    answer:
      "Improve the lighting and frame the barcode properly. Otherwise, search by title or ISBN in Explore, or enter the ISBN manually.",
  },

  // Community & swaps
  {
    id: "communaute-1",
    category: "communaute",
    question: "Joining or creating a reading club",
    answer:
      "Browse clubs from the home feed or Explore, join an existing club, or start the creation flow.",
  },
  {
    id: "communaute-2",
    category: "communaute",
    question: "Chatting with other readers",
    answer:
      "Open messaging from the icon at the top of the app to start or follow your conversations.",
  },
  {
    id: "communaute-3",
    category: "communaute",
    question: "Reporting abuse or suspicious behavior",
    answer:
      "Use the reporting actions in the app when available, then contact support@linqfolio.com for follow-up.",
  },
  {
    id: "communaute-4",
    category: "communaute",
    question: "Using the Swaps tab",
    answer:
      "In the Swaps tab: browse nearby listings, post your own, and follow the steps to make or review an offer.",
  },
  {
    id: "communaute-5",
    category: "communaute",
    question: "Following a reader",
    answer:
      "Open their profile through search or a post, then tap Follow. Their public activity appears according to their privacy settings.",
  },

  // Privacy
  {
    id: "confidentialite-1",
    category: "confidentialite",
    question: "How does LinQfolio handle my data?",
    answer:
      "Processing is described in the privacy policy (GDPR): purposes, retention periods, and rights of access and deletion. DPO contact: dpo@linqfolio.com.",
  },
  {
    id: "confidentialite-2",
    category: "confidentialite",
    question: "Cookies on linqfolio.com",
    answer:
      "The site uses necessary cookies and, with your consent, optional cookies for presentation testing and the newsletter. See the cookie policy.",
  },
  {
    id: "confidentialite-3",
    category: "confidentialite",
    question: "Who publishes LinQfolio?",
    answer:
      "LINQFOLIO SAS. Contact details and host in the legal notice. Support: support@linqfolio.com.",
  },

  // linqfolio.com website
  {
    id: "site-1",
    category: "site",
    question: "What’s the site newsletter for?",
    answer:
      "It keeps you posted on LinQfolio news (launch, features). Sign up at the bottom of the page; unsubscribe via the links in the emails.",
  },
  {
    id: "site-2",
    category: "site",
    question: "Difference between the website and the app",
    answer:
      "linqfolio.com presents the product, the FAQ, the legal pages, and the newsletter. The mobile app brings together library, community, swaps, and messaging.",
  },
];
