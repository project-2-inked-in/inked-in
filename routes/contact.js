const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact')
const { isLoggedIn } = require('../middlewares');

// @desc Get Contact view
// @route GET /contact/tattooerId
// @access Private
router.get('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { tattooerId } = req.params;
    const user = req.session.currentUser;
    try {
        const tattooer = await User.findById(tattooerId);
        const contacts = await Contact.find({ tattooerId: tattooerId }).populate('userId').sort({ createdAt: -1 });
        const userCanSee = [];
        contacts.filter(contact=> {
            if ((tattooerId === user._id )) {
                userCanSee.push(contact)
            } 
        });
        const userContact = !(tattooerId === user._id);
        res.render('contact', { user, tattooer, contacts, userCanSee, userContact}); 
    } catch (error) {
        next(error)
    }
});

// @desc Contact data to database
// @route POST /contact/tattooerId
// @access Private
router.post('/:tattooerId', isLoggedIn, async (req, res, next) => {
    const { comment, contactform } = req.body;
    const user = req.session.currentUser;
    const { tattooerId } = req.params;
    try {
    await Contact.create({  comment, contactform, userId: user._id, tattooerId: tattooerId });
    res.redirect(`/tattooer/${tattooerId}`)
    } catch (error) {
        next(error)
    }
});

module.exports = router;