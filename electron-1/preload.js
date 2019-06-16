const { ipcRenderer } = require('electron');

// Send synchronous message on "bx" to the main process to get bx
const bx = ipcRenderer.sendSync('bx');

window.bx = {
    getName: () => Promise.resolve(bx.name),
    getVersion: () => Promise.resolve(bx.version),
};