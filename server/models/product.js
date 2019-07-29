const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: String,
    category: String,
    description: String,
    price: Number

},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

module.exports = mongoose.model('products', productSchema)