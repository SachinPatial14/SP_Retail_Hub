import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Product",
     required:true,
    },
    productOwnerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    },
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    },
    name:{
        type:String,
        required : true,
    },
    rating:{
        type:Number,
        required:true,
    },
    reviewText:{
        type:String,
        required:true,
        trim:true,
    },
    },
    {timestamps:true}
);

const Review = mongoose.model("Review",reviewSchema);
export default Review ;