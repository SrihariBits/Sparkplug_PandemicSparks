var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Batches=new mongoose.Schema({
    batchId:String,
    status:String,
    orders:[{orderId:String}],
    event_time: Date
});

module.exports =  mongoose.model('batches', Batches);