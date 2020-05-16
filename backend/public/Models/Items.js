    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var Items=new mongoose.Schema({
    Id:String,
    products:[{productId:String,description:String,unitPrice:String,currencyUnit:String}]
    });

    module.exports =  mongoose.model('Items', Items);