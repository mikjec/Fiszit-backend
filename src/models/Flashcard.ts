import { Document, Schema } from 'mongoose'

export interface IFlashcard extends Document {
	question: string
	answer: string
	createdAt?: Date
	updatedAt?: Date
}

export const FlashcardSchema = new Schema<IFlashcard>(
	{
		question: { type: String, required: true },
		answer: { type: String, required: true },
	},
	{ timestamps: true },
)
