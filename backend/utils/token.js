const jwt = require('jsonwebtoken');

class Token {
  createAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_KEY, { expiresIn: '30s' });
  }
  createRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN_KEY);
    return refreshToken;
  }
}

module.exports = new Token();
