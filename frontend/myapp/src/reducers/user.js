
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user', 
  initialState: {
    isauthenticated : false
  },
  reducers: {
    loginrequest: (state) => {
      state.loading = true;
      
    },
    loginsuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isauthenticated = true;
    },
    loginfailure: (state, action) => {
      state.loading = false;
      state.error  = {
        message: action.payload.data.message,
        headers: { ...action.payload.headers } // Convert AxiosHeaders to a plain object
      };
    },
    registerrequest: (state) => {
      state.loading = true;
      
    },
    registersuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isauthenticated = true;
    },
    registerfailure: (state, action) => {
      state.loading = false;
      state.error  = {
        message: action.payload.data.message,
        headers: { ...action.payload.headers } // Convert AxiosHeaders to a plain object
      };
    },
    loaduserrequest: (state) => {
      state.loading = true;
      
    },
    loadusersuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isauthenticated = true;
    },
    loaduserfailure: (state, action) => {
      state.loading = false;
      state.error  = {
        message: action.payload.data.message,
        headers: { ...action.payload.headers } 
      };
    },
    getCompleteUsersrequest: (state) => {
      state.loading = true;
      
    },
    getCompleteUserssuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      
    },
    getCompleteUsersfailure: (state, action) => {
      state.loading = false;
      state.error  = {
        message: action.payload.data.message,
        headers: { ...action.payload.headers } 
      };
    },
    clearerror : (state)=>{
      state.error = null;
    }
  },
});

export const { loginrequest, loginsuccess, loginfailure , registerfailure ,registerrequest ,registersuccess ,clearerror , loaduserrequest, loadusersuccess, loaduserfailure,getCompleteUsersfailure,getCompleteUsersrequest,getCompleteUserssuccess} = userSlice.actions;
export default userSlice.reducer;
