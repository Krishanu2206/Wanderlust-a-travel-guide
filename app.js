if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
} //during development phase

/* console.log(process.env.SECRET); */

const express = require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const Listing=require("./models/listing.js");
const path=require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const expresserror=require("./utils/expresserror.js");
/* const joi=require("joi");
const listingschema=require("./schema.js");
const Review=require("./models/review.js");
const reviewschema=require("./schema.js"); */
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter=require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);

/* const MONGOURL="mongodb://127.0.0.1:27017/wanderlust"; */

const DBURL=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(DBURL); //connecting to mongoose
}

main().then(()=>{
    console.log("connected to DB");
}) 
.catch((err)=>{
    console.log(err);
});

const store=MongoStore.create({
    mongoUrl: DBURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 60 * 60,
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, //in milliseconds
        httpOnly:true,
    }
};

/* app.get("/", (req, res)=>{
    res.send("this is root");
}); */

store.on("error", ()=>{
    console.log("ERROR iN MONGO SESSION STORE", err);
});  //IF IN CASE ANY ERROR OCCURS IN MONGO STORE

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());  //to initialise the passport for every request
app.use(passport.session()); //passport also requires the session so we also call the session here
passport.use(new Localstrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success=req.flash("success");  //the key success is actually an array
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    console.log(res.locals.success);
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userrouter);

app.all("*", (req, res, next)=>{
    next(new expresserror(404, "Page Not Found"));
})

app.use((err, req, res, next)=>{
    let {status=500, message="Some error occurred"}=err;
    res.status(status).render("error.ejs", {status, message});
})

app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
});
