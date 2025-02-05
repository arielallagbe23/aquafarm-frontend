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

  const [newExploitationName, setNewExploitationName] = useState(""); // Nouveau nom pour exploitation
  const [showAddExploitationForm, setShowAddExploitationForm] = useState(false);

  const [showAddElementForm, setShowAddElementForm] = useState(false); // Contrôle du formulaire d'ajout d'élément
const [showAddProductionForm, setShowAddProductionForm] = useState(false); // Contrôle du formulaire d'ajout de production


  const [showAddDomaineForm, setShowAddDomaineForm] = useState(false);
  const [newDomaineName, setNewDomaineName] = useState("");

  const [newElementName, setNewElementName] = useState(""); // Nouveau nom pour élément
  const [newElementQuantity, setNewElementQuantity] = useState(0); // Quantité de l'élément
  const [newProductionQuantity, setNewProductionQuantity] = useState(0); // Quantité de production
  const [newProductionDate, setNewProductionDate] = useState(""); // Date de production

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token JWT depuis le localStorage
    
        const response = await axios.get("http://127.0.0.1:5005/users/user/connected", {
          headers: {
            Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
          },
        });
    
        setUser(response.data); // Mettre à jour l'état utilisateur
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        setError("Erreur lors de la récupération de l'utilisateur.");
      }
    };
    

    const fetchDomains = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const response = await axios.get("http://127.0.0.1:5005/domaines/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDomains(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des domaines:", err);
        setError("Erreur lors de la récupération des domaines.");
      }
    };
    fetchDomains();

    fetchUser();
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


  const addDomaine = async () => {
    const token = localStorage.getItem("token");
    if (!newDomaineName.trim()) {
      console.error("Le nom du domaine est vide !");
      return;
    }
  
    if (!user || !user.id) {
      console.error("Impossible de récupérer l'utilisateur connecté !");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5005/domaines", // Endpoint correct
        {
          user_id: user.id, // Inclure l'ID de l'utilisateur connecté
          nom_domaine: newDomaineName, // Nom du domaine
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token d'authentification
          },
        }
      );
      console.log("Domaine ajouté avec succès:", response.data);
      setDomains((prevDomains) => [...prevDomains, response.data]); // Ajouter le nouveau domaine à la liste
      setNewDomaineName(""); // Réinitialiser le champ du formulaire
      setShowAddDomaineForm(false); // Fermer le formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout du domaine:", error.response?.data || error);
    }
  };
  
  
  

  // Créer une exploitation
  const createExploitation = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5005/exploitations", {
        type_exploitation_id: 1, // exemple d'ID
        domaine_id: selectedDomain, // domaine sélectionné
        nom_exploitation: newExploitationName,
      });
      console.log("Exploitation créée", response.data);
      fetchExploitations(selectedDomain); // Rafraîchir la liste des exploitations
      setNewExploitationName(""); // Réinitialiser le champ de saisie
    } catch (err) {
      console.error("Erreur lors de la création de l'exploitation:", err);
    }
  };

  // Créer un élément
  const createElement = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8080/elements/${selectedExploitation}`, {
        exploitation_id: selectedExploitation, // exploitation sélectionnée
        nom_element: newElementName,
        quantite: newElementQuantity,
      });
      console.log("Élément créé", response.data);
      fetchElements(selectedExploitation); // Rafraîchir la liste des éléments
      setNewElementName(""); // Réinitialiser le champ de saisie
      setNewElementQuantity(0); // Réinitialiser la quantité
    } catch (err) {
      console.error("Erreur lors de la création de l'élément:", err);
    }
  };

  // Créer une production
  const createProduction = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5005/productions", {
        element_id: selectedElement, // élément sélectionné
        quantite_produite: newProductionQuantity,
        date_de_production: newProductionDate, // exemple de date
      });
      console.log("Production créée", response.data);
      fetchProductions(selectedElement); // Rafraîchir la liste des productions
      setNewProductionQuantity(0); // Réinitialiser la quantité
      setNewProductionDate(""); // Réinitialiser la date
    } catch (err) {
      console.error("Erreur lors de la création de la production:", err);
    }
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

      <button
        className="adddomaine-button"
        onClick={() => setShowAddDomaineForm(true)} // Affiche le formulaire
      >
        Ajouter un domaine
      </button>

      {showAddDomaineForm && (
        <div className="form-container">
          <h3>Ajouter un nouveau domaine</h3>
          <input
            type="text"
            value={newDomaineName}
            onChange={(e) => setNewDomaineName(e.target.value)}
            placeholder="Nom du domaine"
          />
          <div className="form-container-buttons">
            <button className="adddomaine-button" onClick={addDomaine}>
              Ajouter Domaine
            </button>
            <button className="adddomaine-button button-cancel" onClick={() => setShowAddDomaineForm(false)}>
              Annuler
            </button>

          </div>
        </div>
      )}


      <h2>Mes domaines :</h2>
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

      {/* Formulaire pour ajouter une exploitation */}
      {selectedDomain && (
          <>
            {!showAddExploitationForm && (
              <button 
                className="adddomaine-button" 
                onClick={() => setShowAddExploitationForm(true)} // Ouvre le formulaire
              >
                Ajouter une exploitation
              </button>
            )}

            {showAddExploitationForm && (
              <div className="form-container">
                <h3>Ajouter une nouvelle exploitation</h3>
                <input
                  type="text"
                  value={newExploitationName}
                  onChange={(e) => setNewExploitationName(e.target.value)}
                  placeholder="Nom de l'exploitation"
                />
                <div className="form-container-buttons-2">
                  <button 
                    className="adddomaine-button" 
                    onClick={createExploitation}
                  >
                    Ajouter Exploitation
                  </button>
                  <button 
                    className="button-cancel2" 
                    onClick={() => setShowAddExploitationForm(false)} // Masque le formulaire
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </>
        )}



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

      {/* Formulaire pour ajouter un élément */}
      {selectedExploitation && (
        <>
          {!showAddElementForm && (
            <button 
              className="adddomaine-button" 
              onClick={() => setShowAddElementForm(true)} // Affiche le formulaire
            >
              Ajouter un élément
            </button>
          )}

          {showAddElementForm && (
            <div className="form-container">
              <h3>Ajouter un nouvel élément</h3>
              <input
                type="text"
                value={newElementName}
                onChange={(e) => setNewElementName(e.target.value)}
                placeholder="Nom de l'élément"
              />
              <input
                type="number"
                value={newElementQuantity}
                onChange={(e) => setNewElementQuantity(e.target.value)}
                placeholder="Quantité de l'élément"
              />
              <div className="form-container-buttons">
                <button
                  className="add-element-button"
                  onClick={() => {
                    createElement(); // Appelle la fonction pour ajouter l'élément
                    setShowAddElementForm(false); // Ferme le formulaire
                  }}
                >
                  Ajouter Élément
                </button>
                <button
                  className="cancel-element-button"
                  onClick={() => setShowAddElementForm(false)} // Ferme le formulaire sans ajouter
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
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

            {/* Formulaire pour ajouter une production */}
            {selectedElement && (
              <div className="form-container">
                <h3>Ajouter une production</h3>
                <input
                  type="number"
                  value={newProductionQuantity}
                  onChange={(e) => setNewProductionQuantity(e.target.value)}
                  placeholder="Quantité produite"
                />
                <input
                  type="date"
                  value={newProductionDate}
                  onChange={(e) => setNewProductionDate(e.target.value)}
                />
                <button onClick={createProduction}>Ajouter Production</button>
              </div>
            )}
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
