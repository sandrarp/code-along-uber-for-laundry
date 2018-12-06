const express = require('express');
const User = require('../models/user');
const laundryRouter = express.Router();

laundryRouter.use((req, res, next) => {
    if(req.user) {
        next();
        return;
    }
    res.redirect("/login");
})

laundryRouter.get('/dashboard', (req, res, next) => {
    res.render('laundry/dashboard');
})

laundryRouter.post('/launderers', (req, res, next) => {
    const userId = req.user._id;
    const laundererInfo = {
      fee: req.body.fee,
      isLaunderer: true
    };
  
    User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
      if (err) {
        next(err);
        return;
      }
  
      req.session.currentUser = theUser;
  
      res.redirect('/dashboard');
    });
  });

  laundryRouter.get('/launderers', (req, res, next) => {
      User.find({ isLaunderer: true}, (err, launderersList) => {
          if(err) {
              next(err);
              return;
          }
          res.render('laundry/launderers', {
            launderers: launderersList
          })
      })
  })

  laundryRouter.get('/launderers:id', (req, res, next) => {
      const laundererId = req.params.id;

      User.findById(laundererId, (err, theUser) => {
        if(err) {
            next(err);
            return;
        }
        console.log(theUser);
        res.render('laundry/launderer-profile', {
            theLaunderer: theUser
          })
          
      })
  })

module.exports = laundryRouter;