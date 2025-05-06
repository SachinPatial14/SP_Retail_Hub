import Review from "../models/review.js";


export const addReview = async(req,res)=>{
    try{
     const {productId,productOwnerId,userId,rating,reviewText,name} = req.body ;

     if(!productId || !productOwnerId || !userId || !rating || !reviewText || !name){
        return res.status(400).json({message:"All fields are required"});
     };

     const newReview =  new Review({
        productId,
        productOwnerId,
        userId,
        name,
        rating,
        reviewText,
     });

     const savedReview = await newReview.save();

     res.status(201).json({
        message:"Review added successfully",
        review:savedReview,
     });

    }catch(error){
     console.error("Error adding review",error);
     res.status(500).json({
        message:"Error adding review",
        error:error.message,
     });
    }
};

export const getReviewsForProduct = async(req,res)=>{
    try{
      const {productId} = req.query ;

      if(!productId){
        return res.status(400).json({message:"Product id is required"});
      };

      const reviews = await Review.find({productId}).sort({createdAt:-1});
      res.status(200).json({reviews});
    }catch(error){
     console.error("Error fetching reviews:",error);
     res.status(500).json({
        message:"Error fetching reviews",
        error:error.message,
    });
}
};