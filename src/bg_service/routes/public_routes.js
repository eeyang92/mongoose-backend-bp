// @flow
import express from 'express'
import type { $Request, $Response } from 'express'
import passport from 'passport'

import { authMiddleware } from '../../common/passport_mw'

const router = express.Router()

router.post('/register', authMiddleware(passport, 'register'), (req: $Request, res: $Response) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.post('/login', authMiddleware(passport, 'login'), (req: $Request, res: $Response) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.get('/test', authMiddleware(passport, 'login'), (req: $Request, res: $Response) => {
	console.log(req.user)

	res.cookie('userid', req.user._id, { maxAge: 2592000000 }).json(req.user)
})

router.get('/', (req: $Request, res: $Response) => {
	res.send('Hello World!')
})

export default router
