import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page1/>}/>
          <Route path="/page2" element={<Page2/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;