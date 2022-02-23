const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// create session MongoDB variable
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to DB"))

class UserController {
  static getRegister(req, res) {
    return res.render('register.ejs');
  }

  static createUser(req, res) {
    (async () => {
      try {
        const hashPw = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashPw
        });
        try {
          await user.save();
        } catch (err) {
          console.log(err);
          return res.redirect('/register');
        }
        return res.redirect('/login');
      } catch (err) {
        return res.redirect('/register');
      }
    })();
  }
}

module.exports = UserController;
