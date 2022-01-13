//@ts-check
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const blogsApiRouter = require('./routes/api/blogs');
const usersApiRouter = require('./routes/api/users');
const indexRouter = require('./routes/index');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/blogs', blogsApiRouter)
app.use('/api/v1/users', usersApiRouter)

module.exports = app;
