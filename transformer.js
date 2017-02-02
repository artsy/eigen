'use strict'
let path = require('path')
let ts = require('typescript')
let tsConfig = require('./tsconfig.json')
let rnTransform = require('react-native/packager/transformer').transform

function transform(data, callback) {
	// Do custom transformations
	let result = data.sourceCode
	if (path.extname(data.filename) == '.tsx' || path.extname(data.filename) == '.ts') {
		try {
			result = ts.transpileModule(result, {compilerOptions: tsConfig.compilerOptions})
			result = result.outputText
		} catch(e) {
			callback(e)
			return
		}
	}

	// Pass the transformed source to the original react native transformer

	try {
		result = rnTransform(result, data.filename, data.options)
	} catch(e) {
		callback(e)
		return
	}
	callback(null, result)
}

module.exports = transform