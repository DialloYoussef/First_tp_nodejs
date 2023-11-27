const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;
// Définir le dossier 'public' comme dossier statique
app.use(express.static('public'));
app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'views/index.html'));

});


// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
// On s'assure que le middleware d'analyse du corps est appliqué avant le middleware Multer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Endpoint pour récupérer la liste des pays du monde depuis une API
app.get("/countries", async (req, res) => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countries = response.data.map((country) => country.name.common);
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des pays.");
  }
});

// Endpoint pour récupérer la liste des auteurs depuis l'API Open Library
app.get("/authors", async (req, res) => {
  try {
    const response = await axios.get(
      "https://openlibrary.org/authors/OL33421A.json"
    );

    //   console.log('Réponse de l\'API Open Library:', response.data);

    // la propriété name permet d'obtenir le nom de l'auteur
    const authors = [response.data.personal_name];

    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des auteurs.");
  }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Endpoint pour gérer l'upload des fichiers
app.post(
  "/upload",
  upload.fields([{ name: "cv" }, { name: "images" }]),
  (req, res) => {
    try {
      const nom = req.body.nom;
      const prenom = req.body.prenom;
      const genre = req.body.genre;
      const pays = req.body.pays;
      const auteurs = req.body.auteurs;
      const cvFile = req.file;
      console.log("!!!!!!!!!!! Info envoye au serveur !!!!!!!!!!!!!!!!!! ");
      // Ajout de messages de débogage
      console.log("!!!   Nom:", nom);
      console.log("!!!   Prénom:", prenom);
      console.log("!!!   Genre:", genre);
      console.log("!!!   Pays:", pays);
      console.log("!!!   Auteurs:", auteurs);
      // Vérification: si le fichier CV est présent
      if (req.files["cv"]) {
        console.log("!!!   CV:", req.files["cv"][0].originalname);
      } else {
        console.log("Aucun fichier CV n'a été fourni.");
      }

      // Vérification: si des fichiers d'images sont présents
      if (req.files["images"]) {
        console.log(
          "!!!   Images:",
          req.files["images"].map((file) => file.originalname).join(", ")
        );
      } else {
        console.log("Aucun fichier d'images n'a été fourni.");
      }
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");

      // Ajout des messages de débogage supplémentaires
      console.log("Requête:", req.body);

      const cvname = req.files["cv"][0].originalname;
      const imgName = req.files["images"].map((file) => file.originalname).join(", ")
      res.render("succes", { nom, prenom, genre, pays, auteurs, cvname, imgName });
      
    } catch (error) {
      // Capture des erreurs et affichages des uns dans les journaux
      console.error("Erreur lors du traitement de la requête:", error);
      res.status(500).send("Erreur interne du serveur.");
    }
  }
);

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port http://localhost:${port}`);
});
