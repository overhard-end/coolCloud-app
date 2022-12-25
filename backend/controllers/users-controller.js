const User = require('../models/user');

class UsersController {
  async registration(req, res, next) {
    const email = req.body.email;
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        return res.json('user with email ' + email + ' already exist');
      }
    });

    // const user = new User({ email: email, password: 'passwssord', role: 'admin' });
    // user.save();
  }
  async auntification(req, res, next) {}
  async autorization(req, res, next) {}
}
module.exports = new UsersController();
