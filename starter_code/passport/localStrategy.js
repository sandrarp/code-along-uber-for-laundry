const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy((email, password, next) => {

        User.findOne({ email })
            .catch(e => console.log(e))
            .then(foundUser => {
                if (!foundUser) {
                    throw new Error('Incorrect email')
                    // done(null, false, { errorMessage: 'Incorrect email' });
                    
                }
                return foundUser;
            })
            .then(foundUser => {

                if (!bcrypt.compareSync(password, foundUser.password)) {
                    throw new Error('Incorrect password')
                    // done(null, false, { errorMessage: 'Incorrect password' });
                    return;
                }else {
                    next(null, foundUser);
                }
            })
            .catch(err => next(err));
    }
));