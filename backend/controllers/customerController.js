var Customer = require("../public/Models/Customer.js")

var async = require("async")

exports.customer_create_get = function(req, res) {
    
    console.log('Cusotomer GET: Fetching all customers');

    async.parallel({
        'customer': function(callback) {
            Customer.find()
            .exec(callback);
        },

    }, function(err, result) {
        if(err){
            console.log(err);
            return res.json({
                'status': 'failure',
                'message': 'Customer GET: some error occured'
            })
        }

        const res_data = []
        for (x in result.customer) {
            res_data.push(result.customer[x]);
        }

        return res.json(res_data);
    });
}

exports.customer_create_post = function(req, res) {
    
    const req_data = {
        'username': req.body.username,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'shipping_address': req.body.shipping_address,
    }

    res_data = {}
    res_data['username'] = req_data['username']

    async.parallel({
        'customer': function(callback) {
            Customer.findOne({'username': req_data['username']})
            .exec(callback);
        },

    }, function(err, result) {
        if(err){
            res_data['status'] = "failure";
            res_data['message'] = "Customer POST: some error occured";
            console.log("Customer POST: Some error occured");
            return res.json(res_data);
        }

        if(result.customer != null){
            res_data['status'] = "failure";
            res_data['message'] = "Customer POST: username already exists";
            console.log("Customer POST: Username already exists");
            return res.json(res_data);
        }

        var new_customer = Customer(req_data);
        new_customer.save(function(err, instance) {
            if(err){
                res_data['status'] = "failure";
                res_data['message'] = "Customer POST: some error occured";
                console.log("Customer POST: Some error occured");
                return res.json(res_data);
            }

            else{
                res_data['status'] = "success";
                res_data['message'] = "Customer POST: Customer added successfully";
                console.log("Customer POST: Customer added successfully");
                res.json(res_data);
            }
        })
        
    });

}

exports.customer_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Customer delete GET");
}

exports.customer_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Customer delete POST");
}

exports.customer_update_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Customer update GET");
}

exports.customer_update_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Customer update POST");
}