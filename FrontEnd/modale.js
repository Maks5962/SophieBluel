import { donneesAPI } from "./scripts.js"

/* Fonction ouverture et fermeture de la modale (code présent dans le HTML)
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
        initialiserAffichageModale() // Initialise la modale lors de l'ouverture pour afficher la suppression des projets par défaut
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



/* Fonction initialiser l'affichage modale par la modification de styles CSS
Permet le retour sur l'affichage d'ouverture, c'est à dire la suppression des projets */
function initialiserAffichageModale() {

    // Modification de l'affichage de la modale pour faire apparaitre la partie upload. 

    const modaleSuppression = document.querySelector(".contenu-modale-suppression")
    const modaleUpload = document.querySelector(".contenu-modale-ajout")

    modaleSuppression.style.display = "flex"
    modaleUpload.style.display = "none"

    // Modification de la navigation modale pour l'ajout de la fleche retour et l'espacement entre retour et fermer
    const navigationModale = document.querySelector(".navigation-modale")
    const iconePrecedente = document.querySelector(".icone-precedente")

    navigationModale.style.justifyContent = "flex-end"
    iconePrecedente.style.display = "none"

}



/* Fonction liste les projets existants dans la modale pour suppression 
Il s'agit de la page principal lors de l'ouverture */
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
        imgPoubelle.onclick =  function(event) { // Fonction avec onclick pour récupérer la valeur id de la vignette a supprimer
            event.preventDefault()
            supprimerProjet(event, donneesAPI[i].id) }

        divGalerieGrid.appendChild(imgGalerie)
        divGalerieGrid.appendChild(imgPoubelle)
        divGalerieModale.appendChild(divGalerieGrid) 
    }

    document.querySelector(".titre-modale").insertAdjacentElement("afterend", divGalerieModale)

}



/* Supprimer le projet depuis la modale 
Après avoir cliqué sur l'icone de la poubelle (fonction avec onclick) */
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
                    modale.style.display = "none"


                } else {
                    alert("Erreur lors de la suppression du projet.")
                }
            })

        }

    }

}



/* Après traitement du serveur, 
Suppression du projet sur la page des projets mais aussi sur la modale */
function supprimerAffichageProjet (id) {

    const idProjet = id

    /* Sur la page des projets (accueil) */ 
    document.querySelector(`[data-id-projet="${id}"]`).remove()

    /* Sur la modale (vignette) */
    document.querySelector(`[data-id-projet-modale="${id}"]`).remove()


}



/* Ecoute du bouton "Ajouter une photo" depuis la modale pour changer l'affichage 
Bascule de l'affiche des projets de la modale, vers la partie upload d'un nouveau projet 
Modification des styles CSS */
document.getElementById("btn-ajouter-modale").addEventListener("click", function() {
    
    // Modification de l'affichage de la modale pour faire apparaitre la partie upload. 
    const modaleSuppression = document.querySelector(".contenu-modale-suppression")
    const modaleUpload = document.querySelector(".contenu-modale-ajout")

    modaleSuppression.style.display = "none"
    modaleUpload.style.display = "flex"

    // Modification de la navigation modale pour l'ajout de la fleche retour et l'espacement entre retour et fermer
    const navigationModale = document.querySelector(".navigation-modale")
    const iconePrecedente = document.querySelector(".icone-precedente")

    navigationModale.style.justifyContent = "space-between"
    iconePrecedente.style.display = "block"

    // Appel de la fonction modaleUpload() pour rendre dynamique le formulaire
    initialiserUpload()
    modaleUploadDynamique()

}) 



/* Fonction pour initialiser la modale Upload 
Permet l'affichage du formulaire vide dans le cas de plusieurs retour en arrière */
function initialiserUpload() {

    document.querySelector(".upload").style.display = "flex" // Faire apparaitre la boite d'upload et le bouton
    document.getElementById("file").value = "" // Vide le champ upload
    document.getElementById("title").value = "" // Vide la champ titre
    document.getElementById("categorie").value = "" // vide la champ categorie
    const preview = document.querySelector(".preview")
    if(preview) {
        document.querySelector(".preview").remove() // Supprime la div preview si elle existe
    }
    
    
}



/* Analyse du formulaire d'upload pour afficher un preview de l'image sélectionnée
Vérifier que les 3 champs soient complétés
Modification des styles CSS notamment sur le bouton valider */
function modaleUploadDynamique() {

    /* Désactivation du bouton valider */
    const btnValider = document.getElementById("btn-valider-modale")
    btnValider.style.backgroundColor = "#A7A7A7"
    btnValider.style.cursor = "default"
    btnValider.disabled = true


    /* Ajout d'une écoute du champ file 
    Cela permet de modifier l'affichage de la modale avec l'ajout d'un apperçu apres sélection du fichier */ 
    const inputFichier = document.getElementById("file")
    inputFichier.addEventListener("change", function(event) {
        const fichierUtilisateur = inputFichier.files[0] // ici le 0 si un choix multiple aurait été fait (par défaut impossible)
        
        // Supprimer les anciennes prévisualisations
        const anciennePreview = document.querySelector(".preview");
        if (anciennePreview) {
            anciennePreview.remove();  // Supprime l'ancienne preview si elle existe
        }
        /* Création de la div preview */ 
        const preview = document.createElement("div")
        preview.className = "preview"
        /* Création d'une URL pour intégrer une nouvelle balise img */
        const imgPreview = document.createElement("img")
        imgPreview.alt = "Prévisualisation de l'upload"
        imgPreview.src = URL.createObjectURL(fichierUtilisateur) // Création d'une URL temporaire 

        /* Ajout au DOM */
        preview.appendChild(imgPreview)
        document.querySelector(".ajout-fichier").appendChild(preview)


        document.querySelector(".upload").style.display = "none"
        preview.style.display = "block"
        
        preview.onload = () => URL.revokeObjectURL(preview.src) // Suppresion de l'URL temporaire une fois l'image sur le DOM

    })
    

    /* Ecoute des champs du formulaire pour vérifier la saisie */ 
    const champFichier = document.getElementById("file")
    const champTitre = document.getElementById("title")
    const champCategorie = document.getElementById("categorie")

    /* Fonction de vérification des champs */
    const verifierChamps = () => {

        if (champFichier.value && champTitre.value && champCategorie.value) {
            
            /* Si tous les champs sont complétés, le bouton valider est activé et l'envoi du formulaire peut être réalisé */
            btnValider.style.backgroundColor = "#1D6154"
            btnValider.style.cursor = "pointer"
            btnValider.disabled = false
            
        } 

    }

    champFichier.addEventListener("input", verifierChamps) // L'évenement "input", permet de détecter la modification immédiatement
    champTitre.addEventListener("input", verifierChamps)
    champCategorie.addEventListener("input", verifierChamps)

    const formulaireAjout = document.querySelector("#formulaire-ajout");
        
        
    

    /* Ajout des catégories de manière dynamique */ 
    listeCategories(donneesAPI)

    ouvertureFermetureModale()
}



/* Fonction pour lister les catégories de l'API dans la modale lors de l'ajout de photo 
Il s'agit d'un champ du formulaire d'upload (catégorie) */ 
function listeCategories(donneesAPI) {

    /* Vérification de la présence d'option */
    const selectElement = document.getElementById("categorie")
    const optionsSelect = selectElement.options

    if(optionsSelect.length === 0) { // Si les catégories ne sont pas généré, on créer les options sinon rien ne se passe.

        /* Récupère uniquement les catégories de l'appel API works */
        const categories = donneesAPI.map(resultat => resultat.category)

        /* Filtre les catégories et cherche la position pour lister dans un nouvelle objet les catégories sans doublon */
        const categoriesUnique = categories.filter((objetActuel, index) => 
            index === categories.findIndex(c => c.id === objetActuel.id))

        /* Lance la boucle pour les intégrer dans la modale */
        const categorieModale = document.getElementById("categorie")

        const optionDefault = document.createElement("option") // Choix vide
        categorieModale.appendChild(optionDefault)


        for(let i=0; i<categoriesUnique.length; i++) {
            const optionModale = document.createElement("option")
            optionModale.value = categoriesUnique[i].id
            optionModale.innerText = categoriesUnique[i].name

            categorieModale.appendChild(optionModale)
        }
    }
    
}




/* Fonction de traitement du formulaire, 
Gestion de l'envoi */

    const formulaireAjout = document.querySelector("#formulaire-ajout");

    formulaireAjout.addEventListener("submit", async (event) => {
        event.preventDefault();  // Empêche le rechargement de la page
        const formData = new FormData(formulaireAjout);
        // Récupère les valeurs du formulaire
        const image = formData.get("file");
        const title = formData.get("title");
        const categoryId = formData.get("categorie");
        // Vérification des champs avant envoi
        if (!image || !title || !categoryId) {
            console.error("Tous les champs ne sont pas remplis.");
            return;
        }
        // Supprime le champ "file" et ajoute le fichier en tant que "image"
        formData.delete("file");
        formData.append("image", image);  // Fichier image
        formData.append("category", parseInt(categoryId));  // Catégorie convertie en entier
        formData.delete("categorie");  // Supprime categorie "IE" pour laisser place à category "Y"
        try {
            // Envoi de la requête POST
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,  // Token
                    "accept": "application/json"  // Attendre du JSON en réponse
                    // Content-Type n'est pas nécessaire avec FormData
                },
                body: formData  // Envoi du FormData
            });
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Erreur 400: Requête mal formée.");
                } else if (response.status === 401) {
                    throw new Error("Erreur 401: Non autorisé. Vérifiez le token.");
                } else {
                    throw new Error("Erreur lors de la soumission.");
                }
            }
            const data = await response.json();  // Convertit la réponse en JSON
            console.log("Succès:", data);  // Traitement du succès (à adapter selon besoin)

            ajoutProjet(data)
            
        } catch (error) {
            // Gestion des erreurs
            console.error("Erreur:", error.message);
        }
        modale.style.display = "none"
    });


/* Fonction d'ajout de projet à la page projet ainsi que sur la modale */
function ajoutProjet(nouveauProjet) {

    /* Vide les champs du formulaire d'envoi */
        initialiserUpload()
    
    
        /* Affiche le projet sur la page projet   */
        const divGallery = document.querySelector(".gallery") //Récupère le parent dans le DOM        
    
        const figure = document.createElement("figure")
        figure.dataset.idProjet = nouveauProjet.id
        const image = document.createElement("img")
        const figcaption = document.createElement("figcaption")
    
        image.src = nouveauProjet.imageUrl
        image.alt = nouveauProjet.title
        figcaption.innerText = nouveauProjet.title
    
        figure.appendChild(image)
        figure.appendChild(figcaption)
        divGallery.appendChild(figure) 
    
    
        /* Affiche le projet dans la modale */
        const divGalerieModale = document.querySelector(".galerie-modale")
        // Création de la div
        const divGalerieGrid = document.createElement("div")
        divGalerieGrid.className = "galerie-grid"
        divGalerieGrid.dataset.idProjetModale = nouveauProjet.id
    
        // Création de la vignette
        let imgGalerie = document.createElement("img")
        imgGalerie.src = nouveauProjet.imageUrl
        imgGalerie.alt = nouveauProjet.title
        imgGalerie.dataset.id = nouveauProjet.id
        imgGalerie.className = "img-galerie-grid"
    
        // Création de la poubelle
        let imgPoubelle = document.createElement("img")
        imgPoubelle.src = "./assets/icons/poubelle.svg"
        imgPoubelle.alt = "Supprimer"
        imgPoubelle.dataset.id = nouveauProjet.id
        imgPoubelle.className = "icone-supprimer"
        imgPoubelle.onclick =  function(event) { 
            event.preventDefault()
            supprimerProjet(event, nouveauProjet.id) }
    
        divGalerieGrid.appendChild(imgGalerie)
        divGalerieGrid.appendChild(imgPoubelle)
        divGalerieModale.appendChild(divGalerieGrid) 
    
    }


/* Ecoute du bouton "retour" depuis la modale pour changer l'affichage 
Cela permet de modifier l'affichage de la modale "Upload" par la partie "Suppression de projet" */
document.querySelector(".icone-precedente").addEventListener("click", initialiserAffichageModale)