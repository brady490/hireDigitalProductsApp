const express = require('express');
const router = express.Router();

const Users = require('../models/users');

// get login page
router.get('/login', (req, res, next) => {
    res.render('login');
});


// fake login
router.post('/', (req, res, next) => {
    let user = Users.getUserName(req.body.userId);
    if (user) {
        res.cookie('userId', user.id);
        res.cookie('userName', user.name);
        res.redirect('/products');
    }
    else {
        res.status(404).render('error', { "name": "unauthorized", "message": "User not found" });
    }
});

module.exports = router;