require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('./models/user');
const initializePassport = require('./passport-config');
const app = express();

// create session MongoDB variable
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to DB"))

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

initializePassport(
  passport,
  async (username) => {
    const query = await User.findOne({ 'username': username })
    return query;
  },
  async (id) => {
    const query = await User.findById(id);
    return query;
  }
);

app.get('/', checkAuthenticated, (req, res) => res.render('index.ejs'));
app.get('/login', checkNotAuthenticated, (req, res) => res.render('login.ejs'));
app.get('/register', checkNotAuthenticated, (req, res) => res.render('register.ejs'));

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
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
})

app.delete('/logout', (req, res) => {
  req.logOut();
  return res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

app.listen(3000, () => console.log('connected on port 3000'));
