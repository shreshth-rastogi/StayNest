const mongoose = require("mongoose");

const Review = require("./reviews.js");





const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {

        filename: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
    type: String,
    enum: [
        "Farms",
        "Rooms",
        "Beach",
        "Mountain",
        "Cabins",
        "Amazing Pools",
        "Amazing Views",
        "Lakefront",
        "Iconic Cities",
        "Surfing",
        "Camping",
        "Historic"
    ],
    required: true
    }
});


listingSchema.post("findOneAndDelete", async function(listing) {
    if (listing && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});



let Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;