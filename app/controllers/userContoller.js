const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User ,validUser} = require("../models/userModel.js");
const { generateToken } = require("../utils/jwt");
const { auth, authNoPermistion } = require("../middlewares/auth");

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
        date_created: Joi.date()
    })
};
const checkIfUserExists = async (email) => {
    const user = await User.findOne({ email });
    if (user) return user;
    return false;
}

exports.register = async (req, res, next) => {
    const body = req.body;
    try {
     
        if (await checkIfUserExists(body.email)) {
            throw new Error("Already in the sysytem");
        };

        const hash = await bcrypt.hash(body.password, 10);
        body.password = hash;

        const newUser = new User(body);
        await newUser.save();

        return res.status(201).send(newUser);
    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    const body = req.body;
    try {
        //Todo: validate body
        const validate = userJoiSchema.login.validate(body);
        if (validate.error) {
            throw Error(validate.error);
        }

        //check is user exists
        const user = await checkIfUserExists(body.email);
        // if exsits check if password match
        if (!user || ! await bcrypt.compare(body.password, user.password)) {
            throw new Error('Password or email not valid');
        }
        //* generate jwt token
        const token = generateToken(user);
        return res.send({ user, token });
        // send the user object to the client
    } catch (error) {
        next(error);
    }
};
exports.users = async (req, res, next) => {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        try {
            let data = await User.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ _id: -1 })
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
   
};
exports.editUser = async (req, res) => {
    let idEdit = req.params.editId;
        let validBody = validUser(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
        try{
      
          let data;
       
      
        data = await User.updateOne({ _id: idEdit }, req.body);
          res.json(data);
      
        }
        catch (err) {
          console.log(err);
          res.status(500).json({ err })
        }
},
exports.deleteUser =  async (req, res) => {
    try {
        let delId = req.params.delId;
        let data;
            data = await User.deleteOne({ _id: delId })
       
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
}





