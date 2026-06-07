import { Response } from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AuthRequest } from '../middleware/authMiddleware.js'
import { z } from 'zod'

export const registerSchema = z.object({
	username: z
		.string()
		.min(3, 'Nazwa użytkownika musi mieć minimum 3 znaki')
		.max(30, 'Nazwa użytkownika może mieć maksymalnie 30 znaków')
		.trim(),
	email: z.email('Niepoprawny format adresu e-mail').trim().toLowerCase(),
	password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków').max(50, 'Hasło jest za długie'),
})

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { username, email, password } = req.body

		const result = registerSchema.safeParse({ username, email, password })

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors
			res.status(400).json({ message: 'Nieprawidłowe dane rejestracji', errors })
			return
		}

		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		})

		if (existingUser) {
			res.status(401).json({ message: 'Użytkownik już istnieje' })
			return
		}

		const hashedPassword = await bcryptjs.hash(password, 10)

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		})

		await newUser.save()

		res.status(201).json({
			message: 'Użytkownik zarejestrowany pomyślnie',
			userId: newUser._id,
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd rejestracji', error: errorMessage })
	}
}

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body
		console.log(email, password)

		const user = await User.findOne({ email })

		if (!user) {
			res.status(401).json({ message: 'Nieprawidłowy login lub hasło' })
			return
		}

		// Sprawdzenie hasła
		const isPasswordValid = await bcryptjs.compare(password, user.password)

		if (!isPasswordValid) {
			res.status(401).json({ message: 'Nieprawidłowy login lub hasło' })
			return
		}

		// Generowanie JWT
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' })

		res.status(200).json({
			message: 'Zalogowano pomyślnie',
			token,
			userId: user._id,
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		res.status(500).json({ message: 'Błąd logowania', error: errorMessage })
	}
}
