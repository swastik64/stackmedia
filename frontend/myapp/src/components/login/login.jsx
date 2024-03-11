
import React, { useState, useEffect } from 'react';
import './login.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginfailure, loginrequest, loginsuccess } from '../../reducers/user';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginrequest());
      console.log("first");
      const response = await axios.post("http://localhost:5000/api/v1/login", {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include credentials for CORS requests
      });
      console.log(response.data);
      dispatch(loginsuccess(response.data));
    } catch (err) {
      console.error(err);
      console.log("2nd");
      dispatch(loginfailure(err));
    }
  };

  const { error } = useSelector(state => state.user);

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="https://i.pinimg.com/originals/82/0a/9d/820a9df8b0ecfe2737c84f0af47a0220.jpg" alt="" />
      </div>
      <div className="text-center mt-4 name">
        F.R.I.E.N.D.S
      </div>
      <form className="p-3 mt-3" onSubmit={submitHandler}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input type="text" name="userName" value={email} id="userName" placeholder="Username" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input type="password" name="password" value={password} id="pwd" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn mt-3">Login</button>
      </form>
      <div className="text-center fs-6">
        <a href="#">Forget password?</a> or <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};
