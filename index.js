const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

const bucketPath = path.join(path.dirname(app.getPath('exe')), 'bucket'); 


function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 480,
    minHeight: 480,
    autoHideMenuBar: true, 
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    icon: path.join(__dirname, './img/applogo.ico')
  });

  win.loadFile('index.html');

  // win.webContents.openDevTools();

  ipcMain.handle('window-minimize', () => {
    win.minimize();
  });
  
  ipcMain.handle('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  
  ipcMain.handle('window-close', () => {
    win.close();
  });
  
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

ipcMain.handle('get-bucket-path', async () => {
  return bucketPath;
});

ipcMain.handle('load-videos', async () => {
  try {
    const filePath = path.join(bucketPath, 'videos.json');
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
    const videosDir = path.join(bucketPath, 'videos');
    const thumbnailsDir = path.join(bucketPath, 'thumb');

    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(thumbnailsDir, { recursive: true });

    const videoFilePath = path.join(videosDir, video.videoFileName);
    await fs.writeFile(videoFilePath, Buffer.from(video.videoFileData));

    const thumbnailFilePath = path.join(thumbnailsDir, video.thumbnailFileName);
    await fs.writeFile(thumbnailFilePath, Buffer.from(video.thumbnailFileData));

    const filePath = path.join(bucketPath, 'videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);
    videos.push({
      imageUrl: path.join(bucketPath, 'thumb', video.thumbnailFileName),
      videoUrl: path.join(bucketPath, 'videos', video.videoFileName),
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

ipcMain.handle('add-comment', async (event, { videoIndex, comment }) => {
  try {
    const filePath = path.join(bucketPath, 'videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);

    videos[videoIndex].commentbox.push(comment);

    await fs.writeFile(filePath, JSON.stringify(videos, null, 2));

    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    return false;
  }
});

ipcMain.handle('update-like', async (event, { videoIndex, commentIndex }) => {
  try {
    const filePath = path.join(bucketPath, 'videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);

    // I can't believe this nesting is real
    videos[videoIndex].commentbox[commentIndex].likes++;

    await fs.writeFile(filePath, JSON.stringify(videos, null, 2));

    return videos[videoIndex].commentbox[commentIndex].likes;
  } catch (error) {
    console.error('Error updating like:', error);
    return null;
  }
});

ipcMain.handle('register-user', async (event, { username, password }) => {
  try {
    const filePath = path.join(bucketPath, 'users.json');
    const data = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(data);

    if (users.find(user => user.username === username)) {
      return { success: false, message: 'El usuario ya existe' };
    }

    users.push({ username, password });
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    return { success: true, message: 'El usuario fue registrado exitosamente' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Error registrando usuario' };
  }
});

ipcMain.handle('login-user', async (event, { username, password }) => {
  try {
    const filePath = path.join(bucketPath, 'users.json');
    const data = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(user => user.username === username);

    if (!user) {
      return { success: false, message: 'El usuario no existe' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    return { success: true, message: 'El inicio de sesión se realizó con éxito', user: username };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, message: 'Error iniciando sesión' };
  }
});

ipcMain.handle('logoff-user', async () => {
  return { success: true, message: 'La sesión fue cerrada con éxito' };
});

