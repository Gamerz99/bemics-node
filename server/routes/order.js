const express = require('express');
const router = express.Router();
const orders = require('../models/order');
const joi = require('joi');
const verify = require('../verify');

const OrderSchema = joi.object().keys({
    product: {
        _id: joi.string().required(),
        name: joi.string().required(),
        category: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required()
    },
    user: joi.string().required()
})

/* GET orders listing. */
router.get('/', verify.ensureToken, async (req, res, next) => {
    try {
        const data = await orders.find({});
        if (!data) {
            res.status(500).json({ message: "Not Found" });
            return
        }

        res.status(200).json({ message: "success", data: data })
    } catch (error) {
        next(error)
    }

});


//GET order by id
router.get('/:id', verify.ensureToken, async (req, res, next) => {
    try {
        const data = await orders.findOne({ _id: req.params.id });
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

//GET order by user
router.get('/user/:id/:status', verify.ensureToken, async (req, res, next) => {
    try {
        let data = '';
        if (req.params.status == 'all' || req.params.status == '') {
            data = await orders.find({ user: req.params.id });
        } else {
            data = await orders.find({ user: req.params.id, status: req.params.status });
        }
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

//POST order
router.post('/', verify.ensureToken, async (req, res, next) => {
    try {
        const result = joi.validate(req.body, OrderSchema);
        if (result.error) {
            res.status(404).json({ message: 'Data is not valid' });
            return
        }

        result.value.status = 'new';

        const order = await new orders(result.value)
        const out = await order.save();
        if (!out) {
            res.status(500).json({ message: "Not Success" })
        }

        res.status(200).send({ message: "success" })

    } catch (error) {
        next(error);
    }

});


module.exports = router;