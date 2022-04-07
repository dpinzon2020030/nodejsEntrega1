const Empresa = require('../modelos/empresa.model');
const Municipio = require('../modelos/municipios.model');
const Proveedor = require('../modelos/proveedor.model')
const TipoEmpresa = require('../modelos/tipoEmpresa.model');
const Sucursal = require('../modelos/sucursal.model');

const ProductoSucu = require('../modelos/productoSucursal.model');
const ProductoEmpre = require('../modelos/productoEmpresa.model');

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt.tokens');

////////////////////////////////////////////////////////////////
// UNIVERSAL
////////////////////////////////////////////////////////////////
function Login(req, res) {  
    var parametros = req.body;

    Empresa.findOne({ usuario: parametros.usuario }, (error, empresaEncontrada) => {
        if (error) return res.status(500).send({ mensaje: "Error en la petición" });
        if (empresaEncontrada) {

            bcrypt.compare(parametros.password, empresaEncontrada.password, (error, verificacionPassword) => {// V/F

                if (verificacionPassword) {

                    if (parametros.Token === "true") {
                        return res.status(200).send({ token: jwt.crearToken(empresaEncontrada) })
                    }else{
                        empresaEncontrada.password = undefined;
                        return res.status(200).send({ empresa: empresaEncontrada })
                    }
                } else {
                   return res.status(500).send({ mensaje: "algo no cuadra"})
                }
            })

        } else {
            return res.status(500).send({ mensaje: "Error, la empresa no se encuentra registrada" })
        }
    })
}

function Admin(res) {
    var adminModelo = new Empresa();
    adminModelo.usuario = "SuperAdmin";
    adminModelo.tipo = "Admin";

    Empresa.find({ tipo: adminModelo.tipo }, (error, adminEncontrado) => {
        if (adminEncontrado.length == 0)

            bcrypt.hash('123456', null, null, (error, passwordEncriptada) => {
                adminModelo.password = passwordEncriptada;

                adminModelo.save((error, adminGuardado) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!adminGuardado) return res.status(500).send({ mensaje: "Error, no se creo ningun Admin" });

                });
            });
    });
}


////////////////////////////////////////////////////////////////
// CRUD EMPRESAS (admin y empresa)
////////////////////////////////////////////////////////////////
function verEmpresas(req, res) {
    Empresa.find({ tipo: { $nin: "Admin" } }, (error, empresaObtenidos) => {

        if (error) return res.send({ mensaje: "error:" + error })
        for (let i = 0; i < empresaObtenidos.length; i++) {
        }
        return res.send({ Empresa: empresaObtenidos })

    })
}

function registrarEmpresa(req, res) {
    var parametros = req.body;
    var empresaModelo = new Empresa();

    if (parametros.nombre && parametros.usuario && parametros.tipoEmpresa && parametros.password) {

        empresaModelo.tipo = "Empresa";

        TipoEmpresa.findOne({ nombreTipoEmpresa: { $regex: parametros.tipoEmpresa, $options: 'i' } }, (error, tipoEmpresaEncontrado) => {
            if (error) return res.status(500).send({ mensaje: "Error1 de la petición" });
            if (!tipoEmpresaEncontrado) return res.status(500).send({ mensaje: "Error, no se encontro este tipo empresa" });

            empresaModelo.tipoEmpresa = tipoEmpresaEncontrado.nombreTipoEmpresa;

            Empresa.find({ nombre: { $regex: parametros.nombre, $options: 'i' } }, (error, empresaEncontrada) => {
                if (error) return res.status(500).send({ mensaje: "Error2 de la petición" });
                if (empresaEncontrada.length == 0) {

                    empresaModelo.nombre = parametros.nombre;

                    Empresa.find({ usuario: parametros.usuario }, (error, empresaEncontrada) => {
                        if (error) return res.status(500).send({ mensaje: "Error3 de la petición" });
                        if (empresaEncontrada.length == 0) {

                            empresaModelo.usuario = parametros.usuario;

                            bcrypt.hash(parametros.password, null, null, (error, passwordEncriptada) => {
                                empresaModelo.password = passwordEncriptada;

                                empresaModelo.save((error, empresaGuardada) => {
                                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                    if (!empresaGuardada) return res.status(500).send({ mensaje: "Error, no se agrego ninguna empresa" });

                                    return res.status(200).send({ empresa: empresaGuardada, nota: "empresa agregada exitosamente" });
                                });
                            });

                        } else {
                            return res.status(500).send({ mensaje: "El 'usuario' de esta empresa ya se encuentra en uso" });
                        }
                    });

                } else {
                    return res.status(500).send({ mensaje: "El 'nombre' de esta empresa ya se encuentra en uso" });
                }
            });
        })
    }
}

function editarEmpresa(req, res) {
    var idEmp = req.params.idEmpresa;
    var parametros = req.body;

    if (req.user.tipo == "Admin") {
        Empresa.findByIdAndUpdate(idEmp, parametros, { new: true }, (error, empresaActualizada) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!empresaActualizada) return res.status(500).send({ mensaje: "Error al editar la empresa" });

            return res.status(200).send({ empresa: empresaActualizada, nota: "empresa editada exitosamente" });
        })

    } else if (req.user.sub != idEmp) {
        return res.status(500).send({ mensaje: "No puede editar a otra empresa" });

    } else if (req.user.sub == idEmp) {
        Empresa.findByIdAndUpdate(idEmp, parametros, { new: true }, (error, empresaActualizada) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!empresaActualizada) return res.status(500).send({ mensaje: "Error al editar su empresa" });

            return res.status(200).send({ empresa: empresaActualizada, nota: "Su empresa fue editada exitosamente" });
        })
    }

}

function eliminarEmpresa(req, res) {
    var idEmp = req.params.idEmpresa;

    if (req.user.tipo == "Admin") {
        /*  Sucursal.deleteMany({ idEmpresa: idEmp }, (error, sucursalesBorradas) => {
              if (error) return res.status(500).send({ mensaje: "Error de la petición" }); */

        Empresa.findByIdAndDelete(idEmp, (error, empresaEliminada) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!empresaEliminada) return res.status(404).send({ mensaje: "Error al eliminar la empresa" });

            return res.status(200).send({
                empresa: empresaEliminada, nota: "Empresa eliminada con exito",
                // cierres: sucursalesBorradas
            });
        })
        // })

    } else if (req.user.sub !== idEmp) {
        return res.status(500).send({ mensaje: "No puede eliminar a otra empresa" });

    } else if (req.user.sub == idEmp) {
        /*  Sucursal.deleteMany({ idEmpresa: idEmp }, (error, sucursalesBorradas) => {
              if (error) return res.status(500).send({ mensaje: "Error de la petición" }); */

        Empresa.findByIdAndDelete(idEmp, (error, empresaEliminada) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!empresaEliminada) return res.status(404).send({ mensaje: "Error al eliminar su empresa" });

            return res.status(200).send({
                empresa: empresaEliminada, nota: "Su empresa fue borrada con exito",
                // cierres: sucursalesBorradas
            });
        })
        //  })
    }
}

function nuevoValorDesplegablePredeterminado(req, res) {
    var parametros = req.body;
    var municipioModelo = new Municipio();
    var proveedorModelo = new Proveedor();
    var logueado = req.user.tipo;
    var tipoEmpresaModelo = new TipoEmpresa();

    if (parametros.nombre && parametros.rama) {

        if (parametros.rama == "municipio" && logueado == "Empresa") {

            Municipio.find({ nombreMunicipio: parametros.nombre }, (error, municipioEncontrado) => {
                if (municipioEncontrado.length == 0) {

                    municipioModelo.nombreMunicipio = parametros.nombre;

                    municipioModelo.save((error, municipioGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!municipioGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun nuevo municipio" });

                        return res.status(200).send({ Municipio: municipioGuardado, nota: "municipio agregado exitosamente" });
                    });

                } else {
                    return res.status(500).send({ mensaje: "El municipio ya se encuentra registrado" });
                }
            });

        } else if (parametros.rama == "proveedor" && logueado == "Empresa") {

            if(parametros.nombre && parametros.telefono && parametros.distribuidora){

            Proveedor.find({ nombreProveedor: parametros.nombre }, (error, proveedorEncontrado) => {
                if (proveedorEncontrado.length == 0) {

                    proveedorModelo.nombreProveedor = parametros.nombre;
                    proveedorModelo.telefono = parametros.telefono;
                    proveedorModelo.distribuidora = parametros.distribuidora;

                    proveedorModelo.save((error, proveedorGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!proveedorGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun nuevo municipio" });

                        return res.status(200).send({ Proveedor: proveedorGuardado, nota: "proveedor agregado exitosamente" });
                    });

                } else {
                    return res.status(500).send({ mensaje: "El proveedor ya se encuentra registrado" });
                }
            });
        }

        } else if (parametros.rama == "municipio" || "proveedor" && logueado == "Admin") {
            return res.status(500).send({ error: "Acción disponible solo para Empresas" });

        } else if (parametros.rama == "tipoEmpresa" && logueado == "Admin") {

            TipoEmpresa.find({ nombreTipoEmpresa: parametros.nombre }, (error, tipoEncontrado) => {
                if (tipoEncontrado.length == 0) {

                    tipoEmpresaModelo.nombreTipoEmpresa = parametros.nombre;

                    tipoEmpresaModelo.save((error, tipoGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!tipoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun nuevo municipio" });

                        return res.status(200).send({ "Tipo Empresa": tipoGuardado, nota: "Tipo de empresa agregado exitosamente" });
                    });

                } else {
                    return res.status(500).send({ mensaje: "Este tipo de empresas ya se encuentra registrado" });
                }
            });

        } else if (parametros.rama == "tipoEmpresa" && logueado == "Empresa") {
            return res.status(500).send({ error: "Acción disponible solo para el Admin" });

        } else if (parametros.rama != "municipio" || "tipoEmpresa") {
            return res.status(500).send({ error: "Esta rama no es valida" });
        }
    }
}

////////////////////////////////////////////////////////////////
// CRUD EMPRESAS (empresa)
////////////////////////////////////////////////////////////////
function verSucursales(req, res) {
    Sucursal.find({ idEmpresa: req.user.sub }, (error, sucursalesObtenidas) => {

        if (error) return res.send({ mensaje: "error:" + error })
        for (let i = 0; i < sucursalesObtenidas.length; i++) {
        }
        return res.send({ Sucursales: sucursalesObtenidas })

    })
}

function registrarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModelo = new Sucursal();
    var idEmpresa = req.user.sub;

    if (parametros.nombre && parametros.direccion && parametros.municipio) {

        sucursalModelo.idEmpresa = idEmpresa;

        Municipio.findOne({ nombreMunicipio: { $regex: parametros.municipio, $options: 'i' } }, (error, municipioEncontrado) => {
            if (error) return res.status(500).send({ mensaje: "Error1 de la petición" });
            if (!municipioEncontrado) return res.status(500).send({ mensaje: "Error, no se encontro este tipo empresa" });

            sucursalModelo.municipio = municipioEncontrado.nombreMunicipio;

            Sucursal.findOne({ nombreSucursal: parametros.nombre }, (error, sucursalEncontrada) => {
                if (error) return res.status(500).send({ mensaje: "Error2 de la petición" });
                if (sucursalEncontrada.length == 0) {

                    sucursalModelo.nombreSucursal = sucursalEncontrada.nombreSucursal;
                    sucursalModelo.direccionSucursal = parametros.direccion;

                    sucursalModelo.save((error, sucursalGuardada) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!sucursalGuardada) return res.status(500).send({ mensaje: "Error, no se agrego ninguna empresa" });

                        return res.status(200).send({ Sucursal: sucursalGuardada, nota: "empresa agregada exitosamente" });
                    });
                } else {
                    return res.status(500).send({ mensaje: "El 'nombre' de esta sucursal ya se encuentra en uso" });
                }
            });
        })

    } else {
        return res.status(500).send({ mensaje: "Cumpla con los parametros obligatorios" });
    }

}

function editarSucursal(req, res) {
    var idSu = req.params.idSucu;
    var parametros = req.body;

    Sucursal.findByIdAndUpdate(idSu, parametros, { new: true }, (error, sucursalActualizada) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!sucursalActualizada) return res.status(500).send({ mensaje: "Error al editar la empresa" });

        return res.status(200).send({ Sucursal: sucursalActualizada, nota: "sucursal editada exitosamente" });
    })
}

function eliminarSucursal(req, res) {
    var idSu = req.params.idSucu;

    Sucursal.findByIdAndDelete(idSu, (error, sucursalEliminada) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!sucursalEliminada) return res.status(404).send({ mensaje: "Error al eliminar la empresa" });

        /*  ProductoSucu.deleteMany({ idSucursal: idSu }, (error, productosBorrados) => {
          if (error) return res.status(500).send({ mensaje: "Error de la petición" }); */

        return res.status(200).send({
            Sucursal: sucursalEliminada, nota: "Sucursal eliminada con exito",
            // cierres: productosBorrados
        });
    })
}




module.exports = {
    nuevoValorDesplegablePredeterminado,
    Login,
    Admin,
    verEmpresas,
    registrarEmpresa,
    editarEmpresa,
    eliminarEmpresa,

    verSucursales,
    registrarSucursal,
    editarSucursal,
    eliminarSucursal,
}