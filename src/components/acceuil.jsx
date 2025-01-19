import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

const Accueil = () => {
  const [user, setUser] = useState(null); // État pour l'utilisateur
  const [domains, setDomains] = useState([]);
  const [exploitations, setExploitations] = useState([]);
  const [elements, setElements] = useState([]);
  const [productions, setProductions] = useState([]); // État pour les productions
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedExploitation, setSelectedExploitation] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null); // Élément sélectionné
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5005/users/1");
        setUser(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        setError("Erreur lors de la récupération de l'utilisateur.");
      }
    };

    // Récupérer les domaines de l'utilisateur
    const fetchDomains = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5005/domaines/user/1");
        setDomains(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des domaines:", err);
        setError("Erreur lors de la récupération des domaines.");
      }
    };

    fetchUser();
    fetchDomains();
  }, []);

  // Récupérer les exploitations pour un domaine
  const fetchExploitations = async (domainId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5005/exploitations/domaine/${domainId}`
      );
      setExploitations(response.data);
      setSelectedDomain(domainId);
      setSelectedExploitation(null);
      setElements([]);
      setProductions([]);
    } catch (err) {
      console.error("Erreur lors de la récupération des exploitations:", err);
      setExploitations([]);
    }
  };

  // Récupérer les éléments pour une exploitation
  const fetchElements = async (exploitationId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5005/elements/exploitation/${exploitationId}`
      );
      setElements(response.data);
      setSelectedExploitation(exploitationId);
      setSelectedElement(null);
      setProductions([]);
    } catch (err) {
      console.error("Erreur lors de la récupération des éléments:", err);
      setElements([]);
    }
  };

  // Récupérer les productions pour un élément
  const fetchProductions = async (elementId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5005/productions/element/${elementId}`
      );
      setProductions(response.data);
      setSelectedElement(elementId);
    } catch (err) {
      console.error("Erreur lors de la récupération des productions:", err);
      setProductions([]); // Réinitialiser les productions
    }
  };

  // Réinitialiser tout
  const clearSelection = () => {
    setSelectedDomain(null);
    setExploitations([]);
    setSelectedExploitation(null);
    setElements([]);
    setProductions([]);
  };

  // Réinitialiser les exploitations
  const clearExploitationSelection = () => {
    setSelectedExploitation(null);
    setElements([]);
    setProductions([]);
  };

  // Configuration pour Chart.js
  const chartData = {
    labels: productions.map((prod) => prod.date_de_production), // Dates des productions
    datasets: [
      {
        label: "Quantité Produite",
        data: productions.map((prod) => prod.quantite_produite), // Quantités produites
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="accueil-container">
      {user && (
        <h1>
          Bonjour, {user.nom} {user.prenom} 👋
        </h1>
      )}
      <h2>Voici vos domaines :</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="domain-grid">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="domain-card"
            onClick={() => fetchExploitations(domain.id)}
          >
            <h2>{domain.nom_domaine}</h2>
          </div>
        ))}
      </div>
      {selectedDomain && (
        <div className="exploitations-container">
          <div className="exploitations-header">
            <h3>Exploitations du domaine sélectionné :</h3>
            <button className="cancel-button" onClick={clearSelection}>
              Annuler
            </button>
          </div>
          {exploitations.length > 0 ? (
            <div className="exploitations-grid">
              {exploitations.map((exploitation) => (
                <div
                  key={exploitation.id}
                  className="exploitation-card"
                  onClick={() => fetchElements(exploitation.id)}
                >
                  <h4>{exploitation.nom_exploitation}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p>Pas d'exploitation pour ce domaine.</p>
          )}
        </div>
      )}
      {selectedExploitation && (
        <div className="elements-container">
          <div className="elements-header">
            <button className="cancel-button-element" onClick={clearExploitationSelection}>
              Annuler
            </button>
            <h3>Éléments de l'exploitation sélectionnée :</h3>
          </div>
          <div className="elements-production-grid">
            <div className="elements-content">
              {elements.length > 0 ? (
                <ul className="elements-list">
                  {elements.map((element) => (
                    <li
                      key={element.id}
                      className="element-item"
                      onClick={() => fetchProductions(element.id)} // Récupérer les productions
                    >
                      <span>{element.nom_element}</span>
                      <br />
                      <span>qte : {element.quantite}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Pas d'élément pour cette exploitation.</p>
              )}
            </div>
            <div className="production-content">
              <h3>Production</h3>
              {productions.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <p>Production indisponible pour votre sélection.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accueil;
