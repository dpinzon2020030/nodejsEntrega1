
exports.Emp = function (req, res, next) {
    if (req.user.tipo !== "Empresa") {
        return res.status(500).send({ message: "Solo para tipo: Empresa"})
    }
    next()
}