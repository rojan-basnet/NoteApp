import express from 'express'
import { createNote,getNotes,deleteNotes } from '../controllers/note.controller.js'

const router=express.Router({ mergeParams: true })

router.get('/dashboard',getNotes)

router.post('/addNewNote',createNote)

router.delete('/deleteNotes',deleteNotes)

export default router