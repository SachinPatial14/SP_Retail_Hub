import Address from "../models/address.js";

export const addAddress  = async (req, res) => {
    try {
      const { userId, addressText } = req.body;
      if (!userId || !addressText) {
        return res.status(400).json({ message: "userId and address text are required" });
      }
  
      const updatedAddress = await Address.findOneAndUpdate(
        { userId },
        { addressText },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        message: "Address added successfully",
        address: updatedAddress,
      });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({
        message: "Error updating address",
        error: error.message,
      });
    }
  };

export const getAddressByUser = async (req, res) => {
    try {
      const { userId } = req.query; 
      if (!userId) {
        return res.status(400).json({ message: "User id is required" });
      }
      
      const address = await Address.findOne({ userId: userId });
      res.status(200).json({ address });
    } catch (error) {
      console.error("Error fetching address:", error);
      res.status(500).json({
        message: "Error fetching address",
        error: error.message,
      });
    }
  };