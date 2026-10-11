<a id="contributing-to-opencoast"></a>

# Zu OpenCoast beitragen

Danke für Verbesserungen an Karte oder Software. Halte die Unterschiede zwischen einer gemeldeten Beobachtung, einer zitierten Rechtsregel und einer durch Moderatoren geprüften Schlussfolgerung klar.

<a id="choose-where-to-contribute"></a>

## Den passenden Beitragsweg wählen

| Wobei du helfen möchtest | Hier beginnen |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strand, Küstengebiet, Weg, Eingang oder Korrektur | [Karte öffnen](https://opencoast-web.vercel.app/) und Add information oder die Korrekturfunktion des Datensatzes nutzen. |
| Amtliche Quellen und örtliche Zugangsbedingungen | Die Quelle mit der zugehörigen Kartenaussage einreichen; die [Moderationsrichtlinie](docs/moderation-policy.md) erklärt die Bewertung. |
| Softwarefehler oder Funktion | [Bestehende Issues](https://github.com/Ker102/opencoast/issues) durchsuchen, dann [ein Issue eröffnen](https://github.com/Ker102/opencoast/issues/new/choose). |
| Code, Dokumentation oder Barrierefreiheit | Den [Entwicklungsleitfaden](docs/development.md) und die nachstehenden Schritte für Codebeiträge lesen. |
| Sicherheitslücke | [Private Schwachstellenmeldung](https://github.com/Ker102/opencoast/security/advisories/new) nutzen. |

Zum Einreichen von Karteninformationen brauchst du kein GitHub-Konto. GitHub dient Entwicklungsbeiträgen; die Karte besitzt einen eigenen Moderatoren-Prüfablauf.

<a id="map-information"></a>

## Karteninformationen

Nutze **Add information** in der Anwendung, um ein Gebiet, einen Weg, Punkt oder eine Korrektur vorzuschlagen. Ein Konto ist nicht erforderlich. Gib die möglichst genaue gezeichnete Geometrie, das Rechtsgebiet, den deiner Ansicht nach erlaubten Zugang, relevante Bedingungen und eine Beschreibung deiner Beobachtung oder Lektüre an. Amtliche Dokumente und direkte Links werden ausdrücklich empfohlen, sind aber optional. Einreichungen ohne amtliche Quelle können ebenfalls geprüft werden und erhalten eine sichtbare entsprechende Kennzeichnung. Bewahre den privaten Eingangslink auf, um die Prüfung zu verfolgen und Moderatorenfragen zu beantworten.

<a id="what-makes-a-useful-submission"></a>

### Was macht eine Einreichung nützlich?

- Den Ort identifizieren und nur das Gebiet, den Weg oder Punkt zeichnen, auf den sich die Aussage bezieht.
- Das relevante Land oder Rechtsgebiet und örtliche Kategorien wie Konzession oder Küstenpfad angeben.
- Aktivität sowie Bedingungen, Daten, saisonale Beschränkungen und Unsicherheit beschreiben.
- Bei Dokumenten einen direkten Quellenlink, Titel, herausgebende Stelle, Datum und soweit verfügbar relevante Bestimmung oder Seite angeben. Erklären, welchen Teil der Aussage das Dokument stützt.
- Bei eigenen Beobachtungen beschreiben, was du wann gesehen hast. Beobachtung und Schlussfolgerung über rechtliche Ansprüche unterscheiden.
- Einen Weg zum Ufer getrennt vom erreichten Küstengebiet einreichen. Moderatoren prüfen und verknüpfen diese Datensätze ausdrücklich.

Einreichungen aus aller Welt sind willkommen. Ein nützlicher Bericht ohne amtliche Quelle kann nach Moderation mit der Kennzeichnung gemeinschaftlicher Prüfung veröffentlicht werden. Bitte keine großen Gebiete mit Annahmen füllen, die nur auf einer allgemeinen Regel beruhen.

Keine Namen, Gesichter, Telefonnummern oder privaten Kontaktdaten in Beschreibungen oder öffentlichen Issue-Berichten veröffentlichen. Hochgeladene Originale sind nur Moderatoren zugänglich; die Einwilligung zur Bildveröffentlichung ist optional und garantiert keine Veröffentlichung.

<a id="code-changes"></a>

## Codeänderungen

1. Vor Arbeitsbeginn bestehende Issues und Pull Requests durchsuchen.
2. Für größere Funktionen oder Fehler ein Issue eröffnen, damit das gewünschte Verhalten besprochen werden kann.
3. Einen Branch erstellen, eine gezielte Änderung vornehmen, die relevanten Prüfungen aus dem [Entwicklungsleitfaden](docs/development.md#checks) ausführen und einen Pull Request eröffnen.
4. Änderungen, Gründe, durchgeführte Tests und Auswirkungen auf Barrierefreiheit oder Datenschutz beschreiben.

Das Repository nutzt npm-Workspaces: `shared` enthält Datenverträge, `api` verantwortet Persistenz und Moderation, `web` enthält die Kartenoberfläche. Öffentliche Endpunkte dürfen niemals ausstehende Vorschläge, Eingangs-Tokens, rohe Belege, Moderatorzugangsdaten oder die Identität Beitragender offenlegen. Jeder neue Kartenstatus braucht eine passende Legende und Detailerklärung.

Rechtliche Quellen können Wiederverwendungsbeschränkungen haben. Verlinke sie und fasse sie in eigenen Worten zusammen; füge keine vollständigen Gesetze ein und kopiere keine Daten einer anderen Karte in dieses Repository. OpenStreetMap-Attribution muss sichtbar bleiben. Keine beispielhaften Küstenzugangsaussagen in die initialen Produktionsdaten aufnehmen.

<a id="reporting-security-issues"></a>

## Sicherheitsprobleme melden

Nutze für Sicherheitsprobleme GitHubs private Schwachstellenmeldung statt eines öffentlichen Issues. Füge eine minimale Reproduktion bei und veröffentliche keine echten Eingangslinks, Belegdateien oder Zugangsdaten.
