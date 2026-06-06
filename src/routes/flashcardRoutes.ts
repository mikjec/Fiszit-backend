import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import {
	getDecks,
	getDeckById,
	createDeck,
	updateDeck,
	deleteDeck,
	addFlashcard,
	deleteFlashcard,
} from '../controllers/flashcardController.js'

const router = Router()

router.get('/', authMiddleware, getDecks)
router.get('/:id', authMiddleware, getDeckById)
router.post('/', authMiddleware, createDeck)
router.put('/:id', authMiddleware, updateDeck)
router.delete('/:id', authMiddleware, deleteDeck)

router.post('/:deckId/flashcards', authMiddleware, addFlashcard)
router.delete('/:deckId/flashcards/:flashcardId', authMiddleware, deleteFlashcard)

export default router
