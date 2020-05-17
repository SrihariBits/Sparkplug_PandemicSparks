var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productID: {
        type: String,
        max: [50, "Enter less than 50 letters"],
        required: true,
    },
    description: {
        type: String,
        max: [50, "Enter less than 50 letters"],
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    currencyUnit: {
        type: String,
        max: [20, "Enter less than 20 letters"],
        required: true,
    },
})

ProductSchema
.virtual('getPrice')
.get(function() {
    return String(this.unitPrice) + this.currencyUnit;
})

ProductSchema
.virtual('url')
.get(function() {
    return '/product/' + this._id;
})

module.exports = mongoose.model('Product', ProductSchema);