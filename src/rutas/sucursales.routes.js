const express = require('express');
const empresaController = require('../controladores/Admin_Empresa.controller');
const sucursalController = require('../controladores/Sucursal_Productos.controller')

const md_autentificacion = require('../middlewares/autentificacion');
const md_autentificacion_tipo = require('../middlewares/autentificacion_admin');


var api = express.Router();

api.post('/login', empresaController.Login);
api.post('/registrarse', empresaController.Registrar);

//CRUD EMPRESAS
api.get('/empresas', empresaController.verEmpresas);
api.post('/registrarEmpresa', empresaController.registrarEmpresa);
api.put('/editarEmpresa/:idEmpresa',  empresaController.editarEmpresa)
api.delete('/eliminarEmpresa/:idEmpresa', empresaController.eliminarEmpresa)


module.exports = api;
