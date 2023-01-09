const jwt = require('jsonwebtoken');
const accessKey = process.env.JWT_ACCESS_TOKEN_KEY;
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;
class Token {
  checkToken(token, tokenSecret) {
    try {
      const decoded = jwt.verify(token, tokenSecret);
      return decoded;
    } catch (error) {
      return false;
    }
  }

  createAccessToken(email) {
    return jwt.sign({ email: email }, accessKey, { expiresIn: '60s' });
  }
  createRefreshToken(email) {
    const refreshToken = jwt.sign({ email: email }, refreshKey);
    return refreshToken;
  }
  tokenPair(email) {
    const accessToken = this.createAccessToken(email);
    const refreshToken = this.createRefreshToken(email);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}

module.exports = new Token();
