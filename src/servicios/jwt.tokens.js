const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = "clave_sucursal";

exports.crearToken = function (empresa) {
    let payload = {
        sub: empresa._id,
        usuario: empresa.usuario,
        tipo: empresa.tipo,
        iat: moment().unix(),
        exp: moment().days(7,'days').unix()
    }
    return jwt_simple.encode(payload, secret);
}