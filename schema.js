const Joi = require("joi");


module.exports.listingSchema = Joi.object({

    listing: Joi.object({

        title: Joi.string().required(),

        description: Joi.string().required(),

        category: Joi.string()
            .valid(
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
            )
            .required(),

        price: Joi.number().min(0).required(),

        location: Joi.string().required(),

        country: Joi.string().required(),

    }).required()

});


module.exports.reviewSchema = Joi.object({

    review: Joi.object({

        rating: Joi.number().min(0).max(5),

        comment: Joi.string().required()

    }).required()

});