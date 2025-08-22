import express from 'express';
import cors from 'cors';
import {newUser } from './models/newUser.js';
import dotenv from "dotenv";
import connectDb from './config/db.js';
import { note } from './models/note.js';
import { NoteBody } from './models/noteBody.js';
import path from 'path'

const PORT=process.env.PORT||5000;
const __dirname=path.resolve()
console.log(__dirname)
dotenv.config()
const app=express();

app.use(cors())
app.use(express.json())

app.post('/api/createNewUser',async (req,res)=>{
    const {userName,password}=req.body
    if(!userName || !password ){
        res.status(400).json({error: "Username and password are required."})
    }
    try{
        const existingUserName=await newUser.findOne({userName});
        if(!existingUserName){
            const newCreatedUser = new newUser({userName,password})
            await newCreatedUser.save()
            return res.status(201).json({message:"new user created",data:newCreatedUser})
        }
        res.status(409).json({error:"usename already exists"})
    }catch(error){
        res.status(500).json({message:"failed to create user",error})
    }
})

app.post('/api/login',async (req,res)=>{
    const {userName,password}=req.body;
    const user=await newUser.findOne({userName:userName})

    if(user){
        if(user.password==password){
            return res.status(200).json({message:"user logged in",data:user})
        }
        return res.status(401).json("incorrect password")
    }
    return res.status(404).json({error:"user Does not exist"})
})

app.get('/api/:id/dashboard',async (req,res)=>{
    const userId=req.params.id
    try{
        const userNotes= await note.find({userId:userId})
        res.status(200).json({message:" served the notes of user ",data:userNotes})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})
app.post('/api/:id/addNewNote',async (req,res)=>{
    const {subject}=req.body
    const userId=req.params.id;
    if(!subject){
        return res.status(400).json({message:"user didn't submit subject"})
    }
    try{
        const noteData=new note({subject,userId})
        await noteData.save();
        res.json({message:"notes saved ",data:noteData})
    }catch(error){
        res.status(500).json({message:"error while adding note to database",error:error})
    }

})

app.post('/api/:id/:noteId/dashboard/notebody',async (req,res)=>{
    const {topic,content}=req.body
    const noteId=req.params.noteId

    try{
        const newNoteBody=new NoteBody({topic,content,noteId})
        await newNoteBody.save()
        res.status(201).json({message:"new note body created",data:newNoteBody})
    }catch(error){
        console.log("error while saving note body",error)
        res.status(500).json({message:"error while creating note body"})
    }
})

app.get('/api/:id/:noteId/dashboard/notebody',async (req,res)=>{
    const userNoteId=req.params.noteId;
    try{
        const allNoteForSub=await NoteBody.find({noteId:userNoteId})
        res.status(200).json({data:allNoteForSub,message:"notes fetch sucessfully"})
    }catch(error){
        res.status(500).json({message:"error while fetching note body",error:error})
    }
})
app.delete('/api/:notebodyId',async (req,res)=>{
    const noteID=req.params.notebodyId
    try{
        const noteToDelete=await NoteBody.findOneAndDelete({_id:noteID})
        res.status(200).json({message:"note deleted",data:noteToDelete})
    }catch(error){
        console.log(error,"error while deleting note body")
        res.status(500).json("failed to delete note body")
    }
})
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));

    app.use((req, res) => {
        const indexPath = path.resolve(__dirname, '../frontend', 'dist', 'index.html');
        res.sendFile(indexPath);
    });
}
app.listen(PORT,()=>{
    connectDb();
    console.log(`listening at port:${PORT}`)
})