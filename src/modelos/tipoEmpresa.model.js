const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipoEmpresaSchema = Schema({
    nombreTipoEmpresa: String
});
module.exports = mongoose.model('tiposEmpresa', tipoEmpresaSchema);

