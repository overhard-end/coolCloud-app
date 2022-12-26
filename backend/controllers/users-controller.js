const User = require('../models/user');
const authService = require('../services/auth-service');

class UsersController {
  async registration(NewUserData, res) {
    try {
      const email = NewUserData.email;
      console.log(email);
      const password = NewUserData.password;
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(400).json('User with email ' + email + ' already exist');
      }
      const user = authService.register(email, password);
      if (!user) {
        return res.status(500).json('Something went wrong');
      }
      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }
  async login(req, res, next) {}
  async logout(req, res, next) {}
}
module.exports = new UsersController();
