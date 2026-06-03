const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Auto-Updater (nur wenn nicht im Entwicklungsmodus)
let autoUpdater = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
  try {
    autoUpdater = require('electron-updater').autoUpdater;
    autoUpdater.autoDownload = true;        // sofort im Hintergrund laden
    autoUpdater.autoInstallOnAppQuit = true; // beim Beenden installieren
    autoUpdater.logger = null;               // kein Log-Spam
  } catch(e) { /* electron-updater nicht verfügbar im Dev-Modus */ }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 760,
    minWidth: 640,
    minHeight: 520,
    title: 'Skill Tracker',
    backgroundColor: '#191917',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile('index.html');

  // Externe Links im Browser öffnen
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Update-Prüfung nach 3 Sekunden starten
  if (autoUpdater) {
    setTimeout(() => startUpdateCheck(), 3000);
  }
}

// ─── Auto-Updater Events ──────────────────────────────────────────────────────
function startUpdateCheck() {
  autoUpdater.checkForUpdates().catch(() => {}); // Fehler lautlos ignorieren

  autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('update-status', {
      type: 'available',
      version: info.version
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('update-status', {
      type: 'progress',
      percent: Math.round(progress.percent)
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow?.webContents.send('update-status', {
      type: 'ready',
      version: info.version
    });
  });

  autoUpdater.on('update-not-available', () => {
    mainWindow?.webContents.send('update-status', { type: 'none' });
  });
}

// ─── IPC: Update installieren ────────────────────────────────────────────────
ipcMain.handle('install-update', () => {
  autoUpdater?.quitAndInstall(false, true);
});

ipcMain.handle('check-update', () => {
  if (autoUpdater) {
    autoUpdater.checkForUpdates().catch(() => {});
  }
});

// ─── IPC: App-Version abfragen ───────────────────────────────────────────────
ipcMain.handle('get-version', () => app.getVersion());

// ─── IPC: Datei-Export ───────────────────────────────────────────────────────
ipcMain.handle('save-file', async (event, { defaultName, content }) => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'Backup speichern',
    defaultPath: defaultName,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePath) return { ok: false };
  fs.writeFileSync(filePath, content, 'utf-8');
  return { ok: true, filePath };
});

// ─── IPC: Datei-Import ───────────────────────────────────────────────────────
ipcMain.handle('open-file', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Backup laden',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (canceled || !filePaths.length) return { ok: false };
  const content = fs.readFileSync(filePaths[0], 'utf-8');
  return { ok: true, content };
});

// ─── App-Lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
