const path = require('path');
const fs = require('fs');
const filesService = require('../services/files-service');

class FilesController {
  async sendFiles(req, res, next) {
    try {
      const filesTree = filesService.getfilesTree(path.join(__dirname, '../uploads/root'));
      filesTree.maxSize = 15 * 1024 * 1024 * 1024;
      res.status(200).json(filesTree);
    } catch (error) {
      res.status(500).json('Server error');
    }
  }

  async saveFiles(req, res, next) {
    try {
      const destinationPath = path.join(__dirname, '../uploads/root/');
      let relativePaths = req.body.relativePath;
      const files = req.files.files;
      if (!Array.isArray(relativePaths)) {
        relativePaths = [relativePaths];
      }
      for (let i = 0; i < files.length; i++) {
        let fileData = files[i].buffer;
        let relativePath = relativePaths[i];
        let pathForMkDir = path.dirname(relativePaths[i]);

        console.log(pathForMkDir);
        fs.mkdirSync(destinationPath + pathForMkDir, { recursive: true });

        fs.writeFileSync(destinationPath + relativePath, fileData);
      }
      const filesTree = filesService.getfilesTree(path.join(__dirname, '../uploads/root'));
      res.json(filesTree);
    } catch (error) {
      res.json(error);
    }
  }

  async removeFile(req, res, next) {
    const filePath = req.body.file.path;
    const fileType = req.body.file.type;

    const relativePath = path.join(__dirname, '../uploads/rootDisk', filePath);
    const fileExist = fs.existsSync(relativePath);
    console.log(fileExist);
    console.log(relativePath);

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
