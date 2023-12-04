const { Toy ,validateToy} = require("../models/toyModel.js");
const { decodeToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

exports.toyCtrl = {
    searchToy: async (req, res) => {
        const quary=req.body;
        let perPage = req.query.perPage || 10;
        const skip=(quary.page-1)*perPage;
        try {
            let {s} = req.query;
            if(s){
                let data = await Toy.find({ $or: [{ name: s }, { info: s }] })
                .skip(skip).limit(perPage).populate('id_user');
                res.send(data);

            }
            else{
                let data=await Toy.find().skip(skip).limit(perPage).populate('id_user');
                res.send(data);

            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    getToys: async (req, res) => {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        try {
            let data = await Toy.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ _id: -1 })
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    getToy: async (req, res) => {
        try {
            const toyId = req.params.id;
    
            let data = await Toy.findById(toyId);
    
            if (!data) {
                return res.status(404).json({ msg: "Toy not found" });
            }
    
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "There was an error, please try again later", err });
        }
    },
    
    toyByCategory: async (req, res) => {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        try {
            let catN = req.params.catName;
            console.log(catN);
            let catReg = new RegExp(catN, "i")
            let data = await Toy.find({ category: catReg })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ _id: -1 })
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    toysByPrice: async (req, res) => {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "price"
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        try {
            let minP = req.query.min;
            let maxP = req.query.max;
            if (minP && maxP) {
                let data = await Toy.find({ $and: [{ price: { $gte: minP } }, { price: { $lte: maxP } }] })

                    .limit(perPage)
                    .skip((page - 1) * perPage)
                    .sort({ [sort]: reverse })
                res.json(data);
            }
            else if (maxP) {
                let data = await Toy.find({ price: { $lte: maxP } })
                    .limit(perPage)
                    .skip((page - 1) * perPage)
                    .sort({ [sort]: reverse })
                res.json(data);
            } else if (minP) {
                let data = await Toy.find({ price: { $gte: minP } })
                    .limit(perPage)
                    .skip((page - 1) * perPage)
                    .sort({ [sort]: reverse })
                res.json(data);
            } else {
                let data = await Toy.find({})
                    .limit(perPage)
                    .skip((page - 1) * perPage)
                    .sort({ [sort]: reverse })
                res.json(data);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    addToy: async (req, res) => {
        const body = req.body;
        const userId = res.locals.id_user;
        try {
            const newToy = new Toy(body);
            newToy.id_user=userId;
            await newToy.save();
            res.status(201).send(newToy);
        } catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    },
    editToy: async (req, res,next) => {
        try {
            const { editId } = req.params;
            const updates = req.body;
            const  id_user = res.locals.id_user;
            const validate = validateToy(updates);
            if (validate.error)
                throw Error(validate.error);
            let toy = await Toy.findOne({ _id: editId });
            if (!toy)
                return res.status(404).send({ msg: "Toy not found" });
            if (String(toy.id_user) !==  id_user)
                return res.status(404).send({ msg: "You cannot update this toy" });
    
            toy = await Toy.findByIdAndUpdate(editId, updates, { new: true });
            res.status(200).send(toy);
        } catch (error) {
            next(error);
        }
    },
    deleteToy: async (req, res,next) => {
        try {
            const  id  = req.params.delId;
            const body = req.body;
            const id_user = res.locals.id_user;
            let toy = await Toy.findOne({ _id: id });
            if (!toy)
                return res.status(404).send({ msg: "Toy not found" });
            if (String(toy.id_user) !== id_user)
                return res.status(404).send({ msg: "You cannot delete this toy" });
            toy = await Toy.findByIdAndDelete(id, body, { new: true });
            res.status(200).send(toy);
        
        } catch (error) {
            next(error);
        }
    }
};
exports.updateToy = async (req, res, next) => {
    try {
        const { editId } = req.params;
        const updates = req.body;
        const user_id = res.locals.user_id;

        const validate = joiSchema.update.validate(updates);
        if (validate.error)
            throw Error(validate.error);
        let toy = await Toy.findOne({ _id: editId });
        if (!toy)
            return res.status(404).send({ msg: "Toy not found" });
        if (String(toy.user_id) !== user_id)
            return res.status(404).send({ msg: "You cannot update this toy" });

        toy = await Toy.findByIdAndUpdate(editId, updates, { new: true });
        res.status(200).send(toy);
    } catch (error) {
        next(error);
    }
}
