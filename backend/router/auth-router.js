const { validationResult, body, check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const express = require('express');
const token = require('../utils/token');
const refreshToken = require('../middlewares/refresh-token');
const router = express.Router();

router.post(
  '/register',
  body('email').isEmail(),

  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ message: errors.array() });
    }
    usersController.registration({ email: req.body.email, password: req.body.password }, res);
  },
);
router.post('/token', refreshToken);

module.exports = router;
