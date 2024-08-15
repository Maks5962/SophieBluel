// Fonction appel API "fetch" http://localhost:5678/api/works
async function fetchDonnees () {
    const reponse = await fetch("http://localhost:5678/api/works")
    if(reponse.ok === true) {
        return reponse.json()
    }
    throw new Error("Impossible de contacter le serveur.")
}

// Création des variables nécessaires dans plusieurs fonction 
let filtreFinal = "Tous" // Pour vérifier la présence de  filtre plus tard filtre "Tous" par défaut
// Afficher filtres 
async function afficherFiltres (data) {
    let dataFiltrees = data // Initialise les données filtrées sans filtre

    // Détermine le nombre de bouton filtre à afficher    
    const nbProjet = data.length

    const tableauFiltres = ["Tous"]
    for (let i=0; i<nbProjet; i++) {
        const nomFiltre = data[i].category["name"]

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
            dataFiltrees = data.filter(filtre => filtre.category.name === filtreFinal)
        } 
        else { // Else nécessaire dans le cas d'un nouveau clic sur "Tous"
            dataFiltrees = data
        }

        afficherPortfolio(dataFiltrees)
        
        })
    })
        
    afficherPortfolio(data)
}

// Fonction afficher les projets
async function afficherPortfolio (data) {   
    const nbProjet = data.length

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
        const title = data[i].title
        const imageUrl = data[i].imageUrl 

        //Récupère le parent dans le DOM
        const divGallery = document.querySelector(".gallery")
        
        
        //Création des balises
        const figure = document.createElement("figure")
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


// Lance l'appel API, une fois les données reçues appel de fonction afficherFiltres
// Les projets seront affichés depuis la fonction afficherFiltres
fetchDonnees().then(data => {
    afficherFiltres(data)
})


