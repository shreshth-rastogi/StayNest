require("dotenv").config({ path: "../.env" });

const mongoose = require('mongoose'); 
const Listing = require("../models/listings.js"); 
const { data } = require("./initDB.js"); 
const Review = require("../models/reviews.js"); 
 


main()
.then(() => { 
    console.log("Connection to DB successful");
    insertData();
})
.catch(err => console.log(err)); 
 


async function main() { 
    await mongoose.connect(process.env.MONGODB_URI);  
} 
 
async function insertData() { 
 
    try { 
        await Listing.deleteMany({}); 
        await Review.deleteMany({}); 
 
        //assigning owner to the listing 
        data.forEach((listing) => { 
            listing.owner = '6a99214d2b735129fa4adba9'; 
        }); 
 
        await Listing.insertMany(data); 
        console.log("Insertion of data successful"); 
         
    } catch(err) { 
        console.log("Error " + err); 
    }; 
}