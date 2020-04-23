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

app.listen(port, () => {
    console.log(`server running on : "http://localhost:${port}"`);
});