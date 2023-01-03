const jwt = require('jsonwebtoken');
const Token = require('../utils/token');

function accessTokenCheck(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const user = Token.checkAccessToken(token);
    console.log(user);
    if (!user) return res.status(403).json('You must be logged in');

    next();
  } catch (error) {
    console.log(error);
  }
}
module.exports = accessTokenCheck;
