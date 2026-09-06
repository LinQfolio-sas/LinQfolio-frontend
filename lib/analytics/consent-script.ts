import {
  ANALYTICS_ENABLED,
  CONSENT_STORAGE_KEY,
  CONSENT_TTL_MS,
  GA_MEASUREMENT_ID,
} from "./config";
import { PAGE_TYPE_RULES, pageTypeOf } from "./track";

/**
 * Amorçage de Google Analytics, exécuté dans le <head>.
 *
 * Deux choses s'y jouent, et une seule est visible.
 *
 * L'ordre, d'abord : `gtag('consent', …)` doit être dans `dataLayer` avant que
 * gtag.js ne s'exécute, sinon la bibliothèque démarre sans connaître l'état.
 * Le <head> est analysé avant tout le reste du document : l'ordre tient donc
 * au navigateur, pas au calendrier de rendu de React.
 *
 * Le consentement, ensuite : sans accord enregistré, ce script ne fait
 * strictement rien — il ne crée même pas `window.gtag`. C'est délibéré.
 * L'absence de cette fonction est ce qui rend `track()` inerte, plutôt qu'un
 * drapeau qu'un appel futur pourrait oublier de consulter. Aucun événement ne
 * peut donc s'accumuler dans une file qui serait rejouée si la personne
 * acceptait plus tard.
 *
 * Volontairement écrit en ES5, sans dépendance : il tourne avant tout bundle.
 */
export const CONSENT_INIT_SCRIPT = `(function(){
try{
var raw=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
var rec=raw?JSON.parse(raw):null;
if(!rec||rec.choice!=="granted"||typeof rec.at!=="number"||Date.now()-rec.at>${CONSENT_TTL_MS})return;
}catch(e){return}
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"granted"});
var rules=${JSON.stringify(PAGE_TYPE_RULES)},path=location.pathname,type="other";
for(var i=0;i<rules.length;i++){if(new RegExp(rules[i][0]).test(path)){type=rules[i][1];break}}
gtag("js",new Date());
gtag("config",${JSON.stringify(GA_MEASUREMENT_ID)},{anonymize_ip:true,page_type:type,content_group:type});
})()`.replace(/\n/g, "");

/**
 * Même amorçage, pour une acceptation donnée en cours de visite.
 *
 * Les commandes sont mises en file avant que la balise <Script> ne soit
 * rendue : gtag.js les rejouera à son arrivée, dans l'ordre. La page vue est
 * envoyée à ce moment-là, et pas avant — ce qui est correct, puisque avant
 * l'accord il n'y avait rien à envoyer.
 */
export function activateGtag() {
  if (!ANALYTICS_ENABLED || typeof window === "undefined") return;
  if (window.gtag) return;

  const layer = (window.dataLayer = window.dataLayer ?? []);

  // gtag.js relit l'objet `arguments` de chaque appel, pas un tableau : la
  // fonction doit être une vraie `function`. Une flèche capturerait
  // l'`arguments` de la portée englobante et la file serait illisible.
  function gtag(this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    layer.push(arguments);
  }
  const send = gtag as NonNullable<Window["gtag"]>;
  window.gtag = send;

  send("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });

  const type = pageTypeOf(window.location.pathname);
  send("js", new Date());
  send("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    page_type: type,
    content_group: type,
  });
}
