const User=require('../models/user');


module.exports.registerForm=async(req,res)=>{
    res.render('users/register');
}

module.exports.registerPost=async(req,res)=>{
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
            return res.redirect('/campgrounds');
        });
    } catch (error) {
        req.flash('error',error.message);
        return res.redirect('/register');
    }
    // res.send(req.body);
}

module.exports.loginForm=(req,res)=>{
    res.render('users/login')
}

module.exports.loginPost=(req,res)=>{
    console.log(req.user);
    req.flash('success',`Welcome Back ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //to have no reminence no more return to
    delete req.session.returnTo
    res.redirect(redirectUrl);
}

module.exports.userLogout=(req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'See You Space Cowboy!');
        res.redirect('/campgrounds');
    });
}