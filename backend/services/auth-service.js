const User = require('../models/user');
class AuthService {
  register(email, password) {
    const user = new User({ email: email, password: password });
    user.save();
    return user;
  }
}
module.exports = new AuthService();
