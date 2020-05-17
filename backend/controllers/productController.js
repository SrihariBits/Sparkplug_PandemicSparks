var Product = require("../public/Models/Product.js")

var async = require("async");

exports.product_create_get = function(req, res) {
    
    console.log("Product GET: Fetching all products");

    async.parallel({
        'product': function(callback) {
            Product.find()
            .exec(callback);
        },

    }, function(err, result) {
        if(err){
            console.log(err);
            return res.json({
                'status': "failure",
                'message': "Product GET: some error occured"
            })
        }

        const res_data = []
        for (x in result.product) {
            res_data.push(result.product[x]);
        }

        return res.json(res_data);
    });
}

exports.product_create_post = function(req, res) {
    
    const req_data = {
        'productID': req.body.productID,
        'description': req.body.description,
        'unitPrice': req.body.unitPrice,
        'currencyUnit': req.body.currencyUnit,
    }

    res_data = {}
    res_data['productID'] = req_data['productID'];

    async.parallel({
        'product': function(callback) {
            Product.findOne({'productID': req_data['productID']})
            .exec(callback);
        }
    }, function(err, result) {
        if(err){
            res_data['status'] = "failure";
            res_data['message'] = "Product POST: some error occured";
            console.log("Product POST: Some error occured");
            return res.json(res_data);
        }

        if(result.product != null){
            res_data['status'] = "failure";
            res_data['message'] = "Product POST: product already exists";
            console.log("Product POST: product already exists");
            return res.json(res_data);
        }

        var new_product = Product(req_data);
        new_product.save(function(err, instance) {
            if(err){
                res_data['status'] = "failure";
                res_data['message'] = "Product POST: Some error occured";
                console.log("Product POST: Some error occured");
                return res.json(res_data);
            }

            else{
                res_data['status'] = "success";
                res_data['message'] = "Product POST: Product added successfully";
                console.log("Product POST: Product added successfully");
                return res.json(res_data);
            }
        });
    });
}

exports.product_delete_get = function(req, res) {
    return res.send("NOT_IMPLEMENTED: Product delete GET");
}

exports.product_delete_post = function(req, res) {
    return res.send("NOT_IMPLEMENTED: Product delete POST");
}

exports.product_update_get = function(req, res) {
    return res.send("NOT_IMPLEMENTED: Product update GET");
}

exports.product_update_post = function(req, res) {
    return res.send("NOT_IMPLEMENTED: Product update POST");
}