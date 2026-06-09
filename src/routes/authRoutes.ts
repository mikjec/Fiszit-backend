import { Router } from 'express'
import { register, login, getCurrentUser } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/user', authMiddleware, getCurrentUser)

export default router
