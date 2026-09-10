import { Newsreader, IBM_Plex_Sans, Caveat } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import Telemetry from "@/components/Telemetry";
import { ConsentProvider } from "@/lib/analytics/ConsentContext";
import { ANALYTICS_ENABLED } from "@/lib/analytics/config";
import { CONSENT_INIT_SCRIPT } from "@/lib/analytics/consent-script";
import { LanguageProvider, type Lang } from "@/lib/i18n/LanguageContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { THEME_INIT_SCRIPT } from "@/lib/theme/theme-script";
import type { ReactNode } from "react";

/**
 * Le document, partagé par les deux arborescences.
 *
 * Le site a deux layouts racine — `app/(fr)` et `app/en` — parce que chacun
 * doit poser son propre `<html lang>` dans le HTML servi, ce qu'un layout
 * unique ne peut pas faire. Tout ce qui ne dépend pas de la langue vit donc
 * ici plutôt que d'être écrit deux fois.
 *
 * Les polices sont instanciées dans ce module, une seule fois : les déclarer
 * dans chaque layout produirait deux jeux de variables CSS pour les mêmes
 * fichiers.
 */

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

export default function SiteShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang === "fr" ? "fr-FR" : "en"}
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
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider lang={lang}>
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
