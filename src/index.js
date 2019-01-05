const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

autoUpdater.on('checking-for-update', function() {
  mainWindow.webContents.send('updateStatus', 'Checking for Update...');
});
autoUpdater.on('update-available', function(info) {
  console.log(info);
  mainWindow.webContents.send('updateNotify', 'Update Available');
});
autoUpdater.on('update-downloaded', function(info) {
  console.log(info);
  mainWindow.webContents.send('updateReady', 'Restart to Install Update');
});
autoUpdater.on('download-progress', function(data) {
  console.log(data);
});

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // create a socket server

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;

    // attempt to close all windows when main closes so the app quits
    const allWindows = BrowserWindow.getAllWindows();
    for (const w in allWindows) {
      allWindows[w].close();
    }
  });

  autoUpdater.checkForUpdatesAndNotify();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
