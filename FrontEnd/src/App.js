import React, { useEffect } from 'react';
import Team from "./scenes/team";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import { BrowserRouter as Router } from 'react-router-dom';

import { Login } from './scenes/Auth/login';
import { Register } from './scenes/Auth/register'; 
import { ForgotPassword } from './scenes/Auth/forgotPassword';
import { Provider, useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { isPortrait_Store } from './store/actions/mainAction';

function App() {
  const [theme, colorMode] = useMode();
  const dispatch = useDispatch();
  const isMobileDetect = useSelector(store => store.isMobileDetect);
  const colorModeName = useSelector(store => store.colorModeName);
  console.log(colorMode, theme);
  useEffect(() => {
    console.log('colorMode', colorModeName, window.matchMedia("(orientation: portrait)"));
    if(window.matchMedia("(orientation: portrait)").matches){
      dispatch(isPortrait_Store(true));
      window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
    }else{
      dispatch(isPortrait_Store(false));
      window.document.documentElement.style.transform = 'scaleY(0.8) translateY(-50px)';
    }
    const portraitChange = (e) => {
      if (e.matches) {
        // Portrait mode
        
        dispatch(isPortrait_Store(true));
        window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
      } else {
        // Landscape
        if (isMobileDetect) {
          dispatch(isPortrait_Store(false));
          window.document.documentElement.style.transform = 'scaleY(0.8) translateY(-50px)';
        } else {
          dispatch(isPortrait_Store(true));
          window.document.documentElement.style.transform = 'scaleY(1) translateY(0px)';
        }
      }
    };
    window.matchMedia("(orientation: portrait)").addEventListener("change", portraitChange);
    return () => {
      window.matchMedia("(orientation: portrait)").removeEventListener("change", portraitChange)
    }
  }, [])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />} />
            <Route path='/forgotPassword' element={<ForgotPassword />}/>
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
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
