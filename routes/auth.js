const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {isLoggedIn } = require('../middlewares');
const { isLoggedTattooer } = require('../middlewares');
const { isLoggedButOut } = require('../middlewares');

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', isLoggedButOut, async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signup', user);
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', isLoggedButOut, async (req, res, next) => {
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
router.post('/signup', isLoggedButOut, async (req, res, next) => {
  const { username, email, password, userRole } = req.body;
  if (!email || !password || !username || !userRole ) {
    res.render('auth/signup', { error: 'All fields are necessary.' })
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.render('auth/signup', { error: 'Password needs to containe at lesat 7 characters, one number, one lowercase an one uppercase letter.' })
    return;
  }
  const regex2 = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex2.test(email)) {
    res.render('auth/signup', { error: 'Error. Invalid email.' })
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
router.post('/login', isLoggedButOut, async (req, res, next) => {
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
        //res.render('welcome', { user: isUserInDB });
        res.redirect('/welcome')
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
router.post('/tattooer', isLoggedTattooer, async (req, res, next) => {
  const { tattooStyle, city } = req.body;
  const userId = req.session.currentUser._id
  if (!tattooStyle || !city) {
    res.render('auth/signTattooer', { error: 'Tattoo style or city fields are necessary.' })
    return;
  }
  const styles = ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other'];
  if (typeof tattooStyle === "string") {
    const tattooStyleArray = tattooStyle.split();
     tattooStyleArray.map((OneStyle) => {
    if (!styles.includes(OneStyle)) {
      res.render('auth/signTattooer', { error: 'Please, select correct tattoo style .' })
      return;
    }
  });
  } else {
     tattooStyle.map((OneStyle) => {
    if (!styles.includes(OneStyle)) {
      res.render('auth/signTattooer', { error: 'Please, select correct tattoo style .' })
      return;
    }
  });
  };
  try {
    const updateUser = await User.findByIdAndUpdate(userId, { tattooStyle, city }, { new: true });
    req.session.currentUser = updateUser;
    res.redirect('/welcome');
    } catch (error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   GET /auth/logout
// @access  Private 
router.get('/logout', isLoggedIn, (req, res, next) => {
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