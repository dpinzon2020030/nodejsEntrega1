const express = require('express');
const empresaController = require('../controladores/Admin_Empresa.controller');
const sucursalController = require('../controladores/Productos_General.controller')

const md_autentificacion = require('../middlewares/autentificacion');
const md_autentificacion_ad = require('../middlewares/autentificacion_admin');
const md_autentificacion_em = require('../middlewares/autentificacion_empresa');


var api = express.Router();

api.post('/login', empresaController.Login);
api.post('/nuevoAtributoPrede', md_autentificacion.Auth, empresaController.nuevoValorDesplegablePredeterminado);

//CRUD EMPRESAS
api.get('/empresas', empresaController.verEmpresas);
api.post('/registrarEmpresa', md_autentificacion.Auth, empresaController.registrarEmpresa);
api.put('/editarEmpresa/:idEmpresa', md_autentificacion.Auth, empresaController.editarEmpresa);
api.delete('/eliminarEmpresa/:idEmpresa', md_autentificacion.Auth, empresaController.eliminarEmpresa);

//CRUD SUCURSALES
api.get('/sucursales', [md_autentificacion.Auth, md_autentificacion_em.Emp], empresaController.verSucursales);
api.post('/registrarSucursal', [md_autentificacion.Auth, md_autentificacion_em.Emp], empresaController.registrarSucursal);
api.put('/editarSucursal/:idSucu', [md_autentificacion.Auth, md_autentificacion_em.Emp], empresaController.editarSucursal);
api.delete('/eliminarSucursal/:idSucu', [md_autentificacion.Auth, md_autentificacion_em.Emp], empresaController.eliminarSucursal);

//CRUD PRODUCTOS-EMPRESA
api.get('/productosEmpresa', [md_autentificacion.Auth, md_autentificacion_em.Emp], sucursalController.verProductosEmpresa);
api.post('/crearProductoEmpresa', [md_autentificacion.Auth, md_autentificacion_em.Emp], sucursalController.crearProductoEmpresa);
api.put('/editarProductoEmpresa/:idPro', [md_autentificacion.Auth, md_autentificacion_em.Emp], sucursalController.editarProductoEmpresa);
api.delete('/borrarProductoEmpresa/:idPro', [md_autentificacion.Auth, md_autentificacion_em.Emp], sucursalController.borrarProductoEmpresa);



module.exports = api;
