// @flow
import mongoose, { Schema } from 'mongoose'
import classToSchema from 'class-to-mongoose-schema'

import { Base } from './Base'

export class User extends Base {
	username = String
	password = String
	admin = Boolean
}

const userSchema = classToSchema(new User())

export { userSchema }

export default mongoose.model(User.name, userSchema)
