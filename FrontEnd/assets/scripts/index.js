    // Variables
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");
const token = sessionStorage.getItem("token");

   
    // Fonction qui retourne tableau des works
async function getWorks () {
    const response = await fetch ("http://localhost:5678/api/works");
    return await response.json()
    
    }
    getWorks();
    console.log(getWorks());

    // Fonction qui retourne le tableau des categories
async function getCategories () {
    const response = await fetch ("http://localhost:5678/api/categories");
    return await response.json()
    
    }
    getCategories();
    console.log(getCategories());

    // Fonction qui affiche tous les works   
async function displayAllWorks () {
    const works = await getWorks();
    works.forEach((work) => {
        createWorks(work);
       
    });
}
displayAllWorks();


    // Fonction pour créer les works que l'on va afficher dans le DOM
function createWorks (work) { 
    const figureWork = document.createElement("figure");
    const imgWork = document.createElement("img");
    const figcaptionWork = document.createElement("figcaption");
    imgWork.src = work.imageUrl;
    imgWork.alt = work.title;
    figcaptionWork.textContent = work.title;
    figureWork.appendChild(imgWork);
    figureWork.appendChild(figcaptionWork);
    gallery.appendChild(figureWork);
}

    // Création de la div container-filters
const containerFilters = document.createElement("div");
containerFilters.classList.add("container-filters");
portfolio.insertBefore(containerFilters, gallery);

    //Création du bouton filtre "Tous"
    if (!token) {
        const buttonAll = document.createElement("button");
        buttonAll.textContent = "Tous";
        buttonAll.classList.add("filter-selected");
        buttonAll.id = "0";
        containerFilters.appendChild(buttonAll);
    }

    // Fonction pour afficher les autres filtres de categories
async function displayCategories () {
    const categories = await getCategories();
    categories.forEach((category) => {
        const buttonCategory = document.createElement("button");
        buttonCategory.textContent = category.name;
        buttonCategory.classList.add("filter-category");
        buttonCategory.id = category.id;
        containerFilters.appendChild(buttonCategory);
    });
}
if (!token) {
displayCategories();
}

    // Fonction pour afficher les works en fonction de la catégorie sélectionnée
async function displayWorksByCategory (id) {
    const works = await getWorks();
    console.log(works);

    const buttons = document.querySelectorAll(".container-filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
              gallery.innerHTML = ""; // reset de la galerie
                // reset des classes de tous les boutons
              for (let button of buttons) { 
                if (button.classList.contains("filter-selected")) {
                    button.classList.remove("filter-selected");
                    button.classList.add("filter-category");
                }}
                // ajout de la classe filter-selected au bouton cliqué et supperssion de la classe filter-category
                e.target.classList.add("filter-selected");
                e.target.classList.remove("filter-category");
                // récupération de l'id du bouton cliqué (correspondant à l'id de la catégorie)
                const buttonId = e.target.id;
                // si l'id du bouton cliqué est différent de 0 (0= tous les works), on filtre les works en fonction de la catégorie
                if (buttonId !== "0") {
                const worksByCategory = works.filter((work) => {
                    return work.categoryId == buttonId;
                });
                worksByCategory.forEach((work) => {
                    createWorks(work);
                });
                // sinon, on affiche tous les works
            } else {
               displayAllWorks(works);
            }
        });
    });
}
displayWorksByCategory();

   

// Modification de l'affichage de la page en mode éditeur
if (token) {
    // ajouter un bandeau "mode édition"
const body = document.querySelector ("body");
const header = document.querySelector ("header");

const modeEdition = document.createElement ("div");
modeEdition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
body.insertBefore(modeEdition,header);
modeEdition.classList.add ("bandeau-mode-edition");

    // modifier le bouton login en logout
const logElement = document.getElementById("login");
logElement.innerHTML = "logout";
 
    // ajouter le bouton modifier
  
const  h2MesProjets = portfolio.querySelector("h2")
const btnModifier = document.createElement ("div")
btnModifier.classList.add ("btn-modifier")
h2MesProjets.appendChild (btnModifier)
btnModifier.innerHTML = `<a href="#modal1" class="js-modal"> <i class="fa-regular fa-pen-to-square"></i> modifier</a>`

    // se déconnecter
logElement.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    location.reload();  
});
}
/**********  MODAL **********/

const btnModifier = document.querySelector(".btn-modifier");
const modal = document.getElementById("modal1");  
const divModalRemove = document.querySelector(".modal-delete");
const divModalAdd = document.querySelector(".modal-add");
const galleryModal = document.querySelector(".gallery-modal"); 

// fonction pour afficher les works dans la galerie de la modal

async function displayWorksInModal () {
    
    galleryModal.innerHTML = ""; // reset de la galerie
    const works = await getWorks();
    
    works.forEach((work) => {
        const figureWork = document.createElement("figure");
        const imgWork = document.createElement("img");
        const deleteBtn = document.createElement("div");
        const trashIcone = document.createElement("i");
        deleteBtn.classList.add("delete-icon");
        trashIcone.classList.add("fa-solid", "fa-trash-can");
        deleteBtn.id = work.id;
        imgWork.src = work.imageUrl;
        imgWork.alt = work.title;
        figureWork.appendChild(imgWork);
        figureWork.appendChild(deleteBtn);
        deleteBtn.appendChild(trashIcone);
        galleryModal.appendChild(figureWork);
    });
deleteWorks();
}
displayWorksInModal();

// fonction pour supprimer un work

function deleteWorks () {
    const trashIcones = document.querySelectorAll(".delete-icon");
    trashIcones.forEach((trashIcone) => {
        trashIcone.addEventListener("click", (e) => {
            e.preventDefault();
            
            const id = trashIcone.id; // récupération de l'id du work à supprimer
            const init =  {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
          
            fetch(`http://localhost:5678/api/works/${id}`, init)
            .then((response) => {
                if (response.ok) {
                   
                    displayWorksInModal();
                    
                }
  
            });
        }
    );
});

}

  // ouverture de la modal
  btnModifier.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.setAttribute ("aria-hidden", "false");
    modal.setAttribute ("aria-modal", "true");
});

// Passage de la modal de suppression à la modal d'ajout
const btnAdd = document.querySelector(".btn-add");
btnAdd.addEventListener("click", (e) => {
divModalRemove.style.display = "none";
divModalAdd.style.display = "flex";
});

// Passage de la modal d'ajout à la modal de suppression
const btnComeBack = document.getElementById("come-back");
btnComeBack.addEventListener("click", (e) => {
    divModalAdd.style.display = "none";
    divModalRemove.style.display = "block";
});

// Fermeture de la modal
    // Fermeture de la modal en cliquant sur le bouton close
    const btnClose = document.querySelectorAll(".close");
    console.log (btnClose)
    btnClose.forEach((btn) => {
        btn.addEventListener("click", () => {
            modal.style.display = "none";
            modal.setAttribute ("style", "display:none");
            modal.setAttribute ("aria-hidden", "true");
            modal.removeAttribute("aria-modal");
            if (divModalRemove.style = "display:none") {
              divModalRemove.removeAttribute ("style", "display:none")
              divModalAdd.setAttribute ("style", "display:none")
            }
        });
    });
        
        // Fermeture de la modal en cliquant en dehors de la modal
        modal.addEventListener ("click" ,(e) => {
        console.log (e.target.id)
        if (e.target.id == "modal1") {
            modal.setAttribute ("style", "display:none");
            modal.setAttribute ("aria-hidden", "true");
            modal.removeAttribute("aria-modal");
            if (divModalRemove.style = "display:none") {
              divModalRemove.removeAttribute ("style", "display:none")
              divModalAdd.setAttribute ("style", "display:none")
            }
        };
      });

      // Ajout d'un work
      const formImageInput = document.getElementById("image");
      const formTitle = document.getElementById("title");
      const formCategory = document.getElementById("category");

        const form = document.getElementById("addWorkForm");
        console.log (form)
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('image', formImageInput.files[0])
            formData.append('title', formTitle.value)
            formData.append('category', formCategory.value)
        
            fetch('http://localhost:5678/api/works', {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                    
                } else {
                    throw new Error("la requête n\'a pas abouti")
                }
            })
            .then(data => {
                console.log('Success:', data)   
            })
            .catch(error => {
                console.error('Erreur:', error)
            })
          
        })
        
        
    
  