const dirTree = require('directory-tree'); //library for get files structure from storage directory

class FileService {
  getfilesTree(storagePath) {
    const resuts = dirTree(
      storagePath,
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
    return resuts;
  }
}
module.exports = new FileService();
