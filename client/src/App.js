import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Recommendations, Search } from "./components";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/recommendation" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;
