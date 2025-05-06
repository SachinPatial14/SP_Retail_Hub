import Wishlist from "../models/wishlist.js";

export const addWishlistItem =async(req,res)=>{
    try{
     const{userId,brandname,price,quantity,image,description} = req.body ;

     if(!userId || !brandname || !price || !quantity || !image || !description){
        return res.status(400).json({message:"All fields are required."});
     };

     const newWishlistItem = new Wishlist({
        userID:userId,
        brandname,
        description,
        price,
        quantity,
        image,
     });

     const savedItem = await newWishlistItem.save();
     res.status(201).json({
        message:"Wishlist item added successfully",
        wishlistItem:savedItem ,
     });
    
    }catch(error){
       console.error('Error adding wishlist item:',error);
       res.status(500).json({
        message:"Error adding wishlist item",
        error : error.message,
       });
    }
};

export const deleteWishlistItem =async(req,res)=>{
    try{
      const {id} = req.params ;
      if(!id){
        return res.status(400).json({message:"Wishlist item id id required"});
      }
      const deletedItem = await Wishlist.findByIdAndDelete(id);

      if(!deletedItem){
        return res.status(404).json({message:"Wishlist item not found"});
      };

      res.status(200).json({message:"Wishlist item deleted successfully"});
      
    }catch(error){
       console.error("Error deleting wishlist item:",error);
       res.status(500).json({
        message:"Error deleting wishlist item",
        error:error.message ,
       });
    }
};

export const getWishlistItems = async (req,res)=>{
    try{
     const {userId} = req.query ;
     if(!userId){
      return res.status(400).json({message:"User id is required"});
     };

     const wishlistItems = await Wishlist.find({userID:userId});
     res.status(200).json({wishlistItems});

    }catch(error){
      console.error("Error fetching wishlist:",error);
      res.status(500).json({message:"Error fetching wishlist items",
         error:error.message,
      });
    }
};