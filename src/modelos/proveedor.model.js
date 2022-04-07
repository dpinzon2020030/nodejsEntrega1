const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proveedoresSchema = Schema({
    nombreProveedor: String,
    telefono: Number,
    distribuidora: String
});
module.exports = mongoose.model('proveedores', proveedoresSchema);

