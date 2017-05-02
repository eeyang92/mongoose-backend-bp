// @flow
import mongoose, { Schema } from 'mongoose'
import classToSchema from 'class-to-mongoose-schema'

export class User {
	constructor() {
		this.username = String
		this.password = String
		this.admin = Boolean
	}
}

const userSchema = classToSchema(new User())

export { userSchema }

export default mongoose.model(User.name, userSchema)
