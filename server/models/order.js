const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    product: {
        _id: String,
        name: String,
        category: String,
        description: String,
        price: Number
    },
    user: String,
    status: String
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

module.exports = mongoose.model('orders', orderSchema)