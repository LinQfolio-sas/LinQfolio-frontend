/** Clé partagée par le script inline, le contexte React et le sélecteur. */
export const THEME_STORAGE_KEY = "linqfolio-theme";

/**
 * Deux thèmes, pas de troisième état.
 *
 * L'arrivée sur le site se fait toujours en clair : le papier crème est
 * l'identité de LinQfolio, et c'est ce qu'on veut montrer d'abord, même à
 * quelqu'un dont le système est en sombre. Le sélecteur reste là pour passer
 * en sombre, et ce choix-là est retenu.
 */
export type Theme = "light" | "dark";

/** Fonds de page des deux thèmes, repris de `globals.css`. */
export const THEME_PAGE_COLOR = { light: "#fffefc", dark: "#16111f" } as const;

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Aligne la barre d'adresse mobile sur le thème affiché.
 *
 * `viewport.themeColor` du layout ne déclare que le clair, l'état de départ.
 * La spec HTML retient le premier `theme-color` dont le `media` correspond :
 * on insère donc le nôtre en tête de <head> pour passer devant.
 */
export function syncThemeColorMeta(theme: Theme) {
  const head = document.head;
  const existing = head.querySelector<HTMLMetaElement>("meta[data-theme-color]");

  const meta = existing ?? document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("data-theme-color", "");
  meta.setAttribute("content", THEME_PAGE_COLOR[theme]);
  if (!existing) head.insertBefore(meta, head.firstChild);
}

/**
 * Script exécuté de façon synchrone pendant l'analyse du HTML, donc avant la
 * première peinture : le thème est déjà bon quand le premier pixel s'affiche.
 * Un `useEffect` arriverait après la peinture et ferait clignoter la page —
 * ce qui compte aussi pour les Core Web Vitals, un repaint plein écran juste
 * après le LCP se lit comme de l'instabilité visuelle.
 *
 * Sans choix enregistré, on ne pose rien : la feuille de style est en clair
 * par défaut, il n'y a rien à corriger.
 *
 * Volontairement écrit en ES5, sans dépendance : il tourne avant tout bundle.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})!=="dark")return;
document.documentElement.setAttribute("data-theme","dark");
var m=document.createElement("meta");
m.setAttribute("name","theme-color");
m.setAttribute("data-theme-color","");
m.setAttribute("content",${JSON.stringify(THEME_PAGE_COLOR.dark)});
document.head.insertBefore(m,document.head.firstChild);
}catch(e){}})()`.replace(/\n/g, "");
