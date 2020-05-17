var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AssociateSchema = new Schema({
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
    location: {
        type: String,
        max: [50, "Please use less than 50 words"],
        required: true,
    },
});

AssociateSchema
.virtual('fullname')
.get(function() {
    if(this.last_name)
        return this.first_name + this.last_name;
    else
        return this.first_name;
});

AssociateSchema
.virtual('url')
.get(function() {
    return '/user/associate/' + this._id;
});

module.exports = mongoose.model('Associate', AssociateSchema)