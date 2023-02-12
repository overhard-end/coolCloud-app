import { Http } from '../api/api';

class FileService {
  async getFiles() {
    return await new Http({ withAuth: true }).get('/files');
  }
  async addFiles(file, headers) {
    return await new Http({ withAuth: true }).post('/files', file, { headers });
  }
  async removeFiles(files) {
    return await new Http({ withAuth: true }).post('/removeFile', files);
  }
}
export default new FileService();
