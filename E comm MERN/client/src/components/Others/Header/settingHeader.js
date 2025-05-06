import React from "react";
import "./settingHeader.css" ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faHeart,faGear,faCartShopping} from '@fortawesome/free-solid-svg-icons';

const SettingHeader = () =>{

     const naviagte = useNavigate();
     const naviagteHome = ()=>{
        naviagte("/home");
     }

     const navigateWishList = ()=>{
        naviagte("/wishlist");
      }
       
      const navigateCart = ()=>{
        naviagte("/cart");
    };


    return (
        <>
            <div id="settingHeader">
               <div id="settingHeaderElements">
                <img id="logoSetting" src="/sitelogo.jpg" alt="logo image"  />
                <div id="navLinks">
                    <ul id="links">
                        <li><a onClick={naviagteHome} ><FontAwesomeIcon icon={faHouse} /></a></li>
                        <li><a onClick={navigateWishList} ><FontAwesomeIcon icon={faHeart} /></a></li>
                        <li><a id="active" href="#"><FontAwesomeIcon icon={faGear} /></a></li>
                        <li><a onClick={navigateCart}><FontAwesomeIcon icon={faCartShopping} /></a></li>
                    </ul>
                </div>
                </div> 
            </div>
        
        </>
    )
}

export default SettingHeader ;