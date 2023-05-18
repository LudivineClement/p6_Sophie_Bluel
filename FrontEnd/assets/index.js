//------------------------- fonction pour récupérer la galerie et les catégories
let lstGallery = [];
let lstCategories = [];

const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      lstGallery = data;     
    })
  await fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((data) => {
    lstCategories = data;
      
  }).then(() => {
    createCategory();
    createGallery(lstGallery);
    createGalleryModal(lstGallery);
  });

}

// -------------------------- fonction pour créer les catégories et rendre fonctionnel les filtres
const createCategory = () => {
  const filter = document.createElement("div");
  filter.classList.add("filter");
  portfolio.appendChild(filter);

  filter.innerHTML =
    `<div class="button selected" id="0">Tous</div>
  ` +
    lstCategories
      .map(
        (categories) =>
        
          `<div class="button" id="${categories.name}">${categories.name}</div>`
      )
      .join("");

  let btnFilter = document.querySelectorAll(".button");
  for (let i = 0; i < btnFilter.length; i++) {
    btnFilter[i].addEventListener("click", () => {
      if (i != 0) {
        lstGalleryFilter = lstGallery.filter((el) => el.categoryId == i);
        createGallery(lstGalleryFilter);
      } else {
        createGallery(lstGallery);
      }

      btnFilter.forEach((btn) => btn.classList.remove("selected"));
      btnFilter[i].classList.add("selected");
    });
  }
};

//------------------------- fonction pour créer la galerie

let gallery = document.querySelector('.gallery')
gallery = document.createElement("div");
gallery.classList.add("gallery");

const createGallery = (lst) => {
  gallery.innerHTML = lst
    .map(
      (img) =>
        `<figure>
    <img src=${img.imageUrl} alt=${img.title}>
    <figcaption>${img.title}</figcaption>
  </figure>
  `
    )
    .join("");

  portfolio.appendChild(gallery);
};

getWorks();

const logout = document.querySelector('.logout')
console.log(logout);
logout?.addEventListener("click", ()=> localStorage.removeItem('user'));


// ---------------- Apparition de la modal sur les 3 liens "modifier" -------------------------------//

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal)
)

function toggleModal() {
  modalContainer.classList.toggle("active")
  createGalleryModal(lstGallery);
  resetForm();
}

const modalLinks = document.querySelectorAll(".modalLink");
modalLinks.forEach(modalLink => modalLink.addEventListener("click", firstModal));


// ---------------------fonction pour faire apparaitre la galerie dans la modale et ajouter les icones suppression ------------//

function createGalleryModal(elt) {
  const galleryModal = document.querySelector('.gallery_modal');
  galleryModal.innerHTML = elt .map(
    (img) =>
      `<div class="img_modal">
        <img src=${img.imageUrl} alt=${img.title} data-id=${img.id}>
        <img src="assets/icons/Group 9.svg" alt="" class="icon_delete" data-id=${img.id}> 
        <figcaption>éditer</figcaption>
</div> `
  )
  .join("");

  let iconsDelete = document.querySelectorAll(".icon_delete");
  for (let iconDelete of iconsDelete) {
  iconDelete.addEventListener('click', deleteProject)
  }
}

//------------------------- fonction pour supprimer des projets-------------------------//

async function deleteProject (e) { 
  let id = this.dataset.id; 
  
 await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "*/*",
          "Authorization": "Bearer " + localStorage.user,
        },
      }).then((res) => {
        if (res.ok) {
          e.target.parentElement.remove()
          getWorks();
          
        } else if (res.status === "401") {
          window.location.assign("login.html")
        }
      })
};

const deleteModal = document.querySelector(".link_modal");
deleteModal.addEventListener("click", () => {
  for (let i = 0; i < lstGallery.length; i++) {

  }
});

//---------------- AJOUTS DE PROJETS----------------------------//

//initialisation de variables globales des éléments du formulaire utilisés dans plusieurs fonctions
const modal = document.querySelector('.modal');
const modal_add= document.querySelector('.modal_add');

const arrowModal = document.querySelector(".arrow-modal")
arrowModal.addEventListener("click", firstModal)

const formUploadImg = document.querySelector(".form_upload_img");
const labelFile= document.querySelector(".form_add_photo");
const input_file = document.createElement("input");

const btnAdd = document.querySelector('.button_add_gallery');
btnAdd?.addEventListener('click', modalAdd);


// fonction qui affiche la première modale

function firstModal() {
  modal.style.display = "block";
  modal_add.style.display = "none";
}

// // fonction pour afficher dynamiquement les éléments de la deuxième modale
function modalAdd() {
  modal.style.display = "none";
  modal_add.style.display = "block";

  input_file.type = "file";
  input_file.id = "file"
  input_file.name = "file";
  input_file.accept = "image/png, image/jpeg";
  input_file.style.display= "none";
  formUploadImg.appendChild(input_file);
  
  categoriesSelect(lstCategories);  
}



// Sélectionner une catégorie pour l'image à envoyer
function categoriesSelect (categories) {
  const categorySelect =  document.getElementById('categories');

  categorySelect.innerHTML= `
 <option value ="default" selected required></option>
  `
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent= category.name;
    categorySelect.appendChild(option);
  });
}

// faire apparaitre la miniature de l'image uploaded dans le formulaire avant validation, récupérer l'image de l'utilisateur dans une variable (file) et l'ajouter au formulaire pr l'envoyer vers la base de données.
const inputTitle = document.getElementById("title_picture");
const selectCategories= document.getElementById("categories")

input_file.addEventListener("change", previewFile);


function previewFile(e) {
  const file_extension_regex = /\.(jpe?g|png)$/i;
  if(this.files.length === 0 || !file_extension_regex.test(this.files[0].name)) {
    return;
  }

  let file = e.target.files[0];
  console.log(file);
  let url = URL.createObjectURL(file);
  displayImg();

  //fonction pour créer l'image, et l'intégrer dans le label

 function displayImg () {
  labelFile.style.padding = "0px";

  const img_element = document.createElement('img');
  img_element.classList.add('img_uploaded')
  img_element.src= url;
  labelFile.innerHTML="";
  labelFile.appendChild(img_element);
}

  // fonction pour mettre le bouton valider en vert une fois les conditions remplies
  function btnValidateForm() {
    const btnValidate= document.querySelector('.button_validate');
    if (inputTitle.value !="" && selectCategories.value !=="default" &&  input_file.files.length > 0 ) {
      btnValidate.style.background = "#1D6154";
      btnValidate.disabled= false;
      btnValidate.style.cursor= "pointer";
    } else {
      btnValidate.disabled= true;
      btnValidate.style.background = "#A7A7A7";
      btnValidate.style.cursor = "auto";
    }
  };
  
  inputTitle.addEventListener('input', btnValidateForm);
  selectCategories.addEventListener('input', btnValidateForm);
  input_file.addEventListener('input', btnValidateForm);

  // Sounission du formulaire et envoie du projet vers la base de données

  formUploadImg.addEventListener('submit', addProject);

  function addProject (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", input_file.files[0]);
    formData.append('title', inputTitle.value);
    formData.append('category', selectCategories.value);

    fetch('http://localhost:5678/api/works', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.user,
        },
        body:formData,
      })
      .then((res) => {
        if(res.ok) {
          resetForm();
           getWorks();
           firstModal();
        }
      })
  }
}

function resetForm() {
    input_file.value = "";
    inputTitle.value = "";
    selectCategories.value = "default";
  }

 













