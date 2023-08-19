const express= require("express");
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const User = require("../models/User");
const bcrypt = require("bcryptjs")

//UPDATE USER
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    
    if(req.body.password){

        try{
            const hashedString= await bcrypt.hash(req.body.password,12)
            req.body.password=hashedString;
        }
        catch(err){
            return res.status(500).json({error:"Unable to process the request. Try different password"})
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {new:true}
        ).select("-password");

        if(!updatedUser)
            return res.status(500).json({error:"Invalid user to update"})

        res.status(200).json({message:"User updated successfully"})
        
    } catch (err) {
        res.status(500).json({error:"Unable to process the request. Try again later"})
    }
})

//DELETE USER
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET USER
router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        const user= await User.findById(req.params.id).select("-password");
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET ALL USERS
router.get("/",verifyTokenAndAdmin,async (req,res)=>{

    if(!req.query.new || !req.query.count){
        return res.status(400).json({message:"Please include 'count' and 'new' queries in your request"})
    }
    else if(!(req.query.count>0 && req.query.count <=100)){
        return res.status(400).json({message:"Please provide valid 'count' between 1 and 100"})
    }

    try {
        const users= await User.find().sort({createdAt:req.query.new==="false"?"asc":"desc"}).limit(req.query.count).select(`-password -mobile -email -isAdmin -address -birthdate`)
    
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Error occurred. Try again later"})
    }

})


//GET USER STATS
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{

    const date = new Date();
    const lastYearDate = new Date(date.setFullYear(date.getFullYear()-1));

    try {
        
        const data = await User.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:lastYearDate
                    }
                }
            },
            {
                $project:{
                    month:{$month:"$createdAt"}
                }

            },
            {
                $group:{
                    _id:"$month",
                    totalUsers:{$sum:1}
                }
            },
            {
                $sort:{
                    _id:1
                }
            }
        ])

        res.send(data)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Error occurred. Try again later"})
    }



})

module.exports= router;
