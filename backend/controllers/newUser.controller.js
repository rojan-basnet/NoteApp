import {newUser } from '../models/newUser.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/refreshToken.js';

export const createUser=async (req,res)=>{
    const {userName,password}=req.body
    if(!userName || !password ){
        return res.status(400).json({error: "Username and password are required."})
    }
    try{
        const existingUserName=await newUser.findOne({userName});
        if(!existingUserName){
            const hashedPassword= await bcrypt.hash(password,10)
            const newCreatedUser = new newUser({userName,password:hashedPassword})
            await newCreatedUser.save()

            const accessToken=jwt.sign({userName:userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"})
            const refreshToken=jwt.sign({userName:userName},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})

                    const newRefreshToken= new RefreshToken({refreshToken:refreshToken,username:userName})
                    localStorage.setItem("refreshToken",newRefreshToken)
                    await newRefreshToken.save();

            return res.status(201).json({message:"new user created",data:{_id:newCreatedUser._id},accessToken:accessToken})
        }
        return res.status(409).json({error:"username already exists"})
    }catch(error){
        res.status(500).json({message:"failed to create user",error})
    }
}


export const loginUser=async (req,res)=>{
    const {userName,password}=req.body;
    const user=await newUser.findOne({userName:userName})

    try{
        if(user){
            if(await bcrypt.compare(password,user.password)){

                try {
                    const accessToken=jwt.sign({userName:userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"})
                    const refreshToken=jwt.sign({userName:userName},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})

                    const newRefreshToken= new RefreshToken({refreshToken:refreshToken,username:userName})
                    localStorage.setItem("refreshToken",newRefreshToken)
                    await newRefreshToken.save();

                    return res.status(200).json({message:"user logged in",data:{_id:user._id},accessToken:accessToken})
                } catch (jwtError) {
                    console.error('JWT Generation Error:', jwtError);
                    console.error('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
                    return res.status(500).json({success:false,message:"JWT generation failed",error:jwtError.message})
                }
            }
            return res.status(401).json({success:false,error:"incorrect password"})
        }
        return res.status(404).json({error:"user Does not exist"})
    }catch(error){
        console.error('Login Error:', error);
        res.status(500).json({success:false,message:"error while loging in user",error:error.message})
    }
}

