const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        },
    })
  
    mainWindow.loadFile('./src/index.html');
}

app.whenReady().then(() => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('openMetro', () => {
    mainWindow.loadFile('./src/metronome.html');
});

ipcMain.on('closeMetro', () => {
    mainWindow.loadFile('./src/index.html');
});


// more audio compiler attempt: 
// ipcMain.handle('mergeAudio', async (event, buf1, buf2) => {

//     let buffers = [buf1, buf2]
//     let audiobufs = [];
//     (async () => {
//         for (let i = 0; i < 2; i++) {
//             await arrayBufferToAudioBuffer(buffers[i])
//                 .then(audiobuf => {
                
//                     audiobufs.push(audiobuf);
    
//                     if (i == 1) {
//                         console.log('success1')
//                         finalCompile(audiobufs);
//                     }
//             });
//         }
//     })()

//     function finalCompile(audiobufs) {
//         audio.mergeAudio(audiobufs)
//         .then(merged => audio.export(merged, 'merged.mp3'))
//         .catch(error => {
//         console.log(error);
//     });
//     }
// });
