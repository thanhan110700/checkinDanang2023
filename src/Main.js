import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ChaoMung from "./ChaoMung";
import ListCheckIn from "./ListCheckIn";
import QuaySo from "./QuaySo";
import UserMage from "./UserMage";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/check-in" element={<App />} />
        <Route path="/thong-ke" element={<ListCheckIn />} />
        <Route path="/quay-so" element={<QuaySo />} />
        <Route path="/quan-ly" element={<UserMage />} />
        <Route path="/chao-mung" element={<ChaoMung />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
