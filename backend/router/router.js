const path = require('path');
const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files-controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const multerUploadsSet = upload.fields([
  { name: 'files', maxCount: 100 },
  { name: 'relativePath',maxCount:100 }
  
]);

router.get('/files', filesController.sendFiles);
router.post('/files', multerUploadsSet, filesController.saveFiles);
router.post('/removeFile', filesController.removeFile);

module.exports = router;
