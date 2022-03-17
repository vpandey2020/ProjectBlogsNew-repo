const jwt = require('jsonwebtoken');

let authentication = function(req, res, next) {
    try {
        let token = req.headers["x-api-key"];

        if (!token) return res.send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "project for blogs");

        if (!decodedToken)
            return res.send({ status: false, msg: "token is invalid" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
    next()
}



let authorization = async function(req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "project for blogs");
        let usedLoggedIn = decodedToken.authorId
        let param_Id = req.params.authorId
        if (usedLoggedIn == param_Id) return res.status(200).send({ msg: "successfull" })
        next()
    } catch (error) { res.status(500).send({ msg: error.message }) }
}


module.exports.authenticate = authentication
module.exports.authorize = authorization