const express = require('express');
const cors = require('cors');
var app = express();

const SucursalesRutas = require('./src/rutas/sucursales.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/api', SucursalesRutas);


module.exports = app;