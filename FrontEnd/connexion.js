/* Rappel des identifiants 
email: sophie.bluel@test.tld
password: S0phie 
*/

// Récupérer les données du formulaire
document.getElementById("formulaireConnexion").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche l'envoi réel du formulaire

    // Récupération des données du formulaire après envoi
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Création de l'objet pour envoi à l'API
    const donneesFormulaire = {
        email,
        password
    }

    // Appel de l'API avec la méthode POST
    fetch("http://localhost:5678/api/users/login", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", // On envoi que des données JSON
        },
        body: JSON.stringify(donneesFormulaire) // Convertir les données en chaîne JSON pour l'envoi
    })
    .then(reponse => {
        if (!reponse.ok) {
            // Gérer les erreurs
            throw new Error("Adresse email et/ou mot de passe.");
        }
        return reponse.json(); // Convertir la réponse en JSON
    })
    .then(data => {
        // Ajout de la réponse dans le localStorage pour maintenir la session
        const token = data.token;
        // Stocker le token dans le localStorage
        localStorage.setItem('authToken', token);
        console.log("Utilisateur connecté")
    })
    .catch(error => {
        // Afficher l'erreur sur le DOM
        /*
        <div class="erreur">
			Erreur lors de la connexion, veuillez vérifier vos identifiants.
		</div>
        */
       const baliseMain = document.querySelector("main")
       const baliseErreur = document.createElement("div")
       baliseErreur.className = "erreur"
       baliseErreur.textContent = "Erreur lors de la connexion, veuillez vérifier vos identifiants."
       baliseMain.insertAdjacentElement('afterbegin', baliseErreur);
    })
})