const express = require('express');
const loginRoute = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const db = require(path.join(__dirname,"..","models","userPool.js"));
const bcrypt = require('bcrypt');

loginRoute.use(bodyParser.json());
loginRoute.use(bodyParser.urlencoded({extended:false}))


loginRoute.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,"..","views","login.html"));
})

loginRoute.get('/signup', (req, res)=>{
    res.sendFile(path.join(__dirname,"..","views","user","signup.html"))
})

loginRoute.post('/signup', async (req, res)=>{
    await db.query("SELECT password,id FROM users WHERE email = $1",[req.body.email],(err,dbres1)=>{
        if(err){
            console.log(err);
        }
        else{
            if(dbres1.rows.length==1){
                console.log("email already exists")
            }
            else{
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                     
                     db.query("INSERT INTO users (firstname,lastname,dob,email,password) VALUES($1,$2,$3,$4,$5);",[req.body.firstname,req.body.lastname,req.body.dob,req.body.email,hash],
                     (err)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                             db.query("SELECT password,id FROM users WHERE email = $1",[req.body.email],(err,dbres1)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{

                                         bcrypt.compare(req.body.password,dbres1.rows[0].password,(err,result)=>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                if(result){
                        
                                                    db.query("SELECT id FROM admin WHERE user_id = $1",[dbres1.rows[0].id],(err,dbres2)=>{
                                                       if(err){
                                                           console.log(err);
                                                       }
                                                       else{
                                                           if(!dbres2 || !dbres2.rows || dbres2.rows.length === 0){
                                                            // console.log(dbres1.rows[0].id);
                                                            res.redirect(`/user/${dbres1.rows[0].id}`);
                                                               
                                                           }
                                                           else{
                                                            // console.log("/admin/${dbres1.rows[0].id}")
                                                            res.redirect(`/admin/${dbres1.rows[0].id}`);
                                                           }
                                                       }
                                                    })
                                                }
                                            }
                                        })
                                    
                                }
                             })
                        
                        }
                     });
                  });
            }
        }
    });
})

loginRoute.post('/login', async (req, res)=>{

     
     await db.query("SELECT password,id FROM users WHERE email = $1",[req.body.email],(err,dbres1)=>{
        if(err){
            console.log(err);
        }
        else{
            if(dbres1.rows.length==0){
                console.log("invalid credentials");
            }
            else{
                 bcrypt.compare(req.body.password,dbres1.rows[0].password,(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(result){

                            db.query("SELECT id FROM admin WHERE user_id = $1",[dbres1.rows[0].id],(err,dbres2)=>{
                               if(err){
                                   console.log(err);
                               }
                               else{
                                   if(!dbres2 || !dbres2.rows || dbres2.rows.length === 0){
                                    res.redirect(`/user/${dbres1.rows[0].id}`);
                                       
                                   }
                                   else{
                                    // console.log("/admin/${dbres1.rows[0].id}")
                                    res.redirect(`/admin/${dbres1.rows[0].id}`);
                                   }
                               }
                            })
                        }
                        else{
                            console.log("Invalid credentials");
                        }
                    }
                })
            }
        }
     })

})

module.exports = loginRoute;