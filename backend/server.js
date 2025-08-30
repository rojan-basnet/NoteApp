import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDb from './config/db.js';
import path from 'path'
import userAuthRoutes from './routes/newUser.model.js'
import noteRoutes from './routes/note.model.js'
import noteBodyRoutes from './routes/noteBody.model.js'
import { verifyJwtToken } from './middleware/verifyjwtToken.js';
import jwt from 'jsonwebtoken'
import { RefreshToken } from './models/refreshToken.js';

const PORT=process.env.PORT||5000;
const __dirname=path.resolve()

const app=express();
dotenv.config()
app.use(cors()) 
app.use(express.json())

app.post('/api/auth/refresh', async  (req,res)=>{
    const {refreshToken}=req.body;
    

    if(!refreshToken) return res.status(401).json({success:false,message:"no resfresh token send"})

    const refreshTokenData=await RefreshToken.findOne({refreshToken:refreshToken})
    if(refreshTokenData==null) return res.status(401).json({success:false,message:"refresh token not found in database"})

    try{
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)

        const newAccessToken=jwt.sign({userName:decoded.userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"})

        return res.status(200).json({accessToken:newAccessToken,data:decoded})

    }catch(error){
        return res.status(403).json({success:false,message:"token ivalid or expired"})
    }
})

app.use('/',userAuthRoutes)

app.use('/api/:id',verifyJwtToken,noteRoutes)

app.use('/api/:id/:noteId',verifyJwtToken,noteBodyRoutes)

app.use('/api/auth/del',verifyJwtToken, async (req,res)=>{
    const {refreshToken}=req.body

    try{
        const del= await RefreshToken.findOneAndDelete({refreshToken:refreshToken})
        return res.status(200).json({success:true,message:"deleted refresh token",data:del})
    }catch(error){
        res.status(500).json({success:false,message:"server error while deleting refresh token"})
    }
})




if(process.env.NODE_ENV==="production"){
    const frontendPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}
app.listen(PORT,()=>{
    connectDb();
    console.log(`listening at port:${PORT}`)
})