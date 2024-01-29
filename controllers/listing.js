const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.mapToken;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req, res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs", {allListings});        
};

module.exports.renderNewForm=(req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.createlisting=async(req, res, next)=>{
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();
/* 
    console.log(response.body.features[0].geometry);
    res.send("done!!"); */

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "..", filename);
    let listing=req.body.listing;  //OR {title, description, .....}=req.body .....but it is a convenient approach 
    const newlisting=new Listing(listing);
    newlisting.owner=req.user._id; //so that the owner of the listing is saved..
    newlisting.image={url, filename};

    newlisting.geometry=response.body.features[0].geometry;

    let savedlisting=await newlisting.save();
    console.log(savedlisting);
    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.showlisting=async (req, res)=>{
    let id=req.params.id;  //let {id}=req.params;
    //const details=Listing.find({_id:id}); 
    const listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.rendereditform=async (req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    } 
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalimageurl});
};

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    
    let listingUpdates = req.body.listing;
    
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url, "..", filename);
        listingUpdates.image = { url, filename };
        }
    
    try {
        let updatedListing = await Listing.findByIdAndUpdate(id, listingUpdates, { new: true });
    
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error updating listing");
        res.redirect(`/listings/${id}`);
    }
};    


module.exports.destroylisting=async(req, res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};