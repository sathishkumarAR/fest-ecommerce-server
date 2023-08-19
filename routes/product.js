const express= require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const Product = require("../models/Product");
const cloudinary= require("../cloudinary")

//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async(req,res)=>{

    try {
        const createdProduct = new Product(req.body);

        await createdProduct.save();

        return res.status(201).json({message:"Product added successfully"});


    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Error occurred"});
    }

})

//UPLOAD IMAGE TO CLOUDINARY
router.post("/image",verifyTokenAndAdmin,async(req,res)=>{
    const base64Img = req.body.image;

    const uploadOptions={
        resource_type:"image",
        upload_preset:"ecommerce-fest"
    }
    try {
        const uploadedImage= await cloudinary.uploader.upload(base64Img,uploadOptions);
        return res.status(200).json(uploadedImage.secure_url);
        
    } catch (error) {
        return res.status(500).json({error:"Error while uploading image to cloud"})
    }

})

//UPDATE PRODUCT
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {new:true}
        )

        if(!updatedProduct)
            return res.status(500).json({error:"Invalid Product to update"})

        res.status(200).json({message:"Product updated successfully"})
        
    } catch (err) {
        res.status(500).json({error:"Unable to process the request. Try again later"})
    }
})

//DELETE PRODUCT
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    console.log(req.params.id)
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Product deleted successfully"})
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET PRODUCT
router.get("/find/:id",async (req,res)=>{

    try {
        const product= await Product.findById(req.params.id);
        
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({error:"Error occurred. Try again later"})
    }
})

//GET ALL PRODUCTS
router.get("/",async (req,res)=>{

    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(10);
        } else if (qCategory) {
            products = await Product.find({
            categories: {
            $in: [qCategory],
            },
        });
        } else {
        products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }

})

module.exports= router;
