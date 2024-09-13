import { donneesAPI } from "./scripts.js"


/* Modification de la modale par l'upload de fichier */
function modaleUploadDynamique() {

    /* Désactivation du bouton valider */
    const btnValider = document.getElementById("btn-valider-modale")
    btnValider.style.backgroundColor = "#A7A7A7"
    btnValider.style.cursor = "default"
    btnValider.disabled = true


    /* Ajout d'une écoute du champ file 
    Cela permet de modifier l'affichage de la modale avec l'ajout d'un apperçu apres sélection du fichier */ 
    document.getElementById("file").addEventListener("change", function(event) {
        const fichierUtilisateur = event.target.files[0] // ici le 0 si un choix multiple aurait été fait (par défaut impossible)

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
        
        //document.querySelector(".ajout-fichier").appendChild(preview)

        preview.onload = () => URL.revokeObjectURL(preview.src) // Suppresion de l'URL temporaire une fois l'image sur le DOM

    })
    

    /* Ecoute des champs du formulaire pour vérifier la saisie */ 
    const champFichier = document.getElementById("file")
    const champTitre = document.getElementById("title")
    const champCategorie = document.getElementById("categorie")

    champFichier.addEventListener("input", verifierChamps) // L'évenement "input", permet de détecter la modification immédiatement
    champTitre.addEventListener("input", verifierChamps)
    champCategorie.addEventListener("input", verifierChamps)

    const formulaireAjout = document.querySelector("#formulaire-ajout");
        
        
    /* Fonction de vérification des champs */
    function verifierChamps() {

        if (champFichier.value !== '' && champTitre.value !== '' && champCategorie.value !== '') {
            
            /* Si tous les champs sont complétés, le bouton valider est activé et l'envoi du formulaire peut être réalisé */
            btnValider.style.backgroundColor = "#1D6154"
            btnValider.style.cursor = "pointer"
            btnValider.disabled = false
            
        } 

    }

    /* On passe au traitement du formulaire, 
    L'envoi, la récupération des données et le traitement pour l'ajout en base */
    traitementFormulaire()

    /* Ajout des catégories de manière dynamique */ 
    listeCategories(donneesAPI)

    ouvertureFermetureModale()
}




/* Fonction de traitement du formulaire, 
Gestion de l'envoi */
function traitementFormulaire() {
    const formulaireAjout = document.querySelector("#formulaire-ajout");

    formulaireAjout.addEventListener("submit", function(event) {
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
        formData.append("image", image) // Fichier image
        formData.append("category", parseInt(categoryId))  // Catégorie convertie en entier
        formData.delete("categorie") // Supprime categorie "IE" pour laisser place a category "Y"

        // Envoi de la requête POST
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,  // Token
                "accept": "application/json"  // Attendre du JSON en réponse
                // Content-Type, car FormData le gère automatiquement
            },
            body: formData  // Envoi du FormData
        })
        .then(reponse => {
            if (!reponse.ok) {
                if (reponse.status === 400) {
                    throw new Error("Erreur 400: Requête mal formée.")
                }
                if (reponse.status === 401) {
                    throw new Error("Erreur 401: Non autorisé. Vérifiez votre token.")
                }
                throw new Error("Erreur lors de la soumission.")
            }
            return reponse.json()  // Convertit la réponse en JSON
        })
        .then(data => {
            ajoutProjet(data)
        })
        .catch(error => {
            console.error("Erreur:", error.message)
        })
    })
}


   
/* Fonction d'ajout de projet à la page projet ainsi que sur la modale */
function ajoutProjet(nouveauProjet) {

    // {id: 21, title: 'test', imageUrl: 'http://localhost:5678/images/IMG_6688_2_-_Moyenne1726216460286.jpg', categoryId: '1', userId: 1}

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


/* Fonction pour initialiser la modale Upload */
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




/* Fonction pour lister les catégories de l'API dans la modale lors de l'ajout de photo */ 
function listeCategories(donneesAPI) {

    /* Récupère uniquement les catégories de l'appel API works */
    const categories = donneesAPI.map(resultat => resultat.category)

    /* Filtre les catégories et cherche la position pour lister dans un nouvelle objet les catégories sans doublon */
    const categoriesUnique = categories.filter((objetActuel, index) => 
        index === categories.findIndex(c => c.id === objetActuel.id))

    /* Lance la boucle pour les intégrer dans la modale */
    const categorieModale = document.getElementById("categorie")

    for(let i=0; i<categoriesUnique.length; i++) {
        const optionModale = document.createElement("option")
        optionModale.value = categoriesUnique[i].id
        optionModale.innerText = categoriesUnique[i].name

        categorieModale.appendChild(optionModale)
    }
    
}


/* Ecoute du bouton "Ajouter une photo" depuis la modale pour changer l'affichage */
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


/* Fonction initialiser l'affichage modale 
Permet le retour sur l'affichage d'ouverture, soit la suppression des projets */
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


/* Ecoute du bouton "retour" depuis la modale pour changer l'affichage 
Cela permet de modifier l'affichage de la modale "Upload" par la partie "Suppression de projet" */
document.querySelector(".icone-precedente").addEventListener("click", initialiserAffichageModale)



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

/* */