var express = require('express');
var router = express.Router();

var productController = require("../controllers/productController");
var orderController = require("../controllers/orderController");
var walketController = require("../controllers/walketController");

router.get('/product', productController.product_create_get);

router.post('/product', productController.product_create_post);

router.get('/order', orderController.order_create_get);

router.post('/order', orderController.order_create_post);

router.get('/order/:username', orderController.customer_order_get);

router.get('/walket', walketController.walket_create_get);

router.post('/walket', walketController.walket_create_post);

module.exports = router;