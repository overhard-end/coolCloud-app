const { validationResult, body } = require('express-validator');
const usersController = require('../controllers/users-controller');
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json(req.body);
});

module.exports = router;
