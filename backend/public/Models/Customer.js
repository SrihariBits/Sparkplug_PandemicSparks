var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    username: {
        type: String,
        max: [25, "Please use less than 25 letters"],
        required: true,
    },
    first_name: {
        type: String, 
        max: [25, "Please use less than 25 letters"], 
        required: true,
    },
    last_name: {
        type: String, 
        max: [25, "Please use less than 25 letters"], 
        required: true,
    },
    shipping_address: {
        type: String,
        max: [100, "Please use less than 100 letters"],
        required: true,
    },
});

CustomerSchema
.virtual('fullname')
.get(function() {
    if(this.last_name)
        return this.first_name + this.last_name;
    else
        return this.first_name;
});

CustomerSchema
.virtual('url')
.get(function() {
    return '/user/customer/' + this._id;
});

module.exports = mongoose.model('Customer', CustomerSchema);