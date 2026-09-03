const Listing = require("./models/listings.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const CustomError = require("./utils/CustomError.js");




module.exports.isLoggedIn = async (req, res, next) => {

    if (!req.isAuthenticated()) {

        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else {
            req.session.redirectUrl = req.get("Referer") || "/listings";
        }

        req.flash("error", "Login first to access this functionality");

        return res.redirect("/user/login");
    }
    next();
}







module.exports.saveRedirectedUrl = async(req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}






module.exports.isOwner = wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let record = await Listing.findById(id);

    if (!res.locals.user._id.equals(record.owner)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
});






module.exports.isAuthor = wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);


    if (!review) {
        req.flash("error", "No such review");
        return res.redirect(`/listings/${id}`);
    }

    if (!(req.user._id).equals(review.author)) {

        req.flash("error", "You are not authorised to delete this review");
        return res.redirect(`/listings/${id}`);

    }
    
    next();
});






// Validation of Listing Schema
module.exports.validateListingSchema = (req, res, next) => {
    let error = listingSchema.validate(req.body).error;

    if (error) {
        throw new CustomError(
            400,
            "Details not provided correctly"
        );
    }

    next();
};




//Validation of Review Schema function 
module.exports.validateReviewSchema = (req, res, next) => {
    let error = reviewSchema.validate(req.body).error;

    if (error) {
        throw new CustomError(400, "Details not provided correctly");
    }

    return next();
}
