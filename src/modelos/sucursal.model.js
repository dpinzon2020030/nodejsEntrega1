const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SucursalSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    municipio: String,
    idEmpresa: { type: Schema.Types.ObjectId, ref: "Empresas"}
});
module.exports = mongoose.model('Sucursales', SucursalSchema);

