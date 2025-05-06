import React, { useState } from "react";
import "./searchHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart,faCartShopping,faBackward } from '@fortawesome/free-solid-svg-icons';


const SearchHeader = ()=>{
    const[searchTerm,setSearchTerm] = useState("");
    
    const navigate = useNavigate();
    const navigateHome = ()=>{
        navigate('/home');
    };

    const navigateWishList =()=>{
        navigate('/wishlist');
    };

    const handleSearch = ()=>{
        if(searchTerm.trim()){
          navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
      };

      const navigateCart = ()=>{
        navigate("/cart");
    };

  
    return(
        <>
    <div id="searchHeader">
       <div id="searchHeaderElements">
        <img id="logoSearch" src="/sitelogo.jpg" alt="logo image"  />
        <div id="search">
        <input type="text" id="searchArea" placeholder="search here..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        <button id="searchBtn" onClick={handleSearch}>Go</button>
        </div>
        <div id="navLinks">
            <ul id="links">
                <li><a onClick={navigateHome}><FontAwesomeIcon icon={faBackward} /></a></li>
                <li><a onClick={navigateWishList}><FontAwesomeIcon icon={faHeart} /></a></li>
                <li><a onClick={navigateCart}><FontAwesomeIcon icon={faCartShopping} /></a></li>
            </ul>
        </div>
        </div> 
    </div>

        </>
    )
}

export default SearchHeader ;