require('dotenv').config();
require('./db');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const hbs = require('hbs')

// Routers require
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const welcomeRouter = require('./routes/welcome');
const tattooerRouter = require('./routes/tattooer');
const usersRouter = require('./routes/users');
const reviewRouter = require('./routes/reviews');
const searchRoute = require('./routes/search');
const tattooRouter = require('./routes/tattoo');
const likesRouter = require('./routes/likes');
const favoritesRouter = require('./routes/favorites');
const contactRouter = require('./routes/contact')

const app = express();

// cookies and loggers
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For deployment
app.set('trust proxy', 1);
app.use(
  session({
    name: 'inked-in-cookie',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2592000000 // 30 days in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    })
  }) 
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
/*HELPER UPPERCASE*/
hbs.registerHelper('toUpperCase', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});
hbs.registerHelper('changeNumToStar', function (elements) {
  let numberToStar = Array(elements + 1).join("★");
  let rest;
  if(numberToStar.length < 5) {
    rest = Array(5 - numberToStar.length + 1)
    return numberToStar + rest.join("☆")
  } else {
  return numberToStar
  }
});
hbs.registerHelper("prettifyDate", function(timestamp) {
    let curr_date = timestamp.getDate();
    let curr_month = timestamp.getMonth();
    curr_month++;
    let curr_year = timestamp.getFullYear();
    return curr_date + ". " + curr_month + ". " + curr_year;
});


// routes intro
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/welcome', welcomeRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewRouter);
app.use('/search', searchRoute);
app.use('/tattooer', tattooerRouter);
app.use('/tattoo', tattooRouter);
app.use('/likes', likesRouter);
app.use('/favorites', favoritesRouter);
app.use('/contact', contactRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  if (err.status === 404) {
    res.render('404', { path: req.url });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
