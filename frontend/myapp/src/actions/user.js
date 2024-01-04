import axios from "axios";
import { getCompleteUsersfailure, getCompleteUsersrequest, getCompleteUserssuccess, loaduserfailure, loaduserrequest, loadusersuccess } from "../reducers/user"

export const loaduser = ()=>async (dispatch)=>{
    try {
        dispatch(loaduserrequest());
         const res = await axios.get("http://localhost:5000/api/v1/me",{  withCredentials : true ,  headers : {'Content-Type': 'application/json'}});  

         dispatch(loadusersuccess(res.data));
    } catch (error) {
        dispatch(loaduserfailure(error.response));
    }
}

export const getCompleteUsers = ()=>async (dispatch)=>{
    try {
        dispatch(getCompleteUsersrequest());
         const res = await axios.get("http://localhost:5000/api/v1/allusers",{  withCredentials : true ,  headers : {'Content-Type': 'application/json'}});  

         dispatch(getCompleteUserssuccess(res.data));
    } catch (error) {
        dispatch(getCompleteUsersfailure(error.response));
    }
}