const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");




module.exports.createReview = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "No such Listing");

        return res.redirect("/listings");
    }

    let review = req.body.review;

    review.author = req.user._id;

    let insertedReview = await Review.insertOne(review);

    listing.reviews.push(insertedReview._id);

    await listing.save();

    req.flash("success", "Review Added Successfully");

    res.redirect(`/listings/${id}`);
};







module.exports.deleteReview = async (req, res) => {
    let {id, reviewId } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "No Such Listing");
        return res.redirect("/listings");
    }

    let review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        req.flash("error", "No Such Review Found");
        return res.redirect(`/listings/${id}`);
    }

    //remove from Listing collection's document the review id of the review which is deleted
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review Deleted Successfully");

    res.redirect(`/listings/${id}`);
};