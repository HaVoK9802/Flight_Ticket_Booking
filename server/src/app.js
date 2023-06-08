const express = require('express')
const app = express();
const path = require('path');
const db = require(path.join(__dirname,"models","userPool.js"));
const bcrypt = require ('bcrypt');
const loginHandle = require(path.join(__dirname,"routes","loginHandle.js"));
const adminRouter = require(path.join(__dirname,"routes","adminRouter.js"));
const userRouter = require(path.join(__dirname,"routes","userRoutes.js"));
app.set("view engine", "ejs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sessionConfig = require(path.join(__dirname,"config","sessionConfig.json"));
app.use(cookieParser());
app.use(session({
    secret: sessionConfig.secret,
    resave: sessionConfig.resave,
    saveUninitialized: sessionConfig.saveUninitialized,
    cookie: sessionConfig.cookie
}));
app.use(loginHandle);
app.use(adminRouter);
app.use(userRouter);





app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("listening on port 3000");
        db.connect((err)=>{
            if(err) {
                console.log(err);
            }
            else{

                console.log("DB connected");
                // bcrypt.hash("yogan", 10, function(err, hash) {
                //     // Store hash in database here
                //     console.log(hash);
                //   });
            }
        });
    }
})