import mongoose, { Document, Schema } from 'mongoose'
// Importujemy interfejs ORAZ schemat z pliku Flashcard
import { FlashcardSchema, IFlashcard } from './Flashcard.js'

export interface IDeck extends Document {
	name: string
	public_token: string | null
	flashcards: IFlashcard[]
	userId: mongoose.Types.ObjectId
	createdAt?: Date
	updatedAt?: Date
}

const DeckSchema = new Schema<IDeck>(
	{
		name: { type: String, required: true },
		public_token: { type: String, required: false, default: null },
		flashcards: [FlashcardSchema],
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true },
)

export default mongoose.model<IDeck>('Deck', DeckSchema)
