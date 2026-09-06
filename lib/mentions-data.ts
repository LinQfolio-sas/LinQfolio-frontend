export type MentionsBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "check"; items: string[] };

export type MentionsSection = {
  id: string;
  number: number;
  title: string;
  blocks: MentionsBlock[];
};

export const MENTIONS_EFFECTIVE_DATE_FR = "10 mai 2026";

export const MENTIONS_SECTIONS_FR: MentionsSection[] = [
  {
    id: "identification",
    number: 1,
    title: "Identification du responsable du site",
    blocks: [
      {
        type: "p",
        text: "Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, nous vous informons des éléments suivants.",
      },
      { type: "h3", text: "Responsable de publication" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS, Société par Actions Simplifiée (SAS)",
          "Siège social : 142 rue de Rivoli, 75001 Paris, France",
          "Date de constitution : 6 janvier 2026 (par acte sous seing privé)",
          "Capital social : 3 000 €",
          "RCS : Paris 102 625 183",
          "SIRET : 10262518300011",
          "TVA intracommunautaire : FR83102625183",
          "Email : support@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "Objet social : conception, développement et exploitation de solutions numériques, notamment d'applications mobiles et de plateformes en ligne permettant la mise en relation d'utilisateurs pour l'achat, la vente, l'échange ou le partage d'ouvrages et de produits culturels ; la fourniture de services de communication et d'animation de communautés d'utilisateurs ; la promotion et la commercialisation de contenus culturels et littéraires sur tout support.",
      },
      { type: "h3", text: "Responsable éditorial et responsable technique" },
      {
        type: "p",
        text: "LINQFOLIO SAS. Contact : support@linqfolio.com",
      },
    ],
  },
  {
    id: "directeur-publication",
    number: 2,
    title: "Directeur de la publication",
    blocks: [
      {
        type: "p",
        text: "Le directeur de la publication est responsable de l'ensemble du contenu édité sur la Plateforme LinQfolio.",
      },
      { type: "h3", text: "Coordonnées du directeur de la publication" },
      {
        type: "list",
        items: [
          "Le Président de LINQFOLIO SAS",
          "142 rue de Rivoli, 75001 Paris, France",
          "support@linqfolio.com",
        ],
      },
    ],
  },
  {
    id: "hebergement",
    number: 3,
    title: "Hébergement",
    blocks: [
      {
        type: "p",
        text: "La Plateforme LinQfolio est hébergée par le prestataire suivant.",
      },
      { type: "h3", text: "Hébergeur principal" },
      {
        type: "list",
        items: [
          "Amazon Web Services (AWS)",
          "Amazon Web Services EMEA SARL (succursale française)",
          "31 Place des Corolles, Tour Carpe Diem, 92400 Courbevoie, France",
          "Site web : aws.amazon.com",
        ],
      },
      { type: "h3", text: "Localisation et disponibilité" },
      {
        type: "p",
        text: "Les serveurs sont localisés dans l'Union Européenne (région AWS eu-west-1, Irlande), conformément à la politique de protection des données de LINQFOLIO et au RGPD. LINQFOLIO bénéficie des SLA (Service Level Agreements) et des garanties de disponibilité d'AWS.",
      },
      { type: "h3", text: "Délai d'intervention" },
      {
        type: "p",
        text: "En cas de problème technique, le délai d'intervention moyen est de 48 heures. LINQFOLIO s'efforce de traiter les problèmes critiques plus rapidement.",
      },
    ],
  },
  {
    id: "propriete-intellectuelle",
    number: 4,
    title: "Propriété intellectuelle",
    blocks: [
      {
        type: "p",
        text: "L'ensemble des éléments composant la Plateforme LinQfolio, y compris à titre non limitatif les textes, images, vidéos, logos, marques, signalétique et ergonomie, sont la propriété exclusive de LINQFOLIO SAS ou de ses prestataires.",
      },
      { type: "h3", text: "4.1 Droits de LINQFOLIO" },
      {
        type: "list",
        items: [
          "Marques : la dénomination « LINQFOLIO » et les logos associés sont des marques protégées. Toute reproduction ou utilisation non autorisée est interdite.",
          "Contenu éditorial : les textes, articles et contenus éditoriaux sont protégés par le droit d'auteur.",
          "Logiciels et code : la Plateforme et ses algorithmes sont protégés par des droits de propriété intellectuelle.",
          "Design et ergonomie : l'interface et le design graphique sont protégés.",
        ],
      },
      { type: "h3", text: "4.2 Droits des utilisateurs" },
      {
        type: "p",
        text: "Les utilisateurs conservent l'intégralité de leurs droits sur les contenus qu'ils publient. Pour plus d'informations, consulter la section propriété intellectuelle des CGU.",
      },
      { type: "h3", text: "4.3 Limitations d'utilisation" },
      {
        type: "p",
        text: "Sans l'autorisation préalable écrite de LINQFOLIO, il est strictement interdit de :",
      },
      {
        type: "list",
        items: [
          "Reproduire, modifier ou distribuer le contenu de la Plateforme",
          "Copier ou scraper les données de la Plateforme",
          "Utiliser les marques ou logos de LINQFOLIO",
          "Créer des œuvres dérivées",
          "Revendre ou monétiser le contenu",
        ],
      },
    ],
  },
  {
    id: "responsabilite",
    number: 5,
    title: "Responsabilité et limitations",
    blocks: [
      { type: "h3", text: "5.1 Limitation de responsabilité" },
      {
        type: "p",
        text: "LINQFOLIO est fournie « en l'état » sans garantie. LINQFOLIO SAS ne peut être tenue responsable de :",
      },
      {
        type: "list",
        items: [
          "Les interruptions ou dysfonctionnements techniques",
          "Les erreurs ou imprécisions du contenu",
          "Les dommages directs, indirects ou immatériels",
          "Les pertes de données ou d'accès",
          "Les contenus publiés par les utilisateurs",
        ],
      },
      { type: "h3", text: "5.2 Non-responsabilité sur les contenus tiers" },
      {
        type: "p",
        text: "En tant qu'hébergeur au sens de la Loi pour la Confiance dans l'Économie Numérique (LCEN), LINQFOLIO n'est pas responsable des contenus illicites publiés par les utilisateurs, à condition qu'elle en soit informée et qu'elle agisse rapidement pour les retirer.",
      },
      { type: "h3", text: "5.3 Accès à la Plateforme" },
      {
        type: "p",
        text: "LINQFOLIO SAS se réserve le droit de suspendre ou d'interrompre l'accès à la Plateforme à tout moment pour maintenance, mise à jour ou motifs légaux.",
      },
      { type: "h3", text: "5.4 Obligations au titre du DSA" },
      {
        type: "p",
        text: "Conformément au Règlement (UE) 2022/2065 (Digital Services Act), LINQFOLIO met en place des mécanismes permettant à tout utilisateur ou tiers de signaler la présence de contenus illicites. LINQFOLIO traite ces signalements de manière diligente, non arbitraire et objective, et informe le notifiant de sa décision dans un délai raisonnable. Les décisions de modération sont motivées et peuvent faire l'objet d'un recours interne.",
      },
    ],
  },
  {
    id: "conditions-utilisation",
    number: 6,
    title: "Conditions d'utilisation",
    blocks: [
      {
        type: "p",
        text: "L'utilisation de la Plateforme LinQfolio est soumise aux Conditions Générales d'Utilisation que vous acceptez lors de votre inscription.",
      },
      { type: "h3", text: "6.1 Règles comportementales" },
      {
        type: "p",
        text: "Les utilisateurs s'engagent à :",
      },
      {
        type: "check",
        items: [
          "Respecter les lois et régulations applicables",
          "Ne pas publier de contenu illégal ou offensant",
          "Ne pas violer les droits de tiers",
          "Ne pas harceler ou menacer d'autres utilisateurs",
          "Ne pas utiliser de faux comptes ou usurpation d'identité",
        ],
      },
      { type: "h3", text: "6.2 Suspension de compte" },
      {
        type: "p",
        text: "LINQFOLIO SAS peut suspendre ou supprimer tout compte en cas de violation des règles. Consultez les CGU pour les détails.",
      },
    ],
  },
  {
    id: "donnees-personnelles",
    number: 7,
    title: "Données personnelles et confidentialité",
    blocks: [
      {
        type: "p",
        text: "Le traitement de vos données personnelles est régi par la Politique de Confidentialité, conforme au RGPD et à la loi Informatique et Libertés.",
      },
      { type: "h3", text: "7.1 Vos droits" },
      {
        type: "p",
        text: "Vous disposez notamment d'un droit d'accès, de rectification, d'effacement et de portabilité sur vos données, ainsi que des droits prévus par le RGPD selon les situations. Pour exercer vos droits : dpo@linqfolio.com (prioritaire pour les demandes formalisées RGPD) ou support@linqfolio.com pour l'orientation et le support général. Détails dans la Politique de Confidentialité.",
      },
      { type: "h3", text: "7.2 Cookies" },
      {
        type: "p",
        text: "La Plateforme et le site marketing peuvent utiliser des cookies strictement nécessaires et, sous consentement, des traceurs complémentaires décrits dans la Politique cookies et la Politique de Confidentialité.",
      },
    ],
  },
  {
    id: "signalement",
    number: 8,
    title: "Signalement de contenus illicites",
    blocks: [
      {
        type: "p",
        text: "Conformément à la Loi pour la Confiance dans l'Économie Numérique (LCEN), les utilisateurs peuvent signaler tout contenu illégal ou non conforme.",
      },
      { type: "h3", text: "8.1 Procédure de signalement" },
      {
        type: "p",
        text: "Pour signaler un contenu illicite, vous pouvez :",
      },
      {
        type: "list",
        items: [
          "Utiliser le bouton de signalement disponible sur chaque publication",
          "Envoyer un email à support@linqfolio.com avec le sujet « Signalement contenu illicite »",
        ],
      },
      { type: "h3", text: "8.2 Traitement des signalements" },
      {
        type: "p",
        text: "LINQFOLIO s'engage à examiner les signalements dans les 48 heures et à retirer tout contenu manifestement illégal dans les meilleurs délais.",
      },
      { type: "h3", text: "8.3 Types de contenu signalables" },
      {
        type: "list",
        items: [
          "Contenus incitant à la violence ou discrimination",
          "Harcèlement ou menaces",
          "Exploitation ou abus d'enfants",
          "Contrefaçon ou violation de droits d'auteur",
          "Escroquerie ou fraude",
          "Contenu à caractère sexuel explicite non consenti",
        ],
      },
    ],
  },
  {
    id: "droit-applicable",
    number: 9,
    title: "Droit applicable et compétence",
    blocks: [
      { type: "h3", text: "9.1 Droit applicable" },
      {
        type: "p",
        text: "Les présentes Mentions Légales et l'utilisation de la Plateforme sont régies par le droit français, indépendamment des conflits de lois.",
      },
      { type: "h3", text: "9.2 Juridiction compétente" },
      {
        type: "p",
        text: "Tout litige relatif à la Plateforme ou aux présentes Mentions Légales sera soumis à la compétence exclusive des tribunaux de Paris, sauf en cas de compétence exclusive d'une autre juridiction.",
      },
      { type: "h3", text: "9.3 Résolution amiable" },
      {
        type: "p",
        text: "Avant d'engager une action en justice, les parties s'engagent à tenter une résolution amiable en contactant LINQFOLIO à support@linqfolio.com.",
      },
    ],
  },
  {
    id: "modification",
    number: 10,
    title: "Modification des mentions légales",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO SAS se réserve le droit de modifier les présentes Mentions Légales à tout moment pour tenir compte des évolutions légales, techniques ou organisationnelles.",
      },
      { type: "h3", text: "10.1 Notification des modifications" },
      {
        type: "list",
        items: [
          "Les modifications seront publiées sur cette page",
          "Les modifications substantielles seront annoncées par email ou notification in-app lorsque pertinent",
          "Un délai de préavis raisonnable sera observé (en routine, au moins sept jours calendaires avant effet), sauf obligation légale ou mesure urgente de sécurité",
          "La date de dernière mise à jour est indiquée en bas de page",
        ],
      },
      { type: "h3", text: "10.2 Acceptation" },
      {
        type: "p",
        text: "Votre utilisation continue de la Plateforme après la publication des modifications constitue votre acceptation des nouvelles Mentions Légales.",
      },
    ],
  },
  {
    id: "contact",
    number: 11,
    title: "Contact et support",
    blocks: [
      { type: "h3", text: "Service client" },
      {
        type: "p",
        text: "Pour toute question ou assistance : support@linqfolio.com. Accusé ou première réponse en général sous deux jours ouvrés pour les demandes courantes.",
      },
      { type: "h3", text: "Médiation de la consommation" },
      {
        type: "p",
        text: "Les utilisateurs auxquels s'applique le Code de la consommation peuvent saisir un médiateur de la consommation conformément aux CGU. Les coordonnées du médiateur désigné et les modalités de saisine figurent ou figureront dans la présente rubrique dès lors que LINQFOLIO aura procédé à la désignation formelle requise ; à défaut de publication à une date donnée, une demande d'information peut être adressée à support@linqfolio.com.",
      },
      { type: "h3", text: "Adresse postale" },
      {
        type: "p",
        text: "LINQFOLIO SAS, 142 rue de Rivoli, 75001 Paris, France.",
      },
    ],
  },
  {
    id: "conformite",
    number: 12,
    title: "Conformité légale et réglementations",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO SAS respecte les réglementations suivantes.",
      },
      { type: "h3", text: "12.1 Lois applicables" },
      {
        type: "list",
        items: [
          "LCEN : loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique",
          "RGPD : règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016",
          "Loi Informatique et Libertés : loi n° 78-17 du 6 janvier 1978",
          "DSA : règlement (UE) 2022/2065 du Parlement européen et du Conseil du 19 octobre 2022 relatif à un marché unique des services numériques (Digital Services Act)",
          "Droit d'auteur : Code de la propriété intellectuelle",
        ],
      },
      { type: "h3", text: "12.2 Engagements" },
      {
        type: "p",
        text: "LINQFOLIO s'engage à :",
      },
      {
        type: "check",
        items: [
          "Protéger les données personnelles conformément au RGPD",
          "Respecter la liberté d'expression et l'anonymat raisonnable",
          "Lutter contre le contenu illégal et le harcèlement",
          "Fournir des outils de modération efficaces",
          "Assurer la transparence des modérations et suppressions conformément au DSA",
          "Mettre à disposition un point de contact unique pour les autorités des États membres, la Commission européenne et le Comité européen des services numériques (art. 11 DSA)",
        ],
      },
    ],
  },
  {
    id: "documents-connexes",
    number: 13,
    title: "Documents connexes",
    blocks: [
      {
        type: "p",
        text: "Pour une compréhension complète de votre utilisation de la Plateforme, veuillez consulter les documents suivants.",
      },
      {
        type: "list",
        items: [
          "Conditions Générales d'Utilisation : règles d'accès et d'utilisation de la Plateforme (/cgu)",
          "Politique de Confidentialité : gestion et protection de vos données personnelles (/confidentialite)",
          "Politique cookies : traceurs déposés sur le site marketing (/cookies)",
        ],
      },
    ],
  },
];

export const MENTIONS_EFFECTIVE_DATE_EN = "May 10, 2026";

export const MENTIONS_SECTIONS_EN: MentionsSection[] = [
  {
    id: "identification",
    number: 1,
    title: "Identification of the Site Publisher",
    blocks: [
      {
        type: "p",
        text: "In accordance with French Law No. 2004-575 of June 21, 2004, for confidence in the digital economy (the “Loi pour la Confiance dans l'Économie Numérique,” or LCEN), we provide the following information.",
      },
      { type: "h3", text: "Publisher" },
      {
        type: "list",
        items: [
          "LINQFOLIO SAS, a French simplified joint-stock company (Société par Actions Simplifiée, SAS)",
          "Registered office: 142 rue de Rivoli, 75001 Paris, France",
          "Date of incorporation: January 6, 2026 (by private deed)",
          "Share capital: €3,000",
          "Trade and Companies Register (RCS): Paris 102 625 183",
          "SIRET number: 10262518300011",
          "Intra-EU VAT number: FR83102625183",
          "Email: support@linqfolio.com",
        ],
      },
      {
        type: "p",
        text: "Corporate purpose: the design, development, and operation of digital solutions, in particular mobile applications and online platforms that connect users for the purchase, sale, exchange, or sharing of books and cultural goods; the provision of communication services and community management for users; and the promotion and marketing of cultural and literary content in any format.",
      },
      { type: "h3", text: "Editorial and Technical Manager" },
      {
        type: "p",
        text: "LINQFOLIO SAS. Contact: support@linqfolio.com",
      },
    ],
  },
  {
    id: "directeur-publication",
    number: 2,
    title: "Publication Director",
    blocks: [
      {
        type: "p",
        text: "The publication director is responsible for all content published on the LinQfolio Platform.",
      },
      { type: "h3", text: "Publication Director Contact Information" },
      {
        type: "list",
        items: [
          "The President of LINQFOLIO SAS",
          "142 rue de Rivoli, 75001 Paris, France",
          "support@linqfolio.com",
        ],
      },
    ],
  },
  {
    id: "hebergement",
    number: 3,
    title: "Hosting",
    blocks: [
      {
        type: "p",
        text: "The LinQfolio Platform is hosted by the following provider.",
      },
      { type: "h3", text: "Primary Hosting Provider" },
      {
        type: "list",
        items: [
          "Amazon Web Services (AWS)",
          "Amazon Web Services EMEA SARL (French branch)",
          "31 Place des Corolles, Tour Carpe Diem, 92400 Courbevoie, France",
          "Website: aws.amazon.com",
        ],
      },
      { type: "h3", text: "Location and Availability" },
      {
        type: "p",
        text: "Servers are located within the European Union (AWS region eu-west-1, Ireland), in accordance with LINQFOLIO's data protection policy and the GDPR. LINQFOLIO benefits from AWS's Service Level Agreements (SLAs) and availability guarantees.",
      },
      { type: "h3", text: "Response Time" },
      {
        type: "p",
        text: "In the event of a technical issue, the average response time is 48 hours. LINQFOLIO strives to address critical issues more quickly.",
      },
    ],
  },
  {
    id: "propriete-intellectuelle",
    number: 4,
    title: "Intellectual Property",
    blocks: [
      {
        type: "p",
        text: "All elements comprising the LinQfolio Platform, including without limitation text, images, videos, logos, trademarks, signage, and user interface design, are the exclusive property of LINQFOLIO SAS or its service providers.",
      },
      { type: "h3", text: "4.1 LINQFOLIO's Rights" },
      {
        type: "list",
        items: [
          "Trademarks: the name “LINQFOLIO” and its associated logos are protected trademarks. Any unauthorized reproduction or use is prohibited.",
          "Editorial content: text, articles, and editorial content are protected by copyright.",
          "Software and code: the Platform and its algorithms are protected by intellectual property rights.",
          "Design and user experience: the interface and graphic design are protected.",
        ],
      },
      { type: "h3", text: "4.2 Users' Rights" },
      {
        type: "p",
        text: "Users retain full ownership of the rights to the content they publish. For more information, see the intellectual property section of the Terms of Use.",
      },
      { type: "h3", text: "4.3 Usage Restrictions" },
      {
        type: "p",
        text: "Without LINQFOLIO's prior written authorization, it is strictly prohibited to:",
      },
      {
        type: "list",
        items: [
          "Reproduce, modify, or distribute the Platform's content",
          "Copy or scrape data from the Platform",
          "Use LINQFOLIO's trademarks or logos",
          "Create derivative works",
          "Resell or monetize the content",
        ],
      },
    ],
  },
  {
    id: "responsabilite",
    number: 5,
    title: "Liability and Limitations",
    blocks: [
      { type: "h3", text: "5.1 Limitation of Liability" },
      {
        type: "p",
        text: "LINQFOLIO is provided “as is” without warranty. LINQFOLIO SAS cannot be held liable for:",
      },
      {
        type: "list",
        items: [
          "Interruptions or technical malfunctions",
          "Errors or inaccuracies in content",
          "Direct, indirect, or intangible damages",
          "Loss of data or access",
          "Content published by users",
        ],
      },
      { type: "h3", text: "5.2 No Liability for Third-Party Content" },
      {
        type: "p",
        text: "As a hosting provider within the meaning of the French Law for Confidence in the Digital Economy (LCEN), LINQFOLIO is not liable for unlawful content posted by users, provided that it is notified of such content and acts promptly to remove it.",
      },
      { type: "h3", text: "5.3 Access to the Platform" },
      {
        type: "p",
        text: "LINQFOLIO SAS reserves the right to suspend or interrupt access to the Platform at any time for maintenance, updates, or legal reasons.",
      },
      { type: "h3", text: "5.4 Obligations under the DSA" },
      {
        type: "p",
        text: "In accordance with Regulation (EU) 2022/2065 (the Digital Services Act), LINQFOLIO has implemented mechanisms allowing any user or third party to report the presence of unlawful content. LINQFOLIO handles these reports diligently, in a non-arbitrary and objective manner, and informs the person who submitted the report of its decision within a reasonable time. Moderation decisions include a statement of reasons and may be appealed through LINQFOLIO's internal complaint-handling process.",
      },
    ],
  },
  {
    id: "conditions-utilisation",
    number: 6,
    title: "Terms of Use",
    blocks: [
      {
        type: "p",
        text: "Use of the LinQfolio Platform is subject to the Terms of Use, which you accept when you register.",
      },
      { type: "h3", text: "6.1 Rules of Conduct" },
      {
        type: "p",
        text: "Users agree to:",
      },
      {
        type: "check",
        items: [
          "Comply with applicable laws and regulations",
          "Not post illegal or offensive content",
          "Not infringe the rights of third parties",
          "Not harass or threaten other users",
          "Not use fake accounts or impersonate others",
        ],
      },
      { type: "h3", text: "6.2 Account Suspension" },
      {
        type: "p",
        text: "LINQFOLIO SAS may suspend or delete any account that violates these rules. See the Terms of Use for details.",
      },
    ],
  },
  {
    id: "donnees-personnelles",
    number: 7,
    title: "Personal Data and Privacy",
    blocks: [
      {
        type: "p",
        text: "The processing of your personal data is governed by the Privacy Policy, which complies with the GDPR and the French Data Protection Act (loi Informatique et Libertés).",
      },
      { type: "h3", text: "7.1 Your Rights" },
      {
        type: "p",
        text: "You have, among others, the right to access, rectify, erase, and port your data, as well as the other rights provided under the GDPR depending on your situation. To exercise your rights: dpo@linqfolio.com (preferred for formal GDPR requests) or support@linqfolio.com for general guidance and support. See the Privacy Policy for details.",
      },
      { type: "h3", text: "7.2 Cookies" },
      {
        type: "p",
        text: "The Platform and the marketing website may use strictly necessary cookies and, with your consent, additional trackers described in the Cookie Policy and the Privacy Policy.",
      },
    ],
  },
  {
    id: "signalement",
    number: 8,
    title: "Reporting Unlawful Content",
    blocks: [
      {
        type: "p",
        text: "In accordance with the French Law for Confidence in the Digital Economy (LCEN), users may report any illegal or non-compliant content.",
      },
      { type: "h3", text: "8.1 Reporting Procedure" },
      {
        type: "p",
        text: "To report unlawful content, you can:",
      },
      {
        type: "list",
        items: [
          "Use the report button available on each post",
          "Send an email to support@linqfolio.com with the subject line “Unlawful content report”",
        ],
      },
      { type: "h3", text: "8.2 Handling of Reports" },
      {
        type: "p",
        text: "LINQFOLIO undertakes to review reports within 48 hours and to remove any manifestly illegal content as promptly as possible.",
      },
      { type: "h3", text: "8.3 Types of Content That Can Be Reported" },
      {
        type: "list",
        items: [
          "Content inciting violence or discrimination",
          "Harassment or threats",
          "Child exploitation or abuse",
          "Counterfeiting or copyright infringement",
          "Scams or fraud",
          "Non-consensual sexually explicit content",
        ],
      },
    ],
  },
  {
    id: "droit-applicable",
    number: 9,
    title: "Governing Law and Jurisdiction",
    blocks: [
      { type: "h3", text: "9.1 Governing Law" },
      {
        type: "p",
        text: "This Legal Notice and the use of the Platform are governed by French law, regardless of conflict-of-law principles.",
      },
      { type: "h3", text: "9.2 Competent Jurisdiction" },
      {
        type: "p",
        text: "Any dispute relating to the Platform or to this Legal Notice shall be subject to the exclusive jurisdiction of the courts of Paris, except where another court has exclusive jurisdiction.",
      },
      { type: "h3", text: "9.3 Amicable Resolution" },
      {
        type: "p",
        text: "Before initiating legal proceedings, the parties agree to attempt an amicable resolution by contacting LINQFOLIO at support@linqfolio.com.",
      },
    ],
  },
  {
    id: "modification",
    number: 10,
    title: "Changes to This Legal Notice",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO SAS reserves the right to modify this Legal Notice at any time to reflect legal, technical, or organizational changes.",
      },
      { type: "h3", text: "10.1 Notice of Changes" },
      {
        type: "list",
        items: [
          "Changes will be published on this page",
          "Material changes will be announced by email or in-app notification when relevant",
          "A reasonable notice period will be observed (as a rule, at least seven calendar days before taking effect), except where required by law or in the case of an urgent security measure",
          "The date of the last update is shown at the bottom of the page",
        ],
      },
      { type: "h3", text: "10.2 Acceptance" },
      {
        type: "p",
        text: "Your continued use of the Platform after changes are published constitutes your acceptance of the revised Legal Notice.",
      },
    ],
  },
  {
    id: "contact",
    number: 11,
    title: "Contact and Support",
    blocks: [
      { type: "h3", text: "Customer Service" },
      {
        type: "p",
        text: "For any question or assistance: support@linqfolio.com. You can generally expect an acknowledgment or initial response within two business days for routine requests.",
      },
      { type: "h3", text: "Consumer Mediation" },
      {
        type: "p",
        text: "Users to whom the French Consumer Code applies may refer a dispute to a consumer mediator in accordance with the Terms of Use. The designated mediator's contact details and the procedure for referring a dispute will appear in this section once LINQFOLIO has completed the required formal designation; if this information is not yet published at a given time, a request for information may be sent to support@linqfolio.com.",
      },
      { type: "h3", text: "Mailing Address" },
      {
        type: "p",
        text: "LINQFOLIO SAS, 142 rue de Rivoli, 75001 Paris, France.",
      },
    ],
  },
  {
    id: "conformite",
    number: 12,
    title: "Legal Compliance and Regulations",
    blocks: [
      {
        type: "p",
        text: "LINQFOLIO SAS complies with the following regulations.",
      },
      { type: "h3", text: "12.1 Applicable Laws" },
      {
        type: "list",
        items: [
          "LCEN: French Law No. 2004-575 of June 21, 2004, for confidence in the digital economy",
          "GDPR: Regulation (EU) 2016/679 of the European Parliament and of the Council of April 27, 2016",
          "French Data Protection Act (Loi Informatique et Libertés): Law No. 78-17 of January 6, 1978",
          "DSA: Regulation (EU) 2022/2065 of the European Parliament and of the Council of October 19, 2022, on a single market for digital services (Digital Services Act)",
          "Copyright: French Intellectual Property Code",
        ],
      },
      { type: "h3", text: "12.2 Commitments" },
      {
        type: "p",
        text: "LINQFOLIO is committed to:",
      },
      {
        type: "check",
        items: [
          "Protecting personal data in accordance with the GDPR",
          "Respecting freedom of expression and reasonable anonymity",
          "Combating illegal content and harassment",
          "Providing effective moderation tools",
          "Ensuring transparency of moderation and removal decisions in accordance with the DSA",
          "Providing a single point of contact for Member State authorities, the European Commission, and the European Board for Digital Services (Article 11 DSA)",
        ],
      },
    ],
  },
  {
    id: "documents-connexes",
    number: 13,
    title: "Related Documents",
    blocks: [
      {
        type: "p",
        text: "For a complete understanding of your use of the Platform, please review the following documents.",
      },
      {
        type: "list",
        items: [
          "Terms of Use: rules for accessing and using the Platform (/cgu)",
          "Privacy Policy: how we manage and protect your personal data (/confidentialite)",
          "Cookie Policy: trackers placed on the marketing website (/cookies)",
        ],
      },
    ],
  },
];
