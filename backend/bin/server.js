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
var mongoDB = ""
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//serve react static files.
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    // console.log(req);
    res.send("hi");
});

let jsonObj={};
app.post('/square/A',(req,res) => {
    readFile('./files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        res.send(jsonObj);
    });        
})

app.post('/square/B',(req,res) => {    
    readFile('./files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        jsonObj = csvjson.toObject(fileContent);
        res.json(jsonObj);
    });
           
})

app.post('/square/C',(req,res) => {
    readFile('./files/square_products'+req.body.Id+'.csv', 'utf-8', (err, fileContent) => {
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
    writeFile('./files/warehouse.json', JSON.stringify(req.body.data));
})

app.get('/warehouseLoad',(req,res) => {
    readFile('./files/warehouse.json', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        
        res.send(JSON.stringify(fileContent));
    });  
})

app.listen(port, () => {
    console.log(`server running on : "http://localhost:${port}"`);
});