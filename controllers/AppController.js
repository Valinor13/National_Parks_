const mongoose = require('mongoose');
const Data = require('../models/data');

mongoose.connect('mongodb://localhost/customApi', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.on('open', () => console.log('connect to db'));

class AppController {
  static getIndex(req, res) {
    (async () => {
      const index = Math.floor(Math.random() * 61) + 1;
      const result = await Data.findOne({ index });
      const tSplit = result.title.split('_');
      const title = tSplit.join(' ');
      res.render('index.ejs', { data: result.data, title });
    })();
  }
}

module.exports = AppController;
