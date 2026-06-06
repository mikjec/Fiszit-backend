import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI!)
		console.log(`Połączono z bazą danych: ${conn.connection.host}`)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		console.error(`Błąd: ${errorMessage}`)
		process.exit(1)
	}
}

export default connectDB
