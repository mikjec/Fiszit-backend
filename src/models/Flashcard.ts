import { Document, Schema } from 'mongoose'

export interface IFlashcard extends Document {
	question: string | null
	answer: string | null
	createdAt?: Date
	updatedAt?: Date
}

export const FlashcardSchema = new Schema<IFlashcard>(
	{
		question: { type: String, required: false },
		answer: { type: String, required: false },
	},
	{ timestamps: true },
)
