import Cart from "../models/cart.js";
import Order from "../models/order.js";


export const ConfirmOrder = async(req,res)=>{
    try{
      const {userId,deliveryDate} = req.body ;
      if(!userId){
        return res.status(400).json({
            message:"UserId is required"
        });
      };

      const cart = await Cart.findOne({userId});
      if(!cart || !cart.addedProducts || cart.addedProducts.length === 0){
        return res.status(400).json({message:"Cart is empty"});
      };

      const newOrder = new Order({
        userId,
        orders:cart.addedProducts,
        deliveryDate:deliveryDate ? new Date(deliveryDate) : new Date(Date.now() + 7*24*60*60*1000 ),
      });

      await newOrder.save();

      cart.addedProducts = [] ;
      await cart.save();

      res.status(201).json({
        message:"Order confirmed successfully",
        order:newOrder,
      });

    }catch(error){
        console.error("Error confirming order:",error);
        res.status(500).json({
            message:"Error confirming order",
            error:error.message,
        });

    }
};

export const getOrders = async (req,res)=>{
    try{
      const {userId} = req.query ;
      if(!userId){
        return res.status(400).json({message:"User id is required"});
      };

      const orders = await Order.find({userId}).sort({createdAt : -1});
      res.status(200).json({orders});
    }catch(error){
      console.error("Error fetching Orders:",error);
      res.status(500).json({message:"Error fetching orders",
        error:error.message,
      });
    }
};

export const confirmOrderStatus = async(req,res)=>{
    try{
      const {orderId} = req.body ;
      if(!orderId)return res.status(400).json({message:"Order id is required"});
      const order = await Order.findByIdAndUpdate(
        orderId,
        {orderStatus:"Confirmed"},
        {new:true}
      );

      if(!order) return res.status(404).json({message:"Order not found"});

      res.status(200).json({message:"Order confirmed successfully",
        order
      });

    }catch(error){
      console.error("Error confirming order:",error);
      res.status(500).json({message:"Error confirming order",
        error:error.message,
      });
    }
};

export const cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) return res.status(400).json({ message: "Order id is required" });
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: "Cancelled" },
        { new: true }
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
  };

  export const placeOrder = async(req,res)=>{
        try{
          const {userId,product,quantity,deliveryDate} = req.body ;

          if(!userId || !product || !quantity || !deliveryDate){
            return res.status(400).json({message:"Missing required fields"});
          }

          const orderData = {
            userId,
            orders:[
              {
                productId:product.productId ,
                brandname : product.brandname ,
                description : product.description,
                price: product.price ,
                quantity:Number(quantity),
                image : product.image ,
              },
            ],
            deliveryDate: new Date (deliveryDate),
          };

          const newOrder = new Order(orderData);
          await newOrder.save();
          res.status(201).json({message:"Order placed successfully",order:newOrder});

        }catch(error){
          console.error("Error placing order:",error);
          res.status(500).json({message:"Error placing order"});
        }
  };