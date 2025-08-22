import mongoose from "mongoose";
async function connectDb() {
    try{
        const connection= await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database")
    }catch(error){
        console.log("error while connecting to db",error);
        process.exit(1);
    }
}
export default connectDb