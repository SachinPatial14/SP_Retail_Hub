import React, { useEffect, useState } from "react";
import HomeHeader from "../Others/Header/homeHeader.js";
import "./home.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Others/Header/Footer/mainFooter.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverWish,setHoverWish] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/getAllProducts");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

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
    fetchProducts();
    fetchWishlistItems();
  }, []);

  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Add product to wishlist
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

  const handleWishlistToggle = (product) => {
    const wishlistItem = wishlistItems.find((item) => item.description === product.description);
    if (wishlistItem) {
      handleDeleteWishlist(wishlistItem._id);
    } else {
      handleAddWishlist(product);
    }
  };

  const selectedProduct = (product)=>{
    localStorage.setItem("selectedProduct",JSON.stringify(product));
    navigate("/prodetails");
  };

  return (
    <>
      <HomeHeader />
      <div id="heroSection">
        <img id="heroImage" src="/herbanner.jpg" alt="Hero Banner" />
        <p id="heroPara">
          <h4>Trade-in-offer</h4>
          <h2>Super value deals</h2>
          <h2>On all products</h2>
          <button id="shopHeroBtn">Shop Now</button>
        </p>
      </div>
      <section id="productSection">
        <h2>Featured Products</h2>
        <p>Smart techs for a smarter you</p>
      </section>
      <div id="productsContainer">
        {currentProducts.map((product) => {
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
              <div id="des">
                <span>{product.brandname}</span>
                <h5>{product.description}</h5>
                <h4>₹{product.price}</h4>
                <h3>Available: {product.quantity}</h3>
              </div>
              <div id="wishDiv" onClick={(e) =>{
                e.stopPropagation(); 
                 handleWishlistToggle(product)}}>
                <FontAwesomeIcon
                  id="wishIcon"
                  icon={faHeart}
                  onMouseEnter={()=>setHoverWish(true)}
                  onMouseLeave={()=>setHoverWish(false)}
                  style={{ color: isProductWishlisted ? "#ff3b30" :hoverWish ?"#ff3b30" : "#6e7e85" }}
                />
              </div>

            </div>
          );
        })}
      </div>
      <div id="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <button
            id="paginationBtn"
            key={number}
            className={currentPage === number ? "active" : ""}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Home;