<img src="../../../web/public/favicon.svg" width="56" height="56" alt="Logo littoral OpenCoast">

<a id="opencoast--open-source-coastal-access-map"></a>

# OpenCoast — Carte libre de l’accès au littoral

[English](../../../README.md) · [Español](../es/README.md) · [简体中文](../zh-CN/README.md) · [Français](README.md) · [日本語](../ja/README.md) · [Deutsch](../de/README.md) · [Português (Brasil)](../pt-BR/README.md)

<!-- translation-notice -->
Traduction de la documentation anglaise ; l’original anglais fait autorité.
<!-- /translation-notice -->

**Droits d’accès aux plages, itinéraires vers le rivage et éléments qui les étayent.**

**Sans compte. Sans connexion. Consultez et contribuez anonymement.**

OpenCoast est une application web open source qui cartographie des informations examinées par la communauté sur **l’accès public aux plages et les droits d’accès au littoral**. Chacun peut dessiner des zones côtières, des chemins vers le rivage et des points d’accès, ajouter des descriptions, des conditions locales et des sources, puis les soumettre anonymement. Les modérateurs examinent chaque proposition avant sa publication sur la carte publique.

[Explorer la carte](https://opencoast.kaelux.dev/) · [Contribuer](CONTRIBUTING.md) · [Fonctionnement de l’examen](docs/moderation-policy.md) · [Guide de développement](docs/development.md) · [Feuille de route](https://github.com/Ker102/opencoast/issues)

Vous découvrez le projet ? Lisez [à quoi sert OpenCoast](https://opencoast.kaelux.dev/about), [comment utiliser la carte et y contribuer](https://opencoast.kaelux.dev/how-it-works) et [la signification des labels de preuve](https://opencoast.kaelux.dev/evidence). Ces pages publiques sont lisibles sans JavaScript. La [configuration et la vérification de la découvrabilité](docs/discovery.md) couvrent les URL canoniques du site, le sitemap et la politique des robots d’exploration. Les [ébauches d’animation et le guide d’enregistrement](../../../tools/motion/README.md) expliquent les vidéos modifiables du projet.

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [Licence du code : MIT](../../../LICENSE)

> **Projet à ses débuts.** La carte permet la navigation et les contributions dans le monde entier ; les informations examinées s’étoffent lieu par lieu. Une côte non marquée signifie **qu’aucune information d’accès examinée n’est encore disponible**. Cela ne signifie jamais que l’accès est interdit ou garanti.

<a id="why-opencoast-exists"></a>

## Pourquoi OpenCoast existe

Trouver une plage sur une carte laisse plusieurs questions ouvertes : quel accès est autorisé ? Quelles conditions s’appliquent ? Existe-t-il un itinéraire examiné pour l’atteindre ? Quelles sources étayent ces informations et quand ont-elles été vérifiées ?

OpenCoast rassemble ces questions sur une seule carte. Chaque fiche associe un lieu précis à une description, une juridiction, un statut d’accès, un label de preuve et un historique d’examen. Le projet est utile aux habitants, aux visiteurs du littoral, aux cartographes communautaires, aux chercheurs de sources et aux développeurs d’outils cartographiques d’intérêt général.

Créé par **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)**, OpenCoast est né de préoccupations concernant l’accès au littoral au Monténégro. Son périmètre est mondial ; les [premières fiches du Monténégro](https://github.com/Ker102/opencoast/issues/5) relèvent d’un travail d’examen des sources, pas d’un ensemble préchargé de conclusions juridiques.

<a id="anonymous-by-default"></a>

## Anonyme par défaut

OpenCoast vise à rendre les informations d’accès au littoral disponibles sans demander aux personnes de s’identifier. Vous pouvez consulter la carte, soumettre un lieu, proposer une correction et suivre l’examen sans compte, connexion, nom ni adresse e-mail. Conservez votre lien de reçu privé pour suivre l’avancement et répondre aux questions des modérateurs.

Les pièces originales téléversées sont réservées aux modérateurs. Seules des images approuvées séparément, avec consentement à la publication, peuvent être affichées publiquement. Évitez les données personnelles dans les descriptions ou les éléments que vous souhaitez publier. Les outils de modération nécessitent une connexion distincte.

<a id="what-can-you-map"></a>

## Que peut-on cartographier ?

| Type de fiche | Ce qu’elle décrit | Pourquoi elle est distincte |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Zone d’accès** | Une plage, un estran ou une autre zone côtière délimitée | Les conditions peuvent concerner une zone particulière plutôt que tout le littoral. |
| **Itinéraire vers le rivage** | Un chemin, un itinéraire d’entrée ou une voie côtière | Le statut d’accès d’une zone n’établit pas l’autorisation de traverser les terrains qui y mènent. |
| **Point d’accès** | Une entrée, un portail, un panneau ou un autre lieu pertinent | Un point précis peut indiquer où s’applique une condition d’accès ou une observation. |

Les fiches peuvent inclure des catégories locales, des activités autorisées, des conditions, des liens vers les sources et des observations. Une plage louée ou une concession peut être décrite avec ses conditions et preuves particulières ; OpenCoast ne suppose pas qu’un seul label détermine tous les droits à cet endroit.

<a id="what-works-now"></a>

## Fonctionnalités actuelles

- **Une carte mondiale adaptative :** consultation sur navigateur de bureau ou mobile, avec un fond dérivé d’OpenStreetMap fourni par OpenFreeMap.
- **Une vue de terrain Focus :** les couleurs terrestres neutres et l’ombrage du relief rendent la côte lisible tout en faisant ressortir les zones, itinéraires et points d’accès examinés.
- **Des outils de dessin précis :** dessinez et modifiez des points, lignes et polygones, ajustez les sommets, annulez des changements et contrôlez la géométrie avant l’envoi.
- **Des contributions anonymes :** soumettez des informations ou corrections sans créer de compte. Conservez un lien de reçu privé pour suivre l’examen et répondre aux modérateurs.
- **Preuves et dates :** les fiches distinguent le statut d’accès de la solidité des preuves et affichent séparément les dates de modification et d’examen des sources.
- **Une publication modérée :** les modérateurs peuvent demander des précisions, modifier la rédaction avec un motif d’audit, approuver ou rejeter les propositions et consulter les pièces privées. Les fiches publiées ont un historique de révisions.
- **Des liens examinés entre zones et itinéraires :** les modérateurs peuvent associer une zone côtière à des fiches distinctes d’itinéraires d’approche. Un label d’accès terrestre vérifié dépend de la visibilité, des preuves et du statut d’accès actuels de l’itinéraire lié.

<a id="how-to-read-coastal-access-information"></a>

## Lire les informations d’accès au littoral

<a id="access-status"></a>

### Statut d’accès

| Statut | Signification dans OpenCoast |
| --------------- | --------------------------------------------------------------------------- |
| **Autorisé** | L’affirmation examinée décrit l’accès comme autorisé dans le périmètre de la fiche. |
| **Conditionnel** | La fiche décrit un accès soumis aux limites ou conditions indiquées. |
| **Restreint** | La fiche décrit une restriction d’accès. |
| **Contesté** | L’affirmation est contestée ou des preuves crédibles se contredisent. |
| **Inconnu** | Les informations disponibles ne permettent pas d’établir la règle d’accès applicable. |

Lisez la description et les conditions avec le statut. Un label d’accès est une affirmation examinée dans un périmètre défini, pas une garantie pour toute activité ou date.

<a id="evidence-strength"></a>

### Solidité des preuves

**Étayé par des documents** signifie qu’un modérateur a vérifié au moins une source officielle liée par rapport à l’affirmation et à la géométrie. L’explication doit préciser ce que la source étaye et les incertitudes restantes.

**Examiné par la communauté, aucune source officielle vérifiée** signifie qu’un modérateur a approuvé l’affichage sans vérifier de source officielle. Ces fiches portent un label visible ; elles ne doivent pas être interprétées comme des droits d’accès juridiquement vérifiés.

Les limites dessinées à la main sont indiquées comme approximatives. Une date de modification n’implique pas un nouvel examen des sources juridiques. Consultez la [politique de modération](docs/moderation-policy.md) pour la norme d’examen complète.

<a id="contribute-beach-access-information"></a>

## Contribuer des informations d’accès aux plages

1. **Repérez le lieu** sur la [carte en ligne](https://opencoast.kaelux.dev/). Déplacez-vous et zoomez, ou saisissez `latitude, longitude` ; la recherche par nom de lieu est [prévue](https://github.com/Ker102/opencoast/issues/6).
2. **Choisissez Add information** et dessinez une zone, un itinéraire ou un point. Les fiches existantes acceptent aussi les propositions de correction.
3. **Décrivez l’affirmation :** indiquez la juridiction, une catégorie locale si utile, les conditions et ce que vous avez observé ou lu.
4. **Ajoutez sources et preuves.** Les documents officiels et liens directs sont vivement encouragés, mais facultatifs. Les originaux sont réservés aux modérateurs ; seules des images approuvées séparément avec consentement à la publication peuvent être publiques.
5. **Conservez le lien de reçu privé.** Un modérateur examine la proposition et peut demander des précisions avant publication.

Les signalements d’accès au littoral passent par le processus d’examen de l’application. Utilisez les issues GitHub pour les bogues logiciels, la documentation et les propositions de fonctionnalités. Voir le [guide de contribution](CONTRIBUTING.md) pour ces deux voies.

<a id="frequently-asked-questions"></a>

## Questions fréquentes

<a id="is-opencoast-a-worldwide-database-of-legally-verified-public-beaches"></a>

### OpenCoast est-il une base mondiale de plages publiques juridiquement vérifiées ?

OpenCoast propose une carte mondiale et des contributions de différentes juridictions. La couverture dépend des fiches soumises et examinées, et certaines fiches publiées n’ont aucune source officielle vérifiée. C’est un projet d’information à ses débuts, pas une base juridique complète ni une autorité juridique.

<a id="does-a-blank-map-mean-a-beach-is-private-or-closed"></a>

### Une carte vide signifie-t-elle qu’une plage est privée ou fermée ?

Non. Cela signifie qu’aucune information d’accès examinée n’y est affichée. Les parcs, routes, plages et couleurs terrestres du fond de carte donnent un contexte géographique ; ce ne sont pas des affirmations d’accès d’OpenCoast.

<a id="can-i-submit-without-an-account-or-an-official-document"></a>

### Puis-je contribuer sans compte ni document officiel ?

Oui. Les contributions publiques ne nécessitent pas de compte, et les sources officielles sont encouragées, non obligatoires. Chaque contribution doit néanmoins être examinée par un modérateur. Si aucune source officielle n’a été vérifiée, la fiche publiée le précise.

<a id="how-is-a-public-beach-connected-to-its-access-route"></a>

### Comment une plage publique est-elle reliée à son itinéraire d’accès ?

La zone de plage et l’itinéraire sont examinés comme des fiches distinctes. Un modérateur doit les relier explicitement après vérification de la géométrie et des sources. OpenCoast ne déduit pas un itinéraire d’accès parce qu’une route ou un chemin voisin semble atteindre la plage.

<a id="does-submitting-to-opencoast-edit-openstreetmap"></a>

### Une contribution à OpenCoast modifie-t-elle OpenStreetMap ?

Non. OpenCoast stocke ses fiches d’accès examinées dans sa propre base de données. OpenFreeMap fournit le fond dérivé d’OpenStreetMap. Les contributions ici ne sont pas automatiquement inscrites dans OpenStreetMap.

<a id="is-the-coastal-access-data-open-data"></a>

### Les données d’accès au littoral sont-elles des données ouvertes ?

Le logiciel est open source sous licence MIT. Les fiches approuvées de la base hébergée n’ont pas encore de licence de données ouvertes ; obtenez une autorisation avant de les redistribuer. Les pièces privées et les sources tierces ont des droits distincts. Voir [licences et attribution](#licensing-and-attribution).

<a id="can-i-use-opencoast-on-my-phone"></a>

### Puis-je utiliser OpenCoast sur mon téléphone ?

Oui, via son interface web adaptative. Le dessin est conçu pour le tactile comme pour les entrées de bureau. Il n’existe pas encore d’application mobile native, et les [tests sur appareils réels et l’examen d’accessibilité](https://github.com/Ker102/opencoast/issues/4) restent en cours.

<a id="help-build-opencoast"></a>

## Aider à construire OpenCoast

Les contributions sont utiles dans plusieurs domaines :

- **Connaissance locale et recherche de sources :** soumettez via la carte des fiches et corrections au périmètre précis. Incluez les dispositions pertinentes, dates des sources et incertitudes.
- **Cartographie et expérience utilisateur :** améliorez le dessin, la navigation, les légendes lisibles, l’accès au clavier et les interactions tactiles.
- **Logiciel et infrastructure :** contribuez aux requêtes géospatiales, outils de modération, traitement des preuves, tests et fiabilité du déploiement.
- **Documentation :** améliorez les explications et l’accueil des développeurs. Traductions et propositions de localisation sont bienvenues.

Lisez [CONTRIBUTING.md](CONTRIBUTING.md), parcourez les [issues ouvertes](https://github.com/Ker102/opencoast/issues) ou [proposez une amélioration](https://github.com/Ker102/opencoast/issues/new/choose). Signalez les problèmes de sécurité par [signalement privé de vulnérabilités](https://github.com/Ker102/opencoast/security/advisories/new).

<a id="technology-and-repository-structure"></a>

## Technologie et structure du dépôt

| Couche | Implémentation | Emplacement |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Interface web | React, TypeScript, Vite, MapLibre GL JS, Terra Draw | [`web/`](../../../web/) |
| API et modération | Fastify, TypeScript, traitement privé des preuves | [`api/`](../../../api/) |
| Contrats de données | Schémas Zod et types GeoJSON | [`shared/`](../../../shared/) |
| Stockage spatial | PostgreSQL et PostGIS ; hébergés sur Supabase | [`api/db/`](../../../api/db/) |
| Hébergement et preuves | Projets web/API Vercel ; stockage privé Cloudflare R2 | [`infra/`](../../../infra/) |

<a id="run-locally"></a>

### Exécution locale

La CI actuelle utilise Node.js 24. Installez Node.js 24+, npm et Docker, puis :

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Ouvrez `http://localhost:5173`. Les bases locales démarrent sans aucune fiche affirmant un accès. Le [guide de développement](docs/development.md#run-locally) couvre l’environnement, les ports, les téléversements locaux et la création d’un compte de modérateur.

<a id="checks"></a>

### Vérifications

Voir les [commandes de validation et le test d’intégration de base de données isolé](docs/development.md#checks).

<a id="hosted-deployment"></a>

### Déploiement hébergé

Voir la [configuration de Vercel, Supabase/PostGIS et Cloudflare R2 privé](docs/development.md#hosted-deployment).

<a id="current-release-limits"></a>

## Limites de la version actuelle

L’implémentation actuelle permet la publication après examen, mais plusieurs tâches restent avant une large promotion : [durcissement des téléversements et des contrôles contre les abus](https://github.com/Ker102/opencoast/issues/3), [tests tactiles sur appareils réels et d’accessibilité](https://github.com/Ker102/opencoast/issues/4), [examen indépendant des sources des premières fiches du Monténégro](https://github.com/Ker102/opencoast/issues/5) et [recherche par nom de lieu](https://github.com/Ker102/opencoast/issues/6).

Aucune loi à l’échelle d’une juridiction n’est appliquée automatiquement aux plages. Une obstruction signalée et un droit juridique documenté sont des affirmations distinctes. Les fiches d’OpenCoast expliquent les preuves examinées ; elles ne remplacent pas les documents sources et n’établissent pas de limites juridiques.

Voir la [conception du projet](../../../docs/plans/2026-09-24-opencoast-design.md) et le [suivi d’avancement](../../../task.md). Les images dans `docs/design-reference` sont des concepts visuels comportant des affirmations fictives d’exemple ; ce ne sont pas des données cartographiques.

<a id="licensing-and-attribution"></a>

## Licences et attribution

- **Logiciel :** [MIT](../../../LICENSE), autorisant l’utilisation, la modification et la redistribution selon ses conditions.
- **Fiches d’accès hébergées :** contrôlées par l’opérateur, sans licence de données ouvertes pour l’instant. Discutez de leur réutilisation avec le [mainteneur](https://github.com/Ker102).
- **Preuves et documents sources :** conservent leurs droits et restrictions de publication propres. Les originaux téléversés sont privés.
- **Fond de carte et terrain :** l’attribution à [OpenStreetMap](https://www.openstreetmap.org/copyright), [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/) et [Mapterhorn](https://mapterhorn.com/attribution) reste visible sur la carte selon les besoins.

Pour les articles, recherches ou réutilisations du logiciel, créez un lien vers [OpenCoast sur GitHub](https://github.com/Ker102/opencoast) et utilisez [CITATION.cff](../../../CITATION.cff) pour les informations de citation du logiciel. Citer le logiciel ne vérifie aucune affirmation particulière d’accès au littoral.

Dernier examen de la présentation du projet : **2026-10-06**.
