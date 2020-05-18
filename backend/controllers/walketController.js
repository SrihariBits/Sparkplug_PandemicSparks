var Walket = require("../public/Models/WalKet.js");

var async = require("async");

exports.walket_create_get = function(req, res) {
    
    console.log("Walket GET: Fetching all walket transactions");

    async.parallel({
        'walket': function(callback) {
            Walket.find()
            .exec(callback);
        },
    }, function(err, result) {
        if(err) {
            console.log(err);
            return res.json({
                'status': 'failure',
                'message': 'Walket GET: some error occured',
            })
        }

        const res_data = []
        for (x in result.walket) {
            res_data.push(result.walket[x]);
        }

        return res.json(res_data);
    });
}

exports.walket_create_post = function(req, res) {
    
    const req_data = {
        'ShipToAddress': req.body.ShipToAddress,
        'orderTotals': req.body.orderTotals,
        'orderNo': req.body.orderNo,
        'products': req.body.products,
        'event_time': req.body.event_time,
    }

    res_data = {}

    var new_walket = Walket(req_data);
    new_walket.save(function(err, instance) {
        if(err) {
            res_data['status'] = "failure";
            res_data['message'] = "Walket POST: some error occured";
            console.log(err);
            console.log("Walket POST: Some error occured");
            return res.json(res_data);
        }

        else {
            res_data['status'] = "success";
            res_data['message'] = "Walket POST: Walket transaction added successfully";
            console.log("Walket POST: Walket Transaction added successfully");
            return res.json(res_data);
        }
    });
}

exports.walket_delete_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Walket delete GET");
}

exports.walket_delete_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Walket delete POST");
}

exports.walket_update_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Walket update GET");
}

exports.walket_update_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Walket update POST");
}