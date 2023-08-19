const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const OrderSchema = new mongoose.Schema(
    {
        user:{
            type:ObjectId,
            ref:"User",
            required:true
        },
        products:[
            {
                productId:{
                    type:ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ],
        amount:{
            type:Number,
            required:true
        },
        address:{
            doorStreet:{type: String, required:true},
            district:{type: String, required:true},
            state:{type: String, required:true},
            pincode:{type: String, required:true}
        },
        status:{
            type:String,
            default:"pending"
        },
        
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Order",OrderSchema);