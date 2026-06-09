import { Response } from 'express'
import Deck from '../models/Deck.js'
import { AuthRequest } from '../middleware/authMiddleware.js'
import { IFlashcard } from '../models/Flashcard.js'
import crypto from 'crypto'

export const getDecks = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const decks = await Deck.find({ userId: req.userId }, { _id: true, name: true })

		res.status(200).json({ decks })
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd pobierania talii', error: errorMessage })
	}
}

export const getDeckById = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { id } = req.params
		const deck = await Deck.findOne({ _id: id, userId: req.userId })

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		res.status(200).json(deck)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd pobierania talii', error: errorMessage })
	}
}

export const getPublicDeckById = async (req: any, res: Response): Promise<void> => {
	try {
		const token = req.params.token
		const deck = await Deck.findOne({ public_token: token })

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		res.status(200).json(deck)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd pobierania talii', error: errorMessage })
	}
}

export const createDeck = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { name } = req.body

		const newDeck = new Deck({
			name,
			flashcards: [],
			userId: req.userId,
		})

		await newDeck.save()

		res.status(201).json({
			message: 'Talia utworzona pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd tworzenia talii', error: errorMessage })
	}
}

export const updateDeck = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { id } = req.params
		const { name } = req.body

		const updatedDeck = await Deck.findOneAndUpdate({ _id: id, userId: req.userId }, { name }, { new: true })

		if (!updatedDeck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		res.status(200).json({
			message: 'Talia zaktualizowana pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd aktualizacji talii', error: errorMessage })
	}
}

export const deleteDeck = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { id } = req.params

		const deletedDeck = await Deck.findOneAndDelete({ _id: id, userId: req.userId })

		if (!deletedDeck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		res.status(200).json({
			message: 'Talia usunięta pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd usuwania talii', error: errorMessage })
	}
}

export const addFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { deckId } = req.params
		const { question, answer } = req.body

		const deck = await Deck.findOne({ _id: deckId, userId: req.userId })

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		deck.flashcards.unshift({ question, answer } as IFlashcard)
		await deck.save()

		res.status(201).json({
			message: 'Fiszka dodana pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd dodawania fiszki', error: errorMessage })
	}
}

export const updateFlashcardFields = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { deckId, flashcardId } = req.params
		const { question, answer } = req.body

		const updateFields: Record<string, any> = {}

		if (question !== undefined) {
			updateFields['flashcards.$.question'] = question
		}
		if (answer !== undefined) {
			updateFields['flashcards.$.answer'] = answer
		}

		if (Object.keys(updateFields).length === 0) {
			res.status(400).json({ message: 'Brak danych do aktualizacji' })
			return
		}

		const deck = await Deck.findOneAndUpdate(
			{
				_id: deckId,
				userId: req.userId,
				'flashcards._id': flashcardId,
			},
			{ $set: updateFields },
			{ new: true, runValidators: true },
		)

		if (!deck) {
			res.status(404).json({ message: 'Talia lub fiszka nie znaleziona' })
			return
		}

		res.status(200).json({ message: 'Zapisano automatycznie' })
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd auto-zapisu', error: errorMessage })
	}
}

export const deleteFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { deckId, flashcardId } = req.params

		const deck = await Deck.findOneAndUpdate(
			{ _id: deckId, userId: req.userId },
			{ $pull: { flashcards: { _id: flashcardId } } },
			{ new: true },
		)

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		res.status(200).json({
			message: 'Fiszka usunięta pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd usuwania fiszki', error: errorMessage })
	}
}

export const importFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const deckId = req.params.id
		const flashcards = req.body.flashcards

		const deck = await Deck.findOne({ _id: deckId, userId: req.userId })

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		for (const flashcard of flashcards) {
			deck.flashcards.unshift(flashcard)
		}

		await deck.save()

		res.status(201).json({
			message: 'Fiszki zaimportowane pomyślnie',
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd importu fiszek', error: errorMessage })
	}
}

export const shareDeck = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const deckId = req.params.id

		const deck = await Deck.findOne({ _id: deckId, userId: req.userId })

		if (!deck) {
			res.status(404).json({ message: 'Talia nie znaleziona' })
			return
		}

		const shareToken = crypto.randomBytes(16).toString('hex')
		deck.public_token = shareToken
		await deck.save()
		res.status(200).json({ message: 'Zmieniono widoczność zestawu' })
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Wystąpił bład', error: errorMessage })
	}
}

export const unshareDeck = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const deckId = req.params.id

		const deck = await Deck.findOne({ _id: deckId, userId: req.userId })

		if (!deck) {
			res.status(400).json({ message: 'Talia nie znaleziona' })
			return
		}
		deck.public_token = null
		await deck.save()
		res.status(200).json({ message: 'Zmieniono widoczność zestawu' })
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Wystąpił bład', error: errorMessage })
	}
}
