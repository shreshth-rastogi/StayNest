if (process.env.NODE_ENV != "production") {

    require('dotenv').config();

}

const express = require("express");

const mongoose = require("mongoose");

const methodOverride = require('method-override');

const path = require("path");

const ejsMate = require('ejs-mate');

const CustomError = require("./utils/CustomError.js");

const session = require("express-session");

const  MongoStore  = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");

const LocalStrategy = require("passport-local");

const User = require("./models/users.js");

const listingRouter = require("./routes/listings.js");

const reviewRouter = require("./routes/reviews.js");

const userRouter = require("./routes/users.js");




const mongo_url = process.env.MONGODB_URI;

main()

.then(() => {

    console.log("Connection to database successful");

})

.catch(err => console.error("Database Connection Error:", err));

async function main() {

    await mongoose.connect(mongo_url);

}





const store = MongoStore.create({

    mongoUrl: process.env.MONGODB_URI,

    crypto: {

        secret: process.env.SESSION_SECRET

    },

    touchAfter: 24 * 3600,

});


store.on("error", (err) => {

    console.error("Session Store Error:", err);

});



const sessionOptions = {

    store,

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {

        maxAge: 10 * 24 * 60 * 60 * 1000,

        httpOnly: true

    }

}





//defining port and starting server

const port = 3000;

const app = express();

app.listen(port, () => {

    console.log("Server listening on port");

});










//middlewares

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method')); 

app.use(express.static("./public"));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));



//Session Middlewares

app.use(session(sessionOptions));

app.use(flash());



//Pasport Middlewares(Authentication)

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.user = req.user;

    next();

});





app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/user", userRouter);





//if none of the routes match

app.use((req, res, next) => {

    return next(new CustomError(404, "Page not Found"));

});




//Custom Error-Handling Middleware

app.use((err, req, res, next) => {

    let { statusCode = 500, message } = err;

    console.log(err.name);

    if (err.name === "ValidationError" || err.name === "CastError") {

        statusCode = 400;

    }

    res.status(statusCode).render("listings/error.ejs", {statusCode, message});

});



