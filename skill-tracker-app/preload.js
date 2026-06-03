const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Datei-Dialoge
  saveFile: (defaultName, content) =>
    ipcRenderer.invoke('save-file', { defaultName, content }),
  openFile: () =>
    ipcRenderer.invoke('open-file'),

  // App-Info
  getVersion: () => ipcRenderer.invoke('get-version'),

  // Updates
  installUpdate: () => ipcRenderer.invoke('install-update'),
  checkUpdate:   () => ipcRenderer.invoke('check-update'),
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update-status', (event, data) => callback(data));
  },
});
