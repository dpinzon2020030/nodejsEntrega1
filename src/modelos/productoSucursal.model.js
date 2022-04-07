const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSucursalSchema = Schema({
    nombreProductoSucursal: String,
    cantidadSucursal: Number,
    cantidadVendidaSucursal: Number,
    idSucursal: String
});
module.exports = mongoose.model('Productos_Sucursal', ProductoSucursalSchema);

