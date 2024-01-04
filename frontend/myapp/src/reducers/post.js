import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post', 
  initialState: {
    
     },
  reducers: {
   postOfFollowingRequest : (state)=>{
    state.loading = true;
   },
   postOfFollowingSuccess : (state,action)=>{
    state.loading = false;
    state.posts = action.payload.posts;
   },
   postOfFollowingFailure : (state,action)=>{
    state.loading = false;
    state.error  = {
      message: action.payload.data.message,
      headers: { ...action.payload.headers } 
    };
   }
}});

export const {postOfFollowingRequest, postOfFollowingSuccess , postOfFollowingFailure} = postSlice.actions;
export default postSlice.reducer;