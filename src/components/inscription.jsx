import React, { useState } from "react";
import axios from "axios";

const Inscription = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    numero_telephone: "",
    mot_de_passe: "",
    confirm_password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Vérification du mot de passe
    if (formData.mot_de_passe !== formData.confirm_password) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5005/users", {
        type_user_id: 1, // Par défaut ou modifiable selon besoin
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        numero_telephone: formData.numero_telephone,
        mot_de_passe: formData.mot_de_passe,
      });
      console.log("Inscription réussie", response.data);
      setSuccess("Inscription réussie. Vous pouvez maintenant vous connecter.");
    } catch (err) {
      console.error("Erreur lors de l'inscription", err);
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="inscription-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numero_telephone">Numéro de téléphone</label>
          <input
            type="tel"
            id="numero_telephone"
            name="numero_telephone"
            value={formData.numero_telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mot_de_passe">Mot de passe</label>
          <input
            type="password"
            id="mot_de_passe"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="btn">
          Inscription
        </button>
      </form>
    </div>
  );
};

export default Inscription;
