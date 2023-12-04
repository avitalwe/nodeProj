const express = require("express");
const Joi = require("joi");
const { register, login ,users,editUser,deleteUser} = require("../controllers/userContoller");
const { auth } = require("../middlewares/auth");

const router = express.Router();
const userJoiSchema = {
    login: Joi.object().keys({
        password: Joi.string(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')),
    }),
    register: Joi.object().keys({
        password: Joi.string().max(20).required(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        date_created: Joi.date(),
        role:Joi.string()
    })
};

router.post("/register", (req, res, next) => {
    try {
        const validate = userJoiSchema.register.validate(req.body);
        if (validate.error) {
            throw Error(validate.error);
        }
        next();
    } catch (error) {
        next(error)
    }
}, register);

router.post("/login", login);
router.get("/",users)


module.exports = router;