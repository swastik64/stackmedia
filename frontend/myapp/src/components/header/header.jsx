import React, { useState } from 'react'
import "./header.css";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [tab , setTab] = useState(window.location.pathname);

  

  return (
    <div className='header'>
      <ul>
     <li><Link to = "/" onClick={()=>setTab("/")}>{tab==="/"?<HomeIcon style={{color:"black"}}/>:<HomeOutlinedIcon style={{color:"black"}}/>}</Link> </li>
     <li><Link to = "/newPost" onClick={()=>setTab("/newPost")}>{tab==="/newPost"?<AddCircleIcon style={{color:"black"}}/>:<AddCircleOutlineOutlinedIcon style={{color:"black"}}/>}</Link> </li>
     <li><Link to = "/search" onClick={()=>setTab("/search")}>{tab==="/search"?<SearchIcon style={{color:"black"}}/>:<SearchOutlinedIcon style={{color:"black"}}/>}</Link> </li>
     <li><Link to = "/myaccount" onClick={()=>setTab("/myaccount")}>{tab==="/myaccount"?<AccountCircleIcon style={{color:"black"}}/>:<AccountCircleOutlinedIcon style={{color:"black"}}/>}</Link></li>

     </ul>
      
      </div>
  )
}
