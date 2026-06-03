import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI)
		console.log(`Połączono z bazą danych: ${conn.connection.host}`)
	} catch (error) {
		console.error(`Błąd: ${error.message}`)
		process.exit(1) // Wyjście z procesu w przypadku błędu połączenia
	}
}

connectDB()

// Middlewares
app.use(cors()) // Pozwala na strzały z frontendu
app.use(express.json()) // Pozwala serwerowi czytać dane w formacie JSON

// Testowa trasa (Endpoint)
app.get('/', (req, res) => {
	res.json({ message: 'Witaj w nowym API Fiszit!' })
})

// Nasłuchiwanie na porcie
const PORT = 5000
app.listen(PORT, () => {
	console.log(`Serwer działa z prędkością światła na porcie ${PORT}`)
})
