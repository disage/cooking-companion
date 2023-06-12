import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase';
import DishOverview from "./pages/DishOverview";
import HelloScreen from "./pages/HelloScreen";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Protected from "./Protected";
import Registration from "./pages/Registration";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<HelloScreen isLoggedIn={!!user} />} />
          <Route path='/login' element={<Login isLoggedIn={!!user} />} />
          <Route path='/registration' element={<Registration isLoggedIn={!!user} />} />
          <Route path='/home'
            element={
              <Protected isLoggedIn={!!user}>
                <Home />
              </Protected>
            }
          />
          <Route path='/products'
            element={
              <Protected isLoggedIn={!!user}>
                <Products />
              </Protected>
            }
          />
          <Route path='/generateDish'
            element={
              <Protected isLoggedIn={!!user}>
                <DishOverview />
              </Protected>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;