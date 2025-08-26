import express from 'express'
import { note } from '../models/note.js';


const router=express.Router({ mergeParams: true })

router.get('/dashboard',async (req,res)=>{
    const userId=req.params.id
    try{
        const userNotes= await note.find({userId:userId})
        res.status(200).json({message:" served the notes of user ",data:userNotes})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})
router.post('/addNewNote',async (req,res)=>{
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

export default router