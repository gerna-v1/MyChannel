const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    icon: path.join(__dirname, './img/applogo.ico')
  });

  win.loadFile('index.html');

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(path.join(__dirname, './img/applogo.png')); 
    app.dock.setMenu(contextMenu); 
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('load-videos', async () => {
  try {
    const filePath = path.join(__dirname, 'bucket', 'videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    console.log(JSON.parse(data));
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading videos.json:', error);
    return [];
  }
});

ipcMain.handle('upload-video', async (event, video) => {
  try {
    const videosDir = path.join(__dirname, 'bucket', 'videos');
    const thumbnailsDir = path.join(__dirname, 'bucket', 'thumb');

    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(thumbnailsDir, { recursive: true });

    const videoFilePath = path.join(videosDir, video.videoFileName);
    await fs.writeFile(videoFilePath, Buffer.from(video.videoFileData));

    const thumbnailFilePath = path.join(thumbnailsDir, video.thumbnailFileName);
    await fs.writeFile(thumbnailFilePath, Buffer.from(video.thumbnailFileData));

    const filePath = path.join(__dirname, 'bucket', 'videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);
    videos.push({
      imageUrl: `./bucket/thumb/${video.thumbnailFileName}`,
      videoUrl: `./bucket/videos/${video.videoFileName}`,
      title: video.title,
      description: video.description,
      commentbox: video.commentbox 
    });
    await fs.writeFile(filePath, JSON.stringify(videos, null, 2));

    return true;
  } catch (error) {
    console.error('Error uploading video:', error);
    return false;
  }
});