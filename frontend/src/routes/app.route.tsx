import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Home />} />
                {/* <Route path="/product" element={#} />  */}
            </Routes>
        </Router>
    );
};
