$(document).ready(function() {
  function ajouterPlageHoraire(jour) {
    var container = document.getElementById(`plages-horaires-${jour}`);
    var plageHoraire = document.createElement('div');
    plageHoraire.className = 'plage-horaire';
    plageHoraire.innerHTML = `
      <input type="time" class="form-control" name="start-time-${jour}[]" placeholder="Heure de début">
      <input type="time" class="form-control" name="end-time-${jour}[]" placeholder="Heure de fin">
    `;
    container.appendChild(plageHoraire);
  }
  document.getElementById('alert-success').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
  
  $.ajax({
    url: '/admin/Listallzone',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var zoneSelect = $('#zoneSelect');

      // Parcourir les données des zones et créer des options
      data.forEach(function(zone) {
        var option = $('<option>').val(zone._id).text(zone.titre); // Utilisez l'ID de la zone comme valeur et le titre comme texte de l'option
        zoneSelect.append(option);
      });
    },
    error: function(xhr, status, error) {
      console.error('Erreur lors de la récupération des zones:', error);
    }
  });

  
  var plagesHoraires = {
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 7
  };

  const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

  // Récupérer le formulaire par son ID
  const form = document.getElementById('planificationFormulaire');

  // Écouter l'événement de soumission du formulaire
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire

    const zoneId = document.getElementById('zoneSelect').value;
    //console.log(typeId);

    const formData = {};

    // Parcourir les jours
    jours.forEach(jour => {
      // Récupérer les valeurs des champs de chaque jour
      const startTimeFields = document.getElementsByName(`start-time-${jour}[]`);
      const endTimeFields = document.getElementsByName(`end-time-${jour}[]`);
    
      const plagesHoraires = [];
    
      // Parcourir les plages horaires pour le jour donné
      for (let i = 0; i < startTimeFields.length; i++) {
        const startTime = startTimeFields[i].value;
        const endTime = endTimeFields[i].value;
    
        if (startTime && endTime) {
          plagesHoraires.push({
            startTime,
            endTime
          });
        }
      }
    
      // Ajouter les plages horaires au formData
      formData[jour] = plagesHoraires;
    });
    
    formData["zoneId"] = zoneId;
    
    
    // Soumettre le formulaire avec les données
fetch('/admin/saveplanification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
  .then(response => {
    document.getElementById('alert-success').style.display = 'block';
    // Traiter la réponse de la requête
  })
  .catch(error => {
    // Gérer les erreurs de la requête
  });


    // Enregistrez les données dans la base de données ici

    document.getElementById('alert-success').style.display = 'block';
    setTimeout(function() {
      document.getElementById('alert-success').style.display = 'none';
    }, 3000);
  });

  // Ajouter un événement de clic pour chaque jour
  /*jours.forEach(jour => {
    document.getElementById(`ajouter-plage-horaire-${jour}`).addEventListener('click', function() {
      ajouterPlageHoraire(jour);
    });
  });*/
  zoneSelect.addEventListener('change', function() {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    const zoneId = zoneSelect.value;
    fetchScheduleData(zoneId);
  });
  
  // Function to fetch schedule data for a specific zone
  function fetchScheduleData(zoneId) {
    return fetch('/admin/listplanification/' + encodeURIComponent(zoneId), {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        const result = response; // Récupération du résultat dans une variable
        console.log('Résultat de la requête AJAX:', result);
        if (response.length > 0 && response[0].jours !== undefined) {
          // Récupérer la valeur de "jours" de l'élément à l'index 0
          const jsonString = response[0].jours;
  
          // Parser la chaîne JSON en tant qu'objet
          const jsonObject = JSON.parse(jsonString);
  
          displaySchedule(jsonObject);
        } else {
          const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
          for (var day of joursSemaine) {
            var container = document.getElementById('plages-horaires-' + day);
            container.innerHTML = ''; // Vider les plages horaires existantes
          }
        }
      })
      .catch(error => {
        console.error('Erreur lors de la requête AJAX:', error);
        // Gérez l'erreur en conséquence
      });
  }
  
  function displaySchedule(scheduleData) {
    const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  
    for (var day of joursSemaine) {
      var container = document.getElementById('plages-horaires-' + day);
      container.innerHTML = ''; // Vider les plages horaires existantes
  
      if (scheduleData.hasOwnProperty(day)) {
        var scheduleDataDay = scheduleData[day];
  
        for (var i = 0; i < scheduleDataDay.length; i++) {
          var plageHoraire = scheduleDataDay[i];
          var startTime = plageHoraire.startTime || '';
          var endTime = plageHoraire.endTime || '';
  
          addPlageHoraire(day, startTime, endTime);
        }
      }
    }
  }
  
  function addPlageHoraire(jour, startTime, endTime) {
    var container = document.getElementById('plages-horaires-' + jour);
    var plageHoraire = document.createElement('div');
    plageHoraire.className = 'plage-horaire';
    plageHoraire.innerHTML = `
      <input type="time" class="form-control" name="start-time-${jour}[]" placeholder="Heure de début" value="${startTime}">
      <input type="time" class="form-control" name="end-time-${jour}[]" placeholder="Heure de fin" value="${endTime}">
    `;
    container.appendChild(plageHoraire);
  }

});
