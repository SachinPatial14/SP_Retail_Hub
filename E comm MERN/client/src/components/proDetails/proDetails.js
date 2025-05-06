import React, { useEffect, useState } from "react" ;
import "./proDetails.css" ;
import DetailHeader from "../Others/Header/detailHeader.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion , faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Others/Header/Footer/mainFooter.js";


const ProDetails = ()=>{
    const [selectedProduct,setSelectedProduct] = useState({});
    const[user,setUser] = useState({});
    const [reviews,setReviews] = useState([]);
    const[reviewRating,setReviewRating] = useState("");
    const[reviewText,setReviewText] = useState("");
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const [openAnswers, setOpenAnswers] = useState({});
    const [randomProducts,setRandomProducts] = useState([]);
    const [hoverWish,setHoverWish] = useState(false) ;
    const [wishlistItems, setWishlistItems] = useState([]);
    const [inCart, setInCart] = useState(false);
    const [showBuyModel,setShowBuyModel] = useState(false);
    
    const navigate = useNavigate();

    const getProduct = () => {
        const product = localStorage.getItem("selectedProduct");
        if (product) {
            const parsedProduct = JSON.parse(product);
            if (!parsedProduct._id && parsedProduct.id) {
              parsedProduct._id = parsedProduct.id;
            }
            setSelectedProduct(parsedProduct);
        }
      };

      const getUser = ()=>{
        const localUser = localStorage.getItem("userdata");
        if(localUser){
            setUser(JSON.parse(localUser));
        };
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
    

      
    useEffect(()=>{
        getProduct();
        getUser();
        fetchWishlistItems();
    },[]);

    const checkIfInCart = async () => {
      const localUser = JSON.parse(localStorage.getItem("userdata"));
      if (!localUser || !selectedProduct._id) return;
      try {
        const response = await axios.get("http://localhost:8081/productExists", {
          params: { userId: localUser._id, productId: selectedProduct._id },
        });
        setInCart(response.data.exists);
      } catch (error) {
        console.error("Error checking product in cart:", error);
      }
    };
  
    useEffect(() => {
      if (selectedProduct._id) {
        checkIfInCart();
      }
    }, [selectedProduct._id]);

    const fetchReviews = async()=>{
        if(selectedProduct._id){
            try{
              const response = await axios.get("http://localhost:8081/getReviewsForProduct",
                {params:{productId:selectedProduct._id},}
              );
              setReviews(response.data.reviews);
            }catch(error){
               console.error("Error fetching reviews:",error);
            }
        }
    };

    useEffect(()=>{
        fetchReviews();
    },[selectedProduct._id]);

    const convertRating = (ratingStr)=>{
        switch(ratingStr){
            case "Excellent":
                return 5;
            case "Good":
                return 4;
            case "Average":
                return 3;
            case "Poor":
                return 2;
            default:
                return 0;    
        }
    };

    const handleReviewSubmit = async(e)=>{
        e.preventDefault();

        if(!selectedProduct._id || !selectedProduct.ownerid || !user._id){
            alert("Missing product or user information");
            return ;
        };

        const numericRating = convertRating(reviewRating);

        const payload = {
            productId : selectedProduct._id ,
            productOwnerId : selectedProduct.ownerid,
            userId : user._id ,
            rating : numericRating,
            reviewText : reviewText,
            name : user.name ,
        };

        try{
         const response = await axios.post("http://localhost:8081/addReview",payload);
         alert(response.data.message);
         setReviewRating("");
         setReviewText("");
        }catch(error){
            console.error("Error adding review:",error);
            alert(error.response?.data?.message || "Error adding review. Please try again.");
        }
    };

    const faqData = [
        {
          question: "What is the return policy?",
          answer: "Return policy within 7 days",
        },
        {
          question: "Does this product come with a warranty?",
          answer: "Yes, this product come with a 1 year warranty",
        },
        {
          question: "Is there free shipping?",
          answer: "Yes, free shipping are available",
        },
        {
          question: "Can I cancel my order?",
          answer: "Yes, within a 2 days cancellation process are active",
        },
        {
          question: "Is my personal information secure?",
          answer:
            "Yes, your personal information are secure with the higher information security",
        },
      ];

      const toggleSection = () => {
        setIsSectionVisible(!isSectionVisible);
      };

      const toggleAnswer = (index) => {
        setOpenAnswers((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      };

      useEffect(()=>{
        if(selectedProduct._id){
            const fetchRandomProducts = async()=>{
                try{
                  const response = await axios.get("http://localhost:8081/randomProducts",{
                    params:{excludeId : selectedProduct._id},
                  });
                  setRandomProducts(response.data.products);
                  console.log("fetch random products are:",response.data.products);
                }catch(error){
                  console.error("Error fetching random Products:",error);
                }
            };
            fetchRandomProducts();
        }
      },[selectedProduct._id]);

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

      const handleAddToCart = async () => {
        try {
          const localUser = JSON.parse(localStorage.getItem("userdata"));
          if (!localUser) {
            alert("Please log in to add products to your cart");
            return;
          }
          const payload = {
            userId: localUser._id,
            product: {
              productId: selectedProduct._id,
              brandname: selectedProduct.brandname,
              description: selectedProduct.description,
              price: selectedProduct.price,
              quantity: 1, // default quantity is 1
              image: selectedProduct.image,
            },
          };
          const response = await axios.post("http://localhost:8081/addToCart", payload);
          if (response.status === 201) {
            alert(response.data.message);
            setInCart(true);
          }
        } catch (error) {
          console.error("Error adding to cart", error);
          alert(
            error.response?.data?.message ||
              "Error adding product to cart. Please try again."
          );
        }
      };
    
      const handleRemoveFromCart = async () => {
        try {
          const localUser = JSON.parse(localStorage.getItem("userdata"));
          if (!localUser || !selectedProduct._id) return;
          const payload = { userId: localUser._id, productId: selectedProduct._id };
          const response = await axios.delete("http://localhost:8081/removeFromCart", { data: payload });
          if (response.status === 200) {
            alert(response.data.message);
            setInCart(false);
          }
        } catch (error) {
          console.error("Error removing product from cart:", error);
          alert(
            error.response?.data?.message ||
              "Error removing product from cart. Please try again."
          );
        }
      };
    
      const handleCartToggle = () => {
        if (inCart) {
          handleRemoveFromCart();
        } else {
          handleAddToCart();
        }
      };

      const BuyNowModel = ({onClose,onSubmit})=>{
         const [quantity,setQuantity] = useState(1);
         const [deliveryDate,setDeliveryDate] = useState("");

         const handleSubmit = (e)=>{
          e.preventDefault();
          onSubmit({quantity,deliveryDate});
         };

         return(
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>Buy Now</h2>
              <form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <label htmlFor="modalQuantity">Quantity:</label>
                  <input id="modalQuantity" type="number" min="1" value={quantity} onChange={(e)=> setQuantity(e.target.value)} required />
                </div>
                <div className="formGroup">
                  <label htmlFor="deliveryDate">delivery Date:</label>
                  <input id="deliveryDate" type="date" value={deliveryDate} onChange={(e)=>setDeliveryDate(e.target.value)} required />
                </div>
                <div className="modalButtons">
                  <button type="submit" id="conBtn">Confirm Order</button>
                  <button type="button" id="closeBtn" onClick={onClose}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
         );
      };

      const handleBuyNowSubmit = async({quantity,deliveryDate})=>{
        if(!selectedProduct._id || !user._id){
          alert("Missing product or user information");
          return ;
        };

        const payload = {
          userId : user._id ,
          product :{
            productId:selectedProduct._id,
            brandname:selectedProduct.brandname ,
            description : selectedProduct.description ,
            price : selectedProduct.price ,
            image: selectedProduct.image ,

          },
          quantity:Number(quantity),
          deliveryDate: deliveryDate,
        };

        try{
          const response = await axios.post("http://localhost:8081/placeOrder",payload);
          alert(response.data.message);
          setShowBuyModel(false);
        }catch(error){
          console.error("Error placing order",error);
          alert(error.response?.data?.message || "Error placing order.Please try again.");
        }
      };
    
      // Check cart status using new endpoint
      const checkCartStatus = async () => {
        const localUser = JSON.parse(localStorage.getItem("userdata"));
        if (!localUser || !selectedProduct._id) return;
        try {
          const response = await axios.get("http://localhost:8081/productExists", {
            params: { userId: localUser._id, productId: selectedProduct._id },
          });
          setInCart(response.data.exists);
        } catch (error) {
          console.error("Error checking product in cart:", error);
        }
      };
    
      useEffect(() => {
        if (selectedProduct._id) {
          checkCartStatus();
        }
      }, [selectedProduct._id]);
    
      const clickedProduct = (product)=>{
        localStorage.setItem("selectedProduct",JSON.stringify(product));
        navigate("/prodetails");
        window.location.reload();
      };
    

    return(
        <>
       < DetailHeader />
       <div id="proDetailsContainer">
        <div id="proImage">
            {selectedProduct.image && (<img src={`http://localhost:8081/ProductImages/${selectedProduct.image}`} alt="product image" />)}
        </div>
        <div id="des">
            <span>{selectedProduct.brandname}</span>
            <h5>{selectedProduct.description}</h5>
            <h4>₹{selectedProduct.price}</h4>
            <h3>Available:{selectedProduct.quantity}</h3>
            <button id="addCart" onClick={handleCartToggle}>{inCart?"Remove From Cart":"Add To Cart"}</button>
            <button id="buyNow" onClick={()=> setShowBuyModel(true)}>Buy Now</button>
        </div>
       </div>

       {/* review section */}

       <section id="reviews">
        <h2>Customer Reviews</h2>
        <div id="reviewList">
            {reviews.length >0 ? (
                          reviews.map((review)=>(
                            <div key={review._id} id="reviewItem">
                                <p><strong>Rating:</strong>
                               <span> {review.rating}{""} </span>
                                </p>
                                <p><strong>Review:</strong>
                               <span> {review.reviewText} </span>
                                </p>
                                <p><em>By User: <span id="revname">{review.name}</span></em></p>
                            </div>
                          
            ))
                
            ):(
                <p>No reviews yet.</p>
            )}
        </div>

        <form id="reviewForm" onSubmit={handleReviewSubmit}>
        <h3>Leave a Review</h3>
        <label htmlFor="rating">Rating:</label>
        <select id="rating" value={reviewRating} onChange={(e)=>setReviewRating(e.target.value)} required>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
        </select>
        <label htmlFor="yourReview">Your Review</label>
        <textarea id="yourReview" value={reviewText} onChange={(e)=> setReviewText(e.target.value)}  rows="4" required />
        <button id="submitBtn" type="submit">Submit</button>
      </form>

       </section>

       {/* faq section */}

       <section id="faq">
        <h2>FAQ <FontAwesomeIcon id="quesIcon" icon={faCircleQuestion} /></h2>
        <div id="faqContainer">
            <button id="showQuestionsBtn" onClick={toggleSection}>Ask me a question</button>
            <div id="faqSection" className={isSectionVisible?"":"hidden"}>

                {faqData.map((item,index)=>(
                     <div
                     key={index}
                     id="faqQuestion"
                     data-answer={item.answer}
                     onClick={() => toggleAnswer(index)}
                     style={{ cursor: "pointer" }}
                   >
                     {item.question}
                     {openAnswers[index] && (
                       <div id="faqAnswer">{item.answer}</div>
                     )}
                   </div>
                ))}

            </div>
        </div>
    </section>

    {/* suggest product section */}

    <section id="suggestProducts">
  <h2>Explore More</h2>
  <p>Tech Solutions for a Smarter Tomorrow</p>
  <div id="productGrid">
    {randomProducts && randomProducts.length > 0 ? (
      randomProducts.map((product) => {
        const isProductWishlisted = wishlistItems.some(
          (item) => item.description === product.description
        );
        return (
          <div key={product._id} id="suggestionItem" onClick={()=>clickedProduct(product)}>
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
              <h3>Available : {product.quantity}</h3>
            </div>
            <div
              id="wishDiv"
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle(product);
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
      })
    ) : (
      <p>No suggestions available at the moment.</p>
    )}
  </div>
</section>
{showBuyModel && (
  <BuyNowModel onClose={()=>setShowBuyModel(false)} onSubmit={handleBuyNowSubmit} />
)}
< Footer />

        </>
    );
};

export default ProDetails ;