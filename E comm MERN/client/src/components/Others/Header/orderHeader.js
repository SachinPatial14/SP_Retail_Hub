import React from "react";
import "./orderHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faHeart,faBoxOpen,faCartShopping } from '@fortawesome/free-solid-svg-icons';


const OrderHeader = ()=>{

    const navigate = useNavigate();

    const navigateHome = ()=>{
        navigate("/home");
    }

    const navigateWishList = ()=>{
        navigate("/wishlist");
    };

    const navigateCart = ()=>{
        navigate("/cart");
    };

    return (
        <>
    <div id="orderHeader">
       <div id="orderHeaderElements">
        <img id="logoOrder" src="/sitelogo.jpg" alt="logo image"  />
        <div id="navLinks">
            <ul id="links">
                <li><a onClick={navigateHome}><FontAwesomeIcon icon={faHouse} /></a></li>
                <li><a onClick={navigateWishList}><FontAwesomeIcon icon={faHeart} /></a></li>
                <li><a id="active" ><FontAwesomeIcon icon={faBoxOpen} /></a></li>
                <li><a onClick={navigateCart} ><FontAwesomeIcon icon={faCartShopping} /></a></li>
            </ul>
        </div>
        </div> 
    </div>

        </>
    )
};

export default OrderHeader ;