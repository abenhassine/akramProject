const mongoose = require('mongoose');
const TypeEspace = require('./TypeEspace');

// Définir le schéma du modèle Spaces
const spacesSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  zones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zones'
  }]
});

// Créer le modèle Spaces à partir du schéma
const Spaces = mongoose.model('Spaces', spacesSchema);

// Exporter le modèle Spaces
module.exports = Spaces;
