// @flow
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import passport from 'passport'
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session)

import passportSetup from './passport_mw'
import dbConfig from './db'
import publicRoutes from './routes/public_routes'
// import protectedRoutes from './routes/protected_routes'

mongoose.connect(dbConfig.url)
mongoose.Promise = Promise

const app = express()
const port = process.env.PORT || 3000

app.use(session({
	store: new MongoStore({
		url: dbConfig.url
	}),
	secret: dbConfig.secret,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
passportSetup(passport)

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3002')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	res.header('Access-Control-Allow-Credentials', 'true')

	next()
})

app.use('/', publicRoutes)
// app.use('/auth', protectedRoutes)

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
})
