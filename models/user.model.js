const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
	coursesCompleted: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
	testsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
})

module.exports = mongoose.model('User', UserSchema)
