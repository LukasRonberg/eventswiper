import React from 'react';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Error404 from './pages/Error404.jsx';
import Home from './pages/Home.jsx';
import Error500 from './pages/Error500.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
//import Matches from './pages/Matches.jsx';
//import Settings from './pages/Settings.jsx';
import EventMatches from './pages/EventMatches.jsx';
import Forum from './pages/Forum.jsx';
import LogIn from './pages/Login.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Home Route */}
      <Route index element={<Home />} errorElement={<Error500 />} />
      
      {/* Profile Route */}
      <Route path="profile" element={<Profile />} errorElement={<Error500 />} />
      
      {/* Matches Route */
      //<Route path="matches" element={<Matches />} errorElement={<Error500 />} />
      }
      
      {/* Settings Route */
      //<Route path="settings" element={<Settings />} errorElement={<Error500 />} />
      }
      
      {/* Register Route */}
      <Route path="register" element={<Register />} errorElement={<Error500 />} />
      <Route path="login" element={<LogIn />} errorElement={<Error500 />} />

      
      {/* Event Details with Dynamic Route */}
      <Route path="events" element={<EventMatches />} errorElement={<Error500 />} />

      <Route path="eventgroup/:id" element={<Forum />} errorElement={<Error500 />} />

      
      {/* 404 Fallback */}
      <Route path="*" element={<Error404 />} errorElement={<Error500 />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
