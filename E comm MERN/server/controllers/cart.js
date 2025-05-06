import Cart from "../models/cart.js";


export const addToCart = async(req,res)=>{
    try{
     const {userId,product} = req.body ;
     if(!userId || !product || !product.productId || !product.brandname || !product.description || !product.price || !product.quantity || !product.image){
        return res.status(400).json({message:"All required fields are missing."});
     }

     let cart = await Cart.findOne({userId});
     if(cart){
        const index = cart.addedProducts.findIndex((p)=> p.productId.toString() === product.productId);

        if(index > -1){
            cart.addedProducts[index].quantity += product.quantity ;
        }else{
            cart.addedProducts.push(product);
        }
        await cart.save();
     }else{
        cart = new Cart({
            userId,
            addedProducts : [product],
        });
        await cart.save();
     }

     res.status(201).json({message:"Product added to cart successfully",cart});
    }catch(error){
       console.error("Error adding product to cart:",error);
       res.status(500).json({message:"Error adding product to cart",
        error : error.message
       });
    }
};

export const checkProductInCart = async (req, res) => {
    try {
      const { userId, productId } = req.query;
      if (!userId || !productId) {
        return res.status(400).json({ message: "User id and product id are required" });
      }
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(200).json({ exists: false });
      }
      const exists = cart.addedProducts.some(
        (prod) => prod.productId.toString() === productId
      );
      res.status(200).json({ exists });
    } catch (error) {
      console.error("Error checking product in cart:", error);
      res.status(500).json({
        message: "Error checking product in cart",
        error: error.message,
      });
    }
  };

  export const removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
      if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found for user" });
      }
  
      const index = cart.addedProducts.findIndex(
        (p) => p.productId.toString() === productId
      );
  
      if (index === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Remove the product from the cart
      cart.addedProducts.splice(index, 1);
      await cart.save();
  
      res.status(200).json({ message: "Product removed from cart successfully", cart });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({
        message: "Error removing product from cart",
        error: error.message,
      });
    }
  };

  export const getCart = async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User id is required" });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({
        message: "Error fetching cart",
        error: error.message,
      });
    }
  };

  export const emptyCart = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      await Cart.findOneAndUpdate(
        { userId },
        { addedProducts: [] },
        { new: true }
      );
  
      res.status(200).json({ message: "Cart emptied successfully" });
    } catch (error) {
      console.error("Error emptying cart:", error);
      res.status(500).json({
        message: "Error emptying cart",
        error: error.message,
      });
    }
  };