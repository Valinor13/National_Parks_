require('dotenv').config();
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const User = require('./models/user');
const router = require('./routes/router');

// create session MongoDB variable
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

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
app.use(router);

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

io.on('connection', (socket) => {
  socket.on('receive-dir', (dir) => {
    const fileno = Math.floor(Math.random() * 4) + 1;
    const imgStream = fs.createReadStream(`./views/${dir.replaceAll('"', '')}/${fileno}.jpg`, { encoding: 'binary' }), chunks = [];
    imgStream.on('data', (chunk) => {
      chunks.push(chunk);
      socket.emit('img-chunk', chunk);
    })
  })
})

server.listen(3000, () => console.log('connected on port 3000'));
