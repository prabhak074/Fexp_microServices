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
      Expense: req.body.exp,
      User:req.body.user,
      Restaurants:req.body.Restaurants,
      Description:req.body.desc,
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
        let Expense = [], user=[],time = [],rest = [],desc = [];
          
        runDocuments.forEach(runDocument => {
          Expense.push(runDocument.Expense);       
          user.push(runDocument.User);
          time.push(runDocument.curTime);
          rest.push(runDocument.Restaurants);
          desc.push(runDocument.Description);
        });
 
        res.send({
          expense:Expense,
          user:user,
          time:time,
          rest:rest,
          desc:desc,
        });

      } else {
        res.send({
          status: "NO_DATA"
        });
      }
    } catch (error) {
      console.log("Error @ summaryRN ==>>", error);
    }
  });


  app.get("/search", async (req, res) => {
    try {
      // let user = req.body.User;         
      let runDocument = await demo_db.collection("expense").find({ User: "Prabhakaran" }).toArray();
      let runDocument1 = await demo_db.collection("expense").find({ User: "Vignesh" }).toArray();

      let prabha = [], vicky=[];
          
        runDocument.forEach(runDocument => {
          prabha.push(runDocument.Expense);       
        });

        runDocument1.forEach(runDocument => {
          vicky.push(runDocument.Expense);       
        });

        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        // console.log(Expense.reduce(reducer));
        let prabexp= (prabha.reduce(reducer));
        let vickyexp= (vicky.reduce(reducer));

        console.log(prabexp,vickyexp)

        res.send({
          prabha:prabexp,vicky:vickyexp
        });

    } catch (error) {
      console.log("Error @ search ==>>", error);
    }
  });