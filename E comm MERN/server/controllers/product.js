import mongoose from "mongoose";
import Product from "../models/product.js";

export const saveProducts = async(req,res)=>{
    try{
      const{brandname,quantity,price,description,ownerid} = req.body ;

      const image = req.file?req.file.filename:null ;

      const newProduct = new Product({
        brandname,
        quantity,
        price,
        description,
        image,
        ownerid,
      });

      const savedProduct = await newProduct.save() ;

      res.status(201).json({
        message:"Product saved successfully",
        product:savedProduct,
      });

    }catch(error){
       console.error("Error saving product:",error);
       res.status(500).json({
        message:"Error saving product",
        error:error.message,
       });
    };
};

export const getAllProducts = async(req,res)=>{
  try{
    const products = await Product.find();
    res.status(200).json(products);
  }catch(error){
     console.error("Error fetching products:",error);
     res.status(500).json({
      message:"An error occurred while fetching products",
      error:error.message,
     });
  };
};

export const searchProducts = async(req,res)=>{
  try{
    const {query} = req.query ;
    if(!query){
      return res.status(400).json({message:"Search query is required"});
    }

    const regex = new RegExp(query,"i");
    const products = await Product.find({$or:[{brandname:regex},{description:regex}],});
    res.status(200).json({products});

  }catch(error){
     console.error("Error searching products:",error);
     res.status(500).json({
      message:"Error searching products",
      error:error.message,
     });
  }
};

export const getRandomProducts = async (req, res) => {
  try {
    const { excludeId } = req.query;
    let matchCondition = {};
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      matchCondition = { _id: { $ne:new mongoose.Types.ObjectId(excludeId) } };
    }

    const randomProducts = await Product.aggregate([
      { $match: matchCondition },
      { $sample: { size: 4 } },
    ]);
    res.status(200).json({ products: randomProducts });
  } catch (error) {
    console.error("Error fetching random Products:", error);
    res.status(500).json({
      message: "Error fetching random Products:",
      error: error.message,
    });
  }
};
