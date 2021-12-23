import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import LiveStream from "./components/LiveStream";
import ShowSteram from "./components/ShowSteram";
const Rout = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LiveStream />} />
        <Route path="/view" element={<ShowSteram />} />
      </Routes>
    </Router>
  );
};
export default Rout;
