class AuthController {
  static getLogin(req, res) {
    return res.render('login.ejs');
  }

  static getLogout(req, res) {
    req.logOut();
    return res.redirect('/login');
  }
}

module.exports = AuthController;
