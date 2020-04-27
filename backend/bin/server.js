const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
//const mongo = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const csvjson = require('csvjson');
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFileSync;

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://daksh:daksh@cluster0-rzpnp.mongodb.net/walmartsparkplug?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function(){  
    var datetime = new Date(Date.now() + 5.5);
    console.log("Mongoose default connection is open at: "+datetime.toString());
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
        module.exports.Collection = names;
    });
 });

//serve react static files.
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    // console.log(req);
    res.send("hi");
});

var items = require('./../public/Models/Items');
let msg = new items({
    Id: "iIBYMZGPg",
    products:[{productId:"PR12ERT45",description:"Avian Mineral Water",currencyAmount:"4.99",currencyUnit:"USD"},
              {productId:"PR45GHT98",description:"Tide Detergent",currencyAmount:"7.99",currencyUnit:"USD"}]
  })
app.post('/items',(req,res) => {
    items.findOne({Id:req.body.Id},function(err,data){
        if(data===null){
            msg.save();
            res.json({    
                present:false
            });
        }
        else{
            res.json({
                products:data.products,
                present:true
            });
        }
    });
  })




let jsonObj={};
app.post('/square/A',(req,res) => {
    readFile('./../frontend/files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        res.send(jsonObj);
    });        
})

app.post('/square/B',(req,res) => {    
    readFile('./../frontend/files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        res.json(jsonObj);
    });
           
})

app.post('/square/',(req,res) => {
    readFile('./../frontend/files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        res.send(jsonObj);
    });  
})

app.post('/warehouseSave',(req,res) => {
    console.log(req.body.data);
    writeFile('./../frontend/files/warehouse.json', JSON.stringify(req.body.data));
})

app.get('/warehouseLoad',(req,res) => {
    readFile('./../frontend/files/warehouse.json', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        
        res.send(JSON.stringify(fileContent));
    });  
})

app.get('/gridLocation',(req,res)=>{
    readFile('./../frontend/files/warehouse.json', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }

        var coords=[];
        var dat = JSON.parse(fileContent);
        for(const property in dat.layers)
        {
            for(const hash in dat.layers[property].items)
            {
            coords=[...coords,...[{x:dat.layers[property].items[hash].x,y:dat.layers[property].items[hash].y}]];
            }
        }
        console.log(coords);
        res.send(fileContent);
    });
})



app.listen(port, () => {
    console.log(`server running on : "http://localhost:${port}"`);
});