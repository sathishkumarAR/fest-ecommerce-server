const express= require("express");
const router = express.Router();
const { verifyTokenAndAdmin, validateToken, verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const Order = require("../models/Order");

//CREATE
router.post("/", validateToken, async(req,res)=>{

    
    const orderDetails={
        ...req.body,
        userId:req.user.id
    }

    try {
        const createdOrder = new Order(orderDetails);

        await createdOrder.save();

        return res.status(201).json({message:"Order added successfully"});


    } catch (error) {
        return res.status(500).json({error:"Error occurred"});
    }

})


//UPDATE Order
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {new:true}
        )

        if(!updatedOrder)
            return res.status(500).json({error:"Invalid Order to update"})

        res.status(200).json({message:"Order updated successfully"})
        
    } catch (err) {
        res.status(500).json({error:"Unable to process the request. Try again later"})
    }
})

//DELETE Order
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Order deleted successfully"})
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET User Orders
router.get("/find/:id",verifyTokenAndAuthorization,async (req,res)=>{

    try {
        const orders= await Order.find({userId:req.params.id});

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET Orders
router.get("/",verifyTokenAndAdmin,async (req,res)=>{

    

    if(!req.query.new || !req.query.count){
        return res.status(400).json({message:"Please include 'count' and 'new' queries in your request"})
    }
    else if(!(req.query.count>0 && req.query.count <=100)){
        return res.status(400).json({message:"Please provide valid 'count' between 1 and 100"})
    }
    let includeFields;
    if(req.query.include){
        includeFields= req.query.include.replace(/,/g," ")
    }
        

    try {
        const orders = await Order.find().sort({createdAt:req.query.new==="false"?"asc":"desc"}).limit(req.query.count).populate("user","fullname img").select(includeFields);
        
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET ORDER INCOME STATS
router.get("/stats/monthlyrevenue",verifyTokenAndAdmin,async(req,res)=>{

    const date = new Date();
    const previousMonthDate = new Date(date.setMonth(date.getMonth()-1));
    const twoMonthsAgoDate = new Date (date.setMonth(date.getMonth()-1));
//     const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
//   const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    
    try {
        const monthlyIncome = await Order.aggregate([
            {
                $match:{
                    createdAt:{ $gte:twoMonthsAgoDate}
                }
            },
            {
                $project:{
                    month: { $month : "$createdAt" } ,
                    sales: "$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total: {$sum:"$sales"}
                }
            },
            {
                $sort:{
                    _id:1
                }
            }
        ])

        res.status(200).json({"data":monthlyIncome})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})



module.exports= router;
