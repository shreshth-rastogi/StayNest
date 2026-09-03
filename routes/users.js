const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");






router
    .route("/signup")
    .get(wrapAsync(userController.renderSignupform))
    .post(wrapAsync(userController.signup));








router
    .route("/login")
    .get(wrapAsync(userController.renderLoginform))
    .post(saveRedirectedUrl, 

        passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true } ),

        wrapAsync(userController.login)
    );





router.get("/logout", userController.logout);





module.exports = router;