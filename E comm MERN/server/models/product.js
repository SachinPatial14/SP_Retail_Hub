import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    brandname:{
        type:String,
        required : true,
        trim:true ,
    },
   quantity:{
    type:Number,
    required:true,
   },
   price:{
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
   ownerid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
},
{ timestamps: true }
);

const Product = mongoose.model("Product",productsSchema);
export default Product ;