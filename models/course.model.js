const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CourseSchema = new Schema({
	title: { type: String },
	text: { type: String },
	tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
})

module.exports = mongoose.model('Course', CourseSchema)
