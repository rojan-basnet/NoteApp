import express from 'express';
import { loginUser,createUser } from '../controllers/newUser.controller.js';

const router=express.Router()

router.post('/api/createNewUser',createUser)

router.post('/api/login',loginUser)

export default router