const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListingSchema } = require("../middleware.js");
const multer  = require('multer');
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
const ListingController = require("../controllers/listings.js");




// Index Route & Create Route
router
    .route("/")
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListingSchema,
        wrapAsync(ListingController.createListing)
    );






// New Route
router.get("/new", isLoggedIn, ListingController.newListingForm);



//Show user listings
router.get(
    "/mine",
    isLoggedIn,
    wrapAsync(ListingController.myListings)
);






// Show Route & Update Route & Destroy Route
router
    .route("/:id")
    .get(wrapAsync(ListingController.viewListing))
    .put(isLoggedIn, 
        isOwner,
        upload.single('listing[image]'),
        validateListingSchema,
        wrapAsync(ListingController.updateListing)
    )
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(ListingController.destroyListing)
    );




// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));





module.exports = router;