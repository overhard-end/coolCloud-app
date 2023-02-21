const path = require('path');
const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files-controller');
const accessTokenCheck = require('../middlewares/access-token-check');

router.get('/files', accessTokenCheck, filesController.getFiles);
router.post('/filesCheck', accessTokenCheck, filesController.checkFileExists);
router.post('/files', accessTokenCheck, filesController.saveFiles);
router.post('/removeFile', accessTokenCheck, filesController.removeFile);

module.exports = router;
