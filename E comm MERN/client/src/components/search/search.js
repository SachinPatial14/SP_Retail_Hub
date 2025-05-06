import React, { useEffect, useState } from "react";
import "./search.css";
import SearchHeader from "../Others/Header/searchHeader.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Others/Header/Footer/mainFooter.js";
import { useNavigate } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get("query");
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [hoverWish, setHoverWish] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get("http://localhost:8081/searchProducts", {
          params: { query: searchTerm },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

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

  // Add a product to the wishlist
  const handleAddWishlist = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("userdata"));
      if (!user) {
        alert("Please log in to add items to your wishlist");
        return;
      }
      const payload = {
        userId: user._id,
        brandname: product.brandname,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        image: product.image,
      };
      const response = await axios.post("http://localhost:8081/addWishlistItem", payload);
      if (response.status === 201) {
        setWishlistItems((prev) => [...prev, response.data.wishlistItem]);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding wishlist item:", error);
      alert(
        error.response?.data?.message ||
          "Error adding item to wishlist. Please try again."
      );
    }
  };

  // Delete a product from the wishlist
  const handleDeleteWishlist = async (wishlistId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/deleteWishlistItem/${wishlistId}`
      );
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

  // Toggle wishlist status
  const handleWishlistToggle = (product) => {
    const wishlistItem = wishlistItems.find(
      (item) => item.description === product.description
    );
    if (wishlistItem) {
      handleDeleteWishlist(wishlistItem._id);
    } else {
      handleAddWishlist(product);
    }
  };

  if (loading) return <div>Loading...</div>;

  const selectedProduct = (product)=>{
    localStorage.setItem("selectedProduct",JSON.stringify(product));
    navigate("/prodetails");
  };


  return (
    <>
      <SearchHeader />
      <section id="searchContent">
        <h2>Related Your Search</h2>
        <p>More to Explore and More to Discover</p>
      </section>
      <div id="searchProductsContainer">
        {products.length > 0 ? (
          <div id="productsGrid">
            {products.map((product) => {
              const isProductWishlisted = wishlistItems.some(
                (item) => item.description === product.description
              );
              return (
                <div key={product._id} id="productItem" onClick={()=>selectedProduct(product)}>
                  {product.image && (
                    <img
                      src={`http://localhost:8081/ProductImages/${product.image}`}
                      alt={product.brandname}
                    />
                  )}
                  <div id="productDetails">
                    <span>{product.brandname}</span>
                    <h5>{product.description}</h5>
                    <h4>₹{product.price}</h4>
                    <h3>Available: {product.quantity}</h3>
                  </div>
                  <div
                    id="wishDiv"
                    onClick={(e) =>{
                      e.stopPropagation(); 
                      handleWishlistToggle(product)
                  }}
                  >
                    <FontAwesomeIcon
                      id="wishIcon"
                      icon={faHeart}
                      onMouseEnter={() => setHoverWish(true)}
                      onMouseLeave={() => setHoverWish(false)}
                      style={{
                        color: isProductWishlisted
                          ? "#ff3b30"
                          : hoverWish
                          ? "#ff3b30"
                          : "#6e7e85",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No products found</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Search;
