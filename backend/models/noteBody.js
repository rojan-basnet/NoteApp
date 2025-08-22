import mongoose from "mongoose";

const noteBodySchema= new mongoose.Schema({
    topic:{
        type:String
    },
    content:{
        type:String
    },
    noteId:{
        type:String
    }
})
export const NoteBody= mongoose.model("NoteBody",noteBodySchema)