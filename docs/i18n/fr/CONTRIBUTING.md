<a id="contributing-to-opencoast"></a>

# Contribuer à OpenCoast

Merci d’améliorer la carte ou le logiciel. Distinguez clairement une observation signalée, une règle juridique citée et une conclusion examinée par un modérateur.

<a id="choose-where-to-contribute"></a>

## Choisir où contribuer

| Vous souhaitez aider sur | Commencez ici |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Une plage, une zone côtière, un itinéraire, une entrée ou une correction | [Ouvrez la carte](https://opencoast-web.vercel.app/) et utilisez Add information ou l’action de correction de la fiche. |
| Des sources officielles et des conditions locales d’accès | Soumettez la source avec l’affirmation cartographique concernée ; consultez la [politique de modération](docs/moderation-policy.md) pour comprendre son évaluation. |
| Un bogue logiciel ou une fonctionnalité | Recherchez les [issues existantes](https://github.com/Ker102/opencoast/issues), puis [ouvrez une issue](https://github.com/Ker102/opencoast/issues/new/choose). |
| Le code, la documentation ou l’accessibilité | Lisez le [guide de développement](docs/development.md) et les étapes de contribution au code ci-dessous. |
| Une vulnérabilité de sécurité | Utilisez le [signalement privé de vulnérabilités](https://github.com/Ker102/opencoast/security/advisories/new). |

Vous n’avez pas besoin d’un compte GitHub pour soumettre des informations à la carte. GitHub sert aux contributions de développement ; la carte dispose de son propre processus d’examen par les modérateurs.

<a id="map-information"></a>

## Informations cartographiques

Utilisez **Add information** dans l’application pour proposer une zone, un itinéraire, un point ou une correction. Aucun compte n’est requis. Incluez la géométrie la plus exacte que vous puissiez dessiner, la juridiction, ce que vous pensez autorisé, les conditions pertinentes et une description de ce que vous avez observé ou lu. Les documents officiels et liens directs sont vivement encouragés, mais facultatifs. Une soumission sans source officielle peut néanmoins être examinée, avec un label visible qui le précise. Conservez le lien de reçu privé pour suivre l’examen et répondre aux modérateurs.

<a id="what-makes-a-useful-submission"></a>

### Qu’est-ce qui rend une contribution utile ?

- Identifiez le lieu et dessinez uniquement la zone, l’itinéraire ou le point concerné par l’affirmation.
- Précisez le pays ou la juridiction concernés ainsi que toute catégorie locale, par exemple une concession ou un sentier côtier.
- Décrivez l’activité et ses conditions, dates, limites saisonnières ou incertitudes.
- Pour un document, incluez un lien direct, son titre, l’organisme émetteur, sa date et, si disponible, la disposition ou page pertinente. Expliquez quelle partie de l’affirmation il étaye.
- Pour une observation personnelle, décrivez ce que vous avez vu et quand. Distinguez cette observation d’une conclusion sur les droits juridiques.
- Soumettez l’itinéraire vers le rivage séparément de la zone côtière qu’il rejoint. Les modérateurs examinent et relient explicitement ces fiches.

Les contributions du monde entier sont bienvenues. Un témoignage utile sans source officielle peut être publié après modération avec le label d’examen communautaire. Évitez de remplir de vastes régions d’hypothèses fondées uniquement sur une règle générale.

N’insérez pas de noms, visages, numéros de téléphone ou coordonnées privées dans les descriptions ou signalements publics. Les originaux téléversés sont réservés aux modérateurs ; le consentement à publier une image est facultatif et ne garantit pas sa publication.

<a id="code-changes"></a>

## Modifications du code

1. Recherchez les issues et pull requests existantes avant de commencer.
2. Ouvrez une issue pour une fonctionnalité importante ou un bogue afin de discuter du comportement attendu.
3. Créez une branche, réalisez une modification ciblée, exécutez les vérifications pertinentes du [guide de développement](docs/development.md#checks), puis ouvrez une pull request.
4. Décrivez ce qui a changé, pourquoi, ce que vous avez testé et les conséquences éventuelles pour l’accessibilité ou la confidentialité.

Le dépôt utilise les workspaces npm : `shared` contient les contrats de données, `api` gère la persistance et la modération, et `web` contient l’interface cartographique. Les endpoints publics ne doivent jamais révéler de propositions en attente, jetons de reçu, preuves brutes, identifiants de modérateurs ou identité des contributeurs. Tout nouveau statut cartographique doit disposer d’une légende et d’une explication détaillée correspondantes.

Les sources juridiques peuvent avoir des restrictions de réutilisation. Créez des liens et résumez-les avec vos propres mots ; ne collez pas des lois entières et ne copiez pas les données d’une autre carte dans ce dépôt. L’attribution OpenStreetMap doit rester visible. N’ajoutez pas d’affirmations fictives d’accès au littoral aux données initiales de production.

<a id="reporting-security-issues"></a>

## Signaler des problèmes de sécurité

Utilisez le signalement privé de vulnérabilités GitHub pour les problèmes de sécurité plutôt qu’une issue publique. Fournissez une reproduction minimale et évitez de publier de vrais liens de reçu, fichiers de preuve ou identifiants.
