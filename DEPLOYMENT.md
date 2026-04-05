# Station Logbook – Deployment-Anleitung

## 1. Auf GitHub pushen

```bash
cd station-logbook
git init
git add .
git commit -m "Initial commit: Station Logbook PWA"
# Erstelle ein neues Repository auf github.com, dann:
git remote add origin https://github.com/DEIN-USERNAME/station-logbook.git
git branch -M main
git push -u origin main
```

## 2. Auf Vercel deployen (empfohlen)

1. Gehe zu [vercel.com](https://vercel.com) und logge dich mit GitHub ein
2. Klicke "Add New Project"
3. Wähle dein `station-logbook` Repository
4. Vercel erkennt Vite automatisch – einfach "Deploy" klicken
5. Nach 1-2 Minuten hast du eine URL wie `station-logbook-xyz.vercel.app`
6. **Jeder `git push` auf `main` deployed automatisch!**

### Alternative: Netlify

1. Gehe zu [netlify.com](https://netlify.com) und logge dich mit GitHub ein
2. "Add new site" → "Import an existing project"
3. Wähle dein Repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Klicke "Deploy site"

## 3. Auf Android installieren

1. Öffne die deployte URL in **Chrome** auf deinem Android-Handy
2. Warte 2-3 Sekunden – es erscheint automatisch ein Banner "App installieren"
3. Falls kein Banner: Tippe auf die **drei Punkte** (⋮) oben rechts → "Zum Startbildschirm hinzufügen" oder "App installieren"
4. Die App erscheint auf deinem Homescreen und funktioniert wie eine native App
5. **Offline-Funktionalität:** Nach dem ersten Laden funktioniert die App komplett ohne Internet

## 4. Backups erstellen

1. Öffne die App → **Einstellungen** (Zahnrad-Icon oben rechts)
2. Tippe auf **"Daten exportieren (Backup)"**
3. Eine JSON-Datei wird heruntergeladen
4. **Empfehlung:** Mache mindestens wöchentlich ein Backup!
5. Speichere die Backup-Dateien in der Cloud (Google Drive, OneDrive) für zusätzliche Sicherheit

### Backup wiederherstellen

1. Einstellungen → "Daten importieren"
2. Wähle die JSON-Backup-Datei
3. **Achtung:** Der Import überschreibt alle aktuellen Daten!

## Tipps

- **Offline:** Die App funktioniert komplett offline. Daten werden lokal in IndexedDB gespeichert.
- **Datensicherheit:** Deine Daten verlassen nie dein Gerät. Kein Server, kein Cloud-Sync.
- **Browser-Daten löschen:** Wenn du Browser-Daten/Cache löschst, gehen auch die App-Daten verloren! Deshalb regelmäßig Backups machen.
- **Mehrere Geräte:** Aktuell kein Sync. Du kannst aber Export → Import nutzen um Daten zwischen Geräten zu übertragen.
