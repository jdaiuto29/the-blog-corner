//@ts-check

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// @ts-ignore
var usersRouter = require('./routes/api/user');
var blogsRouter = require('./routes/api/blog');
var indexRouter = require('./routes/index');
var blogRouter = require('./routes/users');

const db = require('./models');

const models = require('./models')

var app = express();

// inside app.js

// ... rest of express setup/middleware
// ...rest of express routes, etc.


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// further down, use the model
// db.User.create({
//     // data
//   })  
app.use('/', indexRouter);
app.use('/blogs', blogRouter);




app.get('/api/v1/blogs', (req, res) => {
    models.User.findAll().then(Blogs => {
        res.json(Blogs)
    })
})


module.exports = app;
