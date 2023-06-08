const express = require("express");
const adminRouter = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const db = require(path.join(__dirname, "..", "models", "userPool.js"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({ extended: false }));

adminRouter.get("/admin/:id", async (req, res) => {
  await db.query(
    "SELECT firstname,lastname FROM users WHERE id = $1",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        req.session.userId = req.params.id;
        req.session.userName =
          result.rows[0].firstname + " " + result.rows[0].lastname;
        req.session.loggedIn = true;
        req.session.save();
        res.redirect(`/admin/${req.params.id}/addFlights`);
      }
    }
  );
});

adminRouter.get("/admin/:id/addFlights", async (req, res) => {
  if (req.session.loggedIn) {
    await db.query("SELECT * FROM flights;",(err, dbres)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render(path.join(__dirname, "..", "views", "admin", "addFlights.ejs"), {uid: req.params.id, allFlights:dbres.rows});
            // console.log(JSON.stringify(dbres.rows));
        }
    })

  } else {
    res.send("Not Logged In");
  }
});
adminRouter.post("/admin/:id/addFlights", async (req, res) => {
  if (req.session.loggedIn) {
    let flightNumber = req.body.flightNumber;
    let dateOfDeparture = req.body.dateOfDeparture;
    let from = req.body.from;
    let to = req.body.to;
    let arrivalTimeHrs = req.body.arrivalTimeHrs;
    let departureTimeHrs = req.body.departureTimeHrs;
    let arrivalTimeMin = req.body.arrivalTimeMin;
    let departureTimeMin = req.body.departureTimeMin;

    let price = req.body.price;
    let arrivalDate;
    if (parseInt(arrivalTimeHrs) < parseInt(departureTimeHrs)) {
      let date = new Date(dateOfDeparture);
      date.setDate(date.getDate() + 1);
      arrivalDate = date.toISOString().split("T")[0];
    }

    //departure timestamp calc
    let departureDate = moment(dateOfDeparture).set({
      hours: departureTimeHrs,
      minutes: departureTimeMin,
    });
    let departureTimestamp = departureDate.format("YYYY-MM-DD HH:mm:ss");

    //arrival timestamp calc
    let dateOfArrival = moment(arrivalDate).set({
      hours: arrivalTimeHrs,
      minutes: arrivalTimeMin,
    });
    let arrivalTimestamp = dateOfArrival.format("YYYY-MM-DD HH:mm:ss");

    // console.log(departureTimestamp); 
    // console.log(arrivalTimestamp);
    
    db.query("INSERT INTO flights(flight_number,origin,destination,departure_time,arrival_time,price,vaccancy) VALUES($1,$2,$3,$4,$5,$6,$7);",
    [flightNumber,from,to,departureTimestamp,arrivalTimestamp,price,0],(err)=>{
        if(err){
            console.log(err);
        }
    })
  } else {
    res.send("Not Logged In");
  }
});

adminRouter.get('/admin/:id/removeFlights',async(req, res) => {
  if(req.session.loggedIn) {

    await db.query('SELECT * FROM FLIGHTS',(err,dbres)=>{
        if(err){
          console.log(err);
        }
        else{
           res.render(path.join(__dirname,"..","views","admin","removeFlights.ejs"),{userId:req.params.id,allFlights:dbres.rows});
        }
    })

  }
})

adminRouter.post('/admin/:id/removeFlights',async(req, res) => {
  if(req.session.loggedIn){
    await db.query("DELETE FROM flights WHERE id=$1",[req.body.flight_id],(err, result) => {
      if(err) {
        console.log(err)
      }
      else{
        res.json("done");
        console.log("success");
      }
    })
  }
})



module.exports = adminRouter;
