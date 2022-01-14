//@ts-check
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const logger = require('morgan');
const db = require("./models");
const SequelizeSession = require('connect-session-sequelize')(session.Store)
const store = new SequelizeSession({ db: db.sequelize })

const blogsApiRouter = require('./routes/api/blog');
const usersApiRouter = require('./routes/api/user');
const indexRouter = require('./routes/index');


const app = express();

// inside app.js

// ... rest of express setup/middleware
// ...rest of express routes, etc.


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 2592000,
    },
    store: store
  }));
store.sync();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/blogs', blogsApiRouter)
app.use('/api/v1/users', usersApiRouter)

module.exports = app;