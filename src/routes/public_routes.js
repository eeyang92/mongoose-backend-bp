import express from 'express'
import passport from 'passport'

import { authMiddleware } from '../passport_mw'

const router = express.Router()

router.post('/register', authMiddleware(passport, 'register'), (req, res) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.post('/login', authMiddleware(passport, 'login'), (req, res) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.get('/test', authMiddleware(passport, 'login'), (req, res) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.get('/', (req, res) => {
	res.send('Hello World!')
})

export default router
