const Listing = require("../models/listings.js");
const CustomError = require("../utils/CustomError.js");






module.exports.index = async (req, res) => {

    let { category, search } = req.query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ]
    }

    let results;

    results = await Listing.find(filter);

    res.render("listings/index.ejs", { results });
}






module.exports.newListingForm = (req, res) => {

    res.render("listings/new.ejs");

}






module.exports.viewListing = async (req, res) => {

    let { id } = req.params;

    let result = await Listing
        .findById(id)
        .populate({ path: "reviews", populate: { path: "author"} })
        .populate("owner");


    if (!result) {

        req.flash("error", "No Such Listing");

        return res.redirect("/listings");

    }


    res.render("listings/view.ejs", { result });

}




module.exports.myListings = async (req, res) => {

    let results = await Listing.find({
        owner: req.user._id
    });

    res.render("listings/mine.ejs", { results });

}






module.exports.createListing = async (req, res) => {

        let { listing } = req.body;

        listing.image = {};

        if (!req.file) {
            throw new CustomError(400, "No Image provided of Listing");
        }

        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;

        listing.owner = req.user._id;

        await Listing.insertOne(listing);


        req.flash(
            "success",
            "Listing Added Successfully"
        );


        res.redirect("/listings");
       

}








module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    let record = await Listing.findById(id);


    if (!record) {

        req.flash("error", "No Such Listing");

        return res.redirect("/listings");

    }


    res.render("listings/edit.ejs", { record });

}







module.exports.updateListing = async (req, res) => {

        let { id } = req.params;

        let { listing } = req.body;

        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
    }

        let result = await Listing.findByIdAndUpdate(
            id,
            listing,
            { runValidators: true }
        );


        if (!result) {

            req.flash("error", "No Such Listing");

            return res.redirect("/listings");

        }


        req.flash(
            "success",
            "Listing Edited Successfully"
        );


        res.redirect(`/listings/${id}`);

}









module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;


    let result = await Listing.findByIdAndDelete(id);


    if (!result) {

        req.flash("error", "No Such Listing");

        return res.redirect("/listings");

    }


    req.flash(
        "success",
        "Listing Deleted Successfully"
    );


    res.redirect("/listings");

}