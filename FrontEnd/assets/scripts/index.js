    // Variables
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

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
const buttonAll = document.createElement("button");
buttonAll.textContent = "Tous";
buttonAll.classList.add("filter-selected");
buttonAll.id = "0";
containerFilters.appendChild(buttonAll);


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
displayCategories();

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
    
   