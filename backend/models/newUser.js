
import mongoose from "mongoose";

const newUserSchema=new mongoose.Schema({
    userName:{
        type: String, required: true
    },
    password:{
        type: String, required: true
    }
})

export const newUser= mongoose.model("newUser",newUserSchema)