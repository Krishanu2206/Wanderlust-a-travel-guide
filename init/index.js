const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

const MONGOURL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGOURL); //connecting to mongoose
}

main().then(()=>{
    console.log("connected to DB");
}) 
.catch((err)=>{
    console.log(err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj, owner:"65b3ea131f05c339ca037bf6"}))
    await Listing.insertMany(initdata.data);
    console.log("data  was initialised");
}

initDB();