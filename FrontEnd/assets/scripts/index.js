
// Variables
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");
const token = sessionStorage.getItem("token");

   
    // Fonction qui retourne tableau des works
    async function getWorks() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (response.ok) {
                return await response.json();
                
            } else {
                throw new Error("Erreur lors de la récupération des travaux");
            }
        } catch (error) {
            console.error('Erreur dans la récupération des works:', error);
        }
    }
    getWorks();
    console.log(getWorks());

    // Fonction qui retourne le tableau des categories
async function getCategories () {
    try {
        const response = await fetch ("http://localhost:5678/api/categories");
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error ("Erreur lors de la récupération des catégories");
        }
    } catch (error) {
        console.error ("Erreur dans la récupération des catégories :", error);
    
    }
}
    getCategories();
    console.log(getCategories());

    // // Fonction pour créer un élément work
function createWorkElement(work) {
    const figureWork = document.createElement("figure");
    figureWork.dataset.id = work.id;
    const imgWork = document.createElement("img");
    const figcaptionWork = document.createElement("figcaption");
    imgWork.src = work.imageUrl;
    imgWork.alt = work.title;
    figcaptionWork.textContent = work.title;
    figureWork.appendChild(imgWork);
    figureWork.appendChild(figcaptionWork);
    return figureWork;
}


    // Fonction qui affiche tous les works   
    async function displayAllWorks () {
        const works = await getWorks();
        gallery.innerHTML = ""; // reset de la galerie  
        works.forEach((work) => {
            const workElement = createWorkElement(work);
            gallery.appendChild(workElement);
        });
    }
    displayAllWorks();
    
    // Fonction pour mettre à jour un seul work dans la galerie
function addWorkToGallery(work) {
    const workElement = createWorkElement(work);
    gallery.appendChild(workElement);
}

// Fonction pour supprimer un work de la galerie
function removeWorkFromGallery(workId) {
    const workElement = document.querySelector(`figure[data-id='${workId}']`);
    if (workElement) {
        workElement.remove();
    }
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
                            const workElement = createWorkElement(work);
                             gallery.appendChild(workElement);
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
    if (token) {
    const btnModifier = document.querySelector(".btn-modifier");
    const modal = document.getElementById("modal1");  
    const divModalRemove = document.querySelector(".modal-delete");
    const divModalAdd = document.querySelector(".modal-add");
    const galleryModal = document.querySelector(".gallery-modal"); 
    

    // fonction pour créer un work dans la modal

    function createWorkElementForModal(work) {
        const figureWork = document.createElement("figure");
        figureWork.dataset.id = work.id;
        const imgWork = document.createElement("img");
        const deleteBtn = document.createElement("div");
        const trashIcon = document.createElement("i");
        deleteBtn.classList.add("delete-icon");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        deleteBtn.id = work.id;
        imgWork.src = work.imageUrl;
        imgWork.alt = work.title;
        figureWork.appendChild(imgWork);
        figureWork.appendChild(deleteBtn);
        deleteBtn.appendChild(trashIcon);
        return figureWork;
    }
    // fonction pour afficher les works dans la galerie de la modal
    
    async function displayWorksInModal() {
        const works = await getWorks();
        const galleryModal = document.querySelector(".gallery-modal");
        galleryModal.innerHTML = ""; // Reset de la galerie
        works.forEach((work) => {
            const workElement = createWorkElementForModal(work);
            galleryModal.appendChild(workElement);
        });
        addDeleteEventListeners();
    }
    displayWorksInModal();
    

    // Fonction pour ajouter un work dans la modal
function addWorkToModal(work) {
    const galleryModal = document.querySelector(".gallery-modal");
    const figureWork = document.createElement("figure");
    figureWork.dataset.id = work.id;
    const imgWork = document.createElement("img");
    const deleteBtn = document.createElement("div");
    const trashIcon = document.createElement("i");
    deleteBtn.classList.add("delete-icon");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    deleteBtn.id = work.id;
    imgWork.src = work.imageUrl;
    imgWork.alt = work.title;
    figureWork.appendChild(imgWork);
    figureWork.appendChild(deleteBtn);
    deleteBtn.appendChild(trashIcon);
    galleryModal.appendChild(figureWork);
    addDeleteEventListeners();
}

// Fonction pour supprimer un work de la modal
function removeWorkFromModal(workId) {
    const workElement = document.querySelector(`.gallery-modal figure[data-id='${workId}']`);
    if (workElement) {
        workElement.remove();
    }
}

// Fonction pour ajouter les écouteurs d'événements de suppression
function addDeleteEventListeners() {
    const trashIcons = document.querySelectorAll(".delete-icon");
    trashIcons.forEach((trashIcon) => {
        trashIcon.addEventListener("click", async (e) => {
            e.preventDefault();
            const id = trashIcon.id;
            const init = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`http://localhost:5678/api/works/${id}`, init);
            if (response.ok) {
                removeWorkFromGallery(id);
                removeWorkFromModal(id);
            }
        });
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
    
          // Fonction pour prévisualiser l'image
          const imgPreview = document.getElementById("preview");
          console.log(preview);
          const formImageInput = document.getElementById("image");
          console.log(formImageInput);
          const formTitle = document.getElementById("title");
          console.log(formTitle);
          const formCategory = document.getElementById("category");
          console.log(formCategory);
          const form = document.getElementById("addWorkForm");
          console.log (form)
    
    
          function previewFile () {
          formImageInput.addEventListener("change", () =>{
            const file = document.querySelector("input[type=file]").files[0];
            console.log(file);
            const imgLabel = document.querySelector("label[for=image]");
            console.log(imgLabel);
            if (file) {
            const reader = new FileReader();
            reader.onloadend = function (e) {
                imgPreview.src = reader.result;
                imgPreview.style.display = "block";
                imgLabel.style.display = "none";
            };
                reader.readAsDataURL(file);
            } else {
                imgPreview.style.display = "none";
            }
          });
            }   
          previewFile();
    
        // créer la liste des catégories dans le select
        async function displayCategoriesInSelect () {
            const select = document.getElementById("category");
            
            // Ajouter une option vide par défaut
                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                //defaultOption.textContent = "Choisissez une catégorie";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);
            // Récupérer les catégories dynamiques
            const categories = await getCategories();
            // Ajouter les autres options dynamiquement
            categories.forEach((category) => {
                const optionCategory = document.createElement("option");
                optionCategory.value = category.id;
                optionCategory.textContent = category.name;
                select.appendChild(optionCategory);
            });
        }
        displayCategoriesInSelect();
    
    
        // vérification que les inputs sont remplis
    
        document.addEventListener('DOMContentLoaded', function() {
            
            const submitBtn = document.getElementById('btn-submit-add');
        
            function checkInputs() {
                if (
                    formImageInput.files.length > 0 &&
                    formTitle.value.trim() !== "" &&
                    formCategory.value !== ""
                ) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-modal-disabled');
                    submitBtn.classList.add('btn-modal');
                } else {
                    submitBtn.disabled = true;
                }
            }
        
            formImageInput.addEventListener('change', checkInputs);
            formTitle.addEventListener('input', checkInputs);
            formCategory.addEventListener('change', checkInputs);
        });
    
// Fonction pour ajouter un work
async function addWork(formData) {
    const response = await fetch('http://localhost:5678/api/works', {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.ok) {
        const newWork = await response.json();
        addWorkToGallery(newWork);
        addWorkToModal(newWork);
        form.reset();
        modal.setAttribute ("style", "display:none");
        modal.setAttribute ("aria-hidden", "true");
        modal.removeAttribute("aria-modal");


    } else {
        throw new Error("La requête n'a pas abouti");
    }
}

// Événement de soumission du formulaire d'ajout de work
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', formImageInput.files[0]);
    formData.append('title', formTitle.value);
    formData.append('category', formCategory.value);
    try {
        await addWork(formData);
    } catch (error) {
        console.error('Erreur:', error);
    }
});
    }
