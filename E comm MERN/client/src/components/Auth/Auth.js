import React from "react" ;
import AuthHeader from "../Others/Header/AuthHeader.js";
import "./Auth.css" ;
import {useState} from "react" ;
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ()=>{
    const[isLogincontainer,setIsLoginContainer] = useState(true);
    const [data, setData] = useState({
        name:"",
        username:"",
        password:"",
        confirmpassword:"",
        loginUsername:"",
        loginPassword:"",
      });

      const navigate = useNavigate();

    const handleSwitchLC = (event)=>{
        setIsLoginContainer(false);
        event.preventDefault();
    }

    const handleSwitchBackLC =(e)=>{
        setIsLoginContainer(true);
        e.preventDefault();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSetupAccount = async (event) => {
        event.preventDefault();
      
        if (!data.name || !data.username || !data.password) {
          window.alert("All fields are required!");
          return;
        }
      
        try {
          const response = await axios.post(
            'http://localhost:8081/createAccount',
            {
              name: data.name,
              username: data.username,
              password: data.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      
          if (response.status === 201) {
            window.alert(response.data.message);
            setIsLoginContainer(true);
            setData({
              name: "",
              username: "",
              password: "",
              confirmpassword:"",
            });
          }
        } catch (err) {
          console.log(err);
          window.alert(
            err.response?.data?.message || "An error occurred while creating the account."
          );
        }
      };

      const handleCheckUserDetails = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(
            "http://localhost:8081/loginUser",
            { username: data.loginUsername, password: data.loginPassword}
          );
    
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userdata", JSON.stringify(response.data.user));
            navigate("/home")
    }
        } catch (err) {
          console.log(err);
          window.alert(
            err.response?.data?.message || "An error occurred while logging in."
          );
        }
      };

    return (<>
    <AuthHeader />
    <div id="loginContainer" style={{display:isLogincontainer?"block":"none"}}>
        <h2>Login Account</h2>
        <form id="loginArea" onSubmit={handleCheckUserDetails}>
            <label >Username or Email</label>
            <input type="text" id="username" placeholder="Enter your username or email" name="loginUsername" onChange={handleInputChange} value={data.loginUsername} required/>
            <label>Password</label>
            <input type="password" id="password" placeholder="Enter your password" name="loginPassword" onChange={handleInputChange} value={data.loginPassword} required/>
            <button id="loginSubmit" type="submit">Login</button>
            <p id="loginPara">Don't have an aacount?<span id="loginSpan" onClick={handleSwitchLC}>Create Account</span></p>
        </form>
    </div>
    <div id="signContainer" style={{display:!isLogincontainer?"block":"none"}}>
        <h2>SignUp Account</h2>
        <form id="signupArea" onSubmit={handleSetupAccount}>
            <label for="name">Full Name</label>
            <input type="text" placeholder="Enter Your Full Name" id="name" name="name" value={data.name} onChange={handleInputChange} required />
            <label for="userName">Username</label>
            <input type="text" placeholder="Create username" id="userName" name="username" value={data.username} onChange={handleInputChange} required />
            <label for="setPassword">Set Password</label>
            <input id="setPassword" placeholder="Set password" type="password" name="password" value={data.password} onChange={handleInputChange} required />
            <label id="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Confirm password" name="confirmpassword" value={data.confirmpassword} onChange={handleInputChange} required />
            <button id="signupBtn" type="submit">Sign up</button>
            <p id="signupPara">Already have an account?<span id="signupSpan" onClick={handleSwitchBackLC}>Login</span></p>
        </form>
    </div>
    </>)
}

export default Auth ;