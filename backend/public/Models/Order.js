var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    itemset: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        productName: {
            type: String,
        },
        count: {
            type: Number,
            required: true
        },
    }],
    customerID: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    }
});

OrderSchema
.virtual('url')
.get(function() {
    return '/order/' + this._id;
});

module.exports = mongoose.model("Order", OrderSchema);