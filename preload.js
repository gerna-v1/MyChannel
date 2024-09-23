const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoAPI', {
  loadVideos: () => ipcRenderer.invoke('load-videos'),
  uploadVideo: (video) => ipcRenderer.invoke('upload-video', video),
  getBucketPath: () => ipcRenderer.invoke('get-bucket-path'),
  addComment: (videoIndex, comment) => ipcRenderer.invoke('add-comment', { videoIndex, comment }),
  updateLike: (videoIndex, commentIndex) => ipcRenderer.invoke('update-like', { videoIndex, commentIndex })
});

contextBridge.exposeInMainWorld('loginAPI', {
  registerUser: (username, password) => ipcRenderer.invoke('register-user', { username, password }),
  loginUser: (username, password) => ipcRenderer.invoke('login-user', { username, password }),
  logoffUser: () => ipcRenderer.invoke('logoff-user')
});