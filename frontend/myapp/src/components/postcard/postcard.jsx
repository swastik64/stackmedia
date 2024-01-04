import React from 'react';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';

import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';


import './postcard.css';
import { Link } from 'react-router-dom';

export const Postcard = (props) => {
  return (
    <div className="card">
       <div className="owner-section">
        <Avatar src={props.ownerImage} alt="Owner" />
        <Link to={`/user/${props._id}`}  style={{color:'black',textDecoration:'none' , paddingLeft:"1rem" , fontWeight:"bold" }}>{props.ownername}</Link>
      </div>
 <img className="card-img-top" src={props.url} alt="Card image cap" />
<div className="card-body">
     <div className="action-section">
          <div className="action-icons">
            < FavoriteBorderOutlinedIcon />
             <AddCommentOutlinedIcon />
             </div>
              </div>
              <div>
                {props.likes.length} likes 
              </div>
              <div>
                {props.ownername} : {props.caption}
              </div>
              <div className='input'>
              <input type="text" placeholder="Add a comment..."  />
              <button>Post</button>
              </div>

     
      </div>
    </div>
  );
};
