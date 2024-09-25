const isLoggedIn=(req,res,next)=>{
    console.log('start test logged in************************');
    // console.log(`req.user = ${req.user}`);
    // console.log(req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','YOU MUST BE LOGGET FIRST');
        return res.redirect('/login');
    }
    next();
}


module.exports=isLoggedIn;