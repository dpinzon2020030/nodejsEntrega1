const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    nombre: String,
    usuario: String,
    tipo: String,
    tipoEmpresa: String,
    password: String
});
module.exports = mongoose.model('empresas', EmpresaSchema);

