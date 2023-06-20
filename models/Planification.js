const mongoose = require('mongoose');

const planificationSchema = new mongoose.Schema({
  typeEspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeEspace', // Remplacez 'TypeEspace' par le modèle de votre collection 'typeespace'
    required: false
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zones', // Remplacez 'Zone' par le modèle de votre collection 'zones'
    required: false // Autorise la valeur null pour le champ zoneId
  },
  jours: {
    type: String,
    default: '{}',
    validate: {
      validator: function (value) {
        try {
          JSON.parse(value);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid jours JSON'
    }
  }
});
const Planification = mongoose.model('Planification', planificationSchema);

module.exports = Planification;