// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow, shell } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// PRINTING BUG EXAMPLE
ipcMain.on('print', (event, options) => {
  console.log('==============================');
  console.log('Printing initiated with the following options:');
  console.log(options);

  // Create a  window with the print page
  let printWindow = new BrowserWindow({show: false});

  printWindow.loadFile('print-page.html')

  printWindow.webContents.on('did-finish-load', function () {

    // Print 
    printWindow.webContents.print(options, success => {
      if (success) {
        console.log("Print job was succesfull!");
      } else {
        console.log("Print job was not succesfull )-;");
      }

      // Close the window
      printWindow.destroy();

      console.log('Printing finished.')
      console.log('==============================');
    });
  });

});