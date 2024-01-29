const User=require("../models/user.js");

module.exports.rendersignupform=(req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req, res)=>{
    try{
    let {username, email, password}=req.body;
    const newUser=new User({email, username});
    const registeredUser=await User.register(newUser, password); //now the user is signed up
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req, res)=>{
    req.flash("success", "Welcome back to WanderLust, you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";  //checking if the res.locals.redirectUrl is empty or not if empty then the redirect url is "/listings".
    res.redirect(redirectUrl);
};
//Passport provides an authenticate() function, which is used as route middleware to authenticate requests. failureredirect ..to redirect to the login page if user enters wrong username or password and failureflash to send a flash message if the user enters wrong username or password

module.exports.logout=(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
};