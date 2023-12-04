const { decodeToken } = require("../utils/jwt");

exports.auth = (role) => {
    return async function (req, res, next) {
        let token = req.headers["authorization"];
        if (!token) return res.sendStatus(401);
        token = token.split(" ")[1];
        try {
            const payload = decodeToken(token);
            res.locals.id_user = payload._doc._id;
            
              
            next();
        } catch (error) {
            next(error);
        }
    }
};

exports.authNoPermistion = async (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) return res.sendStatus(401);
    token = token.split(" ")[1];
    try {
        const payload = decodeToken(token);
        // console.log(payload);
        // req.userId = payload?._doc?.id;
        res.locals.userId = payload._doc.id;
        console.log(payload._doc.id);
        next();
    } catch (error) {
        next(error);
    }
}
