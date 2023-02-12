const path = require('path');
const fs = require('fs');
const filesService = require('../services/files-service');
const md5 = require('md5');

class FilesController {
  async getFiles(req, res, next) {
    const userId = req.session.userUuid;
    const storePath = path.join(__dirname, `../uploads/root/${userId}`);
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
    const userId = req.session.userUuid;
    const removeFilePart = (dirname) => path.parse(dirname).dir;
    const { fileName, totalChunks, currentChunkIndex, relativePath } = req.query;
    const relativeDir = removeFilePart(relativePath);
    const destinationPath = path.join(
      __dirname,
      `../uploads/root/${userId}${relativeDir ? '/' + relativeDir : ''}`,
    );

    console.log(destinationPath);
    const data = req.body.toString();
    const chunk = data.split(',').pop();
    const buffer = new Buffer.from(chunk, 'base64');
    const fileExt = fileName.split('.').pop();
    const tmpFileName = md5(fileName) + '.' + fileExt;
    const isFirstChunk = parseInt(currentChunkIndex) === 0;
    const isFileExists = fs.existsSync(destinationPath + '/' + fileName);
    const isDirExists = fs.existsSync(destinationPath);

    try {
      if (isFirstChunk && isFileExists) {
        fs.unlinkSync(destinationPath + '/' + fileName);
      }
      if (!isDirExists) {
        fs.mkdirSync(destinationPath);
      }
      fs.appendFileSync(destinationPath + '/' + tmpFileName, buffer);
      if (totalChunks === currentChunkIndex) {
        fs.renameSync(destinationPath + '/' + tmpFileName, destinationPath + '/' + fileName);
        return res.status(201).json('success');
      }

      res.json('ok');
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
