import { Http } from '../api/api';
import store from '../redux/store';

class FileService {
  chunkSize = 5 * 1024 * 1024; // 5mb
  async getFiles() {
    return new Promise(async (resolve, reject) => {
      await new Http({ withAuth: true })
        .get('/files')
        .then((res) => {
          if (res.status === 200) return resolve(res);
        })
        .catch((error) => reject(error));
    });
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
      worker.onmessage((e) => {
        store.dispatch({ type: 'UPLOAD_PROGRESS', payload: e.data.progress });
        if (e.data.ready) resolve(e.data.hash);
      });
    });
  }
  sendChunk(formdata) {
    return new Promise(async (resolve) => {
      const res = await new Http({ withAuth: true }).post('files', formdata);
      resolve(res);
    });
  }
  async mergeChunks(data) {
    data.size = this.chunkSize;
    console.log(data);
    return new Promise(async (resolve, reject) => {
      await new Http({ withAuth: true }).post('fileMerge', data).then(resolve()).catch(reject());
    });
  }
}
export default new FileService();
