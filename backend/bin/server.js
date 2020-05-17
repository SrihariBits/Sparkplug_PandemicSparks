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

var userRouter = require("../routes/users");

////////////////////////////////////// MONGOOSE CONNECTION /////////////////////////////////////////////
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
app.use('/user', userRouter);
////////////////////////////// MONGOOSE VARS //////////////////////////////////////////////////////////

var walkets = require('./../public/Models/WalKet');
var items = require('./../public/Models/Items');

//////////////////////////////////// WALKET ORDERS/////////////////////////////////////////////////////

let message=new walkets({
    ShipToAddress:{
        address:{
            addressLineTwo:"chennai,TN",
            countryCode:"TN",
            addressType:"Residential",
            postalCode:"600020",
            addressLineOne:"1/23 Adyar"
        },
        phone:{
            completeNumber:"1234567899"
        },
        name:{
            firstName:"John",
            lastName:"Doe",
            completeName:"John Doe"
        },
    },
    orderTotals:{
        grandTotal:{
            currencyAmount:"100",
            currencyUnit:"USD"
        }
    },
    orderNo:"1a2b3c",
    products:[
        {
            productId:"dYL1dFxQu",
            description:"Frozen II Blue Ray",
            unitPrice:{
                currencyAmount:"24.96",
                currencyUnit:"USD"
            },
            orderQuantity:"2"
        }
    ],
    event_time: new Date()
});

walkets.findOne({orderNo:message.orderNo},function(err,data){
    if(data===null)
    {
        message.save();
    }
});

///////////////////////////////////////////// PRIMARY CLUSTERING /////////////////////////////////////////////////

var Mapper = new Map();
if(Mapper.size===0)
{
    readFile('./products/others/Mapper.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        jsonObj.forEach((item)=>Mapper.set(item.hash,item.assignment));
    });
}
app.post('/findPrimaryCluster',(req,res) => {
    items.findOne({'items.products':{$elemMatch: {productId:req.body.productId}}},function(err,data){
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        else if(data===null){
            res.json({    
                present:false
            });
        }
        else{
            res.json({
                cluster:Mapper.get(data.Id),
                present:true
            });
        }
    });
  })
///////////////////////////////// SECONDARY CLUSTERING ////////////////////////////////////////////////

 var hclustering = require("./../public/SecondaryClustering/HierarchicalClustering");
 //var c = hclustering.hierarchicalCluster(colors, "manhattan", "complete",50);
 //console.log(JSON.stringify(c));
 app.get('/cluster',(req,res)=>{
     //res.send(c);
 })
//////////////////////////////////////// CELL's ITEMS /////////////////////////////////////////////////

let msg;
app.post('/items',(req,res) => {
    readFile('./products/'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        console.log(jsonObj);
        msg = new items({Id:req.body.Id,products:jsonObj});
        console.log(msg);
    });
    items.findOne({Id:req.body.Id},function(err,data){
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        else if(data===null){
            msg.save();
            res.json({    
                present:false,
                products:msg.products
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

//////////////////////////////// SHOWING ASSOCIATE PATH ///////////////////////////////////////////////

  app.post('/pathmaker',(req,res) => {
    readFile('./public/PathFinding/path.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        var template = {id:"layer2",altitude:0,order:0,opacity:1,name:"layer2",visible:true,vertices:{},lines:{},
                        holes:{},areas:{},items:{},selected:{vertices:[],lines:[],holes:[],areas:[],items:[]}};
        var direction = 'north';
        var pathtype ;
        var readout = [];
        jsonObj.forEach(
            function myfunction(item,index){
                readout.push(item.path);
                readout.push(' ');
                switch(item.path) {
                    case 'straight':
                        switch(direction){
                            case 'north': pathtype = 'pathVT';break;
                            case 'south': pathtype = 'pathVT';break;
                            case 'east': pathtype = 'pathHZ';break;
                            case 'west': pathtype = 'pathHZ';break;
                            default: pathtype = 'pathHZ';
                        }
                        break;
                    case 'left':
                        switch(direction){
                            case 'north': direction = 'west';pathtype = 'pathNW';break;
                            case 'south': direction = 'east';pathtype = 'pathSE';break;
                            case 'east': direction = 'north';pathtype = 'pathSW';break;
                            case 'west': direction = 'south';pathtype = 'pathNE';break;
                            default: pathtype = 'pathHZ';
                        }
                        break;
                    case 'right':
                        switch(direction){
                            case 'north': direction = 'east';pathtype = 'pathNE';break;
                            case 'south': direction = 'west';pathtype = 'pathSW';break;
                            case 'east': direction = 'south';pathtype = 'pathNW';break;
                            case 'west': direction = 'north';pathtype = 'pathSE';break;
                            default: pathtype = 'pathHZ';
                        }
                        break;
                    case 'reverse':
                        switch(direction){
                            case 'north': direction = 'south';pathtype = 'pathVT';break;
                            case 'south': direction = 'north';pathtype = 'pathVT';break;
                            case 'east': direction = 'west';pathtype = 'pathHZ';break;
                            case 'west': direction = 'east';pathtype = 'pathHZ';break;
                            default: pathtype = 'pathHZ';
                        }
                        break;
                    default:
                      pathtype = 'pathHZ'
                } 
                var pathguy={id:"p"+index,type:pathtype,prototype:"items",name:"Path",misc:{},selected:false,
                properties:{color:"#9c27b0",width:{length:100,unit:"cm"},height:{length:100,unit:"cm"},
                depth:{length:100,unit:"cm"}},visible:true,x:0,y:0,rotation:0}
                pathguy.x = item.x;
                pathguy.y = item.y;
                size = Object.keys(template.items).length;
                template.items["p"+size] = pathguy;
            }
        )
        res.json({
            data:template,
            readout:readout
        });
    });
  })

//////////////////////////////////// WAREHOUSE STUFF //////////////////////////////////////////////////

app.post('/warehouseSave',(req,res) => {
    console.log(req.body.data);
    writeFile('./../frontend/files/warehouse.json', JSON.stringify(req.body.data));
})

app.post('/delete',(req,res) => {
    console.log(req.body.Id);
    readFile('./../frontend/files/warehouse.json', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }

        var dat = JSON.parse(fileContent);
        for(const property in dat.layers)
        {
            delete dat.layers[property].items[req.body.Id];
        }
        
        writeFile('./../frontend/files/warehouse.json', JSON.stringify(dat));
        res.json({
            deleted:true
        })
    });

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

////////////////////////////// PRINTING CELL COORDS INTO FILE /////////////////////////////////////////

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
        writeFile('./public/PathFinding/gridLocation.csv', JSON.stringify(coords));
        res.send(fileContent);
    });
})

///////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`server running on : "http://localhost:${port}"`);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////