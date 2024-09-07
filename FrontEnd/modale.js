/* Création de la modale 
Partie HTML uniquement */

export function creationModale () {

    const modale = document.createElement("div")
    modale.className = "modale"
    modale.id = "modale"
    modale.innerHTML = `
        <div class="popup">
			<div class="navigation-modale">
				<img src="assets/icons/arrow-left.svg" alt="Précédente" class="icone-precedente">
				<img src="assets/icons/xmark.svg" alt="Fermer" id="fermerModale" class="icone-fermer">
			</div>
			<div class=contenu-modale>
                <h2 class="titre-modale">Ajout photo</h2>
				
				<hr class="separateur-modale">
				<button class="btn-modale">Ajouter une photo</button>
			</div>
		</div>`

    document.body.insertBefore(modale, document.body.firstChild) // Ajout de la modale au DOM juste après l'ouverture de <body>

}



/* Fonction ouverture et fermeture de la modale
Ouverture depuis le lien "modifier"
Fermeture depuis la croix (X)
Fermeture depuis un clic hors de la popup */

export function ouvertureFermetureModale() {
    // Sélectionner les éléments du DOM
    const modale = document.getElementById("modale")
    const ouvrirModale = document.getElementById("ouvrirModale")
    const fermerModale = document.getElementById("fermerModale")

    // Lorsque l'utilisateur clique sur le bouton, ouvrir la modale
    ouvrirModale.onclick = function() {
        modale.style.display = "block";
    }

    // Lorsque l'utilisateur clique sur (x), fermer la modale
    fermerModale.onclick = function() {
        modale.style.display = "none";
    }

    // Lorsque l'utilisateur clique en dehors de la modale, fermer la modale
    window.onclick = function(event) {
        if (event.target === modale) {
            modale.style.display = "none";
        }
    }
}



/* Supprimer le projet depuis la modale */

function supprimerProjet(event, id) {
    event.preventDefault()

    /* Vérification de la présence du token dans le local storage, 
    Dans le cas d'une erreur, il sera impossible de demander la suppression au serveur */

    if(localStorage.getItem("authToken")) {

        if(confirm("Voulez-vous vraiement supprimer ce projet ?")) {
            
            /* Appel API pour suppression */
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`, // Ajout du token dans l'en-têtes
                    "Content-Type": "application/json" // Le format des données
                }
            })
            .then(reponse => {
                if (reponse.ok) { // Retour en 200
                    
                    /* Suppression de la vignette de la modale et de la page d'accueil */
                    supprimerAffichageProjet(id)


                } else {
                    alert("Erreur lors de la suppression du projet.")
                }
            })

        }

    }

}



/* Fonction liste les projets existants dans la modale pour suppression */
export function listeProjetsModale (donneesAPI) {

    const divGalerieModale = document.createElement("div")
    divGalerieModale.className = "galerie-modale"
    
    const nbProjets = donneesAPI.length // Nombre de projet enregistrer pour créer la boucle

    for(let i = 0 ; i < nbProjets ; i++) {
        // Création de la div
        let divGalerieGrid = document.createElement("div")
        divGalerieGrid.className = "galerie-grid"
        divGalerieGrid.dataset.idProjetModale = donneesAPI[i].id

        // Création de la vignette
        let imgGalerie = document.createElement("img")
        imgGalerie.src = donneesAPI[i].imageUrl
        imgGalerie.alt = donneesAPI[i].title
        imgGalerie.dataset.id = donneesAPI[i].id
        imgGalerie.className = "img-galerie-grid"

        // Création de la poubelle
        let imgPoubelle = document.createElement("img")
        imgPoubelle.src = "./assets/icons/poubelle.svg"
        imgPoubelle.alt = "Supprimer"
        imgPoubelle.dataset.id = donneesAPI[i].id
        imgPoubelle.className = "icone-supprimer"
        imgPoubelle.onclick =  function(event) { 
            event.preventDefault()
            supprimerProjet(event, donneesAPI[i].id) }

        divGalerieGrid.appendChild(imgGalerie)
        divGalerieGrid.appendChild(imgPoubelle)
        divGalerieModale.appendChild(divGalerieGrid) 
    }

    document.querySelector(".titre-modale").insertAdjacentElement("afterend", divGalerieModale)

}



/* Fonction de suppression du projet sur la page des projets mais aussi sur la modale */
function supprimerAffichageProjet (id) {

    const idProjet = id

    /* Sur la page des projets (accueil) */ 
    document.querySelector(`[data-id-projet="${id}"]`).remove()

    /* Sur la modale (vignette) */
    document.querySelector(`[data-id-projet-modale="${id}"]`).remove()


}
