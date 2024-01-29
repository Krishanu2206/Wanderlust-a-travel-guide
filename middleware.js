const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const isloggedin=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        res.redirect("/login");
    }
    next();
};

const saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

const isowner=async(req, res, next)=>{
    let id=req.params.id;
    let initiallisting=await Listing.findById(id);
    if(res.locals.curruser && !initiallisting.owner._id.equals(res.locals.curruser._id)){
        req.flash("error", "You dont have permission to edits , you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

const isauthor=async(req, res, next)=>{
    let {id, reviewid}=req.params;
    let initialreview=await Review.findById(reviewid);
    if(res.locals.curruser && !initialreview.author._id.equals(res.locals.curruser._id)){
        req.flash("error", "You dont have permission to delete , you are not the author of the review");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports={
    isloggedin, 
    saveRedirectUrl,
    isowner,
    isauthor,
};

//req.originalUrl : the original url user tried to access