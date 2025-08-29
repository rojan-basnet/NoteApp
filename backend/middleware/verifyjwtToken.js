import jwt from 'jsonwebtoken'

export const verifyJwtToken= (req,res,next)=>{

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({success:false,message:"you have no token"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET ,(error,decoded)=>{
        if(error){
            return res.status(403).json({success:false,message:"you are not premitted"})
        }
        else{
            req.user=decoded
            next()
        }
    }) 
}