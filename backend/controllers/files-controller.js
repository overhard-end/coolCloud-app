const path = require('path');
const fs = require('fs');
const busboy = require('busboy');
const filesService = require('../services/files-service');
const UPLOAD_DIR = path.join(__dirname, '../uploads/root');
const TMP_DIR = path.join(__dirname, '../tmp');

class FilesController {
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
  async checkFile(req, res) {
    try {
      const userId = req.session.userUuid;
      const { fileName, fileHash } = req.body;
      const checkingFilePath = path.resolve(UPLOAD_DIR, userId, fileName);
      const chunkDirPath = path.resolve(TMP_DIR, userId, `chunkDir_${fileHash}`);
      const isFileExist = fs.existsSync(checkingFilePath);
      const isChunkDirExist = fs.existsSync(chunkDirPath);
      if (isFileExist) return res.json({ exist: true });

      if (!isChunkDirExist) return res.json({ exist: false });
      const uploadedChunks = fs.readdirSync(chunkDirPath);
      const chunksIndex = uploadedChunks.map((chunk) => parseInt(chunk.split('-').pop()));
      if (chunksIndex.length > 0) return res.json({ exist: false, lastIndex: chunksIndex });
      res.json({ exist: false });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  async mergeFile(req, res) {
    try {
      const { fileName, fileHash, size, relativePath } = req.body;
      const userId = req.session.userUuid;
      const userDir = path.resolve(UPLOAD_DIR, userId);
      const userTmpDir = path.resolve(TMP_DIR, userId);
      const chunkDir = path.resolve(TMP_DIR, userTmpDir, `chunkDir_${fileHash}`);
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
      ).then(() => {
        if (fs.existsSync(chunkDir)) fs.rmdirSync(chunkDir);
        fs.rmdirSync(userTmpDir);
        res.json({ status: 'success', fileName: fileName });
      });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
  async saveChunks(req, res) {
    try {
      const userId = req.session.userUuid;
      const userTmpDir = path.resolve(TMP_DIR, userId);
      const bb = busboy({ headers: req.headers });
      if (!fs.existsSync(userTmpDir)) fs.mkdirSync(userTmpDir);

      bb.on('file', (chunkName, chunk) => {
        const fileHash = chunkName.split('-')[0];
        const chunkSize = parseInt(chunkName.split('-')[1]);
        const chunkDir = path.resolve(TMP_DIR, userTmpDir, `chunkDir_${fileHash}`);
        if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);
        const chunkPath = path.resolve(chunkDir, chunkName);
        req.on('close', () =>
          filesService.checkChunk(chunkPath, chunkSize) ? res.json() : res.sendStatus(400),
        );
        chunk.pipe(fs.createWriteStream(chunkPath));
      });
      req.pipe(bb);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  async removeFile(req, res) {
    const userId = req.session.userUuid;
    const filePath = req.body.filePath;
    const pathForDelete = path.join(UPLOAD_DIR, userId, filePath);
    const isfileExist = fs.existsSync(pathForDelete);
    try {
      if (!isfileExist) {
        return res.json({ statusSuccesse: false, message: 'File not found !' });
      }
      fs.unlinkSync(pathForDelete);
      return res
        .status(200)
        .send({ statusSuccesse: true, message: 'File has been successfully deleted ! ' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ statusSuccesse: false, message: error });
    }
  }
}

module.exports = new FilesController();
