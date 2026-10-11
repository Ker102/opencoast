<a id="opencoast-custom-domain"></a>

# Domaine personnalisé d’OpenCoast

`opencoast.kaelux.dev` est affecté au projet Vercel `opencoast-web`. La résolution DNS, HTTPS et la réponse de santé de l’API de même origine ont été vérifiés le 10 octobre 2026. Le déploiement web actuel possède cet hôte comme alias. L’ancien hôte Vercel redirige désormais vers le domaine personnalisé.

<a id="dns-record"></a>

## Enregistrement DNS

L’enregistrement existant dans la zone DNS `kaelux.dev` est :

| Type | Nom | Valeur |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

Il s’agit de la cible propre au projet renvoyée par la commande de vérification de domaine Vercel le 5 octobre 2026. Conservez les serveurs de noms existants. Ce même hôte ne doit pas avoir d’enregistrements A, AAAA ou autres CNAME contradictoires.

La première tentative d’alias a échoué avant la configuration DNS. Le problème est résolu : la carte publique et `https://opencoast.kaelux.dev/api/health` répondent en HTTPS. Continuez à utiliser l’hôte personnalisé pour les liens partagés et les sessions du navigateur.

<a id="application-origins"></a>

## Origines de l’application

Pendant la transition, la valeur de production `WEB_ORIGIN` de l’API est :

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

L’API n’accepte que les origines exactes de cette liste pour CORS et les mutations des modérateurs. Le bucket R2 privé permet aussi les téléversements PUT signés avec `Content-Type` depuis ces deux origines, comme indiqué dans `infra/r2-cors.json`.

Le projet API et le proxy `/api` du projet web conservent leurs adresses existantes. Les sessions de modérateurs sont limitées à l’hôte du navigateur ; les modérateurs se reconnectent donc lors du passage au domaine personnalisé.
