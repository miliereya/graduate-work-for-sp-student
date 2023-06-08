const CourseModel = require('../models/course.model')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class CourseService {
	async findAll(isAdmin) {
		return await CourseModel.find(isAdmin ? {} : { title: { $ne: '' } })
	}

	async findOne(_id) {
		return await CourseModel.findById(_id)
	}

	async create() {
		const isEmptyCourse = await CourseModel.findOne({ title: '' })
		if (isEmptyCourse) {
			throw ApiError.BadRequest('Empty course already exists')
		}

		const course = await CourseModel.create({
			title: '',
			text: '',
			tests: [],
		})
		return course
	}

	async update(_id, dto) {
		const course = await CourseModel.findByIdAndUpdate(_id, dto, { new: true })
		return course
	}

	async delete(_id) {
		await CourseModel.findByIdAndDelete(_id)
	}
}

module.exports = new CourseService()
