import axios from "axios";
import { postOfFollowingFailure, postOfFollowingRequest, postOfFollowingSuccess } from "../reducers/post";


export const fetchData = ()=> async (dispatch) => {
    try {
      dispatch(postOfFollowingRequest());

      const res = await axios.get("http://localhost:5000/api/v1/posts", {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

     
      dispatch(postOfFollowingSuccess(res.data));
    } catch (error) {
      dispatch(postOfFollowingFailure(error.response));
    }
  };

 