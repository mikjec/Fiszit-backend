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
	updateFlashcardFields,
	importFlashcards,
	shareDeck,
	unshareDeck,
	getPublicDeckById,
} from '../controllers/flashcardController.js'

const router = Router()

router.get('/', authMiddleware, getDecks)
router.get('/:id', authMiddleware, getDeckById)
router.post('/', authMiddleware, createDeck)
router.put('/:id', authMiddleware, updateDeck)
router.delete('/:id', authMiddleware, deleteDeck)
router.put('/:id/share', authMiddleware, shareDeck)
router.put('/:id/unshare', authMiddleware, unshareDeck)
router.get('/share/:token', getPublicDeckById)

router.post('/:deckId/flashcards', authMiddleware, addFlashcard)
router.post('/:deckId/flashcards/:flashcardId', authMiddleware, updateFlashcardFields)
router.delete('/:deckId/flashcards/:flashcardId', authMiddleware, deleteFlashcard)
router.post('/:id/import', authMiddleware, importFlashcards)

export default router
