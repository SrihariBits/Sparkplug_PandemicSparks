var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WalKet=new mongoose.Schema({
    status:String,
    ShipToAddress:{
        address:{
            addressLineTwo:String,
            isPoBox:Boolean,
            city:String,
            countryCode:String,
            addressType:String,
            postalCode:String,
            addressLineOne:String,
            stateOrProvinceCode:String,
            addressLineThree:String
        },
        phone:{
            completeNumber:String,
        },
        name:{
            firstName:String,
            lastName:String,
            completeName:String
        },
        email:{
            emailAddress:String
        }
    },
    orderTotals:{
        grandTotal:{
            currencyAmount:String,
            currencyUnit:String
        }
    },
    orderNo:String,
    products:[
        {
            productId:String,
            description:String,
            unitPrice:{
                currencyAmount:String,
                currencyUnit:String
            },
            orderQuantity: String
        }
    ],
    event_time: Date
});

module.exports =  mongoose.model('walkets', WalKet);