import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./Index";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ This ensures every route change scrolls to top */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
