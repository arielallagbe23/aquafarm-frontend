import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Bienvenue sur Aquafarm</h1>
      <p className="welcome-text">
        Simplifiez la gestion de vos exploitations agricoles, piscicoles, et alimentaires avec Aquafarm. Rejoignez-nous pour une expérience moderne et efficace !
      </p>
      <div className="welcome-footer">
        <p>🌱 Agriculture | 🐟 Pisciculture | 🐄 Élevage</p>
      </div>
    </div>
  );
};

export default WelcomePage;
