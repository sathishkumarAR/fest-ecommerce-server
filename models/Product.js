const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: true,
            unique:true
        },
        subtitle:{
            type:String,
            required: true,
        },
        desc:{
            type:String,
            required: true
        },
        img:{
            type:String,
            required: true
        },
        categories:{
            type:Array,
            required: true
        },
        sizes:{
            type:Array
        },
        colors:{
            type:Array
        },
        MRP:{
            type:Number,
            required: true
        },
        sellingPrice:{
            type:Number,
            required: true
        },
        stock:{
            type:Number,
            required: true
        },
        status:{
            type:String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Product",ProductSchema);