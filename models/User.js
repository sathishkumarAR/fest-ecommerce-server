const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique:true
        },
        mobile:{
            type:Number,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required: true
        },
        birthdate:{
            type:String,
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        userType:{
            type:String,
            default:"Consumer",
            required:true
        },
        img:{
            type:String,
            default:"https://res.cloudinary.com/wings05/image/upload/v1625411692/44884218_345707102882519_2446069589734326272_n_u82kmh.jpg"
        },
        address:{
            doorStreet:{type: String},
            district:{type: String},
            state:{type: String},
            pincode:{type: String}
        }
        
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("User",userSchema);