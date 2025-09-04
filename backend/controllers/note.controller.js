import { note } from '../models/note.js';
import { NoteBody } from '../models/noteBody.js';

export const createNote=async (req,res)=>{
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
}



export const getNotes=async (req,res)=>{
    const userId=req.params.id
    try{
        const userNotes= await note.find({userId:userId})
        res.status(200).json({message:" served the notes of user ",data:userNotes})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error"})
    }
}

export const deleteNotes=async (req,res)=>{
    const {ids}=req.body
    
    if(ids.length===0) return res.status(400).json({message:"no ids sent"})
    try{
        const deletedSub= await note.deleteMany({ _id: { $in: ids } });
        const deletedSubBody = await NoteBody.deleteMany({ noteId: { $in: ids } });
        res.json({message:"notes deleted",subDeleted:deletedSub.deletedCount,content:deletedSubBody})
    }catch(error){
        res.status(500).json({errror:"while deleting subjts"})
    }


}