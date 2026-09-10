import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/JsonLd";
import SiteShell from "@/components/SiteShell";
import { siteNodes } from "@/lib/schema";
import { SITE_URL } from "@/lib/links";
import { SITE_VERIFICATION } from "@/lib/seo";
import "../globals.css";

/**
 * Racine anglaise, servie sous `/en`.
 *
 * Ces adresses ne sont pas nouvelles : `/en`, `/en/about`, `/en/faq` et
 * `/en/blog` étaient déjà celles de l'ancien site et sont déjà connues des
 * moteurs. Les reprendre à l'identique évite d'avoir à les rediriger, et une
 * redirection évitée vaut toujours mieux qu'une redirection bien faite.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Social network for readers and book swapping · LinQfolio",
    template: "%s · LinQfolio",
  },
  description:
    "Swap books with readers nearby, join a book club and discover your Reading DNA. The social network for book lovers, on iOS and Android.",
  applicationName: "LinQfolio",
  verification: { google: SITE_VERIFICATION },
  openGraph: {
    type: "website",
    siteName: "LinQfolio",
    locale: "en",
    alternateLocale: ["fr_FR"],
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fffefc",
};

export default function EnglishRootLayout({ children }: LayoutProps<"/en">) {
  return (
    <SiteShell lang="en">
      <JsonLd nodes={siteNodes("en")} />
      {children}
    </SiteShell>
  );
}
