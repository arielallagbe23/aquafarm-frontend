import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import du hook useNavigate

import '../App.css';

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const response = await axios.post("http://127.0.0.1:5005/login", {
        email: email,
        mot_de_passe: password,
      });
      console.log("Connexion réussie", response.data);

      // Redirection vers la page d'accueil après succès
      navigate("/acceuil"); // Remplacez "/accueil" par le chemin de votre route Accueil
    } catch (err) {
      console.error("Erreur lors de la connexion", err);
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="connexion-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn">
          Connexion
        </button>
      </form>
    </div>
  );
};

export default Connexion;
