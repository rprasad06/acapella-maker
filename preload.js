const { contextBridge, ipcRenderer } = require('electron');

if (localStorage == null) {
    localStorage.setItem('tempo', 120);
    localStorage.setItem('beatCount', 4); 
    localStorage.setItem('audiosrc1', null);
    localStorage.setItem('audiosrc2', null); 
} 

contextBridge.exposeInMainWorld('myAPI', {
    openMetro: () => ipcRenderer.send('openMetro'),
    closeMetro: () => ipcRenderer.send('closeMetro'),
})