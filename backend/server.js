import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDb from './config/db.js';
import path from 'path'
import userAuthRoutes from './routes/newUser.model.js'
import noteRoutes from './routes/note.model.js'
import noteBodyRoutes from './routes/noteBody.model.js'


const PORT=process.env.PORT||5000;
const __dirname=path.resolve()

const app=express();
dotenv.config()
app.use(cors())
app.use(express.json())

app.use('/',userAuthRoutes)

app.use('/api/:id',noteRoutes)

app.use('/api/:id/:noteId',noteBodyRoutes)


if(process.env.NODE_ENV==="production"){
    const frontendPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}
app.listen(PORT,()=>{
    connectDb();
    console.log(`listening at port:${PORT}`)
})