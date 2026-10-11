<a id="search-and-ai-discovery"></a>

# Découverte par les moteurs de recherche et l’IA

Site canonique : [opencoast.kaelux.dev](https://opencoast.kaelux.dev). Les changements de production ont été déployés le 10 octobre 2026 sur le projet web Vercel existant. La carte, le proxy API et les pages d’information publiques ont été vérifiés sur le domaine personnalisé.

<a id="public-information"></a>

## Informations publiques

- [À propos](https://opencoast.kaelux.dev/about) : objectif, couverture, anonymat, auteur, code source et attribution du fond de carte.
- [Fonctionnement](https://opencoast.kaelux.dev/how-it-works) : consultation, dessin, sources, reçu privé et modération.
- [Preuves](https://opencoast.kaelux.dev/evidence) : statuts d’accès, vérification documentaire, examen communautaire, dates et limites.

Il s’agit de pages HTML statiques et lisibles. La page d’accueil contient aussi du HTML utile avant le chargement de JavaScript et une explication sans JavaScript. La carte interactive renvoie vers les trois pages. Aucun enregistrement juridique ni aucune affirmation de couverture n’a été inventé pour le contenu de recherche.

`web/scripts/generate-discovery.mjs` est la source des textes, URL canoniques, descriptions, métadonnées Open Graph et Twitter, données structurées WebSite/WebPage/SoftwareApplication, sitemap.xml, robots.txt et llms.txt. Le prebuild web les régénère de manière déterministe. Modifiez la date du contenu lorsque le contenu sous-jacent change. Le style public partagé est `web/public/discovery.css` ; les styles de l’application restent séparés. L’image de partage est générée à partir de l’identité existante par `tools/motion/render.cjs social`.

<a id="routing-and-indexing"></a>

## Routage et indexation

L’ancien hôte `opencoast-web.vercel.app` redirige définitivement vers le domaine personnalisé. Les pages d’information publiques ont leurs propres URL canoniques. Les chemins non pris en charge renvoient HTTP 404 plutôt que la structure de l’application cartographique. Le proxy API continue de transmettre au projet API existant.

Le sitemap ne liste que les quatre pages publiques canoniques. Les pages de contribution, modération et reçu privé renvoient des en-têtes X-Robots-Tag noindex. Les chemins API et processus privés sont exclus de la découverte par les robots. Ces contrôles sont distincts de l’authentification de l’application ; robots.txt n’est pas une barrière de confidentialité. Les reçus et preuves originales restent protégés par les contrôles d’accès existants.

La politique générale autorise l’exploration des pages publiques. OpenAI indique que OAI-SearchBot contrôle la découverte pour la recherche, distinctement de l’usage de GPTBot pour l’entraînement. Aucune nouvelle politique d’exclusion de l’entraînement n’a été choisie dans ce changement. Voir la [documentation officielle des robots OpenAI](https://developers.openai.com/api/docs/bots). `llms.txt` est une aide de lecture courte et facultative ; il ne garantit ni indexation ni classement.

<a id="what-remains-outside-code"></a>

## Ce qui reste hors du code

Les moteurs de recherche décident quand explorer, indexer et citer une page. Cette implémentation ne prouve pas qu’OpenCoast est indexé ou classé. Le propriétaire peut vérifier le domaine dans Google Search Console et Bing Webmaster Tools et soumettre `https://opencoast.kaelux.dev/sitemap.xml`. Créez des liens vers le site canonique depuis le dépôt GitHub et de véritables articles du projet. Actualisez les explications publiques et informations locales approuvées à mesure que la couverture augmente.

Le contenu suit l’accent mis par Google sur les informations utiles et originales pour les lecteurs. Il explique preuves et incertitudes sans fabriquer d’affirmations juridiques, avis ou notes. Voir les [conseils Google sur le contenu utile](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Le routage Vercel utilise sa [configuration documentée](https://vercel.com/docs/project-configuration/vercel-json).

<a id="verification-on-10-october"></a>

## Vérification du 10 octobre

- La compilation web de production, la vérification des types et le formatage des sources ont réussi.
- Suite unitaire : 7 tests réussis. Deux tests d’intégration de base de données ont été ignorés parce que leur exécution explicite sur une base de test n’était pas activée ; aucune donnée de production n’a servi aux tests.
- Les pages publiques, fichiers pour robots et image de partage ont renvoyé HTTP 200 avec les types de contenu attendus.
- Les pages des processus privés ont renvoyé des en-têtes noindex ; un chemin inconnu a renvoyé 404 ; l’ancien hôte a renvoyé une redirection 308 vers le domaine personnalisé.
- Sur bureau à 1280px et mobile à 390px, aucun débordement horizontal ; les titres, balises canoniques et JSON-LD ont été analysés correctement. La page d’accueil était lisible avec JavaScript désactivé.
- Les vidéos exportées ont été inspectées et entièrement décodées sans erreur FFmpeg ; chacune dure 40 secondes, en 1280 × 720, à 30 fps, sans audio.

Les justificatifs et captures locaux sont dans le dossier ignoré `artifacts/`. ID du déploiement : `dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`.

L’audit existant des dépendances du déploiement a signalé quatre avis de sécurité : concurrently/shell-quote (outils de développement), sharp (traitement d’images de l’API) et source-map-js. Ce changement de découvrabilité n’a ajouté aucune dépendance applicative et ne prétend pas avoir corrigé ces avis. L’audit conservé est `artifacts/dependency-audit.json` ; la correction des dépendances doit inclure l’API et ses contrôles de traitement des preuves.
