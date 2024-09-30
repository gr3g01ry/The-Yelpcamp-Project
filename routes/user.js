const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const User=require('../models/user');
const passport = require('passport');

const users=require('../controllers/users');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.registerPost))

// router.get('/register',users.registerForm);

// router.post('/register',catchAsync(users.registerPost));


router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login',keepSessionInfo: true,}),
    // Now we can use res.locals.returnTo to redirect the user after login
    users.loginPost,)


// router.get('/login',users.loginForm);

// router.post('/login',
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local',{failureFlash:true, failureRedirect:'/login',keepSessionInfo: true,}),
//     // Now we can use res.locals.returnTo to redirect the user after login
//     users.loginPost,
//     )

router.get('/logout',users.userLogout)


module.exports=router;