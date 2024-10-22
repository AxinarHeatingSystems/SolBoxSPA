import React, { useEffect } from 'react';
import Team from "./scenes/team";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";

import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleClientID } from './axios/ApiProvider';
import { Login } from './scenes/Auth/login';
import { Register } from './scenes/Auth/register'; 
import { ForgotPassword } from './scenes/Auth/forgotPassword';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { isPortrait_Store, userData_Store } from './store/actions/mainAction';
import { existLogin } from './axios/ApiProvider';
import { ResetPassword } from './scenes/Auth/resetPassword';
import { EmailVerifyNote } from './scenes/Auth/EmailVerifyNote';

const authPath = [
  "/login",
  "/register",
  "/forgotPassword",
  "/resetpassword",
  "/registerationsuccess"
]

function App() {
  const [theme, colorMode] = useMode();
  const dispatch = useDispatch();
  const isMobileDetect = useSelector(store => store.isMobileDetect);
 
  const portraitChange = (e) => {
    if (e.matches) {
      // Portrait mode
      
      dispatch(isPortrait_Store(true));
      // window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
    } else {
      // Landscape
      if (isMobileDetect) {
        dispatch(isPortrait_Store(false));
        // window.document.documentElement.style.transform = 'scaleY(0.8) translateY(-50px)';
      } else {
        dispatch(isPortrait_Store(true));
        // window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
      }
    }
  };
  const initPortraidFunc = () => {
    if(window.matchMedia("(orientation: portrait)").matches){
      dispatch(isPortrait_Store(true));
      // window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
    }else{
      if(isMobileDetect){
        dispatch(isPortrait_Store(false));
        // window.document.documentElement.style.transform = 'scaleY(0.8) translateY(-50px)';
      }else{
        dispatch(isPortrait_Store(true));
        // window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
      }
      
    }
  }
  
  useEffect(() => {
    initPortraidFunc();
    
    // checkLogin();
    window.matchMedia("(orientation: portrait)").addEventListener("change", portraitChange);
    return () => {
      window.matchMedia("(orientation: portrait)").removeEventListener("change", portraitChange)
    }
    
  }, [])
  

  const location = useLocation();

  useEffect(() => {
    console.log(`The current route is ${location.pathname}`);
    checkLogin()
  }, [location]);

  const checkLogin = async () => {
    const userData = localStorage.getItem('userData');
    console.log('userDataCheck', JSON.parse(userData), userData, window.location);
    if(!authPath.includes(window.location.pathname)){
      if(userData){
        const tmpUser = JSON.parse(userData);
        const loginRes = await existLogin(tmpUser.email);
        console.log('checkData', loginRes);
        
        if(loginRes.state !== 'success'){
          localStorage.setItem('userData', JSON.stringify(loginRes.data));
          dispatch(userData_Store(loginRes.data));
          window.location.href = '/login';  
        }
      }else{
        console.log('redirect check', userData);
        window.location.href = '/login';
      }
    }
    
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={GoogleClientID}>
        <CssBaseline />
        {/* <Router> */}
        <div className="app">
          <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />} />
            <Route path='/forgotPassword' element={<ForgotPassword />}/>
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/registerationsuccess' element={<EmailVerifyNote />}/>
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/geography" element={<Geography />} />
          </Routes>
        </div>
        </GoogleOAuthProvider>
        {/* </Router> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
