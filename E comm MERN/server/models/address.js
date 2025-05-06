import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    addressText:{
        type:String,
        required:true,
        trim:true,
    },
},
{timestamps:true}
);

const Address = mongoose.model("Address",addressSchema);

export default Address ;