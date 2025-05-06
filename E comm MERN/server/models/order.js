import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"User",
        required : true ,
    },
    orders:[
        {
            productId :{
                type:mongoose.Schema.Types.ObjectId ,
                ref:"Product",
                required:true ,
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
    deliveryDate :{
        type:Date ,
        required:true,
    },
    orderStatus:{
        type:String,
        default:"Pending",
    },
},
{timestamps:true}
);

const Order = mongoose.model("Order",orderSchema);

export default Order ;