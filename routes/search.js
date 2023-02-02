const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const { isLoggedIn } = require('../middlewares');

// @desc Search
// @route GET /search
// @access Private
router.get('/views/search', isLoggedIn, async function (req, res, next) {
    const { username } = req.query;
    try {
        const tattooer = await User.findOne({ username: username, tattooer: tattooer });
        res.render('search', { query: username });
    } catch (error) {
        next(error)
    }
});

module.exports = router;