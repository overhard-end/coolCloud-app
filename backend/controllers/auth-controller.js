const authService = require('../services/auth-service');
const bcrypt = require('bcrypt');

class AuthController {
  async registration(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const userCheck = await authService.getUser(email);
      if (userCheck) return res.status(400).json('User with email ' + email + ' already exist');

      const newUser = await authService.register(email, password);

      if (!newUser) return res.status(500).json('Cannot register user');
      return res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }

  async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const userDB = await authService.getUser(email);
      if (!userDB) {
        return res.status(403).json(`User with ${email} don't exist`);
      }
      const user = await authService.login(userDB, password);
      if (!user) {
        return res.status(403).json('Password is wrong');
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }
  async logout(req, res, next) {}
}
module.exports = new AuthController();
