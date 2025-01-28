import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour savoir si l'utilisateur est connecté

  // Vérifie si un token est présent dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convertit en booléen
  }, []);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token du localStorage
    setIsLoggedIn(false); // Met à jour l'état de connexion
    navigate("/connexion"); // Redirige vers la page de connexion
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={handleNavigateHome} style={{ cursor: "pointer" }}>
        A Q U A - F A R M
      </div>
      <div className="navbar-links">
        {isLoggedIn ? (
          // Bouton "Déconnexion" si l'utilisateur est connecté
          <div className="navbar-button-deconnexion" onClick={handleLogout}>
            Déconnexion
          </div>
        ) : (
          // Boutons "Connexion" et "Inscription" si l'utilisateur n'est pas connecté
          <>
            <div className="navbar-button" onClick={() => navigate("/connexion")}>
              Connexion
            </div>
            <div className="navbar-button" onClick={() => navigate("/inscription")}>
              Inscription
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
