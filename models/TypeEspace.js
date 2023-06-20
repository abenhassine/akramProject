const mongoose = require('mongoose');

// Définir le schéma du modèle TypeEspace
const typeEspaceSchema = mongoose.Schema({
  titre:  String,
  description:  String
});

// Exporter le modèle TypeEspace
module.exports =  mongoose.model('TypeEspace', typeEspaceSchema);