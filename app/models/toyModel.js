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
        name: Joi.string().min(2).max(99),
        info: Joi.string().min(3).max(100),
        category: Joi.string().min(3).max(15),
        img_url: Joi.string().allow(null, "").max(500),
        price: Joi.number().min(1).max(9999),
        date_created: Joi.date(),

    })
    return schemaJoi.validate(_reqBody);
}