const User = require("../models/users.js");




module.exports.renderSignupform = async (req, res) => {

    res.render("users/signup.ejs");

};






module.exports.signup = async(req, res, next) => {
    try {

    let {username, email, password} = req.body;

    let newUser = new User({username, email});

    let regUser = await User.register(newUser, password);

    req.login(regUser, (err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "Welcome to StayNest");

        res.redirect("/listings");

    });
    } catch(err) {

        if (err.name === "UserExistsError") {

            req.flash("error", "Username already exists");

            return res.redirect("/user/signup");
        }

        throw err;
    }
};







module.exports.renderLoginform = async (req, res) => {

    res.render("users/login.ejs");

};









module.exports.login = async (req, res) => {
    
    req.flash("success", "Welcome back to StayNest");

    if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
    }

    res.redirect("/listings");

};








module.exports.logout =  async (req, res, next) =>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logged Out");

        res.redirect("/listings");
    });
};