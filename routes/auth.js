const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


//REGISTER
router.post("/register", (req, res) => {



    bcrypt.hash(req.body.password, 12)
        .then(async (hashedPass) => {

            const newUser = new User({
                ...req.body,
                password: hashedPass
            })

            try {
                const user= await newUser.save();

                const token = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                },
                process.env.JWT_SEC, {
                    expiresIn: "5d"
                })


                res.status(201).json({
                    fullname:user.fullname,
                    isAdmin:user.isAdmin,
                    id:user._id,
                    address:user.address,
                    token
                })

            } catch (error) {
                
                res.status(500).send("Error while registering the user. Try again after some time")
                console.log(error)
            }
        })
        .catch(err => {
            res.status(500).send("Error occurred")
            return;

        })
})

router.post("/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.findOne({"email": email})
                                .select("fullname password isAdmin address")

        if (user) {
            const isMatching = await bcrypt.compare(password, user.password);

            if (isMatching) {

                const token = jwt.sign({
                        id: user._id,
                        isAdmin: user.isAdmin
                    },
                    process.env.JWT_SEC, {
                        expiresIn: "5d"
                    })

                res.json({
                    fullname:user.fullname,
                    isAdmin:user.isAdmin,
                    id:user._id,
                    address:user.address,
                    token
                })

            } else {
                res.status(401).send("Invalid email or password")
            }

        } else {
            res.status(401).send("Invalid email or password")
        }
    } catch (err) {
        console.log(err)
        res.status(404).send("Error occurred")
        return;
    }
})


const fetchUserDetails=(req,res,next)=>{

    const auth =req.headers.authorization

    if(!auth){
       return res.status(402).json({error:"You must login to proceed"})
    }

    const token = auth.replace("Bearer ","");

    jwt.verify(token,process.env.JWT_SEC, (err,payload)=>{
        if(err)
            return res.status(401).json({error:"Token error. Login again to proceed"})
        
        res.status(200).json(payload)
    })

}

module.exports = router