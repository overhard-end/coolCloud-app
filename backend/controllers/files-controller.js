const path = require('path');
const fs = require('fs');
var qs = require('querystring');
const dirTree = require('directory-tree'); //library for get files structure from directory

class FilesController {
  async sendFiles(req, res, next) {
    const uploadsPath = path.join(__dirname, '../uploads/rootDisk');
    const files = dirTree(
      uploadsPath,
      {
        attributes: ['size', 'type', 'extension'],
        normalizePath: true,
      },
      null,
      (item, path, stats) => {
        let newPath = path.split('rootDisk').pop();
        item.path = newPath;
        for (let i = 0; i < item.children.length; i++) {
          let newPath = item.children[i].path.split('rootDisk').pop();
          item.children[i].path = newPath;
        }
      },
    );

    res.json(files);
    next();
  }

  async saveFiles(req, res, next) {
    const uploadsPath = path.join(__dirname, '../uploads/rootDisk');
    const body = req.body;
    const files = req.files;

    const getRelativePath = (pathArray, files) => {
      let fileName;
      let filePath;
      let separatePath;
      for (let i = 0; i < pathArray.length; i++) {
        separatePath = pathArray[i].split('/');
        fileName = separatePath.pop();
        filePath = separatePath.join('/');

        filePath = path.join(uploadsPath, filePath);
        console.log(filePath);

        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
        }
        fs.writeFileSync(filePath + '/' + fileName, files.file[i].buffer);
      }
    };
    getRelativePath(body.pathArray, files);

    res.send(body.pathArray);
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
