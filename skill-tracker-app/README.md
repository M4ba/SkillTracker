# Skill Tracker — Desktop App

## Schnellstart

### 1. Voraussetzungen
- **Node.js** installieren: https://nodejs.org  (LTS-Version)
- Einmalig, danach nicht mehr nötig

### 2. App starten (Entwicklungsmodus)
```
Im Ordner: Rechtsklick → "In Terminal öffnen"
npm install        ← einmalig, lädt ~200MB
npm start          ← App öffnet sich
```

### 3. Installer bauen
```
npm run build
```
Erzeugt in `dist/`:
- `Skill Tracker Setup 1.0.0.exe`  →  Installer mit Startmenü-Eintrag
- `Skill Tracker 1.0.0.exe`        →  Portable, keine Installation nötig

---

## Auto-Updates einrichten (optional, empfohlen)

Damit die App sich wie Discord automatisch updaten kann:

### Schritt 1: GitHub-Konto + Repository
1. Kostenloses Konto auf https://github.com erstellen
2. Neues Repository anlegen: `skill-tracker` (privat oder öffentlich)
3. In `package.json` ersetzen:
   ```
   "owner": "DEIN-GITHUB-USERNAME"
   ```

### Schritt 2: GitHub Token erstellen
1. GitHub → Settings → Developer Settings → Personal Access Tokens
2. Neues Token mit Berechtigung `repo` erstellen
3. Als Umgebungsvariable setzen:
   ```
   Windows: setx GH_TOKEN "dein-token-hier"
   ```

### Schritt 3: Update veröffentlichen
Wenn du eine neue Version baust und veröffentlichen willst:
1. `version` in `package.json` erhöhen (z.B. `1.0.0` → `1.1.0`)
2. Dann:
   ```
   npm run publish
   ```
   Das baut die App UND lädt sie automatisch als GitHub Release hoch.

### Wie Updates dann funktionieren
- App startet → prüft nach 3 Sekunden automatisch auf neue Version
- Update verfügbar → lädt im Hintergrund herunter (Banner oben)
- Download fertig → Banner: "Jetzt neu starten" → Update wird installiert
- Einstellungen-Tab zeigt immer die aktuelle Version

---

## Daten
- Gespeichert in `%APPDATA%\Skill Tracker\`
- **Bleiben bei Updates automatisch erhalten** — kein Export/Import nötig!
- Export-Funktion weiterhin vorhanden für manuelle Backups / Geräte-Wechsel
