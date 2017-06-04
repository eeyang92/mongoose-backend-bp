// @flow
import { Strategy as LocalStrategy } from 'passport-local'

import User from './schema/User'

export default function setup(passport) {
	passport.serializeUser((user, done) => {
		done(null, user._id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})

	passport.use('login', new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return done(err)
			}

			if (!user) {
				return done(null, false, { message: 'Email or password is incorrect', status: 401 })
			}

			if (password !== user.password) {
				return done(null, false, { message: 'Email or password is incorrect', status: 401 })
			}

			return done(null, user)
		})
	}))

	passport.use('register', new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return done(err)
			}

			if (user) {
				return done(null, false, { message: 'User already exists', status: 403 })
			} else {
				const user = new User({
					username,
					password,
					admin: true
				})

				user.save((err) => {
					if (err) {
						throw err
					}

					console.log('User saved successfully')

					return done(null, user)
				})
			}
		})
	}))
}

export function authMiddleware(passport, type) {
	return (req, res, next) => {
		passport.authenticate(type, (err, user, info) => {
			if (err) {
				return next(err)
			}

			if (!user) {
				res.status(info.status || 403).json({
					message: info.message
				})

				return
			}

			req.logIn(user, (err) => {
				if (err) {
					next(err)
				} else {
					next()
				}
			})
		})(req, res, next)
	}
}

export function isAuthenticated(req, res, next) {
	console.log(req.user)
	if (req.isAuthenticated()) {
		console.log('authed!')
		return next()
	}

	console.log('not authed')
	res.status(400).json({
		status: false,
		message: 'Not authenticated.'
	})
}
