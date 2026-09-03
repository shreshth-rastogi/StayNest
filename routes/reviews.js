const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAuthor, validateReviewSchema } = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");



// Create Route
router.post("/", isLoggedIn, validateReviewSchema, wrapAsync(reviewController.createReview));




// Destroy Route
router.delete("/:reviewId", isLoggedIn, isAuthor,  wrapAsync(reviewController.deleteReview)); 



module.exports = router;