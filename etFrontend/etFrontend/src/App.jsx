import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Toaster } from 'sonner';
import { Button } from "@/components/ui/button";

import Landingpage from "./pages/Landingpage";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import Dashboard from "./pages/Dashboard";

import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses/:id" element={<Courses />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
