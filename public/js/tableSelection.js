document.getElementById('alert-success').style.display = 'none';
  // Variables globales
  var isCreating = false;
  var selectedZones = [];
  var currentColor = '';
  var data = []; // Tableau pour stocker les zones créées

  // Fonction pour générer une couleur unique
  function generateColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  // Fonction pour générer une nouvelle zone avec un colspan optionnel
  function generateZone(colspan) {
      var cell = document.createElement('td');
      if (colspan) {
          cell.colSpan = colspan;
      }
      cell.addEventListener('click', selectZone); // Ajouter l'événement de clic
      return cell;
  }

  // Fonction pour sélectionner une zone
  function selectZone(event) {
      var cell = event.target;
      if (isCreating) {
          cell.classList.toggle('selected');
          if (cell.classList.contains('selected')) {
              cell.style.backgroundColor = currentColor;
              selectedZones.push(cell);
          } else {
              cell.style.backgroundColor = '';
              var index = selectedZones.indexOf(cell);
              if (index > -1) {
                  selectedZones.splice(index, 1);
              }
          }
      }
  }

  // Événement de clic sur le bouton "Créer une zone"
  var createButton = document.getElementById('create-button');
  createButton.addEventListener('click', function() {
      isCreating = true;
      createButton.disabled = true;
      finishButton.disabled = false;
      document.getElementById("titreDescriptionZone").style.display = 'block';
      document.getElementById("detailZoneArea").style.display = 'none';
      currentColor = generateColor(); // Générer une couleur unique pour la création en cours
  });

  // Événement de clic sur le bouton "Terminer la création"
  var finishButton = document.getElementById('finish-button');
  finishButton.addEventListener('click', function() {
      isCreating = false;
      createButton.disabled = false;
      finishButton.disabled = true;

      // Enregistrer les informations de la zone créée
      var zone = {
          titre:document.getElementById('titre').value,
          description:document.getElementById('description').value,
          typeespace:document.getElementById('typeEspace').value,
          color: currentColor,
          cells: []
      };
      selectedZones.forEach(function(cell) {
          var coordinates = {
              row: cell.parentElement.rowIndex,
              col: cell.cellIndex
          };
          zone.cells.push(coordinates);
      });
      data.push(zone);

      // Activer le bouton "Enregistrer le plan" une fois qu'une zone a été créée
      if (data.length > 0) {
          saveButton.disabled = false;
      }else{
          console.log(0000000);
      }
  });

  // Événement de clic sur le bouton "Enregistrer le plan"
  var saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', function() {

   /* var days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  var planification = [];

  days.forEach(function(day) {
    var startTime = document.getElementById('start-time-' + day).value;
    var endTime = document.getElementById('end-time-' + day).value;
    var pauseStartTime = document.getElementById('pause-start-time-' + day).value;
    var pauseEndTime = document.getElementById('pause-end-time-' + day).value;

    planification.push({
      day: day,
      startTime: startTime,
      endTime: endTime,
      pauseStartTime: pauseStartTime,
      pauseEndTime: pauseEndTime
    });
    });*/
    //console.log(planification);
      // Vérifier si des zones ont été créées
      if (data.length > 0) {
        espaceId = document.getElementById('espaceId').value;
          // Envoyer les données au serveur via une requête AJAX
          $.ajax({
              url: 'http://127.0.0.1:8083/admin/savezone/'+espaceId,
              type: 'POST',
              dataType: 'json',
              data: JSON.stringify(data),
              contentType: 'application/json',
              success: function(response) {
                  // Le plan a été enregistré avec succès
                  console.log('Plan enregistré :', response);
                  document.getElementById("titreDescriptionZone").style.display = 'none';
                  document.getElementById("titre").value = '';
                  document.getElementById("description").value = '';
                  saveButton.disabled = true;
                  document.getElementById('alert-success').style.display = 'block';
              },
              error: function(error) {
                  // Une erreur s'est produite lors de l'enregistrement du plan
                  console.error('Erreur lors de l\'enregistrement du plan :', error);
              }
          });
      }
  });

  // Générer la table initiale avec des cellules vides
  var tableBody = document.getElementById('table-body');
  var numRows = 20;
  var numCols = 20;

  for (var i = 0; i < numRows; i++) {
      var row = document.createElement('tr');
      for (var j = 0; j < numCols; j++) {
        row.appendChild(generateZone());
      }
      tableBody.appendChild(row);
  }

  let DisplayData = []; // Initialisez l'objet fakeData
  espaceId = document.getElementById('espaceId').value;
fetch('/admin/listzone/'+ espaceId)
  .then(response => response.json())
  .then(data => {
    // Traitement des données récupérées
    console.log(data); // Affiche les données dans la console

    // Parcours des zones
    data.forEach(zone => {
        const cells = JSON.parse(zone.cells); 
        DisplayData.push({
          id:zone._id,
          color: zone.color,
          cells: cells
        });
        // Appeler la fonction pour afficher les zones enregistrées
        afficherZonesEnregistrees(DisplayData);
      });
   // console.log(fakeData); // Affiche l'objet fakeData rempli avec les résultats
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des zones:', error);
  });

  // Fonction pour afficher les zones enregistrées
  function afficherZonesEnregistrees(displayData) {
     displayData.forEach(function(zone) {
          var color = zone.color;
          var cells = zone.cells;
          cells.forEach(function(coord) {
              var rowIndex = coord.row;
              var colIndex = coord.col;
              var cell = tableBody.rows[rowIndex].cells[colIndex];
              cell.style.backgroundColor = color;
              cell.setAttribute('data-id', zone.id);
          });
      });
  }

 //afficher les detail xe la zone
 var tds = document.querySelectorAll('td');
/*
 $('td').hover(function() {
    var currentColor = $(this).css('background-color');

        // Parcourir uniquement les cellules de la même ligne que la cellule survolée
        tds.forEach(function(td) {
            if (td.css('background-color') === currentColor) {
                var originalColor  = $(this).css('background-color');
                var lightenedColor = tinycolor(originalColor).lighten().toString();
                $(this).css('background-color', lightenedColor);
            }
        });
        
  });*/


tds.forEach(function(td) {
    td.addEventListener('click', function() {
        // Votre code ici pour gérer l'événement de clic sur chaque cellule
        var propValue = td.getAttribute('data-id');
        console.log(propValue);
        
        if(propValue != null)
        {
            var params = new URLSearchParams();
            params.append('id', propValue);
            fetch('/admin/Detailzone/' + encodeURIComponent(propValue))
            .then(response => response.json())
            .then(data => {
              // Traitement des données récupérées
              //console.log(data); // Affiche les données dans la console
               // Affichage des détails dans la carte Bootstrap
   
    
            // Ajout du titre
            document.getElementById("titreWidget").textContent = data.titre;
            document.getElementById("descriptionWidget").textContent = data.description;
            document.getElementById("TypeWidget").textContent = data.type;
            
            // Récupération des composants de la date
            const date = new Date(data.createdAt);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Format de date souhaité : AAAA-MM-JJ HH:MM:SS
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            document.getElementById("createdWidget").textContent = formattedDate;
            document.getElementById("detailZoneArea").style.display = 'block';
            document.getElementById("titreDescriptionZone").style.display = 'none';
            
            const element = document.getElementById('bouleZone');
            element.style.backgroundImage = 'linear-gradient(to left, rgba(0,0,0,0), '+data.color+')';
            //var monElement = document.getElementsByClassName('progress-gradient-success');

           // monElement.style.backgroundImage = "linear-gradient(to right, rgba(0,0,0,0), #ddd)";  

            })
            .catch(error => {
              console.error('Erreur lors de la récupération des zones:', error);
            });
        }
    });
});



