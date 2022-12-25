const jwt = require('jsonwebtoken');

class TokenUtil {
  createAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_KEY);
  }
}
module.exports = new TokenUtil();
