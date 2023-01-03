const jwt = require('jsonwebtoken');
const accessKey = process.env.JWT_ACCESS_TOKEN_KEY;
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;
class Token {
  checkRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, refreshKey);
      if (!decoded) return false;
      return decoded;
    } catch (error) {
      console.log(error);
    }
  }
  checkAccessToken(token) {
    try {
      const decoded = jwt.verify(token, accessKey);
      if (!decoded) return false;
      return decoded;
    } catch (error) {
      console.log(error);
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
