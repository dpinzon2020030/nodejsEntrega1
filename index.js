const mongoose = require('mongoose');
const app = require('./app');

const empresaController = require('./src/controladores/Admin_Empresa.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM_GRUPO2', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se encuentra conectado a la base de datos");

    app.listen(4500, function () {

        console.log("Puerto 4500, ejecución de Sucursales Empresa, exitosa");
        empresaController.Admin("","");
        console.log("ADMINISTRADOR: Usu:SuperAdmin, Pass:******" );
        console.log("-------------------------------------------------------------------------------------------------");
        console.log("-------------------------------------------------------------------------------------------------");
    })

}).catch(error => console.log(error));