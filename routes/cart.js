const express= require("express");
const router = express.Router();
const { verifyTokenAndAdmin, validateToken, verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const Cart = require("../models/Cart");

//CREATE
router.post("/", validateToken, async(req,res)=>{

    try {
        const createdCart = new Cart(req.body);
        await createdCart.save();
        return res.status(201).json({message:"Cart added successfully"});


    } catch (error) {
        return res.status(500).json({error:"Error occurred"});
    }

})


//UPDATE Cart
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {new:true}
        )

        if(!updatedCart)
            return res.status(500).json({error:"Invalid Cart to update"})

        res.status(200).json({message:"Cart updated successfully"})
        
    } catch (err) {
        res.status(500).json({error:"Unable to process the request. Try again later"})
    }
})

//DELETE Cart
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{

    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Cart deleted successfully"})
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET User Cart
router.get("/find/:id",verifyTokenAndAuthorization,async (req,res)=>{

    try {
        const cart= await Cart.findOne({userId:req.params.id});

        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET ALL Carts
router.get("/",verifyTokenAndAdmin,async (req,res)=>{

    try {
        const carts = await Cart.find();
        
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
   

})

module.exports= router;
