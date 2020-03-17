var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://admin:passme123@ec2-52-53-142-129.us-west-1.compute.amazonaws.com:27017/admin?authSource=admin";

const dbName = "run_results";

//to view the entire json doc in a perfect manner
app.get("/demo", function (req, res, next) {
  MongoClient.connect(url,{ useUnifiedTopology: true } , function (err, db) {
    if (err) throw err;
    var dbo = db.db("user_database");
    dbo.collection("userData").find({})
      .toArray(function (err, data) {
        if (err) throw err;
        // console.log(res);
        res.send(data);
      });
      console.log("Task Accomplished @ demo!!!!!!!!!")
  });
});

app.post("/login", function (req, res, next) {
  var name = req.body.Username
  var pass = req.body.Password
  // console.log(name,">>>>",pass)
  MongoClient.connect(url,{ useUnifiedTopology: true } , function (err, db) {
    if (err) throw err;

    var dbo = db.db("user_database");
    dbo.collection('userData').findOne({}, function (err, doc) {
      if (err) throw err;
      var indicator;
      for (var temp in doc.userList) {
        if (doc.userList[temp].userName == name) {
          if (doc.userList[temp].passWord == pass) {
            // console.log(">>>>", doc.userList[temp].userName);
            // console.log(">>>>", doc.userList[temp].passWord);
            indicator = "Approved";
          }
        }
      }
      if(indicator == "Approved"){
        res.send({ "data":"Approved"})
      }
      else{
        res.send({ "data": "Declined" })
        
      }
    });
  });

});

app.get("/summary", function (req, res, next) {
	MongoClient.connect(url,{ useUnifiedTopology: true } , function (err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("run_results").find({}, async function (err, doc) {
			if (err) throw err;
			var temp = await doc.toArray();
			var temp_res = temp.reverse()
			var arr_id = [];
			var arr_total = [];
			var arr_duration = [];
			var arr_status = [];
			var pass = [];
			var fail = [];
			var temp_arr_id = [];
			var temp_arr_total = [];
			var temp_arr_duration = [];
			var temp_arr_status = [];
			var temp_status = [];
			var data = [];
			var pass = []
			var fail = []
			var temp_arr = [];
      var temp_arr2 = [];
      var j, k, i;
			var Pass = 0,
        Fail = 0;

			temp_res.forEach(tempobj => {
				temp_arr_id.push(tempobj._id);
				temp_arr.push(tempobj.rundetails);
				temp_arr2.push(tempobj.rundata);
			});

			temp_arr.forEach(temp => {
				temp_arr_total.push(temp.Total);
				temp_arr_duration.push(temp.Duration);
				temp_arr_status.push(temp.Status);
			});

			temp_arr2.forEach(temp => {
				temp.forEach(temp2 => {
					temp_status.push(temp2.Status)
				});
			});

			for (i = 0; i < 20; i++) {
				arr_id.push(temp_arr_id[i]);
				arr_total.push(temp_arr_total[i]);
				arr_duration.push(temp_arr_duration[i]);
				arr_status.push(temp_arr_status[i]);
			}


			for (i = 0; i < temp_arr_total.length;) {
				for (j = 0; j <= temp_status.length;) {
					for (k = 0; k <= temp_arr_total[i]; k++) {
						if (k == temp_arr_total[i]) {
							for (var x = 0; x < data.length; x++) {
								if (data[x] == "Pass") {
									Pass++
								} else if (data[x] == "Fail") {
									Fail++
								}
							}
							pass.push({
								x: temp_arr_id[i],
								y: Pass
							})
							fail.push({
								x: temp_arr_id[i],
								y: Fail
							})
							Pass = 0, Fail = 0;
							data = []
							i++
							k = 0
						}
						data.push(temp_status[j])
						j++
					}
				}
      }
      
      res.send({
                  pass: pass,
                  fail: fail,
                  RunId: arr_id,
                  Status: arr_status,
                  Duration: arr_duration,
                  Total:   arr_total
                });
		});
  });

});

app.post("/pieGraph", function (req, res, next) {
  MongoClient.connect(url, { useUnifiedTopology: true } ,function (err, db) {
    if (err) throw err;
    var dbo = db.db("run_results");
    var runID = req.body.RunID;
    // console.log("req =>", runID);
    dbo.collection("run_results").find({ _id: runID }).toArray(function (err, doc) {
      if (err) throw err;
      var temp_arr = [];
      var temp_arr2 = [];
      var total = [];
      var status = [];
      var id = [];
      var data = [];
      var pass = [];
      var fail = [];
      var time = [];
      var duration = [];
      var name = [];
      var status = [];

      var j, k, i;
      var Pass = 0,
        Fail = 0;
      doc.forEach(temp => {
        id.push(temp._id);
        temp_arr.push(temp.rundetails);
        temp_arr2.push(temp.rundata);
      });
      temp_arr.forEach(temp => {
        total.push(temp.Total);
      });
      temp_arr2.forEach(temp => {
        temp.forEach(temp2 => {
          name.push(temp2.Testcasename);
          status.push(temp2.Status);
          time.push(temp2.Starttime);
          duration.push(temp2.Duration);
        });
      });
      for (i = 0; i < total.length;) {
        for (j = 0; j <= status.length;) {
          for (k = 0; k <= total[i]; k++) {
            if (k == total[i]) {
              for (var x = 0; x < data.length; x++) {
                if (data[x] == "Pass") {
                  Pass++;
                } else if (data[x] == "Fail") {
                  Fail++;
                }
              }
              // console.log("Pass =>", Pass)
              // console.log("Fail =>", Fail)

              pass.push(Pass);
              fail.push(Fail);
              (Pass = 0), (Fail = 0);
              data = [];
              i++;
              k = 0;
            }
            data.push(status[j]);
            j++;
          }
        }
      }

      // res.send({ pass: pass, fail: fail});
      res.send({
        pass: pass,
        fail: fail, name: name,
        status: status, time: time,
        duration: duration
      });
    });
  });

});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});