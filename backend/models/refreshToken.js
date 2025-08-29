import mongoose from 'mongoose'

const refreshTokenSchema= new mongoose.Schema({
    refreshToken:{type: String, required: true},
    username: { type: String, required: true },
},{timestamps:true})

export const RefreshToken= mongoose.model("RefreshToken",refreshTokenSchema)