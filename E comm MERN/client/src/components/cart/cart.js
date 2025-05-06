import React, { useEffect, useState } from "react";
import "./cart.css";
import CartHeader from "../Others/Header/cartHeader";
import axios from "axios";
import Footer from "../Others/Header/Footer/mainFooter";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [showOrderForm,setShowOrderForm] = useState(false);
  const [deliveryDate,setDeliveryDate] = useState("");

  const fetchCart = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("userdata"));
      if (!localUser) {
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:8081/getCart", {
        params: { userId: localUser._id },
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleEmptyCart = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("userdata"));
      if (!localUser) {
        alert("Please log in to empty cart");
        return;
      }
      const response = await axios.put("http://localhost:8081/emptyCart", {
        userId: localUser._id,
      });
      alert(response.data.message);
      setCart(null);
    } catch (error) {
      console.error("Error emptying cart:", error);
      alert("Failed to empty the cart. Please try again.");
    }
  };

  const handleConfirmOrderClick = ()=>{
    setShowOrderForm(true);
  };

  const handlePlaceOrder = async(e)=>{
    e.preventDefault();
    try{
      const localUser = JSON.parse(localStorage.getItem("userdata"));
      if(!localUser){
        alert("Please log in to place orders");
        return ;
      };

      const payload = {
        userId : localUser._id ,
        deliveryDate : deliveryDate ,
      };

      const response = await axios.post("http://localhost:8081/confirmOrder",payload);

      if(response.status === 201){
        alert(response.data.message);
        setCart(null);
        setShowOrderForm(false);
        setDeliveryDate("");
      }

    }catch(error){
      console.error("Error Placing Order:",error);
      alert(error.response?.data?.message || "Error placing order. Please try again.");

    }
  };

  return (
    <>
      <CartHeader />
      <section id="cartSection">
        <h2>Your Cart Products</h2>
        {loading ? (
          <p>Loading cart...</p>
        ) : cart && cart.addedProducts && cart.addedProducts.length > 0 ? (
          <div id="cartItems">
            {cart.addedProducts.map((item) => (
              <div key={item.productId} id="cartItem">
                {item.image && (
                  <img
                    src={`http://localhost:8081/ProductImages/${item.image}`}
                    alt={item.brandname}
                  />
                )}
                <div id="itemDetails">
                  <span>{item.brandname}</span>
                  <h5>{item.description}</h5>
                  <h4>Price: ₹{item.price}</h4>
                  <h3>Quantity: {item.quantity}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products in your cart.</p>
        )}
      </section>

      <div id="submitProduct">
        <button id="orderBtn" onClick={handleConfirmOrderClick}>
          Confirm Orders
        </button>
        <button id="removeBtn" onClick={handleEmptyCart}>
          Empty Cart
        </button>
      </div>

      { /* order form */}

      {showOrderForm && (
        <section id="orderFormSection">
          <h3>Place Your Order</h3>
          <form onSubmit={handlePlaceOrder}>
            <label htmlFor="deliverDate">delivery Date:</label>
            <input type="date" id="deliveryDate" value={deliveryDate} onChange={(e)=>setDeliveryDate(e.target.value)} />
            <button type="submit">Place Order</button>
            <button type="button" onClick={()=> setShowOrderForm(false)}>Cancel</button>
          </form>
        </section>
      )};
      <Footer />
    </>
  );
};

export default Cart;