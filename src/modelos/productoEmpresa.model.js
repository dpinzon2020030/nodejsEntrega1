const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoEmpresaSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    cantidad: Number,
    idEmpresa: String
});
module.exports = mongoose.model('Productos_Empresa', ProductoEmpresaSchema);

