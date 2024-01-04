import { Avatar} from '@mui/material'
import React from 'react'
import {Link} from "react-router-dom";

export const Usercard = (props) => {
  return (
    <div style={{display:'flex',gap : '1rem', marginBottom:'2rem' , alignItems:'center'}}>
        <Avatar src={props.ownerImage} alt="Owner"/>
        <Link to={`/user/${props._id}`}  style={{color:'black',textDecoration:'none'}}>{props.username}</Link>
    </div>
  )
}
