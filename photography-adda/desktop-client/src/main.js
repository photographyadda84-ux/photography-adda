const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
function createWindow () {
  const win = new BrowserWindow({ width: 900, height: 700, webPreferences: { nodeIntegration: true, contextIsolation: false } })
  win.loadURL('https://your-app.example.com/desktop') // placeholder
}
app.whenReady().then(createWindow)
app.on('window-all-closed', ()=>{ if (process.platform !== 'darwin') app.quit() })
