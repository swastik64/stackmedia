import {configureStore} from "@reduxjs/toolkit";
import userreducer from "./reducers/user"
import postreducer from "./reducers/post"


const store = configureStore({
    reducer : {
        user : userreducer ,
        post : postreducer
    }
});

export default store;