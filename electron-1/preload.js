const { ipcRenderer } = require('electron');

// Send synchronous message on "bx" to the main process to get bx
// const bx = ipcRenderer.sendSync('bx');

window.bx = {
    // Send asynchronous message on bx with the data "name" to get an async reply on bx-name with the name of the app
    // Resolve name :) 
    getName: () => new Promise(resolve => {
        ipcRenderer.send('bx', 'name');
        ipcRenderer.on('bx-name', (event, name) => {
            resolve(name);
        });
    }),
    // Same here :D
    getVersion: () => new Promise(resolve => {
        ipcRenderer.send('bx', 'version');
        ipcRenderer.on('bx-version', (event, version) => {
            resolve(version);
        });
    }),
};