const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree'); //library for get files structure from directory


class FilesController {
  async sendFiles(req, res, next) {
    const uploadsPath = path.join(__dirname, '../uploads/root');
    const files = dirTree(
      uploadsPath,
      {
        attributes: ['size', 'type', 'extension'],
        normalizePath: true,
      },
      null,
      (item, path, stats) => {
        let newPath = path.split('root').pop();
        item.path = newPath;
        for (let i = 0; i < item.children.length; i++) {
          let newPath = item.children[i].path.split('root').pop();
          item.children[i].path = newPath;
        }
      },
    );
          if(!files){
         return res.json('No such of files yet')
       }
    res.json(files);
    
  }

  async saveFiles(req, res, next) {
    try {
      const destinationPath = path.join(__dirname, '../uploads/root/');
      const relativePaths = req.body.relativePath;
      const files = req.files.files;

       
      for (let i = 0; i < files.length; i++) {
        let fileData = files[i].buffer
        //For single file
        if(!Array.isArray(relativePaths)){
          let pathForMkDir = relativePaths.split('/')
          pathForMkDir.pop()

          fs.mkdirSync(destinationPath + pathForMkDir,{ recursive: true })
          fs.writeFileSync(destinationPath + relativePaths, fileData); 

          return res.json(`File has been upload`)
         }
         //For few files
        let relativePath = relativePaths[i]
        let pathForMkDir = relativePath.split('/')
        pathForMkDir.pop()
       

        fs.mkdirSync(destinationPath + pathForMkDir,{ recursive: true })

        fs.writeFileSync(destinationPath + relativePath, fileData); 
      }
     
    res.json('Files has been upload')
    
    } catch (error) {
      res.json(error)
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
