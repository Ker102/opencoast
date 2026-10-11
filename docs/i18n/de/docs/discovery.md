<a id="search-and-ai-discovery"></a>

# Auffindbarkeit in Suche und KI

Kanonische Website: [opencoast.kaelux.dev](https://opencoast.kaelux.dev). Die Produktionsänderungen wurden am 10. Oktober 2026 im bestehenden Vercel-Webprojekt bereitgestellt. Karte, API-Proxy und öffentliche Informationsseiten wurden auf der eigenen Domain geprüft.

<a id="public-information"></a>

## Öffentliche Informationen

- [Über das Projekt](https://opencoast.kaelux.dev/about): Zweck, Abdeckung, Anonymität, Urheberschaft, Quellcode und Grundkarten-Attribution.
- [Funktionsweise](https://opencoast.kaelux.dev/how-it-works): Erkunden, Zeichnen, Quellen, privater Eingangslink und Moderation.
- [Belege](https://opencoast.kaelux.dev/evidence): Zugangsstatus, Dokumentenverifizierung, gemeinschaftliche Prüfung, Daten und Grenzen.

Es sind statische, lesbare HTML-Seiten. Die Startseite enthält auch nützliches HTML vor dem Laden von JavaScript und eine Erklärung ohne JavaScript. Die interaktive Karte verlinkt alle drei Seiten. Für Suchinhalte wurden keine rechtlichen Datensätze oder Abdeckungsbehauptungen erfunden.

`web/scripts/generate-discovery.mjs` ist die Quelle für Seitentexte, kanonische URLs, Beschreibungen, Open-Graph- und Twitter-Metadaten, strukturierte Daten vom Typ WebSite/WebPage/SoftwareApplication, sitemap.xml, robots.txt und llms.txt. Der Web-Prebuild erzeugt diese deterministisch neu. Ändere das Inhaltsdatum, wenn sich die zugrunde liegenden Inhalte ändern. Gemeinsame öffentliche Stile liegen in `web/public/discovery.css`; bestehende App-Stile bleiben getrennt. Das Social-Media-Bild wird aus der bestehenden Identität durch `tools/motion/render.cjs social` erzeugt.

<a id="routing-and-indexing"></a>

## Routing und Indexierung

Der alte Host `opencoast-web.vercel.app` leitet dauerhaft auf die eigene Domain um. Öffentliche Informationsseiten haben eigene kanonische URLs. Nicht unterstützte Pfade liefern HTTP 404 statt der Karten-App-Hülle. Der API-Proxy leitet weiterhin an das bestehende API-Projekt weiter.

Die Sitemap listet nur die vier öffentlichen kanonischen Seiten. Beitrags-, Moderator- und private Eingangsseiten liefern X-Robots-Tag-noindex-Header. API- und private Workflow-Pfade sind von der Crawler-Auffindbarkeit ausgeschlossen. Diese Kontrollen sind von der Anwendungsauthentifizierung getrennt; robots.txt ist keine Datenschutzgrenze. Eingangslinks und Originalbelege bleiben durch bestehende Zugriffskontrollen geschützt.

OpenAI dokumentiert, dass OAI-SearchBot die Auffindbarkeit in der Suche steuert und vom Trainingseinsatz des GPTBot getrennt ist. Die allgemeine Crawler-Richtlinie erlaubt öffentliche Seiten. In dieser Änderung wurde keine neue Trainings-Opt-out-Richtlinie gewählt. Siehe [offizielle OpenAI-Crawler-Dokumentation](https://developers.openai.com/api/docs/bots). `llms.txt` ist eine knappe optionale Lesehilfe, keine Indexierungs- oder Rankinggarantie.

<a id="what-remains-outside-code"></a>

## Was außerhalb des Codes bleibt

Suchmaschinen entscheiden, wann sie eine Seite crawlen, indexieren und zitieren. Diese Implementierung belegt nicht, dass OpenCoast indexiert oder gerankt ist. Der Eigentümer kann die Domain in Google Search Console und Bing Webmaster Tools verifizieren und `https://opencoast.kaelux.dev/sitemap.xml` einreichen. Verlinke die kanonische Website aus dem GitHub-Repository und echten Projektartikeln. Halte öffentliche Erklärungen und genehmigte örtliche Informationen mit wachsender Abdeckung aktuell.

Die Inhalte folgen Googles Schwerpunkt auf nützlichen, eigenständigen Informationen für Leser. Sie erklären Belege und Unsicherheit, ohne rechtliche Aussagen, Rezensionen oder Bewertungen zu erfinden. Siehe [Googles Leitfaden zu hilfreichen Inhalten](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Vercel-Routing nutzt die dokumentierte [Konfiguration](https://vercel.com/docs/project-configuration/vercel-json).

<a id="verification-on-10-october"></a>

## Prüfung am 10. Oktober

- Web-Produktionsbuild, Typprüfung und Quellformatierung bestanden.
- Unit-Suite: 7 Tests bestanden. Zwei Datenbankintegrationstests wurden übersprungen, weil ihr ausdrücklicher Testdatenbanklauf nicht aktiviert war; Produktionsdaten wurden nicht für Tests verwendet.
- Öffentliche Seiten, Crawler-Dateien und Sharing-Bild lieferten HTTP 200 mit den erwarteten Inhaltstypen.
- Private Workflow-Seiten lieferten noindex-Header; ein unbekannter Pfad lieferte 404; der alte Host lieferte eine 308-Weiterleitung zur eigenen Domain.
- Desktop mit 1280px und Mobilansicht mit 390px zeigten keinen horizontalen Überlauf; Überschriften, kanonische Tags und JSON-LD wurden korrekt geparst. Die Startseite war ohne JavaScript lesbar.
- Videoexporte wurden geprüft und vollständig ohne FFmpeg-Fehler decodiert; jeder dauert 40 Sekunden, mit 1280 × 720, 30 fps und ohne Audio.

Lokale Prüfbelege und Screenshots liegen im ignorierten Ordner `artifacts/`. Deployment-ID: `dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`.

Die bestehende Abhängigkeitsprüfung des Deployments meldete vier Sicherheitshinweise: concurrently/shell-quote (Entwicklungswerkzeuge), sharp (API-Bildverarbeitung) und source-map-js. Diese Änderung zur Auffindbarkeit fügte keine App-Abhängigkeiten hinzu und behauptet nicht, die Hinweise behoben zu haben. Die gespeicherte Prüfung liegt in `artifacts/dependency-audit.json`; Abhängigkeitsbehebung sollte die API und ihre Belegverarbeitungsprüfungen einschließen.
