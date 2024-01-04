import React, { useEffect } from 'react'
import "./home.css";
import { Postcard } from '../postcard/postcard';
import { useDispatch, useSelector } from 'react-redux';
import { postOfFollowingFailure, postOfFollowingRequest, postOfFollowingSuccess } from '../../reducers/post';
import axios from 'axios';
import  {Loader}  from "../loader/loader.jsx"
import { fetchData } from '../../actions/post.js';
import { getCompleteUsers } from '../../actions/user.js';
import { Usercard } from '../usercard/usercard.jsx';

export const Home = () => {
  const dispatch = useDispatch();
  const {loading , posts} = useSelector(state => state.post);
  const {loading : isloading , users} = useSelector(state => state.user);

  useEffect(()=>{
    dispatch(fetchData());
  },[dispatch]);

  useEffect(()=>{
    dispatch(getCompleteUsers());
  },[dispatch]);


  return (
    <div className='container'>
    <div className='left-section'>
    {loading ? (
        <Loader />
      ) : (
       (posts&& posts.length>0)?posts.map((post) => (
          <Postcard key={post._id} _id={post.owner._id} ownername={post.owner.name} caption = {post.caption} likes={post.likes} comments={post.comments} url={post.imageUrl.url} />
        )):"no posts yet"
      )}
    </div>
    <div className='right-section'>
    {isloading ? (
        <Loader />
      ) : (
       (users&& users.length>0)?users.map((user) => (
          <Usercard key={user._id} _id={user._id} username={user.name}/>
        )):"no users yet"
      )}
    </div>
    </div>
  )
}
