import React, { useEffect, useState } from "react";
import "./setting.css";
import SettingHeader from "../Others/Header/settingHeader.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faBriefcase,
  faXmark,
  faPenToSquare,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const [defaultSetting, setDefaultSetting] = useState(true);
  const [sellerSetting, setSellerSetting] = useState(false);
  const [hoverSeller, setHoverSeller] = useState(false);
  const [productModel, setProductModel] = useState(false);
  const [sellerActive, setSellerActive] = useState(false);
  const [accountActive, setAccountActive] = useState(false);
  const[addressActive,setAddressActive] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false);
  const[hoverAddress,setHoverAddress] = useState(false);
  const [accountModel, setAccountModel] = useState(false);
  const [profileEditModel, setProfileEditModel] = useState(false);
  const[addressModel,setAddressModel] = useState(false);
  const[editAddressModel,setEditAddressModel] = useState(false);

  const [user, setUser] = useState({});

  const[addressText,setAddressText] = useState("");

  const navigate = useNavigate();

  const [data, setData] = useState({
    brandname: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [editProfileData, setEditProfileData] = useState({
    id: "",
    name: "",
    username: "",
    newPassword: "",
    currentPassword: "",
  });

  const [image, setImage] = useState(null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchCrenditals = () => {
    const localUser = JSON.parse(localStorage.getItem("userdata"));
    if (localUser) {
      setUser(localUser);
      setEditProfileData({
        id: localUser._id || "",
        name: localUser.name || "",
        username: localUser.username || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  };

  useEffect(() => {
    fetchCrenditals();
  }, []);

  const handleProductDetailsChange = async (e) => {
    e.preventDefault();
    if (
      !data.brandname &&
      !data.description &&
      !data.price &&
      !data.quantity &&
      !image
    ) {
      return window.alert("Please do some changes to save changes.");
    }
    const formData = new FormData();
    formData.append("ownerid", user?._id);
    if (data.brandname) formData.append("brandname", data.brandname);
    if (data.description) formData.append("description", data.description);
    if (data.price) formData.append("price", data.price);
    if (data.quantity) formData.append("quantity", data.quantity);
    if (image) formData.append("image", image);
    try {
      const response = await axios.post(
        "http://localhost:8081/products",
        formData
      );
      if (response.status === 201) {
        window.alert(response.data.message);
        window.location.reload();
        setData({
          brandname: "",
          quantity: "",
          price: "",
          description: "",
        });
        setImage(null);
      } else {
        window.alert("Something went wrong while changing your details!!");
      }
    } catch (error) {
      console.error("Failed to edit details of your account due to:", error);
      window.alert(error.response.data.message);
    }
  };

  const handleProfileDataChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:8081/updateUser",
        editProfileData
      );
      alert(response.data.message);
      localStorage.setItem("userdata", JSON.stringify(response.data.user));
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      alert(
        error.response?.data?.message ||
          "An error occured while updating user details."
      );
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user._id,
        addressText: addressText,
      };
      const response = await axios.put("http://localhost:8081/addAddress", payload);
      alert(response.data.message);
      if(response.data.address && response.data.address.addressText){
        setAddressText(response.data.address.addressText);
      }
      fetchAddress();
      closeEditAddressModel();
    } catch (error) {
      console.error("Error saving address:", error);
      alert(
        error.response?.data?.message || "Error saving address. Please try again."
      );
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await axios.get("http://localhost:8081/getAddressByUser", {
        params: { userId: user._id },
      });
      if (response.data.address && response.data.address.addressText) {
        setAddressText(response.data.address.addressText);
      } else {
        setAddressText("");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(()=>{
    fetchAddress();
  },[user._id]);

  const handleSellerClick = () => {
    setDefaultSetting(false);
    setSellerSetting(true);
    setSellerActive(true);
  };

  const handleAccountClick = () => {
    setDefaultSetting(false);
    setAccountModel(true);
    setAccountActive(true);
  };

  const openProductModel = () => {
    setDefaultSetting(false);
    setSellerSetting(false);
    setProductModel(true);
  };

  const openAddressMOdel = ()=>{
    setDefaultSetting(false);
    setAddressModel(true);
    setAddressActive(true);
  }

   
  const openProfileEditModel = () => {
    setDefaultSetting(false);
    setProfileEditModel(true);
    setAccountModel(false);
  };

  const openEditAddressModel = () =>{
    setDefaultSetting(false);
    setEditAddressModel(true);
    setAddressModel(false);
  }

  const handleCloseSeller = () => {
    setDefaultSetting(true);
    setSellerSetting(false);
    setSellerActive(false);
  };

  const handleCloseAccount = () => {
    setDefaultSetting(true);
    setAccountModel(false);
    setAccountActive(false);
  };

  const closeAddressModel = ()=>{
    setDefaultSetting(true);
    setAddressModel(false);
    setAddressActive(false);
  }

  const closeProductModel = () => {
    setProductModel(false);
    setDefaultSetting(false);
    setSellerSetting(true);
    setSellerActive(true);
  };

  const closeProfileEditModel = () => {
    setAccountModel(true);
    setDefaultSetting(false);
    setProfileEditModel(false);
    setAccountActive(true);
  };

  const closeEditAddressModel = ()=>{
    setDefaultSetting(false);
    setAddressModel(true);
    setEditAddressModel(false);
    setAddressActive(true);
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userdata");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <>
      <SettingHeader />
      <div id="settingContainer">
        {/* Account Setting */}
        <div
          id="accountSetting"
          onClick={handleAccountClick}
          onMouseEnter={() => setHoverAccount(true)}
          onMouseLeave={() => setHoverAccount(false)}
          style={{
            backgroundColor: accountActive
              ? "#ff9f1c"
              : hoverAccount
              ? "#ff9f1c"
              : "#ddd",
          }}
        >
          <span>
            <FontAwesomeIcon icon={faUser} />Account Setting
          </span>
        </div>
        {/* Address Management */}
        <div id="addressSetting" onClick={openAddressMOdel} onMouseEnter={()=>setHoverAddress(true)} onMouseLeave={()=>setHoverAddress(false)}
          style={{backgroundColor:addressActive?"ff9f1c":hoverAddress?"#ff9f1c":"#ddd"}}>
          <span>
            <FontAwesomeIcon icon={faLocationDot} />Address Management
          </span>
        </div>
        {/* Become a Seller */}
        <div
          id="sellerSetting"
          onClick={handleSellerClick}
          onMouseEnter={() => setHoverSeller(true)}
          onMouseLeave={() => setHoverSeller(false)}
          style={{
            backgroundColor: sellerActive
              ? "#ff9f1c"
              : hoverSeller
              ? "#ff9f1c"
              : "#ddd",
          }}
        >
          <span>
            <FontAwesomeIcon icon={faBriefcase} />Become a Seller
          </span>
        </div>
      </div>

      {/* Empty Content */}
      <div id="emptyContent" style={{ display: defaultSetting ? "block" : "none" }}>
        <h2>Click on any Setting to Continue</h2>
      </div>

      {/* Seller Model */}
      <div id="sellerModel" style={{ display: sellerSetting ? "block" : "none" }}>
        <button id="closeSeller" onClick={handleCloseSeller}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button id="addProductBtn" onClick={openProductModel}>
          Add Your Product
        </button>
      </div>

      {/* Product Upload Form */}
      <div
        id="productUploadContainer"
        style={{ display: productModel ? "block" : "none" }}
      >
        <form id="productForm" onSubmit={handleProductDetailsChange}>
          <label htmlFor="imageUpload">Image Upload</label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleChangeImage}
            accept="image/*"
          />
          <label htmlFor="brandName">Brand Name</label>
          <input
            type="text"
            id="brandName"
            name="brandname"
            value={data.brandname}
            onChange={handleInputChange}
            placeholder="Enter brand name"
            required
          />
          <label htmlFor="productQuantity">Quantity</label>
          <input
            type="number"
            id="productQuantity"
            name="quantity"
            value={data.quantity}
            onChange={handleInputChange}
            placeholder="Availabe items"
            required
          />
          <textarea
            id="productDes"
            placeholder="Enter description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <label htmlFor="productPrice">Price</label>
          <input
            type="number"
            id="productPrice"
            name="price"
            value={data.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            required
          />
          <button type="submit" id="addBtn">
            Add item
          </button>
          <button type="button" id="closeBtn" onClick={closeProductModel}>
            Close
          </button>
        </form>
      </div>

      {/* Account Model */}
      <div id="accountModel" style={{ display: accountModel ? "block" : "none" }}>
        <button id="closeAccount" onClick={handleCloseAccount}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {user ? (
          <>
            <div id="fullName">
              <h3>Name:</h3>
              <p>{user.name}</p>
            </div>
            <div id="userName">
              <h3>User Name:</h3>
              <p>{user.username}</p>
            </div>
          </>
        ) : (
          <p>No user data available</p>
        )}
        <button id="editProfile" onClick={openProfileEditModel}>
          <FontAwesomeIcon icon={faPenToSquare} />Edit
        </button>
        <button id="logoutBtn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />Log Out
        </button>
      </div>

      {/* Profile Edit Model */}
      <div
        id="profileEditModel"
        style={{ display: profileEditModel ? "block" : "none" }}
      >
        <button id="closeEdit" onClick={closeProfileEditModel}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <form id="editForm" onSubmit={handleProfileDataChange}>
          <label htmlFor="newFullName">New Name</label>
          <input
            type="text"
            id="newFullName"
            name="name"
            value={editProfileData.name}
            onChange={handleProfileInputChange}
            placeholder="Enter new name"
            required
          />
          <label htmlFor="newUsername">New Username</label>
          <input
            type="text"
            id="newUsername"
            name="username"
            value={editProfileData.username}
            onChange={handleProfileInputChange}
            placeholder="Enter new username"
            required
          />
          <label htmlFor="currPassword">Current Password</label>
          <input
            type="password"
            id="currPassword"
            name="currentPassword"
            value={editProfileData.currentPassword}
            onChange={handleProfileInputChange}
            placeholder="Enter current password"
            required
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={editProfileData.newPassword}
            onChange={handleProfileInputChange}
            placeholder="Enter new password"
            required
          />
          <button type="submit" id="confirmEdit">
            Confirm
          </button>
        </form>
      </div>

      {/* address model */}

      <div id="addressModel"  style={{display:addressModel?"block":"none"}}>
        <button id="closeAddressModel" onClick={closeAddressModel}><FontAwesomeIcon icon={faXmark} /></button>
      <div id="deliveryAddress">
      <h2>Delivery Address :</h2>
      {addressText?(<p>{addressText}</p>):(<p>No address available</p>)}
      </div>
      <button id="setAddressBtn" onClick={openEditAddressModel}>Edit Address</button>
    </div>

    {/* set address model */}

    <div id="editAddressModel" style={{display:editAddressModel?"block":"none"}}>
        <button id="closeEditAddressModel" onClick={closeEditAddressModel}><FontAwesomeIcon icon={faXmark} /></button>
        <form id="addressForm" onSubmit={handleAddressSubmit}>
           <textarea id="enterLocation" value={addressText} onChange={(e)=>setAddressText(e.target.value)} placeholder="Enter your address" rows="4" required />
           <button type="submit" id="submitLocation">Submit</button>
        </form>
    </div>



    </>
  );
};

export default Setting;