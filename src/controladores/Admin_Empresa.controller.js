const Empresa = require('../modelos/empresa.model');

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
                    }
                } else {
                    empresaEncontrada.password = undefined;
                    return res.status(200).send({ empresa: empresaEncontrada })
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
// CRUD EMPRESAS
////////////////////////////////////////////////////////////////
function Registrar(req, res) {
    var parametros = req.body;
    var empresaModelo = new Empresa();

    if (parametros.nombre && parametros.usuario && parametros.tipo && parametros.password) {

        empresaModelo.nombre = parametros.nombre;
        empresaModelo.usuario = parametros.usuario;
        empresaModelo.tipo = parametros.tipo;

        Empresa.find({ usuario: parametros.usuario }, (error, EmpresaEncontrada) => {
            if (EmpresaEncontrada.length == 0) {

                bcrypt.hash(parametros.password, null, null, (error, passwordEncriptada) => {
                    empresaModelo.password = passwordEncriptada;

                    empresaModelo.save((error, empresaGuardada) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!empresaGuardada) return res.status(500).send({ mensaje: "Error, no se registro ninguna Empresa" });

                        return res.status(200).send({ Empresa: empresaGuardada, nota: "Empresa registrada exitosamente" });
                    });
                });

            } else {
                return res.status(500).send({ mensaje: "Este Usuario ya se encuentra utilizado" });
            }
        });
    }
}

function verEmpresas(req, res) {
    Empresa.find({ tipo: { $nin: "Admin" } }, (error, empresaObtenidos) => {

        if (error) return res.send({ mensaje: "error:" + error })
        for (let i = 0; i < empresaObtenidos.length; i++) {
            console.log(empresaObtenidos[i].nombre)
        }
        return res.send({ Empresa: empresaObtenidos })

    })
}

function registrarEmpresa(req, res) {
    var parametros = req.body;
    var empresaModelo = new Empresa();

    if (parametros.nombre && parametros.usuario && parametros.tipo && parametros.password) {

        empresaModelo.nombre = parametros.nombre;
        empresaModelo.usuario = parametros.usuario;
        empresaModelo.tipo = parametros.tipo;

        Empresa.find({ nombre: parametros.nombre }, (error, empresaEncontrada) => {
            if (empresaEncontrada.length == 0) {

                Empresa.find({ usuario: parametros.usuario }, (error, empresaEncontrada) => {
                    if (empresaEncontrada.length == 0) {

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

    }
}

function editarEmpresa(req, res) {
    var idEmp = req.params.idEmpresa;
    var parametros = req.body;

    if (req.user.tipo === "Admin") {
        Empresa.findByIdAndUpdate(idEmp, parametros, { new: true }, (error, empresaActualizada) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!empresaActualizada) return res.status(500).send({ mensaje: "Error al editar la empresa" });

            return res.status(200).send({ empresa: empresaActualizada, nota: "empresa editada exitosamente" });
        })

    } else if (req.user.sub !== idEmp) {
        return res.status(500).send({ mensaje: "No puede editar a otra empresa" });

    } else {
        Empresa.findByIdAndUpdate(idEmp, parametros, { new: true }, (error, empresaActualizada) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!empresaActualizada) return res.status(500).send({ mensaje: "Error al editar la empresa" });

            return res.status(200).send({ empresa: empresaActualizada, nota: "empresa editada exitosamente" });
        })
    }

}

function eliminarEmpresa(req, res) {
    var idEmp = req.params.idEmpresa;

    if (req.user.tipo === "Admin") {
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

    } else {
        /*  Sucursal.deleteMany({ idEmpresa: idEmp }, (error, sucursalesBorradas) => {
              if (error) return res.status(500).send({ mensaje: "Error de la petición" }); */

        Empresa.findByIdAndDelete(idEmp, (error, empresaEliminada) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!empresaEliminada) return res.status(404).send({ mensaje: "Error al eliminar la empresa" });

            return res.status(200).send({
                empresa: empresaEliminada, nota: "Eliminado con exito",
               // cierres: sucursalesBorradas
            });
        })
        //  })
    }
}







module.exports = {
    Login,
    Admin,
    Registrar,
    verEmpresas,
    registrarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
}