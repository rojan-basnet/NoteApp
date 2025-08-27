import express from 'express'
import { createNote,getNotes } from '../controllers/note.controller.js'

const router=express.Router({ mergeParams: true })

router.get('/dashboard',getNotes)

router.post('/addNewNote',createNote)

export default router