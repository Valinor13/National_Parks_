const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const AppController = require('../controllers/AppController');
// const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/', checkAuthenticated, AppController.getIndex);
router.get('/login', checkNotAuthenticated, AuthController.getLogin);
router.get('/register', checkNotAuthenticated, UserController.getRegister);

router.post('/register', checkNotAuthenticated, UserController.createUser);
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.delete('/logout', AuthController.getLogout);

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

module.exports = router;
