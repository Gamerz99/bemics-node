const express = require('express');
const router = express.Router();
const products = require('../models/product');
const joi = require('joi');
const verify = require('../verify');

const ProductSchema = joi.object().keys({
    name: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required()
})

// GET prdducts listing.
router.get('/', async (req, res, next) => {
    try {
        const data = await products.find({});
        if (!data) {
            res.status(500).json({ message: "Not Found" });
            return
        }

        res.status(200).json({ message: "success", data: data })
    } catch (error) {
        next(error)
    }

});


//GET prdduct by id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await products.findOne({ _id: req.params.id });
        if (!data) {
            res.status(404).json({ message: "Not Found" });
            return
        }

        delete data.password;
        res.status(200).json({ message: "success", data: data })
    } catch (error) {
        next(error)
    }
});

//POST prdduct
router.post('/', verify.ensureToken, async (req, res, next) => {
    try {
        const result = joi.validate(req.body, ProductSchema);
        if (result.error) {
            res.status(404).json({ message: 'Data is not valid' });
            return
        }

        result.value.status = 'new';

        const product = await new products(result.value)
        const out = await product.save();
        if (!out) {
            res.status(500).json({ message: "Not Success" })
            return
        }

        res.status(200).send({ message: "success" })

    } catch (error) {
        next(error);
    }

});

//UPDATE prdduct
router.put('/:id', verify.ensureToken, async (req, res, next) => {
    try {
        const result = joi.validate(req.body, ProductSchema);
        if (result.error) {
            res.status(404).json({ message: 'Data is not valid' })
            return
        }

        const product = await products.findOne({ _id: req.params.id });
        if (!product) {
            res.status(404).json({ message: "Invalid Product" })
            return
        }

        product.name = await result.value.name;
        product.category = await result.value.category;
        product.description = await result.value.description;
        product.price = await result.value.price;

        const update = await product.save();

        if (!update) {
            res.status(404).json({ message: "Not Success" })
            return
        }

        const data = await products.findOne({ _id: req.params.id });
        if (!data) {
            res.status(404).json({ message: "Not Found" })
            return
        }

        res.status(200).json({ message: "success", data: data })

    } catch (error) {
        next(error);
    }

})

module.exports = router