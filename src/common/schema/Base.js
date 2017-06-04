// @flow
import mongoose, { Schema } from 'mongoose'
import memoize from 'memoizee'
import { ref } from '../db_utils'
import classToSchema from 'class-to-mongoose-schema'

function executeWithCommonOptions(toExecute, options) {
	let execution = toExecute()

	if (options) {
		if (!options.full) {
			execution = execution.select('-__v -_id')
		}
	} else {
		execution = execution.select('-__v -_id')
	}

	return execution
}

export class Base { // Abstract
	static getObject = memoize(function(jsonData, options) {
		return executeWithCommonOptions(() => this.findOne(jsonData), options)
	}, { promise: 'then', maxAge: 60000 })

	static getAll = memoize(function(jsonData, options) {
		return executeWithCommonOptions(() => this.find(jsonData), options)
	}, { promise: 'then', maxAge: 60000 })

	static createNewObject(jsonData) { // No-op if document exists (atomic operation)
		return this.findOneAndUpdate(jsonData, { $setOnInsert: jsonData }, { new: true, upsert: true })
		.then((dataObject) => {
			if (dataObject) {
				return dataObject
			} else {
				throw Error(`${ jsonData } could not be created`)
			}
		})
	}

	static createOrUpdate(queryJson, jsonData) {
		return this.findOneAndUpdate(queryJson, { $set: jsonData }, { new: true, upsert: true })
		.then((dataObject) => {
			if (dataObject) {
				return dataObject
			} else {
				throw Error(`${ jsonData } could not be created`)
			}
		})
	}

	static getOrCreate(jsonData) {
		return this.getObject(jsonData, { full: true })
		.then((dataObject) => {
			if (dataObject) {
				return dataObject
			} else {
				return this.createNewObject(jsonData)
			}
		})
	}
}
