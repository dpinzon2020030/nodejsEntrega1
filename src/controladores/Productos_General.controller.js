const Empresa = require("../modelos/empresa.model");
const Sucursal = require("../modelos/sucursal.model");
const Proveedor = require("../modelos/proveedor.model");
const ProductoEmpresa = require("../modelos/productoEmpresa.model");
const ProductoSucursal = require("../modelos/productoSucursal.model");


////////////////////////////////////////////////////////////////
// CRUD PRODUCTOS-EMPRESA
////////////////////////////////////////////////////////////////
function verProductosEmpresa(req, res) {
    ProductoEmpresa.find({ idEmpresa: req.user.sub }, (error, productosObtenidos) => {

        if (error) return res.send({ mensaje: "error:" + error })
        for (let i = 0; i < productosObtenidos.length; i++) {
            console.log(productosObtenidos[i].nombreProducto)
        }
        return res.send({ Productos_Empresa: productosObtenidos })

    })
}

function crearProductoEmpresa(req, res) {
    var parametros = req.body;
    var ProEmpModelo = new ProductoEmpresa();

    if (parametros.nombreProducto && parametros.nombreProveedor && parametros.cantidad) {

        ProductoEmpresa.find({ nombreProducto: { $regex: parametros.nombreProducto, $options: 'i' } }, (error, proempEncontrado) => {
            if (error) return res.status(500).send({ mensaje: "Error1 de la petición" });
            if (proempEncontrado.length == 0) {

                ProEmpModelo.nombreProducto = parametros.nombreProducto;

                Proveedor.findOne({ nombreProveedor: { $regex: parametros.nombreProveedor, $options: 'i' } }, (error, proveEncontrado) => {
                    if (error) return res.status(500).send({ mensaje: "Error1 de la petición" });
                    if (!proveEncontrado) return res.status(500).send({ mensaje: "Error, no se encontro a este proveedor" });

                    ProEmpModelo.nombreProveedor = proveEncontrado.nombreProveedor;
                    ProEmpModelo.cantidad = parametros.cantidad;
                    ProEmpModelo.idEmpresa = req.user.sub;

                    ProEmpModelo.save((error, productoGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!productoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ninguna empresa" });

                        return res.status(200).send({ Producto_Empresa: productoGuardado, nota: "Producto empresa agregado exitosamente" });
                    });
                });
            } else {
                return res.status(500).send({ mensaje: "El 'nombre' de este producto ya se encuentra en uso" });
            }
        })
    } else {
        return res.status(500).send({ ERROR: "PARAMETROS OBLIGATORIOS" });
    }
}

function editarProductoEmpresa(req, res) {
    var idPro = req.params.idPro;
    var parametros = req.body;

    ProductoEmpresa.findByIdAndUpdate(idPro, parametros, { new: true }, (error, ProductoActualizado) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!ProductoActualizado) return res.status(500).send({ mensaje: "Error al editar la empresa" });

        return res.status(200).send({ Producto_Empresa: ProductoActualizado, nota: "Producto editado exitosamente" });
    })
}

function borrarProductoEmpresa(req, res) {
    var idPro = req.params.idPro;

    ProductoEmpresa.findByIdAndDelete(idPro, (error, productoEliminado) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!productoEliminado) return res.status(404).send({ mensaje: "Error al eliminar la empresa" });

        return res.status(200).send({ Producto_Empresa: productoEliminado, nota: "Producto eliminado con exito" });
    })
}


module.exports = {
    verProductosEmpresa,
    crearProductoEmpresa,
    editarProductoEmpresa,
    borrarProductoEmpresa

}