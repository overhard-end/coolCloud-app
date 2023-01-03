const authController = require('../controllers/auth-controller');
const express = require('express');
const token = require('../utils/token');
const refreshToken = require('../middlewares/refresh-token');
const router = express.Router();
const { validationResult, body } = require('express-validator');

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ ValidatorMessage: errors.array() });
    }
    next();
  },
  authController.registration,
);
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ ValidatorMessage: errors.array() });
    }
    next();
  },
  authController.login,
);
router.post('/token', refreshToken);

module.exports = router;
