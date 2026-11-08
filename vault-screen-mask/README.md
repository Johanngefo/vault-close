# Vault Screen Mask (Obsidian)

## Was das Plugin macht
- Sperrt die Obsidian-Oberfläche beim Start.
- Zeigt nach 60 Sekunden ohne erkannte Aktivität erneut die PIN-Maske.
- Fügt ein Schloss-Symbol in die linke Ribbon-Leiste und einen Befehl zum manuellen Sperren hinzu.
- PIN-Eingabe entsperrt die Oberfläche.

## PIN ändern
Öffne `main.js` und ändere ganz oben:

```js
const VAULT_PIN = "1234";
```

Ersetze `1234` durch deine vier Ziffern. Speichere die Datei und lade das Plugin in Obsidian neu.

## Manuelle Installation unter Fedora KDE
1. Erstelle den Ordner `<Vault>/.obsidian/plugins/vault-screen-mask/`.
2. Kopiere `main.js`, `manifest.json` und `styles.css` in diesen Ordner.
3. Öffne Obsidian → Einstellungen → Community-Plugins.
4. Aktiviere gegebenenfalls den eingeschränkten Modus und aktiviere **Vault Screen Mask** in der Plugin-Liste.
5. Falls das Plugin nicht erscheint: Obsidian neu laden (Strg+R) und erneut prüfen.

## Wichtige Sicherheitsgrenze
Dies ist nur eine Sichtschutz-Maske, keine Verschlüsselung und keine echte Zugriffskontrolle.
Die Notizen bleiben als normale Dateien auf der Festplatte lesbar. Jemand kann die Maske umgehen,
Obsidian direkt schließen, Dateien außerhalb von Obsidian öffnen oder den Plugin-Code ändern.
Die PIN steht im Klartext in `main.js`. Verwende sie daher nicht als Passwort für andere Konten.
Wenn du den Laptop unbeaufsichtigt lässt, sperre zusätzlich Fedora mit `Meta+L`.
Für echten Datenschutz verwende zusätzlich Festplatten-/Vault-Verschlüsselung, z. B. Cryptomator.
