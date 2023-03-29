var express = require('express');
var pool = require('../DataBase/db')
var router = express.Router()
var queries = require("../DataBase/queries.js")
const userModel = require('../MongoModels/usersModel')
// const bcrypt = require("bcrypt.js")

router.post('/user/registeration', async (req,res)=>{

     let {firstname,lastname,mobile,email,password,city,type,username,sports} = req.body
     let [interest1,interest2,interest3] = [...sports]
     try{
        let usercheck = await pool.query(queries.checkuser,[email])     
         if (usercheck[0].length >0){
            res.status(403).send("User Exists")
         }else{
            let result = await pool.query(queries.addNewUser,[firstname,lastname,mobile,email,password,city,type,interest1,interest2,interest3])
            console.log(result)
            let contacts = []
            const user = await userModel.create({
                firstname,
                lastname,
                email,
                contacts
            })
            res.status(200).send("Success")
         }
     }
     catch(err){
        console.log(err)
}}
)

router.post('/user/login',async (req,res)=>{
    console.log(req.body)
    let {email,password} = req.body
    
    try{
        let authuser = await pool.query(queries.authuser,[email,password])
        if (authuser[0].length >0){
            let details = {...authuser[0][0]}
            delete details.password
            res.status(200).send({status:"Authenticated",details:details})
        }else{
            res.status(401).send("Unauthorized User")
        }
        
    }catch(err){
      console.log(err)
    }
})

module.exports = router