var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require("mongodb").MongoClient;

// var url ="mongodb://admin:passme123@ec2-52-53-142-129.us-west-1.compute.amazonaws.com:27017/admin?authSource=admin";
// var url = "mongodb+srv://batman:joker007@cluster0-0wihs.mongodb.net/test?retryWrites=true&w=majority";
var url = "mongodb://localhost:27017/";


const dbName = 'demo';

app.get("/load-data", function(req, res, next) {
  console.log("I am here");
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    // var query = { address: /^S/ };
    dbo.collection("expense").find({}, async function (err, doc) {
			if (err) throw err;
			let temp = await doc.toArray();
			let temp_res = temp.reverse()
			let prabha = [],vicky = [],time = [];

      temp_res.forEach(tempobj => {
				prabha.push(tempobj.Prabhakaran);
				vicky.push(tempobj.vicky);
				time.push(tempobj.curTime);
			});

      console.log("prabha =>",prabha)
      console.log("vicky =>",vicky)
      console.log("time =>",vicky)


        // console.log(res);
        res.send({prabha:prabha,vicky:vicky,time:time});
      });
  });
});

app.post("/insert", function(req, res, next) {
  var item = {
    Prabhakaran: req.body.exp1,
    // vicky: req.body.exp2,
    curTime: req.body.curTime,
    };
    console.log(item)
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("expense").insertOne(item, function(err, res) {
      if (err) throw err;
      console.log("data inserted!!!");
    
    });
  });
});


app.listen(port, () => {
    console.log("Server listening on port " + port);
  });