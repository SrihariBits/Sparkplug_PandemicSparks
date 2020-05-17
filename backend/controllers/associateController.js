var Associate = require("../public/Models/Associate.js")

var async = require("async");

exports.associate_create_get = function(req, res) {
    
    console.log('Associate GET: Fetching all associates');

    async.parallel({
        'associate': function(callback) {
            Associate.find()
            .exec(callback);
        },

    }, function(err, result) {
        if(err){
            console.log(err);
            return res.json({
                'status': 'failure',
                'message': 'Associate GET: some error occured'
            })
        }

        const res_data = []
        for (x in result.associate) {
            res_data.push(result.associate[x]);
        }

        return res.json(res_data);
    });
}

exports.associate_create_post = function(req, res) {
    
    const req_data = {
        'username': req.body.username,
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'location': req.body.location,
        'is_admin': req.body.is_admin,
    }

    res_data = {}
    res_data['username'] = req_data['username']

    async.parallel({
        'associate': function(callback) {
            Associate.findOne({'username': req_data['username']})
            .exec(callback);
        },

    }, function(err, result) {
        if(err){
            res_data['status'] = "failure";
            res_data['message'] = "Associate POST: some error occured";
            console.log("Associate POST: Some error occured");
            return res.json(res_data);
        }

        if(result.associate != null){
            res_data['status'] = "failure";
            res_data['message'] = "Associate POST: username already exists";
            console.log("Associate POST: Username already exists");
            return res.json(res_data);
        }

        var new_associate = Associate(req_data);
        new_associate.save(function(err, instance) {
            if(err){
                res_data['status'] = "failure";
                res_data['message'] = "Associate POST: some error occured";
                console.log("Associate POST: Some error occured");
                return res.json(res_data);
            }

            else{
                res_data['status'] = "success";
                res_data['message'] = "Associate POST: Associate added successfully";
                console.log("Associate POST: Associate added successfully");
                res.json(res_data);
            }
        })
        
    });
}

exports.associate_delete_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Associate delete GET");
}

exports.associate_delete_post = function(req, res) {
    res.send("NOT_IMPLEMENTED: Associate delete POST");
}

exports.associate_update_get = function(req, res) {
    res.send("NOT_IMPLEMENTED: Associate update GET");
}

exports.associate_update_post = function(req, res) {
    res.send('NOT_IMPLEMENTED: Associate update POST');
}