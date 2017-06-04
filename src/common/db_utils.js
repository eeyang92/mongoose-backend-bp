// @flow
import { Schema } from 'mongoose'

export function isPopulated(model, instances) {
	if (Array.isArray(instances)) {
		if (instances.length === 0) {
			return true
		}

		return instances[0] instanceof model
	} else {
		return instances instanceof model
	}
}

export function getQuery(model, instances) {
	if (Array.isArray(instances)) {
		return model.find(instances.map((instance) => instance._id))
	} else {
		return model.find(instances._id)
	}
}

export function ref(name) {
	return {
		type: Schema.Types.ObjectId,
		ref: name
	}
}

export function insertPreHook(obj, hook) {
	if (Array.isArray(obj)) {
		throw Error('Apply array around type')
	}

	if (typeof obj === 'object') {
		if (Object.prototype.hasOwnProperty.call(obj, 'hooks')) {
			if (obj.hooks.pre) {
				obj.hooks.pre.splice(0, 0, hook)
			} else {
				obj.hooks.pre = [hook]
			}
		} else {
			obj.hooks = {
				pre: [hook]
			}
		}

		return obj
	} else {
		return {
			type: obj,
			hooks: {
				pre: [hook]
			}
		}
	}
}

// export class PersistanceManager {
// 	constructor(object, ...otherObjects) {

// 	}
// }
