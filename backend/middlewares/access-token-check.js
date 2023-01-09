const Token = require('../utils/token');
const accessKey = process.env.JWT_ACCESS_TOKEN_KEY;

function accessTokenCheck(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const user = Token.checkToken(token, accessKey);
    if (!user) return res.sendStatus(401);

    next();
  } catch (error) {
    console.log(error);
  }
}
module.exports = accessTokenCheck;
