import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Połączenie z bazą danych
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/decks', flashcardRoutes)

// Nasłuchiwanie na porcie
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`)
})
