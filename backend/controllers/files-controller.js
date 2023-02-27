const path = require('path');
const fs = require('fs');
const filesService = require('../services/files-service');
const busboy = require('busboy');
const UPLOAD_DIR = path.join(__dirname, '../uploads/root');
class FilesController {
  async checkFileExists(req, res) {
    const userId = req.session.userUuid;
    const { fileName } = req.body;
    const checkingFilePath = path.join(UPLOAD_DIR, userId, fileName);
    const fileExists = fs.existsSync(checkingFilePath);
    if (fileExists) return res.status(409).json({ message: 'file already exists' });
    res.json({ message: 'ready for upload' });
  }
  async getFiles(req, res, next) {
    const userId = req.session.userUuid;
    const storePath = path.join(UPLOAD_DIR, userId);
    try {
      if (!fs.existsSync(storePath)) {
        fs.mkdirSync(storePath);
      }
      const filesTree = filesService.getfilesTree(storePath, userId);
      filesTree.maxSize = 15 * 1024 * 1024 * 1024;
      res.status(200).json(filesTree);
    } catch (error) {
      res.status(500).json('Server error');
    }
  }

  async saveFiles(req, res, next) {
    try {
      const bb = busboy({ headers: req.headers });
      const userId = req.session.userUuid;
      const destinationPath = path.join(__dirname, `../uploads/root/`, userId);
      const getChunkDir = (fileHash) => path.resolve(destinationPath, `chunkDir_${fileHash}`);
      bb.on('file', (name, file, info) => {
        const fileHash = name.split('-')[0];
        const chunkDir = getChunkDir(fileHash);
        if (!fs.existsSync(chunkDir)) {
          fs.mkdirSync(chunkDir);
        }
        file.pipe(fs.createWriteStream(path.resolve(chunkDir, name)));
      });
      bb.on('close', () => console.log('current chunk was uploaded'), res.json('ok'));
      req.pipe(bb);

      // const hash = Object.keys(files)[0].split('-')[0];
      // const file = files[hash + '-' + count];

      // const chunkDir = getChunkDir(hash);
      // if (!fs.existsSync(chunkDir)) {
      //   fs.mkdirSync(chunkDir);
      // }
      // fs.renameSync(file.filepath, path.resolve(chunkDir, `${hash}-${count}`));
      // count++;
      // res.json(file);

      // const chunkIndex = parseInt(currentChunkIndex);
      // console.log(chunkIndex);
      // const totalChunkIndex = parseInt(totalChunks);
      // const data = req.body.toString();
      // const chunk = data.split(',').pop();
      // const buffer = new Buffer.from(chunk, 'base64');
      // const fileExt = fileName.split('.').pop();
      // const tmpFileName = md5(fileName) + '.' + fileExt;

      // const isFirstChunk = chunkIndex === 0;
      // const isFileExists = fs.existsSync(destinationPath + '/' + fileName);
      // const isDirExists = fs.existsSync(destinationPath);
      // const isNextFile = chunkIndex !== totalChunkIndex;

      // if (isFirstChunk && isFileExists) {
      //   fs.unlinkSync(destinationPath + '/' + fileName);
      // }
      // if (!isDirExists) {
      //   fs.mkdirSync(destinationPath);
      // }
      // fs.appendFileSync(destinationPath + '/' + tmpFileName, buffer);
      // if (totalChunks !== currentChunkIndex) {
      //   return res.json('Chunk number ' + currentChunkIndex + ' from ' + fileName + ' was saved');
      // }

      // fs.renameSync(destinationPath + '/' + tmpFileName, destinationPath + '/' + fileName);
      // res.status(201).json('File ' + fileName + ' was successfully saved');
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  // async saveFiles(req, res, next) {
  //   const userId = req.session.userUuid;

  //   try {
  //     const destinationPath = path.join(__dirname, `../uploads/root/${userId}`);
  //     let relativePaths = req.body.relativePath;
  //     const files = req.files.files;
  //     if (!Array.isArray(relativePaths)) {
  //       relativePaths = [relativePaths];
  //     }
  //     for (let i = 0; i < files.length; i++) {
  //       let fileData = files[i].buffer;
  //       let relativePath = relativePaths[i];
  //       let pathForMkDir = path.join(destinationPath, relativePath);
  //       pathForMkDir.split('/').pop();
  //       pathForMkDir = pathForMkDir.join('/');
  //       let pathForSave = path.join(destinationPath, relativePath);

  //       console.log(pathForMkDir);
  //       fs.mkdirSync(pathForMkDir, { recursive: true });
  //       fs.writeFileSync(pathForSave, fileData);
  //     }
  //     const filesTree = filesService.getfilesTree(destinationPath, userId);
  //     res.json(filesTree);
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).json(error);
  //   }
  // }

  async removeFile(req, res, next) {
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
      res.status(500).send({ statusSuccesse: false, message: error });
    }
  }
}
module.exports = new FilesController();
