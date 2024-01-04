import {BrowserRouter as Router , Routes ,Route} from "react-router-dom";
import { Login} from "./components/login/login.jsx";
import {Register} from "./components/register/register.jsx"
import { useDispatch, useSelector } from "react-redux";
import {Header} from "./components/header/header.jsx";
import {Home} from "./components/Home/home.jsx";
import { useEffect } from "react";
import { loaduser } from "./actions/user.js";

function App() {
  const dispatch = useDispatch();
  const {isauthenticated} = useSelector(state => state.user);
  useEffect(()=>{
    dispatch(loaduser());
  },[dispatch]);
  return (
    <Router>
     {isauthenticated && <Header/>}
    
    <Routes>
      <Route path="/" element={(isauthenticated)?<Home/>:<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/search" element={(isauthenticated)?<Home/>:<Login/>} />
      <Route path="/newPost" element={(isauthenticated)?<Home/>:<Login/>} />

    </Routes>
    </Router>
  );
}

export default App;
