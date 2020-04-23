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

/*mongo.connect('mongodb://raj:raj1@cluster0-shard-00-00-ojo88.gcp.mongodb.net:27017,cluster0-shard-00-01-ojo88.gcp.mongodb.net:27017,cluster0-shard-00-02-ojo88.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{useNewUrlParser:true},function(err){
    if(err)
        console.log(err);
    else {
        var datetime = new Date(Date.now() + 5.5); //offset for IST
        console.log(datetime.toString() + " : connected");
        fs.appendFile("ServerLog.txt", datetime.toString() + " Connected to mongoDB atlas\n",(err)=>{if(err) console.log(err)});
    }
});

var schema1=new mongo.Schema({
                        fname:String,
                        lname:String,
                        email:String,
                        password:String,
                        address:String,
                        city:String,
                        state:String,
                        pincode:Number,
                        mobile:Number,
                        aadhaar:Number
                        });
var customer=mongo.model('customer',schema1);

var schema2=new mongo.Schema({complaintName:String,
                            email:String,
                            pay:Number,
                            type:String,
                            workNature:String,
                            description:String
                            });
var issue=new mongo.model('issue',schema2);

var freelancerSchema=new mongo.Schema({
                                        fname: String,
                                        lname: String,
                                        email: String,
                                        password: String,
                                        address: String,
                                        city: String,
                                        state: String,
                                        mobile: Number,
                                        aadhaar: Number,
                                        pincode: Number
                                      });
var freelancer=new mongo.model('freelancer',freelancerSchema);

var organizationSchema=new mongo.Schema({
                                            name: String,
                                            email: String,
                                            password: String,
                                            headquaters: String,
                                            mobile: Number,
                                            workforce: Number,
                                        });
var organization=new mongo.model('organization',organizationSchema);*/
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