import { Http } from '../api/api';

class FileService {
  chunkSize = 5 * 1024 * 1024; // 5mb
  async getFiles() {
    return await new Http({ withAuth: true }).get('/files');
  }
  async addFiles(file, headers) {
    return await new Http({ withAuth: true }).post('/files', file, { headers });
  }
  async removeFiles(files) {
    return await new Http({ withAuth: true }).post('/removeFile', files);
  }
  createFileChunk(file) {
    const chunkList = [];
    let cur = 0;
    while (cur < file.size) {
      chunkList.push(file.slice(cur, cur + this.chunkSize));
      cur += this.chunkSize;
    }
    return chunkList;
  }
  ganerateHash(chunkList) {
    return new Promise((resolve) => {
      const worker = new Worker(new URL('../longProcesses/hashFile.js', import.meta.url));
      worker.postMessage(chunkList);
      worker.onmessage = (e) => {
        const hash = e.data;
        if (hash) resolve(hash);
      };
    });
  }
  sendChunk(formdata) {
    return new Promise(async (resolve) => {
      const res = await new Http({ withAuth: true }).post('files', formdata);
      resolve(res);
    });
  }
  async mergeChunks(fileInfo) {
    return new Promise(async (resolve, reject) => {
      const res = await new Http({ withAuth: true }).post('fileMerge', fileInfo);
      if (res.status === 201) return resolve(res);
      reject(res);
    });
  }
}
export default new FileService();
