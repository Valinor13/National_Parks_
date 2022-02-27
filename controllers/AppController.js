const mongoose = require('mongoose');
const Data = require('../models/data');

mongoose.connect('mongodb://localhost/customApi', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.on('open', () => console.log('connect to db'));

class AppController {
  static getIndex(req, res) {
    (async () => {
      // const index = Math.floor(Math.random() * 61) + 1;
      const index = 22;
      const result = await Data.findOne({ index });
      const data = result.data;
      const dir = `images/${result.title}`;
      const tSplit = result.title.split('_');
      const title = tSplit.join(' ');
      return res.render('index.ejs', { data, title, dir });
    })();
  }
}

module.exports = AppController;
