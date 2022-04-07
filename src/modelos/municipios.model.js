const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var municipioSchema = Schema({
    nombreMunicipio: String
});
module.exports = mongoose.model('municipiosSucursales', municipioSchema);

