const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSucursalSchema = Schema({
    nombreProductoSucursal: String,
    stockSucursal: Number,
    cantidadVendidaSucursal: Number,
    idSucursal: { type: Schema.Types.ObjectId, ref: "Sucursales"}
});
module.exports = mongoose.model('Productos_Sucursal', ProductoSucursalSchema);

