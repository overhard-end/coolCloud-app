const User = require('../models/user');
const Token = require('../utils/token');
class AuthService {
  register(email, password) {
    const user = new User({ email: email, password: password });
    user.save();
    if (user) {
      const accessToken = Token.createAccessToken({ user: user.email });
      const refreshToken = Token.createRefreshToken({ user: user.email });
      const newUser = { user: user, accessToken: accessToken, refreshToken: refreshToken };
      return newUser;
    }
    return null;
  }
}
module.exports = new AuthService();
