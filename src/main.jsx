import React from 'react';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Error404 from './pages/Error404.jsx';
import Home from './pages/Home.jsx';
import Error500 from './pages/Error500.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>} > 
    <Route index element={<Home />} errorElement={<Error500/>} />
    <Route path="profile" element={<Profile/>} errorElement={<Error500/>} />
    <Route path="register" element={<Register/>} errorElement={<Error500/>} />
    <Route path="*" element={<Error404/>} errorElement={<Error500/>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);