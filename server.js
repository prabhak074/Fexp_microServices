var express = require("express");
var app = express();
const PORT = process.env.PORT || 5000 ;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require("mongodb").MongoClient;

var url = "mongodb+srv://batman:joker007@cluster0-0wihs.mongodb.net/test?retryWrites=true&w=majority";


var mongo_client,demo_db;
MongoClient.connect(url,{useUnifiedTopology: true },function(err, client) {
    mongo_client = client;
    demo_db = client.db("demo");
 
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
    });
  }
);


app.post("/insert", async (req, res) => {
  try {
    let item = {    
      Prabhakaran: req.body.exp1,
      curTime: req.body.curTime,
      };
    if (item !== undefined) {
      demo_db.collection("expense").insertOne(item, function(err, res) {
        if (err) throw err;
        console.log("data inserted!!!");
      });
   
    } else {
      res.send({ status: "ERROR" });
    }
  } catch (error) {
    console.log("Error @ insert ==>>", error);
  }
});


  app.get("/summary", async (req, res) => {
    try {
      let sort = { _id: -1 };
      let runDocuments = await demo_db.collection("expense").find().sort(sort).limit(30).toArray();
      if (runDocuments !== null) {
        let prabha = [], time=[];
          
        runDocuments.forEach(runDocument => {
          prabha.push(runDocument.Prabhakaran);
          time.push(runDocument.curTime);
        });
  
        res.send({prabha:prabha,time:time});

      } else {
        res.send({
          status: "NO_DATA"
        });
      }
    } catch (error) {
      console.log("Error @ summaryRN ==>>", error);
    }
  });