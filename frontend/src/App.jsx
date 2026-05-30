import { useState, useEffect } from 'react';

export default function App() {
  const API_URL = 'http://localhost:5000/api/utilisateurs';

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorServer, setErrorServer] = useState(false);

  const [userId, setUserId] = useState('');
  const [userNom, setUserNom] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const chargerUtilisateurs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setUtilisateurs(data);
      setErrorServer(false);
    } catch (error) {
      console.error('Erreur chargement:', error);
      setErrorServer(true);
    } finally {
      setIsLoading(false);
    }
  };

  const viderFormulaire = () => {
    setUserId('');
    setUserNom('');
    setUserEmail('');
    setIsEditing(false);
  };

  const handleSoumettre = (e) => {
    e.preventDefault();
    const nom = userNom.trim();
    const email = userEmail.trim();

    if (!nom || !email) return;

    const donnees = { nom, email };

    if (isEditing && userId) {
      // Modification (PUT)
      fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donnees)
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur modification');
          return res.json();
        })
        .then(() => {
          viderFormulaire();
          chargerUtilisateurs();
        })
        .catch(() => alert("Erreur lors de la modification"));
    } else {
      // Ajout 
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donnees)
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur création');
          return res.json();
        })
        .then(() => {
          viderFormulaire();
          chargerUtilisateurs();
        })
        .catch(() => alert("Erreur lors de l'ajout"));
    }
  };

  const supprimerUtilisateur = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Suppression échouée');
          chargerUtilisateurs();
        })
        .catch(() => alert("Erreur lors de la suppression"));
    }
  };

  const preparerModification = (user) => {
    setUserId(user.id);
    setUserNom(user.nom);
    setUserEmail(user.email);
    setIsEditing(true);
    
    const cardElement = document.querySelector('.card');
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1><i className="fas fa-users"></i> Gestion des utilisateurs</h1>
        <p>Ajoutez, modifiez ou supprimez des utilisateurs facilement</p>
      </div>

      <div className="card">
        <div className="form-title">
          <span>
            {isEditing ? (
              <><i className="fas fa-user-edit"></i> Modifier l'utilisateur</>
            ) : (
              <><i className="fas fa-user-plus"></i> Ajouter un utilisateur</>
            )}
          </span>
        </div>
        <form onSubmit={handleSoumettre}>
          <div className="form-row">
            <div className="input-group">
              <label><i className="fas fa-user"></i> Nom complet</label>
              <input 
                type="text" 
                value={userNom}
                onChange={(e) => setUserNom(e.target.value)}
                placeholder="Ex: Mohamed Alami" 
                required 
              />
            </div>
            <div className="input-group">
              <label><i className="fas fa-envelope"></i> Adresse email</label>
              <input 
                type="email" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="exemple@domaine.com" 
                required 
              />
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="btn-primary">
              {isEditing ? (
                <><i className="fas fa-pen"></i> Mettre à jour</>
              ) : (
                <><i className="fas fa-save"></i> Enregistrer</>
              )}
            </button>
            {isEditing && (
              <button type="button" onClick={viderFormulaire} className="btn-secondary">
                <i className="fas fa-times"></i> Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="users-header">
        <h2><i className="fas fa-list-ul"></i> Tous les utilisateurs</h2>
        <div className="badge">
          {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="users-grid">
        {isLoading ? (
          <div className="empty-state">
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : errorServer ? (
          <div className="empty-state">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Erreur de connexion au serveur backend</p>
          </div>
        ) : utilisateurs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-user-slash"></i>
            <p>Aucun utilisateur pour le moment</p>
            <small>Ajoutez votre premier utilisateur via le formulaire</small>
          </div>
        ) : (
          utilisateurs.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-name">
                  <i className="fas fa-user-circle"></i>
                  <span>{user.nom}</span>
                </div>
                <div className="user-email">
                  <i className="fas fa-envelope"></i> {user.email}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="icon-btn edit" 
                  onClick={() => preparerModification(user)} 
                  title="Modifier"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="icon-btn delete" 
                  onClick={() => supprimerUtilisateur(user.id)} 
                  title="Supprimer"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}