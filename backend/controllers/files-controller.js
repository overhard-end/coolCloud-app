const path = require('path');
const fs = require('fs');
const filesService = require('../services/files-service');
const busboy = require('busboy');
const { resolve } = require('path');
const UPLOAD_DIR = path.join(__dirname, '../uploads/root');
class FilesController {
  async checkFile(req, res) {
    try {
      const userId = req.session.userUuid;
      const { fileName } = req.body;
      const checkingFilePath = path.join(UPLOAD_DIR, userId, fileName);
      const fileExists = fs.existsSync(checkingFilePath);
      if (fileExists)
        return res.status(409).json({ message: 'File already exists', upload: false });
      res.json({ message: 'Ready for upload', upload: true });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  async getFiles(req, res) {
    try {
      const userId = req.session.userUuid;
      const storePath = path.join(UPLOAD_DIR, userId);
      if (!fs.existsSync(storePath)) {
        fs.mkdirSync(storePath);
      }
      const filesTree = filesService.getfilesTree(storePath, userId);
      filesTree.maxSize = process.env.USER_DEFAULT_STORAGE_SIZE;
      res.status(200).json(filesTree);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
  async mergeFile(req, res) {
    try {
      const { fileName, fileHash, size, relativePath } = req.body;
      const userId = req.session.userUuid;
      const userDir = path.resolve(UPLOAD_DIR, userId);
      const chunkDir = path.resolve(UPLOAD_DIR, userDir, `chunkDir_${fileHash}`);
      const lastFilePath = path.join(userDir, relativePath);
      console.log(lastFilePath);
      if (!fs.existsSync(lastFilePath)) {
        fs.mkdirSync(lastFilePath);
      }
      const allChunksPath = fs.readdirSync(chunkDir);
      allChunksPath.sort((a, b) => a.split('-')[1] - b.split('-')[1]);

      const pipeStream = (chunkPath, writeStream) => {
        return new Promise((resolve) => {
          const readStream = fs.createReadStream(chunkPath);
          readStream.on('end', () => {
            fs.unlink(chunkPath, () => resolve(true));
          });
          readStream.pipe(writeStream);
        });
      };
      await Promise.all(
        allChunksPath.map((chunkPath, index) =>
          pipeStream(
            path.resolve(chunkDir, chunkPath),
            fs.createWriteStream(path.resolve(lastFilePath, fileName), { start: index * size }),
          ),
        ),
      )
        .then(() => {
          fs.rmdirSync(chunkDir);
          res.json({ status: 'success', fileName: fileName });
        })
        .catch((err) => err);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
  async saveChunks(req, res) {
    try {
      const userId = req.session.userUuid;
      const bb = busboy({ headers: req.headers });
      const userDir = path.resolve(UPLOAD_DIR, userId);

      bb.on('file', (name, file, info) => {
        const fileHash = name.split('-')[0];
        const chunkDir = path.resolve(UPLOAD_DIR, userDir, `chunkDir_${fileHash}`);
        if (!fs.existsSync(chunkDir)) {
          fs.mkdirSync(chunkDir);
        }
        file.pipe(fs.createWriteStream(path.resolve(chunkDir, name)));
      });
      bb.on('close', () => console.log('current chunk was uploaded'), res.json('ok'));
      req.pipe(bb);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  async removeFile(req, res) {
    const filePath = req.body.file.path;
    const fileType = req.body.file.type;

    const relativePath = path.join(__dirname, '../uploads/rootDisk', filePath);
    const fileExist = fs.existsSync(relativePath);
    try {
      if (!fileExist) {
        return res.json({ statusSuccesse: false, message: 'File not found !' });
      }
      if (fileType === 'file') {
        fs.unlinkSync(relativePath);
        return res
          .status(200)
          .send({ statusSuccesse: true, message: 'File has been successfully deleted ! ' });
      }
      fs.rmSync(relativePath, { recursive: true, force: true });
      res
        .status(200)
        .send({ statusSuccesse: true, message: 'Folder has been successfully deleted ! ' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ statusSuccesse: false, message: error });
    }
  }
}
module.exports = new FilesController();
