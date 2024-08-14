/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const fs = require('fs');
const { generatePDF } = require('../renderer/components/generatePDF'); // Import your PDF generator

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('save-order', (event, orderData) => {
  const isDev = process.env.NODE_ENV === 'development';
  const ordersFilePath = isDev
    ? path.join(__dirname, '../renderer/data/orders.json')
    : path.join(app.getPath('userData'), 'orders.json');
      let ordersData = [];

  if (fs.existsSync(ordersFilePath)) {
    ordersData = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
  }

  const newOrder = {
    id: (ordersData.length > 0 ? Math.max(...ordersData.map(order => order.id)) + 1 : 1),
    ...orderData,
  };

  ordersData.push(newOrder);

  fs.writeFileSync(ordersFilePath, JSON.stringify(ordersData, null, 2), 'utf8');

  event.reply('order-saved', newOrder);
});

ipcMain.on('delete-order', (event, orderId) => {
  const isDev = process.env.NODE_ENV === 'development';
  const ordersFilePath = isDev
    ? path.join(__dirname, '../renderer/data/orders.json')
    : path.join(app.getPath('userData'), 'orders.json');

  let ordersData = [];

  if (fs.existsSync(ordersFilePath)) {
    ordersData = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
  }

  const updatedOrders = ordersData.filter((order) => order.id !== orderId);

  fs.writeFileSync(ordersFilePath, JSON.stringify(updatedOrders, null, 2), 'utf8');

  event.reply('order-deleted', orderId);
})

// Print functionality
ipcMain.handle('save-pdf', async (event, order) => {
  const pdfBlob = generatePDF(order);
  const filePath = path.join(app.getPath('documents'), `order_${order.id}.pdf`);
  fs.writeFileSync(filePath, Buffer.from(await pdfBlob.arrayBuffer()));

  // Open the PDF file with the default viewer
  shell.openPath(filePath);

  return filePath;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    width: width,      // Set width to the screen width
    height: height,    // Set height to the screen height
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
