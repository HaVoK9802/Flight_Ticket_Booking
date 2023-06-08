const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const db = require(path.join(__dirname, "..", "models", "userPool.js"));
const bcrypt = require("bcrypt");
const moment = require("moment");
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: false }));



userRouter.get("/user/:id", async (req, res) => {
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
          res.redirect(`/user/${req.params.id}/searchAndBook`);
        }
    }
    );
  });

  userRouter.get("/user/:id/searchAndBook",async(req, res) => {
    if(req.session.loggedIn){
       await db.query("SELECT * FROM flights;",(err,dbres)=>{
           if(err) {
            console.log(err);
          }
          else{
            res.render(path.join(__dirname, "..", "views", "user", "searchAndBook.ejs"), {uid: req.params.id, allFlights:dbres.rows})
          }
       })
    }
    else{
        res.send("User not logged in");
    }
})
userRouter.get("/user/:id/1243",async(req, res) => {
    if(req.session.loggedIn){
       await db.query("SELECT * FROM flights;",(err,dbres)=>{
           if(err) {
            console.log(err);
          }
          else{
            res.render(path.join(__dirname, "..", "views", "user", "searchAndBook.ejs"), {uid: req.params.id, allFlights:dbres.rows})
          }
       })
    }
    else{
        res.send("User not logged in");
    }
})




userRouter.get("/user/:id/getFlightDetails", async (req, res) => {
    // console.log("hello")

    //   res.end("hii");
      await db.query("ALTER SEQUENCE flights_id_seq RESTART WITH 1",(err)=>{
          if(err) {
              console.log(err);
          }
      });
      await db.query("SELECT * FROM flights;",(err, dbres) => {
          if(err){
              // console.log("heeee");
              console.log(err);
          }
          else{
               res.send(dbres.rows)
            //   console.log(dbres.rows);
          }
          
      })

  })
userRouter.post("/user/:id/bookFlight",async(req,res)=>{
    if(req.session.loggedIn){

        db.query("INSERT INTO bookings(user_id,flight_id,flight_number,price) VALUES ($1,$2,$3,$4)",[req.body.userId,req.body.flightId,req.body.flightNumber,req.body.price],
        (err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("Ticket Booked");
                let vcny = 0;
                db.query("SELECT vaccancy FROM flights WHERE id =$1 AND flight_number = $2;",[req.body.flightId,req.body.flightNumber],
                (err,dbres)=>{
                     if(err){
                        console.log(err);
                     }
                     else{

                         vcny = parseInt(dbres.rows[0].vaccancy)+1;

                         db.query("UPDATE flights SET vaccancy=$1 WHERE id =$2 AND flight_number = $3;",[vcny,req.body.flightId,req.body.flightNumber],(err)=>{
                             if(err){
                                 console.log(err);
                             }
                         })
                         
                     }
                })
                
            }
        })
    }
})

module.exports = userRouter;