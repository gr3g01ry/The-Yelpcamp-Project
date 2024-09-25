const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const User=require('../models/user');
const passport = require('passport');





router.get('/register',async(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    try {
        const {email,username,password}=req.body
        const user=new User({email,password,username});
        const registerUser=await User.register(user,password);
        // console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/register');
    }
    // res.send(req.body);
}));

router.get('/login',(req,res)=>{
    res.render('users/login')
})
router.post('/login',
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local',{failureFlash:true, failureRedirect:'/login',keepSessionInfo: true,}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req,res)=>{
        console.log(req.user);
        req.flash('success',`Welcome Back ${req.user.username}`);
        const redirectUrl = req.session.returnTo || '/campgrounds';
        //to have no reminence no more return to
        delete req.session.returnTo
        res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'See You Space Cowboy!');
        res.redirect('/campgrounds');
    });
})


module.exports=router;