// Les imports
import { creationModale, listeProjetsModale, ouvertureFermetureModale } from "./modale.js";


/* Fonction appel API "fetch" http://localhost:5678/api/works */

let donneesAPI = null // Variable pour stocker les résultats de l'API
async function fetchDonnees () {
    const reponse = await fetch("http://localhost:5678/api/works")
    if(reponse.ok === true) {
        donneesAPI = await reponse.json()
        return donneesAPI
    }
    throw new Error("Impossible de contacter le serveur.")
}



/* Vérifier si la connexion est active
Ajout du bandeau d'administration sur la page d'accueil,
Modification du lien "login" en "logout",
Ajout du bouton "modifier",
Suppression des boutons filtres */

if (localStorage.getItem("authToken")) { // A cette étape il faudrait vérifier si le token est authentique
    
    // Remplacer le texte sur la page
    document.getElementById("loginOut").innerText = "logout";

    // Ajout du bandeau d'administration
    /*
    <div class="bandeau-admin">
		<img src="assets/icons/edition.svg" alt="icon mode édition">Mode édition
	</div>
    */
   // Création des éléments
   const bandeauAdmin = document.createElement("div")
   bandeauAdmin.className = "bandeau-admin"

   const iconModeEdition = document.createElement("img")
   iconModeEdition.src = "assets/icons/edition.svg"
   iconModeEdition.alt = "icone mode édition"

   const textEdition = document.createTextNode("Mode édition")

   bandeauAdmin.appendChild(iconModeEdition)
   bandeauAdmin.appendChild(textEdition)

   document.body.insertBefore(bandeauAdmin, document.body.firstChild)

   // Ajout du lien modifier a coté de "Mes Projets"
   const h2Titre = document.getElementById("mes-projets")

   const lienModifier = document.createElement("a")
   lienModifier.href = "#"
   lienModifier.id = "ouvrirModale"
   lienModifier.innerText = "modifier"

   const iconEdition = document.createElement("img")
   iconEdition.src = "assets/icons/edition.svg"
   iconEdition.alt = "icone mode édition"

   lienModifier.prepend(iconEdition) // Ajouter l'icone juste avant le texte "modifier"

   h2Titre.appendChild(lienModifier)

}



// Création des variables nécessaires dans plusieurs fonction 
let filtreFinal = "Tous" // Pour vérifier la présence de  filtre plus tard filtre "Tous" par défaut
// Afficher filtres 
async function afficherFiltres (donneesAPI) {
    let dataFiltrees = donneesAPI // Initialise les données filtrées sans filtre

    // Détermine le nombre de bouton filtre à afficher    
    const nbProjet = donneesAPI.length

    const tableauFiltres = ["Tous"]
    for (let i=0; i<nbProjet; i++) {
        const nomFiltre = donneesAPI[i].category["name"]

        if(tableauFiltres.indexOf(nomFiltre) === -1) { //Vérifie si le nom du Filtre est existant dans le tableau
            tableauFiltres.push(nomFiltre)
        }
    }

    // Ajout des boutons filtres sur le DOM
    const parentDOM = document.querySelector("#portfolio")
    const divFiltres = document.createElement("div")
    divFiltres.className = "filtres"
    parentDOM.appendChild(divFiltres)

    for(let i=0; i<tableauFiltres.length; i++) {
        // Création des boutons
        const btnFiltre = document.createElement("button")
        btnFiltre.className = "btn-filtre " + tableauFiltres[i]
        btnFiltre.id = "btn-filtre " + tableauFiltres[i]
        btnFiltre.innerText = tableauFiltres[i]

        divFiltres.appendChild(btnFiltre)
    }   
    

    // Ecoute du bouton filtre
    document.querySelectorAll(".btn-filtre").forEach((btnFiltre) => {
    btnFiltre.addEventListener("click", function(event) {
                
        // Variable filtre actif 
        const btnFiltreActif = event.target.id // Renvoi "btn-filtre Tous"
        // Modifier le bouton filtre actif avec la class active
        btnFiltre.className = btnFiltreActif + " active"
        // Boucle sur les autres filtres pour supprimer la class le cas échéant
        for(let i=0; i<tableauFiltres.length; i++) {
            if (btnFiltreActif != ("btn-filtre " + tableauFiltres[i]))
            {
                document.getElementById("btn-filtre " + tableauFiltres[i]).className = "btn-filtre " + tableauFiltres[i]
            }
        }
                
                
        // Boucle pour récupérer le filtre final 
        for(let c=0; c<tableauFiltres.length; c++) {
            if(btnFiltreActif === ("btn-filtre " + tableauFiltres[c])) {
                filtreFinal = tableauFiltres[c]
            }
        }

        // Création du filtre
        // Si filtreFinal !== Tous alors le filtre est appliqué sinon dataFiltrees === data
        
        if(filtreFinal !== "Tous") {
            dataFiltrees = donneesAPI.filter(filtre => filtre.category.name === filtreFinal)
        } 
        else { // Else nécessaire dans le cas d'un nouveau clic sur "Tous"
            dataFiltrees = donneesAPI
        }

        afficherPortfolio(dataFiltrees)
        
        })
    })
        
    afficherPortfolio(donneesAPI)
}

// Fonction afficher les projets
async function afficherPortfolio (donneesAPI) {   
    const nbProjet = donneesAPI.length

    //Vérification de l'existance de la div Gallery pour la vider dans le cas d'un filtre a appliquer
    const existanceGallery = document.querySelector(".gallery")
    if(existanceGallery) {
        // On vide la gallery
        existanceGallery.innerHTML = ''
    }
    else {
        //Creation de la div Gallery
        const parentDOM = document.querySelector("#portfolio")
        const divGallery = document.createElement("div")
        divGallery.className = "gallery"
        parentDOM.appendChild(divGallery)
    }
    
    // Boucle pour afficher les projets avec ou sans filtre
    for(let i = 0; i < nbProjet ; i++) {
        //Création des variables de données
        const title = donneesAPI[i].title
        const imageUrl = donneesAPI[i].imageUrl 

        //Récupère le parent dans le DOM
        const divGallery = document.querySelector(".gallery")
        
        
        //Création des balises
        const figure = document.createElement("figure")
        figure.dataset.idProjet = donneesAPI[i].id
        const image = document.createElement("img")
        const figcaption = document.createElement("figcaption")

        //Complète les balises créées
        image.src = imageUrl
        image.alt = title
        figcaption.innerText = title

        //Ajout au DOM
        figure.appendChild(image)
        figure.appendChild(figcaption)
        divGallery.appendChild(figure)            
    } 
}




/* Lance l'appel API, 
une fois les données reçues, appel des différentes fonctions */

fetchDonnees().then( () => {
    
    /* Si l'utilisateur est connecté, je lance les appels API */

    if(localStorage.getItem("authToken")) {

        afficherPortfolio(donneesAPI) /* Afficher le portfolio sans filtre */        
        creationModale() /* Création de la modale */        
        listeProjetsModale(donneesAPI) /* Liste les projets existants dans la modale */        
        ouvertureFermetureModale() /* Ouverture et fermeture de la modale */

    }
    else { /* Si l'utilisateur n'est pas connecté */

        afficherFiltres(donneesAPI)  /* Affiche le portfolio complet */
    
    }

})
