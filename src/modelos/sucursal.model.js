const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SucursalSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    municipio: String,
    idEmpresa: String
});
module.exports = mongoose.model('Sucursales', SucursalSchema);

