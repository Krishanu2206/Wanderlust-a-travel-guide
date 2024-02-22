const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingschema}=require("../schema.js");
/* const reviewschema=require("../schema.js"); */
const expresserror=require("../utils/expresserror.js");
const Listing=require("../models/listing.js");
const {isloggedin}=require("../middleware.js");
const {isowner}=require("../middleware.js");


const multer  = require('multer');
const {storage}= require("../cloudconfig.js");
const upload = multer({ storage});

const listingcontroller=require("../controllers/listing.js");

const validatelisting=(req, res, next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){  //to check if error is present in the result or not
        console.log(error);
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400, errmsg);
    }else{
        next();
    }
};

router
.route("/")
.get(wrapAsync(listingcontroller.index)) //INDEX ROUTE
.post(isloggedin, upload.single('listing[image]'),  validatelisting, wrapAsync(listingcontroller.createlisting)); //CREATE ROUTE */


//NEW ROUTE
router.get("/new", isloggedin, listingcontroller.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingcontroller.showlisting)) //SHOW/DISPLAY ROUTE
.patch(isloggedin, isowner,  upload.single('listing[image]'), validatelisting, wrapAsync(listingcontroller.updatelisting)); //UPDATE ROUTE

//EDIT ROUTE
router.get("/:id/edit", isloggedin, isowner, wrapAsync(listingcontroller.rendereditform));

//DELETE ROUTE
router.delete("/:id/delete", isloggedin, isowner, wrapAsync(listingcontroller.destroylisting));

module.exports=router;