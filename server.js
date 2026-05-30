import express from 'express'
import cors from 'cors'

const app = express()

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
