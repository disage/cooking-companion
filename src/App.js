import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";

import HelloScreen from "./pages/HelloScreen";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Protected from "./Protected";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(localStorage.getItem('uid'));
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'uid') {
        setisLoggedIn(!!event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<HelloScreen />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home'
            element={
              <Protected isLoggedIn={isLoggedIn}>
                <Home />
              </Protected>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;