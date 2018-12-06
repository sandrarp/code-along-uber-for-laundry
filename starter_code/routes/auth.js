const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const flash = require("connect-flash");

authRouter.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

authRouter.post('/signup', (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;

    if (name === "" || password === "" || email === "") {
        res.render("auth/signup", { message: "Indicate name, email and password" });
        return;
    }

    User.findOne({ email }, "email", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The email already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashPass
        })

        newUser.save((err) => {
            if (err) {
                res.render('auth/signup', { message: "something went wrong" });
            } else {
                res.redirect("/");
            }
        })
    })
})

authRouter.get('/login', (req, res, next) => {
    res.render('auth/login');
})

authRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.',
    successFlash: 'Welcome!',
    passReqToCallback: true
}))
    

authRouter.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

module.exports = authRouter;