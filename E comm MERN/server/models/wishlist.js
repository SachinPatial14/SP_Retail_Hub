import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User",
        required:true,
    },
    brandname:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true,
    },
},
{timestamps:true}
);

const Wishlist = mongoose.model("Wishlist",wishlistSchema);

export default Wishlist ;