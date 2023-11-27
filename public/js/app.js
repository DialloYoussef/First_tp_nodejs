document.addEventListener('DOMContentLoaded', function () {
    // Récupération de la liste des pays
    fetch('/countries')
      .then(response => response.json())
      .then(data => {
        const paysSelect = document.getElementById('pays');
        data.forEach(pays => {
          const option = document.createElement('option');
          option.value = pays;
          option.text = pays;
          paysSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des pays:', error));
  
    // Récupération de la liste des auteurs
    fetch('/authors')
      .then(response => response.json())
      .then(data => {
        const auteursSelect = document.getElementById('auteurs');
        data.forEach(auteur => {
          const option = document.createElement('option');
          option.value = auteur;
          option.text = auteur;
          auteursSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des auteurs:', error));
  });
  