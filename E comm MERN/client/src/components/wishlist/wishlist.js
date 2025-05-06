import React from "react";
import "./wishlist.css" ;
import WishListHeader from "../Others/Header/wishlistHeader.js";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Others/Header/Footer/mainFooter.js";


const WishList = ()=>{
    const [wishlistItems, setWishlistItems] = useState([]);

    const navigate = useNavigate();

  const fetchWishlistItems = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userdata"));
      if (!user) return;
      const response = await axios.get("http://localhost:8081/getWishlistItems", {
        params: { userId: user._id },
      });
      setWishlistItems(response.data.wishlistItems || []);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);
  
  const handleRemoveWishlist = async (wishlistId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/deleteWishlistItem/${wishlistId}`);
      if (response.status === 200) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== wishlistId));
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting item from wishlist. Please try again."
      );
    }
  };

  const selectedProduct = (item)=>{
    localStorage.setItem("selectedProduct",JSON.stringify(item));
    navigate("/prodetails");
  };


    return(
        <>
       < WishListHeader />
       <section id="wishListSection">
        <h2>My Collection</h2>
       </section>
       {wishlistItems.length > 0 ? (
        wishlistItems.map((item) => (
          <div key={item._id} id="wishlistItem" onClick={()=>selectedProduct(item)}>
            {item.image && (
              <img
                src={`http://localhost:8081/ProductImages/${item.image}`}
                alt={item.brandname}
                style={{ width: "150px", height: "auto" }}
              />
            )}
            <div id="wishlistDetails">
              <span>{item.brandname}</span>
              <h5>{item.description}</h5>
              <h4>₹{item.price}</h4>
              <h3>Available: {item.quantity}</h3>
            </div>
            <div
              id="wishlistRemove"
              onClick={(e)=>{
                e.stopPropagation();
                handleRemoveWishlist(item._id)}}
            >
              <FontAwesomeIcon icon={faHeart} style={{ color: "#ff3b30" }} />
            </div>
          </div>
        ))
      ) : (
        <p id="empty" >No wishlist items found</p>
      )};
            <Footer />
        </>
    )
}

export default WishList ;