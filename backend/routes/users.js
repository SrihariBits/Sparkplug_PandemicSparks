var express = require('express');
var router = express.Router();

var customerController = require("../controllers/customerController");
var associateController = require("../controllers/associateController");

router.get('/customer', customerController.customer_create_get);

router.post('/customer', customerController.customer_create_post);

router.get('/customer/:username', customerController.customer_get_userid);

router.get('/associate', associateController.associate_create_get);

router.post('/associate', associateController.associate_create_post);

router.get('/associate/:username', associateController.associate_get_userid);

module.exports = router;
