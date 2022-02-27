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
    const msg = '';
    return res.render('register.ejs', { msg });
  }

  static createUser(req, res) {
    (async () => {
      try {
        const hashPw = await bcrypt.hash(req.body.password, 10);
        if (await User.findOne({ username: req.body.username })) {
          const msg = 'User already exists';
          return res.render('register.ejs', { msg });
        }
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
