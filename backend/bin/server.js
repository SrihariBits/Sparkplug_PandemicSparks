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
var productRouter = require("../routes/products");

//////////////////////////////////// LSH CONFIG ///////////////////////////////////////////////////////
const Lsh = require('./../public/lsh/src/index');
const config = {
    storage: 'memory',
    shingleSize: 2,
    numberOfHashFunctions: 120
  }

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
app.use('/products', productRouter);
////////////////////////////// MONGOOSE VARS //////////////////////////////////////////////////////////

var walkets = require('./../public/Models/WalKet');
var items = require('./../public/Models/Items');
var batches = require('./../public/Models/Batches');

//////////////////////////////////// WALKET ORDERS/////////////////////////////////////////////////////

let message=new walkets({
    status:'pending',
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
    orderNo:"1a2b3e",
    products:[
        {
            productId:"PR18ZZY45",
            description:"Salsa Bowls Set",
            unitPrice:{
                currencyAmount:"82.56",
                currencyUnit:"USD"
            },
            orderQuantity:"1"
        },
        {
            productId:"PR14TYZ78",
            description:"Pink Skinless Salmon",
            unitPrice:{
                currencyAmount:"7.92",
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
    items.findOne({'products':{$elemMatch: {productId:req.body.productId}}},function(err,data){
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

///////////////////////////////// GET ORDERS IN FIFO AND BATCHING //////////////////////////////////////

setInterval(()=>{
    var numberToReceive = 10;
    var currentOrders = [];
    var itemToClusters = new Map();
    var distanceVector = [];
    var avgDistance = new Map();
    var hclusterInput = [];
    var orderIDs = new Map();
    var hclustering = require("./../public/SecondaryClustering/HierarchicalClustering");
    const lsh = Lsh.getInstance(config);
    walkets
      .find({status:{ $eq: 'pending' }})
      .sort({'event_time': 1})
      .limit(numberToReceive)
      .exec(function(err, posts) {
        posts.forEach((order)=>{
            currentOrders.push(order);
            order.products.map((item)=>{
                console.log(order.orderNo);
                items
                    .findOne({'products':{$elemMatch: {productId:item.productId}}},function(err,data){
                        if(err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        else if(data===null)
                        {
                            console.log("item with ProductId "+item.productId+"is currently not available in store");
                        }
                        else{
                            var temp = Mapper.get(data.Id);
                            itemToClusters.set(item.productId,temp);
                            if(!avgDistance.has(temp))
                            {
                                //console.log(data);
                                avgDistance.set(temp,[parseInt(data.x),parseInt(data.y),1,temp]);
                                distanceVector.push([parseInt(data.x),parseInt(data.y)]);
                            }
                            else{
                                var a = avgDistance.get(temp);
                                avgDistance.set(temp,[a[0]+parseInt(data.x),a[1]+parseInt(data.y),a[2]+1,a[3]]);
                            }
                        }
                    })
            });
        });
    
        setTimeout(()=>{
            avgDistance.forEach((tuple)=>{
                  hclusterInput.push([tuple[0]/tuple[2],tuple[1]/tuple[2],tuple[3]]);
              });
            var maxDistance = 0;
            distanceVector.map((tuple1)=>{
                distanceVector.map((tuple2)=>{
                maxDistance=Math.max(maxDistance,Math.abs(tuple1[0]-tuple2[0])+Math.abs(tuple1[1]-tuple2[1]));
                })
            })
            console.log('maxDistance: '+maxDistance);
            if(maxDistance>2500)
            {
            var secClusterMap = {};
            var c = hclustering.hierarchicalCluster(hclusterInput, "manhattan", "complete",5000);
            app.get('/cluster',(req,res)=>{res.send(c);})
            console.log('hcluster: '+JSON.stringify(c));
            var cnt=0;
            c.forEach((primary)=>{
                ++cnt;
                function inOrderHelper(root) {
                    if (root.hasOwnProperty("value")) {
                        secClusterMap[root.value[2]]='C'+cnt;
                        return;
                    }
                    inOrderHelper(root.left);
                    if (root.hasOwnProperty("right"))
                        inOrderHelper(root.right);
                }
                inOrderHelper(primary);
            });
            currentOrders.forEach((order)=>{
                var LSHinput = "";
                orderIDs.set(order.orderNo,true);
                order.products.forEach((item)=>{
                    LSHinput=LSHinput+secClusterMap[itemToClusters.get(item.productId)];
                })
                //console.log(LSHinput);
                //console.log(order.orderNo);
                lsh.addDocument(order.orderNo, LSHinput);
                })
            }
            else
            {
                currentOrders.forEach((order)=>{
                    var LSHinput = "";
                    orderIDs.set(order.orderNo,true);
                    order.products.forEach((item)=>{
                        LSHinput=LSHinput+itemToClusters.get(item.productId);
                    })
                    //console.log(LSHinput);
                    lsh.addDocument(order.orderNo, LSHinput);
                })
            }
    
            //console.log(orderIDs);
            var batching = [];
            var singleBatches = [];
            orderIDs.forEach((value,key)=>{
                //console.log('one');
                if(value)
                {
                    var result = lsh.query({id:key,bucketSize:4});
                    result.filter((res)=>orderIDs[res]);
                    //console.log(result.length);
                    if(result.length>=3)
                    {
                        batching.push([result[0],result[1],result[2]]);
                        //console.log(batching);
                        orderIDs.set(result[0],false);
                        orderIDs.set(result[1],false);
                        orderIDs.set(result[2],false);
                    }
                }
            });
            orderIDs.forEach((value,key)=>{
                //console.log('two');
                if(value)
                {
                    var result = lsh.query({id:key,bucketSize:4});
                    if(result.length===1) singleBatches.push(key);
                }
            })
            orderIDs.forEach((value,key)=>{
                //console.log('three');
                if(value)
                {
                    var result = lsh.query({id:key,bucketSize:4});
                    result.filter((res)=>orderIDs[res]);
                    if(result.length==2)
                    {
                        orderIDs.set(result[0],false);
                        orderIDs.set(result[1],false);
                        if(singleBatches.length>0)
                        {
                            orderIDs.set(singleBatches[0],false);
                            batching.push([result[0],result[1],singleBatches[0]]);
                            singleBatches.shift();
                        }
                        else{
                            orderIDs.set(result[0],false);
                            orderIDs.set(result[1],false);
                            batching.push([result[0],result[1]]);
                        }
                    }
                }
            })
            while(true)
            {
                //console.log('four');
                if(singleBatches.length>=3)
                {
                    batching.push([singleBatches[0],singleBatches[1],singleBatches[2]]);
                    singleBatches.shift();
                    singleBatches.shift();
                    singleBatches.shift();
                }
                else if(singleBatches.length>0)
                {
                    batching.push(singleBatches);
                    break;
                }
                else{
                    break;
                }
            }
            console.log('batching: '+batching);
            batching.forEach((batch)=>{
                var tempo = [];
                batch.map((b)=>{
                    tempo.push({orderId:b})
                    console.log(b);
                    walkets
                        .findOne({orderNo:{ $eq: b }},function(err,data){
                            data.status='taken';
                            data.save((err)=>{
                                if(err)console.log(err);
                            });
                        })
                });
                var msg = new batches({
                    status:'pending',
                    orders:tempo,
                    event_time: new Date()
                });
                msg.save();
            })
            },500);
      });
},3000)

//////////////////////////////////// CALL PATH FINDING ALGO ///////////////////////////////////////////
const spawn = require('child_process').spawn;
setTimeout(()=>{
//app.post('/associatefree',(req,res)=>{
    batches.findOne({status:{ $eq: 'pending' }},function(err1,batchdata){
        if(err1)
        {
            console.log(err);
            throw new Error(err);
        }
        else if(batchdata)
        {
            var nodes='';
                batchdata.orders.forEach((orderNo)=>{
                    walkets.findOne({orderNo:{$eq: orderNo.orderId}},function(err2, orderdata){
                        if(orderdata)
                        {
                            orderdata.products.forEach((item)=>{
                                items.findOne({'products':{$elemMatch: {productId:item.productId}}},function(err3,itemdata){
                                    console.log(itemdata);
                                    nodes+=itemdata.x.toString()+','+itemdata.y.toString()+','+orderdata.orderNo+','+item.description+'\n';
                                    //console.log(nodes);
                                })
                            })
                        }  
                    })
                    
                });
            setTimeout(()=>{
                console.log(nodes);
                writeFile('./public/PathFinding/GridsCellsAndAstar/nodeslist.csv', nodes);
                var d = new Date();
            const ls = spawn('python', ['./public/PathFinding/GridsCellsAndAstar/ModScript.py',d.getUTCDate(),[150,50],[1550,150]]);

            ls.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
              });
              
              ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
              });
              
              ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
              });
              batchdata.status='taken';
                batchdata.save((err)=>{
                    if(err)console.log(err);
                });
            },2000);
        }
    });

    //MAKE ASSOCIATE WAIT TILL I SAY READY
},5000)

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
                if(item.x==='left'||item.x==='right'||item.x==='forward'||item.x==='backward')
                {
                    readout.push('turn '+item.x);
                    readout.push('and pick '+item.path+' from second shelf');
                    readout.push(' ');
                    readout.push(' add to order number '+item.y);
                    readout.push(' ');
                }
                else{
                    readout.push(item.path);
                    readout.push(' ');
                }
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
        var username = 'ujjwal';
        var adminTemplate = JSON.parse(JSON.stringify(template));
        adminTemplate.id = req.body.username;
        adminTemplate.name = req.body.username;
        var colour = "#"+((1<<24)*Math.random()|0).toString(16);
        for(let i=0;i<Object.keys(template.items).length;++i)
        {
            adminTemplate.items["p"+i].properties.color=colour;
        }
        console.log(adminTemplate);
        readFile('./public/PathFinding/adminpath.json','utf-8', (err, fileContent) => {
            if(err){
                console.log(err);
                throw new Error(err);
            }
            else{
                fileContent=JSON.parse(fileContent)
                var justforgag={...fileContent.layers,[req.body.username]:adminTemplate};
                fileContent.layers=justforgag;
                console.log(fileContent);
                writeFile('./public/PathFinding/adminpath.json',JSON.stringify(fileContent));
            }
        });
        
        res.json({
            data:template,
            readout:readout
        });
    });
  })

///////////////////////////////////// SHOWING ADMIN PATH ///////////////////////////////////////////////

app.post('/adminmaker',(req,res) => {
    readFile('./public/PathFinding/adminpath.json','utf-8',(err, fileContent) => {
        if(err) {
            console.log(err);
            throw new Error(err);
        }
        var dat = JSON.parse(fileContent);
        res.json({
            data:dat
        })
  })
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

////////////////////////////// UPDATING CELL COORDS IN DB ON CHANGE ///////////////////////////////////

app.get('/updateCellCoords',(req,res) => {
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
                items.findOne({Id:dat.layers[property].items[hash].id},function(err,doc){
                    //console.log("val:"+dat.layers[property].items[hash].id);
                    if(doc===null)
                    {
                        console.log("No item : "+dat.layers[property].items[hash].id);
                    }
                    else{
                        doc.x=(Math.floor((dat.layers[property].items[hash].x+1)/10)*10).toString();
                        doc.y=(Math.floor((dat.layers[property].items[hash].y+1)/10)*10).toString();
                        doc.save(function(err){
                            console.log(err);
                        });
                    }
                    
                });
            coords=[...coords,...[{x:dat.layers[property].items[hash].x,y:dat.layers[property].items[hash].y}]];
            }
        }
    });
});

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