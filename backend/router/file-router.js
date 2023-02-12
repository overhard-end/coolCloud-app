const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const filesController = require('../controllers/files-controller');
const accessTokenCheck = require('../middlewares/access-token-check');
const upload = multer({ storage: multer.memoryStorage() });

const multerUploadsSet = upload.fields([
  { name: 'file', maxCount: 100 },
  { name: 'fileName', maxCount: 100 },
]);

router.get('/files', accessTokenCheck, filesController.getFiles);
router.post('/files', accessTokenCheck, filesController.saveFiles);
router.post('/removeFile', accessTokenCheck, filesController.removeFile);

module.exports = router;
