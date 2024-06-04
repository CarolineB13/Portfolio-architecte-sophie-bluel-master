// VARIABLES
const form = document.getElementById("formLogin");
const champsEmail = document.getElementById("email");
const champsMotDePasse = document.getElementById("password");
const errorMsg = document.getElementById ("messageErreur");



function login () {
    form.addEventListener("submit", (e) => {
    // Empêche l'envoi du formulaire par défaut
    e.preventDefault(); 
  
    const email = champsEmail.value;
    const password = champsMotDePasse.value;

    // Envoi des données d'identification à l'API pour vérification
  
    const reponse = fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      //Reponses post identification

      .then((reponse) => {
        //Si la réponse n'est pas ok
  
        if (!reponse.ok) {
         
         // Affichage du message d'erreur 
         errorMsg.innerText="Email ou mot de passe incorrect"
        }
        return reponse.json();
  
      })
  
      .then((data) => {
        // Si data.token est retourné
        if (data.token) {
          // Stockage du token dans sessionstorage
          sessionStorage.setItem("token", data.token);
          // Redirection page d'accueil
          window.location.href = "index.html";
        } else {
            console.log ("erreur d'identification")
        }
      });
  })};

  login ();