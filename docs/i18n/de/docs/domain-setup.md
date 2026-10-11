<a id="opencoast-custom-domain"></a>

# Eigene Domain für OpenCoast

`opencoast.kaelux.dev` ist dem Vercel-Projekt `opencoast-web` zugeordnet. DNS-Auflösung, HTTPS und die Same-Origin-API-Health-Antwort wurden am 10. Oktober 2026 geprüft. Das aktuelle Webdeployment hat diesen Hostnamen als Alias. Der alte Vercel-Hostname leitet jetzt auf die eigene Domain um.

<a id="dns-record"></a>

## DNS-Eintrag

Der bestehende Eintrag in der DNS-Zone `kaelux.dev` lautet:

| Typ | Name | Wert |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

Das ist das projektspezifische Ziel, das Vercels Domainprüfbefehl am 5. Oktober 2026 zurückgab. Behalte die bestehenden Nameserver. Für denselben Hostnamen dürfen keine widersprüchlichen A-, AAAA- oder weiteren CNAME-Einträge existieren.

Der erste Aliasversuch scheiterte vor der DNS-Konfiguration. Das ist inzwischen behoben: Die öffentliche Karte und `https://opencoast.kaelux.dev/api/health` antworten über HTTPS. Nutze für geteilte Links und Browsersitzungen weiterhin den eigenen Hostnamen.

<a id="application-origins"></a>

## Anwendungs-Origins

Während des Übergangs lautet der Produktionswert `WEB_ORIGIN` der API:

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

Die API akzeptiert für CORS und Moderatoränderungen ausschließlich exakte Origins aus dieser Liste. Der private R2-Bucket erlaubt ebenfalls signierte PUT-Uploads mit `Content-Type` von beiden Origins, wie in `infra/r2-cors.json` festgehalten.

Das API-Projekt und der `/api`-Proxy des Webprojekts behalten ihre bisherigen Adressen. Moderatorsitzungen gelten für den Browserhostnamen; beim Wechsel zur eigenen Domain melden sich Moderatoren deshalb erneut an.
