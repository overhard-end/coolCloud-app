const User = require('../models/user');
const authService = require('../services/auth-service');

class UsersController {
  async registration(req, res, next) {
    const email = req.body.email;
    console.log(email);
    const password = req.body.password;
    await User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json('Something was wrong');
      }
      if (user) {
        return res.json('User with email ' + email + ' already exist');
      }
    });
    const user = authService.register(email, password);
    if (user) {
      res.status(200).json(user);
    }
  }
  async auntification(req, res, next) {}
  async autorization(req, res, next) {}
}
module.exports = new UsersController();
