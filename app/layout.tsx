import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Sans, Caveat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import ConsentBanner from "@/components/ConsentBanner";
import Telemetry from "@/components/Telemetry";
import { ConsentProvider } from "@/lib/analytics/ConsentContext";
import { ANALYTICS_ENABLED } from "@/lib/analytics/config";
import { CONSENT_INIT_SCRIPT } from "@/lib/analytics/consent-script";
import { SITE_URL } from "@/lib/links";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { THEME_INIT_SCRIPT } from "@/lib/theme/theme-script";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Base absolue pour les images Open Graph, sinon Next retombe sur localhost.
  metadataBase: new URL(SITE_URL),
  title: "LinQfolio · le réseau social des lecteurs et lectrices",
  description:
    "LinQfolio est le fil social où l'on annote ses passages préférés, suit ses amis chapitre après chapitre et referme rarement un livre seul·e.",
  openGraph: {
    title: "LinQfolio · le réseau social des lecteurs et lectrices",
    description:
      "LinQfolio est le fil social où l'on annote ses passages préférés, suit ses amis chapitre après chapitre et referme rarement un livre seul·e.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

/** Teinte la barre d'adresse mobile avec le fond de page du thème actif. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffefc" },
    { media: "(prefers-color-scheme: dark)", color: "#16111f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${plexSans.variable} ${caveat.variable} h-full antialiased`}
      // Le script inline ci-dessous modifie `data-theme` avant l'hydratation :
      // React doit accepter le DOM plutôt que son propre rendu.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Amorce Google Analytics si, et seulement si, l'accord a déjà été
            donné. Le <head> est analysé en premier : l'état de consentement
            est donc dans `dataLayer` avant que gtag.js ne démarre, ce que
            React ne pourrait pas garantir. Sans accord, ce script ne crée même
            pas `window.gtag`, et la mesure reste inerte. */}
        {ANALYTICS_ENABLED ? (
          <script dangerouslySetInnerHTML={{ __html: CONSENT_INIT_SCRIPT }} />
        ) : null}
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {/* Le consentement enveloppe la mesure, pas l'inverse : sans
                accord, `Telemetry` n'observe rien et aucun script tiers
                n'est injecté. La bannière est rendue en dernier pour rester
                le dernier arrêt du parcours au clavier. */}
            <ConsentProvider>
              {children}
              <Telemetry />
              <ConsentBanner />
            </ConsentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
