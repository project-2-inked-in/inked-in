const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signup', user);
})

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/login', user);
})

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { username, email, password, userRole, city, tattooNumber } = req.body;
  if (!email || !password || !username || !userRole || !city || !tattooNumber) {
    res.render('auth/signup', { error: 'All fields are necessary.' })
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.render('auth/signup', { error: 'Password needs to containe at lesat 7 characters, one number, one lowercase an one uppercase letter.' })
    return;
  }
  try {
    const isUserInDB = await User.findOne({ email: email });
    if (isUserInDB) {
      res.render('auth/signup', { error: `There already is a user with email ${email}.` })
      return;
    } else {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, hashedPassword, userRole, city, tattooNumber });
    res.render('welcome', user)
    } 
  } catch (error) {
    next(error)
  }
});

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('auth/login', { error: 'email or password do not match.' })
    return;
  }
  try {
    const isUserInDB = await User.findOne({ email: email });
    if (!isUserInDB) {
      res.render('auth/login', { error: `There are no users by ${email}`});
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, passwordMatch.hashedPassword);
      if (passwordMatch) {
        // Remember to assign user to session cookie:
        req.session.currentUser = isUserInDB;
        //res.redirect('/'); puc fer un res.redirect i passar dades?
        res.render('welcome', { user: isUserInDB });
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private 
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})

module.exports = router;
