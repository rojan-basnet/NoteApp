import express from 'express'
import { createNoteBody,deleteNoteBody,getNoteBody ,deleteManyNoteBody} from '../controllers/noteBody.controller.js'

const router =express.Router({ mergeParams: true })

router.post('/dashboard/notebody',createNoteBody)

router.get('/dashboard/notebody',getNoteBody)

router.delete('/manydel',deleteManyNoteBody)

router.delete('/:notebodyId',deleteNoteBody)



export default router