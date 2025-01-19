import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Navbar from './components/Navbar';
import Inscription from './components/inscription';
import Connexion from './components/connexion';
import WelcomePage from './components/WelcomePage';
import Accueil from "./components/acceuil";

import './App.css';

function App() {
  return (
    <div className="App">
       <Router>
        <Navbar/>
          <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/acceuil" element={<Accueil/>}/>
          </Routes>
       </Router>

    </div>
  );
}

export default App;
