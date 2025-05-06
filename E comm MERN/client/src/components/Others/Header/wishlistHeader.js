import React from "react";
import "./wishlistHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faHeart,faBoxOpen,faCartShopping} from '@fortawesome/free-solid-svg-icons';


const WishListHeader = ()=>{
    const navigate = useNavigate();

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
            <div id="wishListHeader">
               <div id="wishListHeaderElements">
                <img id="logoWish" src="/sitelogo.jpg" alt="logo image"  />
                <div id="navLinks">
                    <ul id="links">
                        <li><a onClick={navigateHome}><FontAwesomeIcon icon={faHouse} /></a></li>
                        <li><a id="active" href="#" ><FontAwesomeIcon icon={faHeart} /></a></li>
                        <li><a onClick={navigateOrder}><FontAwesomeIcon icon={faBoxOpen} /></a></li>
                        <li><a onClick={navigateCart}><FontAwesomeIcon icon={faCartShopping} /></a></li>
                    </ul>
                </div>
                </div> 
            </div>
        
        </>
    )
}

export default WishListHeader ;