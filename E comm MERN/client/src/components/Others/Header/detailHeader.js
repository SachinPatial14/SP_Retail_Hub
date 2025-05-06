import React from "react";
import "./detailHeader.css" ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faHeart,faBoxOpen,faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";



const DetailHeader = ()=>{
    const navigate = useNavigate();

    const navigateWishList = ()=>{
        navigate("/wishlist") ;
    };

    const navigateHome = ()=>{
        navigate("/home");
    };

    const navigateCart = ()=>{
        navigate("/cart");
    };

    const navigateOrder = ()=>{
        navigate("/order");
    };



    return (
        <>
    <div id="detailHeader">
       <div id="detailHeaderElements">
        <img id="logoDetail" src="/sitelogo.jpg" alt="logo image"  />
        <div id="navLinks">
            <ul id="links">
                <li><a onClick={navigateHome}><FontAwesomeIcon icon={faHouse} /></a></li>
                <li><a onClick={navigateWishList}><FontAwesomeIcon icon={faHeart} /></a></li>
                <li><a onClick={navigateOrder} ><FontAwesomeIcon icon={faBoxOpen} /></a></li>
                <li><a onClick={navigateCart}><FontAwesomeIcon icon={faCartShopping} /></a></li>
            </ul>
        </div>
        </div> 
    </div>

        </>
    )
}

export default DetailHeader ;
