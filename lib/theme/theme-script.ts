/** Clé partagée par le script inline, le contexte React et le sélecteur. */
export const THEME_STORAGE_KEY = "linqfolio-theme";

/** `system` = on suit la préférence de l'OS, aucun attribut posé sur <html>. */
export type Theme = "light" | "dark" | "system";

/** Fonds de page des deux thèmes, repris de `globals.css`. */
export const THEME_PAGE_COLOR = { light: "#fffefc", dark: "#16111f" } as const;

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Aligne la barre d'adresse mobile sur un choix explicite.
 *
 * `viewport.themeColor` du layout couvre déjà le cas « je suis l'OS » via
 * `prefers-color-scheme`. Quand quelqu'un choisit l'inverse de son système, il
 * faut passer devant : la spec HTML retient le premier `theme-color` dont le
 * `media` correspond, donc on insère le nôtre en tête de <head>.
 */
export function syncThemeColorMeta(theme: Theme) {
  const head = document.head;
  const existing = head.querySelector<HTMLMetaElement>("meta[data-theme-color]");

  if (theme === "system") {
    existing?.remove();
    return;
  }

  const meta = existing ?? document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("data-theme-color", "");
  meta.setAttribute("content", THEME_PAGE_COLOR[theme]);
  if (!existing) head.insertBefore(meta, head.firstChild);
}

/**
 * Script exécuté de façon synchrone pendant l'analyse du HTML, donc avant la
 * première peinture : le thème est déjà bon quand le premier pixel s'affiche.
 * Un `useEffect` arriverait après la peinture et ferait clignoter la page en
 * blanc — ce qui compte aussi pour les Core Web Vitals, un repaint plein écran
 * juste après le LCP se lit comme de l'instabilité visuelle.
 *
 * Sans choix enregistré, on ne pose rien : c'est `prefers-color-scheme` qui
 * décide, dans la feuille de style.
 *
 * Volontairement écrit en ES5, sans dépendance : il tourne avant tout bundle.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var r=document.documentElement;
if(t!=="dark"&&t!=="light"){r.removeAttribute("data-theme");return}
r.setAttribute("data-theme",t);
var m=document.createElement("meta");
m.setAttribute("name","theme-color");
m.setAttribute("data-theme-color","");
m.setAttribute("content",t==="dark"?${JSON.stringify(
  THEME_PAGE_COLOR.dark,
)}:${JSON.stringify(THEME_PAGE_COLOR.light)});
document.head.insertBefore(m,document.head.firstChild);
}catch(e){}})()`.replace(/\n/g, "");
