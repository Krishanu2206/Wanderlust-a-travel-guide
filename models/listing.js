const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type: String,
        required: true,
    },
    description:String,
    image:{
        type: Object,
        properties:{
            filename:{
                type:String,
            },
            url:{
                type:String,
                /* default:"https://media.istockphoto.com/id/1351763219/photo/crystal-cove-state-park-sky-fire.webp?b=1&s=170667a&w=0&k=20&c=mJEFZ68eUauueOHxlGRbBQZ-F0J-FwMXLWGqs5a0LAk=", */
                /* set: (v)=> v===""? "https://media.istockphoto.com/id/1351763219/photo/crystal-cove-state-park-sky-fire.webp?b=1&s=170667a&w=0&k=20&c=mJEFZ68eUauueOHxlGRbBQZ-F0J-FwMXLWGqs5a0LAk=" : v, */
            }
        },  
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing", listingSchema);  // already told that Listing is an object
module.exports=Listing; //exporting the Listing object