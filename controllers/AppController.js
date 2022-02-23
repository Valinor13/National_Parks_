class AppController {
  static getIndex(req, res) {
    res.render('index.ejs');
  }
}

module.exports = AppController;
