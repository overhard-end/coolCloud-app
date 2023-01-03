const User = require('../models/user');
const RefreshToken = require('../models/token');

const Token = require('../utils/token');
const Hash = require('../utils/hash');
class AuthService {
  async getUser(email) {
    const user = await User.findOne({ email: email });
    if (user === null) return undefined;
    return user;
  }

  async register(email, password) {
    try {
      const hashPassword = await Hash.createPasswordHash(password);

      const user = await User.create({ email: email, password: hashPassword });
      const tokens = Token.tokenPair(user.email);

      const obj = user.toObject();
      const str = JSON.stringify(obj);
      const jsonUser = JSON.parse(str);
      delete jsonUser.password;
      const newUser = { user: jsonUser, ...tokens };
      await RefreshToken.create({
        refreshToken: tokens.refreshToken,
        userId: jsonUser._id,
      });

      return newUser;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  async login(userDB, password) {
    const checkPassword = await Hash.comparePassword(userDB.password, password);
    if (!checkPassword) return false;

    const obj = userDB.toObject();
    const str = JSON.stringify(obj);
    const jsonUser = JSON.parse(str);
    delete jsonUser.password;
    const tokens = Token.tokenPair(jsonUser.email);
    return { user: jsonUser, ...tokens };
  }
}
module.exports = new AuthService();
