const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const isLoggedIn = require('../middlewares')

// @desc Search
// @route GET /search
// @access Private
router.get('/search', /*middleware here */  async function (req, res, next) {
    const { username } = req.query;
    try {
        const show = await User.findOne({ username: username });
        res.render('search', { query: username });
    } catch (error) {
        next(error)
    }
});

module.exports = router;