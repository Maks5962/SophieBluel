/* Rappel des identifiants 
email: sophie.bluel@test.tld
password: S0phie 
*/

/* Vérifier si la connexion est active 
Si elle est active alors on supprime la session pour la déconnexion */
if (localStorage.getItem("authToken")) { 
    // Déconnexion par suppression du localStorage
    localStorage.removeItem("authToken")

}

/* Traitement de l'envoi du formulaire pour créer la session
Dans le cas d'une erreur d'identifiant, un message d'info s'affiche sur la page de connexion. */
document.getElementById("formulaireConnexion").addEventListener("submit", function(event) { // Ecoute du formulaire de connexion
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
        localStorage.setItem("authToken", token);
        // Redirection vers la page d'accueil
        window.location.href = "index.html";
    })
    .catch(error => {
        // Afficher l'erreur sur le DOM
       const baliseMain = document.querySelector("main")
       const baliseErreur = document.createElement("div")
       baliseErreur.className = "erreur"
       baliseErreur.textContent = "Erreur lors de la connexion, veuillez vérifier vos identifiants."
       baliseMain.insertAdjacentElement('afterbegin', baliseErreur); // Ajout de la balise juste après l'ouverture de la balise main
    })
})