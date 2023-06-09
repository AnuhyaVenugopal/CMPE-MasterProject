var express = require('express');
var pool = require('../DataBase/db')
var router = express.Router()
var queries = require("../DataBase/queries.js")
const userModel = require('../MongoModels/usersModel')

router.post("/getProfile", async (req, res) => {

    let {email} = req.body
        
    try {
        console.log(email)
        let data = await pool.query(queries.checkuser, [email])
        res.send(data[0][0]).status(200)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post("/updateProfile", async (req, res) => {

    let {firstname,lastname,mobile,city,interests1,interests2,interests3,photo,dob,id} = req.body
    console.log(firstname,lastname,mobile,city,interests1,interests2,interests3,photo,dob,id)
    try{
        let result = await pool.query(queries.updateProfile,[firstname,lastname,mobile,city,interests1,interests2,interests3,photo,dob,id])
           res.status(200).send("Success")
    }
    catch(err){
       console.log(err)
}})

router.post("/addReview",async (req,res)=>{
    let {toUserId,fromUserId,rating,reviewText} = req.body
    let reviewDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try{
        let result = await pool.query(queries.addUserReview,[toUserId,fromUserId,rating,reviewText,reviewDate])
        res.status(200).send("Success")
    }
    catch(err){
        console.log(err)
    }
})
router.post("/getReviews",async(req,res)=>{
    let {toUserId} = req.body
    try{
        let result = await pool.query(queries.getUserReviews,[toUserId])
        res.send(result[0]).status(200)
    }
    catch(err){
            console.log(err)
            res.send(err)
    }
})

module.exports = router