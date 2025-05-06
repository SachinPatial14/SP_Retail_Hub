import React, { useState } from "react";
import "./homeHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faShop,faHeart,faGear,faBoxOpen,faCartShopping,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const HomeHeader= () => {
    const[searchTerm,setSearchTerm] = useState("");

    const naviagte = useNavigate();

    const navigateSetting = ()=>{
        naviagte("/setting");
    }

    const navigateWishList = ()=>{
      naviagte("/wishlist");
    }

    const handleSearch = ()=>{
      if(searchTerm.trim()){
        naviagte(`/search?query=${encodeURIComponent(searchTerm)}`);
      }
    };

    const navigateCart = ()=>{
      naviagte("/cart");
  };

  const navigateOrder = ()=>{
    naviagte("/order");
};

const handleLogout = () => {
  if (window.confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    naviagte("/");
  }
};




  return (
    <>
    <div id="homeHeader">
       <div id="homeHeaderElements">
        <img id="logoHome" src="/sitelogo.jpg" alt="logo image"  />
        <div id="search">
        <input type="text" id="searchArea" placeholder="search here..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        <button id="searchBtn" onClick={handleSearch}>Go</button>
        </div>
        <div id="navLinks">
            <ul id="links">
                <li><a id="active" href="#"><FontAwesomeIcon icon={faHouse} /></a></li>
                <li><a onClick={navigateWishList}><FontAwesomeIcon icon={faHeart} /></a></li>
                <li><a ><FontAwesomeIcon icon={faGear} onClick={navigateSetting} /></a></li>
                <li><a onClick={navigateOrder} ><FontAwesomeIcon icon={faBoxOpen} /></a></li>
                <li><a onClick={navigateCart} ><FontAwesomeIcon icon={faCartShopping} /></a></li>
                <li><a onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} /></a></li>
            </ul>
        </div>
        </div> 
    </div>
    </>
  );
};

export default HomeHeader;