var Order = require("../public/Models/Order.js");

var async = require("async");

exports.order_create_get = function(req, res) {
    
    console.log("Order GET: Fetching all orders");

    async.parallel({
        'order': function(callback) {
            Order.find()
            .exec(callback);
        },
    }, function(err, result) {
        if(err){
            console.log(err);
            return res.json({
                'status': 'failure',
                'message': 'Order GET: some error occured',
            })
        }

        const res_data = []
        for (x in result.order) {
            res_data.push(result.order[x]);
        }

        return res.json(res_data);
    });
}

exports.order_create_post = function(req, res) {
    
    const req_data = {
        'itemset': req.body.itemset,
        'customerID': req.body.customerID,
    }

    res_data = {}

    var new_order = Order(req_data);
    new_order.save(function(err, instance) {
        if(err){
            res_data['status'] = "failure";
            res_data['message'] = "Order POST: some error occured";
            console.log(err)
            console.log("Order POST: Some error occured");
            return res.json(res_data);
        }

        else{
            res_data['status'] = "success";
            res_data['message'] = "Order POST: Order added successfully";
            console.log("Order POST: Order added successfully");
            return res.json(res_data);
        }
    });
}

exports.order_delete_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Order delete GET");
}

exports.order_delete_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Order delete POST");
}

exports.order_update_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Order update GET");
}

exports.order_update_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Order update POST");
}