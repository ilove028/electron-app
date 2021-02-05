const { app, BrowserWindow } = require('electron');

function updateProcess(win) {
  win.setProgressBar(0.5);
  setTimeout(() => {
    win.setProgressBar(-1);
  }, 3000);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
  updateProcess(win);
  win.webContents.openDevTools()
//   win.once('focus', () => win.flashFrame(false))
// win.flashFrame(true)
  // win.setOverlayIcon('img/result.png', 'Description for overlay')
}

app.whenReady().then(createWindow);

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});