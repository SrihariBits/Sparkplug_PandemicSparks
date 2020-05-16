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
let msg;
app.post('/items',(req,res) => {
    /*console.log(req.body.Id);
    readFile('./products/'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        console.log(fileContent);
    })*/
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
        if(data===null){
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


  app.post('/pathmaker',(req,res) => {
    readFile('./public/PathFinding/path.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        var template = {id:"layer2",altitude:0,order:0,opacity:1,name:"layer2",visible:true,vertices:{},lines:{},holes:{},areas:{},items:{},selected:{vertices:[],lines:[],holes:[],areas:[],items:[]}};
        jsonObj.forEach(
            function myfunction(item,index){
                var pathguy={id:"p"+index,type:item.path,prototype:"items",name:"Path",misc:{},selected:false,
                properties:{color:"#9c27b0",width:{length:100,unit:"cm"},height:{length:100,unit:"cm"},
                depth:{length:100,unit:"cm"}},visible:true,x:0,y:0,rotation:0}
                pathguy.x = item.x;
                pathguy.y = item.y;
                size = Object.keys(template.items).length;
                template.items["p"+size] = pathguy;
            }
        )
        res.json({
            data:template
        });
    });
  })
/*
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
*/
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



app.listen(port, () => {
    console.log(`server running on : "http://localhost:${port}"`);
});