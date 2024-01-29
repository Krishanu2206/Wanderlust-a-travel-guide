const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expresserror");
const listingschema=require("../schema.js");
const Review=require("../models/review.js");
const {reviewschema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isloggedin}=require("../middleware.js");
const {isauthor}=require("../middleware.js");

const reviewcontroller=require("../controllers/reviews.js");

const validatereview=(req, res, next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){  //to check if error is present in the result or not
        console.log(error);
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400, errmsg);
    }else{
        next();
    }
};

//Reviews post route
router.post("/", isloggedin, validatereview, wrapAsync(reviewcontroller.createreview));

//Delete Review route
router.delete("/:reviewid", isloggedin, isauthor, wrapAsync(reviewcontroller.deletereview));

module.exports=router;