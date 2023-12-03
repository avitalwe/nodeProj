const { Toy } = require("../models/toyModel.js");
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
    getToy: async (req, res) => {
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
    editToy: async (req, res) => {
        let idEdit = req.params.editId;
            // let validBody = userValid(req.body);
            // if (validBody.error) {
            //   return res.status(400).json(validBody.error.details);
            // }
            try{
          
              let data;
            //   if (req.tokenData._role == "admin") {
            //     req.body.password = await bcrypt.hash(req.body.password, 10)
          
            //     data = await UserModel.updateOne({ _id: idEdit }, req.body);
            //   }
            //   else if (idEdit == req.tokenData.user_id) {
            //     req.body.password = await bcrypt.hash(req.body.password, 10)
          
            //     data = await UserModel.updateOne({ _id: idEdit }, req.body);
            //   }
            //   else {
            //     data = [{ status: "failed", msg: "You are trying to do an operation that is not enabled!" }]
            //   }
            //req.body.password = await bcrypt.hash(req.body.password, 10)
          
            data = await Toy.updateOne({ _id: idEdit }, req.body);
              res.json(data);
          
            }
            catch (err) {
              console.log(err);
              res.status(500).json({ err })
            }
    },
    deleteToy: async (req, res) => {
        try {
            let dellId = req.params.delId;
            let data;
            if (req.tokenData.role == "admin") {
                data = await Toy.deleteOne({ _id: delId })
            }
            else {
                data = await Toy.deleteOne({ _id: delId, user_id: req.tokenData._id })
            }
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    }
};
// router.put("/:idEdit", auth, async (req, res) => {
//     let idEdit = req.params.idEdit;
//     let validBody = userValid(req.body);
//     if (validBody.error) {
//       return res.status(400).json(validBody.error.details);
//     }
//     try{
  
//       let data;
//       if (req.tokenData._role == "admin") {
//         req.body.password = await bcrypt.hash(req.body.password, 10)
  
//         data = await UserModel.updateOne({ _id: idEdit }, req.body);
//       }
//       else if (idEdit == req.tokenData.user_id) {
//         req.body.password = await bcrypt.hash(req.body.password, 10)
  
//         data = await UserModel.updateOne({ _id: idEdit }, req.body);
//       }
//       else {
//         data = [{ status: "failed", msg: "You are trying to do an operation that is not enabled!" }]
//       }
//       res.json(data);
  
//     }
//     catch (err) {
//       console.log(err);
//       res.status(500).json({ err })
//     }
//   })