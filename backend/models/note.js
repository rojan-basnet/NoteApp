import mongoose from "mongoose";

const noteSchema=new mongoose.Schema({
    subject:{
        type:String,required: true
    },
    userId:{
        type:String,required:true
    }
})
export const note= mongoose.model("note",noteSchema)