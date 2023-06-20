const mongoose = require('mongoose');
const ZoneSchema = mongoose.Schema({
    titre:String,
    description:String,
    plan : String, 
    cells: String,
    planification: String,
    name : String,
    days : String, 
    times : String,
    color:String,
    typeespace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeEspace',
        required: true
    },
    space: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spaces'
      }
}, {
    timestamps: true
});

module.exports = mongoose.model('Zones', ZoneSchema);