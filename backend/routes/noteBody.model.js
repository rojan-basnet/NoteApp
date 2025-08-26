import express from 'express'
import { NoteBody } from '../models/noteBody.js';
const router =express.Router({ mergeParams: true })

router.post('/dashboard/notebody',async (req,res)=>{
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

router.get('/dashboard/notebody',async (req,res)=>{
    const userNoteId=req.params.noteId;
    try{
        const allNoteForSub=await NoteBody.find({noteId:userNoteId})
        res.status(200).json({data:allNoteForSub,message:"notes fetch sucessfully"})
    }catch(error){
        res.status(500).json({message:"error while fetching note body",error:error})
    }
})
router.delete('/:notebodyId',async (req,res)=>{
    const noteID=req.params.notebodyId
    try{
        const noteToDelete=await NoteBody.findOneAndDelete({_id:noteID})
        res.status(200).json({message:"note deleted",data:noteToDelete})
    }catch(error){
        console.log(error,"error while deleting note body")
        res.status(500).json("failed to delete note body")
    }
})
export default router