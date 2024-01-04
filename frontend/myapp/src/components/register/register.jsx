import React, { useEffect, useState } from 'react'
import "./register.css";
import { useDispatch, useSelector } from 'react-redux';
import { registerfailure, registerrequest, registersuccess ,clearerror } from '../../reducers/user';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
    const [name , setName] = useState("");
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");;
    const dispatch = useDispatch();
 const submitHandler = async (e) => {
    e.preventDefault();
    try {
        dispatch(registerrequest());
        console.log("1st");
        const res = await axios.post("http://localhost:5000/api/v1/register",{name:name ,email: email, password: password},{ withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
        dispatch(registersuccess(res.data));

    }
    catch(err){
        console.log(err);
        dispatch(registerfailure(err.response));

 }}
 const {error } = useSelector(state => state.user);
 useEffect(()=>{
    if(error)
    alert(error.message);
dispatch(clearerror());
 },[error]) ;
  return (
    <div className="wrapper">
        <div className="logo">
            <img src="https://i.pinimg.com/originals/82/0a/9d/820a9df8b0ecfe2737c84f0af47a0220.jpg" alt=""  />
        </div>
        <div className="text-center mt-4 name">
            F.R.I.E.N.D.S
        </div>
        <form className="p-3 mt-3" onSubmit={submitHandler}>
        <div className="form-field d-flex align-items-center">
                <span className="far fa-user"></span>
                <input type="text" name="userName" id="userName" placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className="form-field d-flex align-items-center">
                <span className="far fa-user"></span>
                <input type="email" name="userName" id="userName" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="form-field d-flex align-items-center">
                <span className="fas fa-key"></span>
                <input type="password" name="password" id="pwd" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button className="btn mt-3" >Sign up</button>
        </form>
        <div className="text-center fs-6">
            <a href="#">Forget password?</a> or <Link to = "/register">Sign up</Link>
        </div>
    </div>
  
  )
}
