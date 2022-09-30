const express = require('express')
const { Server: SocketServer } = require('socket.io')
const http = require('http')
const cors = require('cors')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

let mainWindow
let mainUser

// Reload in Development for Browser Windows
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    // electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
}

// Menu Template
const templateMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Usuario',
        accelerator: 'Ctrl+N',
        click() {
          createUsuario()
        }
      }
    ]
  }
]

// Ventana principal
const createWindow = () => {
  // The Main Window
  mainWindow = new BrowserWindow({ width: 720, height: 600 })

  // abrir las devtools
  // mainWindow.webContents.openDevTools(),
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../client/dist/index.html'),
      protocol: 'file',
      slashes: true
    })
  )

  // Menu

  const mainMenu = Menu.buildFromTemplate(templateMenu)
  // Se asigna el menu
  Menu.setApplicationMenu(mainMenu)
}

// Asignacion de la pantalla principal
app.on('ready', createWindow)

// Ventana de Usuario
function createUsuario() {
  mainUser = new BrowserWindow({
    width: 400,
    height: 330,
    title: 'User'
  })
  mainUser.setMenu(null)

  mainUser.loadURL(
    url.format({
      pathname: path.join(__dirname, '../user/dist/index.html'),
      protocol: 'file',
      slashes: true
    })
  )
  mainUser.on('closed', () => {
    mainUser = null
  })
}

// SOCKET

let usuarioHidden = false
const server = express()

const serverApp = http.createServer(server)

const io = new SocketServer(serverApp, {
  cors: {
    origin: '*'
  }
})
server.use(cors())

io.on('connection', (socket) => {
  console.log('Me conecteeeeee')
  socket.on('dato', function (message) {
    usuarioHidden = message
    console.log(message)
    socket.broadcast.emit('dato', message)
  })
  // socket.emit('dato', usuarioHidden)
})
serverApp.listen(3001, () => {
  console.log('Server start on port 3001')
})
