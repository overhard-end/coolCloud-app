const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files-controller');
const accessTokenCheck = require('../middlewares/access-token-check');

router.get('/files', accessTokenCheck, filesController.getFiles);
router.post('/files', accessTokenCheck, filesController.saveChunks);
router.post('/fileCheck', accessTokenCheck, filesController.checkFile);
router.post('/fileMerge', accessTokenCheck, filesController.mergeFile);
router.post('/removeFile', accessTokenCheck, filesController.removeFile);

module.exports = router;
