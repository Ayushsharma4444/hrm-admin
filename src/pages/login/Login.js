import axios from "../../axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import socket from "../../Socket";


const succesOption = {
  position: "bottom-right",
  type: "success",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const warningOption = {
  position: "bottom-right",
  type: "warning",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const errorOption = {
  position: "bottom-right",
  type: "error",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  function forgotNavigate(e){
    e.preventDefault();
    navigate("/forgotpassword");
  }

  const handleInput = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginRes = await axios({
        method: "post",
        url: "/login",
        data: {
          email: email,
          password: password,
        },
      });

      if (loginRes.data.status) {
        setLoading(false);
        toast(loginRes.data.message, succesOption);
        socket.emit("admin-login", loginRes.data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("Token", loginRes.data.token);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response.data.message === "Invalid credential") {
        toast(error.response.data.message, errorOption);
      } else {
        toast(error.response.data.message, warningOption);
      }
    }
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/register");
  };
  const pattern = /^[a-zA-Z0-9._%+-]+@ajiledone\.com$/;

  function handleChange(e) {
    setEmail(e.target.value);
    setIsValid(pattern.test(e.target.value));
  }

  return (
    <div>
      <ToastContainer />
      
      <div className="login-div-image">
        <img className="login-image" href="" alt="Ajiledone Technology" />
      </div>
      <form onSubmit={handleInput}>
        <div className="login-main-div">
          <h3 className="login-main-header">Login</h3>
          <p className="login-main-headerTwo">Access to out dashboard</p>
          <label className="login-email" for="Email">
            Email Address
          </label>
          <input
            className="login-email-input"
            id="Email"
            name="email"
            type="email"
            onChange={handleChange}         
          />
          
          <div className="space-passord-forgot">
            <label className="login-password form-label" for="Password">
              Password
            </label>
            <a href=""  className="login-password" onClick={forgotNavigate}>
            ForgotPassword
            </a>
          </div>
          <input
            className="login-email-input"
            id="Password"
            name="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {isValid ? (
            loading ? (
              <div className="loading-div">
                <button className="loading"></button>
              </div>
            ) : (
              <button className="register-button" type="submit">
                Login
              </button>
            )
          ) : (
            <button className="register-button" type="submit" disabled>
              Login
            </button>
          )}

          <div className="login-footer">
            <span>Don't have an account?</span>
            <a href="" onClick={handleNavigate}>
              Register
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
