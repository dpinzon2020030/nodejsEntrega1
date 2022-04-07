
exports.Admin = function (req, res, next) {
    if (req.user.tipo !== "Admin") {
        return res.status(500).send({ message: "Solo para el: ADMIN"})
    }
    next()
}