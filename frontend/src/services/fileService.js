import axios from 'axios';
import Http from '../api/api';
class FileService {
  chunkSize = 10 * 1024 * 1024;
  sourse = axios.CancelToken.source();
  api = new Http({ withAuth: true });
  progressArray = [];
  getFiles() {
    return new Promise(async (resolve) => {
      await this.api.get('/files').then((res) => resolve(res));
    });
  }
  async removeFiles(filePath) {
    return await this.api.post('/removeFile', { filePath: filePath });
  }
  getRelativePath(currentPath, file) {
    let webkitRelativePath = file.webkitRelativePath.split('/');
    webkitRelativePath.pop();
    const relativeFilePath = webkitRelativePath.join('/');
    if (currentPath) return currentPath + '/' + relativeFilePath;
    return relativeFilePath;
  }
  checkFile({ fileName, fileHash }) {
    return new Promise(async (resolve) => {
      await this.api.post('/fileCheck', { fileName: fileName, fileHash: fileHash }).then((res) => {
        resolve(res.data);
      });
    });
  }
  createFileChunk(file) {
    const chunkList = [];
    let cur = 0;
    let index = 0;
    while (cur < file.size) {
      let chunkItem = { index: index, chunk: file.slice(cur, cur + this.chunkSize) };
      chunkList.push(chunkItem);
      cur += this.chunkSize;
      index++;
    }
    console.log(chunkList);
    return chunkList;
  }
  ganerateHash(chunkList, handleHashingProgress) {
    return new Promise((resolve) => {
      const worker = new Worker(new URL('../longProcesses/hashFile.js', import.meta.url));
      worker.postMessage(chunkList);
      let progress;
      worker.onmessage = (e) => {
        if (e.data.progress !== progress) {
          progress = e.data.progress;
          handleHashingProgress(e.data.progress);
        }
        if (e.data.ready) {
          return resolve(e.data.hash);
        }
      };
    });
  }

  fileUploadProgress = (chunksProgress, chunksLenght) => {
    this.progressArray[chunksProgress.index] = chunksProgress.percent;
    let totalChunksPercent = this.progressArray.reduce((sum, current) => sum + current, 0);
    return Math.round((totalChunksPercent / (chunksLenght * 100)) * 100);
  };

  chunkUploadProgress = (chunkIndex, progress) => {
    const percent = Math.round((progress.loaded / progress.total) * 100);
    return { index: chunkIndex, percent: percent };
  };
  downloadFile(filePath) {
    return this.api.post('fileDownload', { filePath: filePath }, { responseType: 'blob' });
  }
  async chunksRequestPool(chunkList, fileHash, handleUploadProgress) {
    let requests = [];
    chunkList.map((chunk) => {
      const chunkName = `${fileHash}-${chunk.chunk.size}-${chunk.index}`;
      const config = {
        onUploadProgress: handleUploadProgress(chunk.index),
      };
      return requests.push(this.sendChunk(chunkName, chunk.chunk, config));
    });
    return await Promise.all(requests);
  }
  sendChunk(chunkName, chunk, config) {
    const formData = new FormData();
    formData.append(chunkName, chunk);
    return this.api.post('/chunk', formData, {
      ...config,
      cancelToken: this.sourse.token,
    });
  }
  cancelRequests() {
    this.sourse.cancel();
  }
  mergeChunks(data) {
    data.size = this.chunkSize;
    return new Promise(async (resolve, reject) => {
      await this.api.post('/fileMerge', data).then(resolve()).catch(reject());
    });
  }
}
export default new FileService();
