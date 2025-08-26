import express from 'express';
import bcrypt from 'bcrypt'
import {newUser } from '../models/newUser.js';

const router=express.Router()

router.post('/api/createNewUser',async (req,res)=>{
    const {userName,password}=req.body
    if(!userName || !password ){
        res.status(400).json({error: "Username and password are required."})
    }
    try{
        const existingUserName=await newUser.findOne({userName});
        if(!existingUserName){
            const hashedPassword= await bcrypt.hash(password,10)
            const newCreatedUser = new newUser({userName,password:hashedPassword})
            await newCreatedUser.save()
            return res.status(201).json({message:"new user created",data:newCreatedUser})
        }
        res.status(409).json({error:"usename already exists"})
    }catch(error){
        res.status(500).json({message:"failed to create user",error})
    }
})

router.post('/api/login',async (req,res)=>{
    const {userName,password}=req.body;
    const user=await newUser.findOne({userName:userName})

    if(user){
        if(await bcrypt.compare(password,user.password)){
            return res.status(200).json({message:"user logged in",data:user})
        }
        return res.status(401).json("incorrect password")
    }
    return res.status(404).json({error:"user Does not exist"})
})

export default router