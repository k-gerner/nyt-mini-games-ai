import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SpellingBee from "./pages/SpellingBee";
import './index.css';

function App() {
  return (
    <Router>
      <div className="p-6 bg-white">
        <nav className="mb-4 space-x-4">
          <Link to="/home" className="text-dark-teal hover:underline">Home</Link>
          <Link to="/about" className="text-dark-teal hover:underline">About</Link>
          <Link to="/spelling_bee" className="text-dark-teal hover:underline">Spelling Bee</Link>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/spelling_bee" element={<SpellingBee />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;