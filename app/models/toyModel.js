// const { required } = require('joi');
const mongoose = require('mongoose');
const Joi = require("joi");

const ToysSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    date_created: {
        type: Date,
        default: Date.now()
    },
    id_user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    }
})
exports.Toy = mongoose.model("Toy", ToysSchema);

exports.validateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(100).required(),
        category: Joi.string().min(3).max(15).required(),
        img_url: Joi.string().allow(null, "").max(500),
        price: Joi.number().min(1).max(9999).required()
    })
    return schemaJoi.validate(_reqBody);
}