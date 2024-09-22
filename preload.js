const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoAPI', {
  loadVideos: () => ipcRenderer.invoke('load-videos'),
  uploadVideo: (video, videoFilePath, thumbnailFilePath) => ipcRenderer.invoke('upload-video', video, videoFilePath, thumbnailFilePath)
});