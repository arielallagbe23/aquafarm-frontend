import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={handleNavigateHome} style={{ cursor: "pointer" }}>
        A Q U A - F A R M
      </div>
      <div className="navbar-links">
        <div className="navbar-button" onClick={() => navigate("/connexion")}>Connexion</div>
        <div className="navbar-button" onClick={() => navigate("/inscription")}>Inscription</div>
      </div>
    </nav>
  );
};

export default Navbar;
