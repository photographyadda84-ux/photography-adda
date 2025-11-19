const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const axios = require('axios')

function createWindow () {
  const win = new BrowserWindow({ width: 900, height: 700, webPreferences: { nodeIntegration: true, contextIsolation: false } })
  win.loadFile(path.join(__dirname, 'ui.html'))
}

app.whenReady().then(createWindow)

ipcMain.handle('pair-request', async (evt, args) => {
  // Request pairing token from API
  const resp = await axios.post(process.env.API_URL + '/pair/request', { deviceName: 'desktop' })
  return resp.data
})

app.on('window-all-closed', ()=>{ if (process.platform !== 'darwin') app.quit() })
