import React from "react";
import "./cartHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faHeart,faBoxOpen,faCartShopping } from '@fortawesome/free-solid-svg-icons';


const CartHeader = ()=>{
    const navigate = useNavigate();

    const navigateHome = ()=>{
        navigate("/home");
    };

    const navigateWishList = ()=>{
        navigate("/wishlist");
    };

    const navigateOrder = ()=>{
        navigate("/order");
    };

    return (
        <>
         <div id="cartHeader">
            <div id="cartHeaderElements">
             <img id="logoCart" src="/sitelogo.jpg" alt="logo image"  />
             <div id="navLinks">
                 <ul id="links">
                     <li><a onClick={navigateHome}><FontAwesomeIcon icon={faHouse} /></a></li>
                     <li><a onClick={navigateWishList}><FontAwesomeIcon icon={faHeart} /></a></li>
                     <li><a onClick={navigateOrder} ><FontAwesomeIcon icon={faBoxOpen} /></a></li>
                     <li><a id="active"  ><FontAwesomeIcon icon={faCartShopping} /></a></li>
                 </ul>
             </div>
             </div> 
         </div>
     
        </>
    )
};

export default CartHeader ;