const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isLoggedTattooer } = require('../middlewares');

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signup', user);
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/login', user);
});

// @desc    Displays second tattooer form view to sign up
// @route   GET /auth/tattooer
// @access  just for tattoer role
router.get('/tattooer', isLoggedTattooer, async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signTattooer', user); // s'ha de canviar per profile
});

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { username, email, password, userRole, city, tattooNumber } = req.body;
  if (!email || !password || !username || !userRole ) {
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
    const user = await User.create({ username, email, hashedPassword, userRole });
      req.session.currentUser = user;
    if (user.userRole == "tattooer") {
      res.render('auth/signTattooer', user)
    } else {
      res.redirect('/welcome')
      //res.render('welcome', user)
      };
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
      res.render('auth/login', { error: `There are no users by ${email}` });
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, isUserInDB.hashedPassword);
      if (passwordMatch) {
        req.session.currentUser = isUserInDB;
        res.render('welcome', { user: isUserInDB });
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Sends tattooer auth data to database to update user info
// @route   POST /auth/tattooer
// @access  just for tattoer role
router.post('/tattooer', isLoggedTattooer ,async (req, res, next) => {
  const { tattooStyle, city } = req.body;
  const userId = req.session.currentUser._id
  if (!tattooStyle || !city) {
    res.render('auth/login', { error: 'Tattoo style or city fields are necessary.' })
    return;
  }
  try {
    const updateUser = await User.findByIdAndUpdate(userId, { tattooStyle, city }, { new: true });
    req.session.currentUser = updateUser;
    //res.redirect('/welcome');
    res.render('welcome', {user: updateUser})
    } catch (error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private 
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.clearCookie('inked-in-cookie');
      res.redirect('/auth/login');
    }
  });
});

module.exports = router;
