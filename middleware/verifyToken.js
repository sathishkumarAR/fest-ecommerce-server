const jwt= require("jsonwebtoken")


const validateToken=(req,res,next)=>{

    const auth =req.headers.authorization

    if(!auth){
       return res.status(402).json({error:"You must login to proceed"})
    }

    const token = auth.replace("Bearer ","");

    jwt.verify(token,process.env.JWT_SEC, (err,payload)=>{
        if(err)
            return res.status(401).json({error:"Token error. Login again to proceed"})
        
        req.user= payload;
        next();
    })

}

const verifyTokenAndAuthorization= (req,res,next)=>{

    validateToken(req,res,()=>{
        if(req.user.id == req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({error:"Access Denied"})
        }
    })
}
const verifyTokenAndAdmin= (req,res,next)=>{

    validateToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({error:"Access Denied"})
        }
    })
}

module.exports={validateToken ,verifyTokenAndAuthorization, verifyTokenAndAdmin}