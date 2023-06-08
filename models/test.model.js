const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TestSchema = new Schema({
	title: { type: String, required: true },
	questions: {
		type: [
			{
				question: { type: String, required: true },
				answers: { type: [], required: true },
				correctAnswer: { type: String, required: true },
			},
		],
		required: true,
	},
	results: {
		type: [
			{
				userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
				result: { type: String, required: true },
			},
		],
		required: true,
	},
})

module.exports = mongoose.model('Test', TestSchema)
