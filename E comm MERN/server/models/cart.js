import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User" ,
        required : true,
    },
    addedProducts : [
        {
            productId :{
                type:mongoose.Schema.Types.ObjectId ,
                ref: "Product",
                required:true,
            },
            brandname:{
                type:String,
                required:true,
            },
            description:{
                type:String,
                required:true,
            },
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
            image:{
                type:String,
                required:true,
            },
        },
    ],
},
{timestamps:true}
);

const Cart = mongoose.model("Cart",cartSchema);

export default Cart ;