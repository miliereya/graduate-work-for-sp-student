const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TestSchema = new Schema({
	title: { type: String },
	questions: {
		type: [
			{
				question: { type: String, required: true },
				answers: { type: Array, required: true },
				correctAnswer: { type: String, required: true },
			},
		],
		required: true,
	},
	results: {
		type: [
			{
				user: { type: Schema.Types.ObjectId, ref: 'User' },
				result: { type: String, required: true },
			},
		],
		required: true,
	},
})

module.exports = mongoose.model('Test', TestSchema)
