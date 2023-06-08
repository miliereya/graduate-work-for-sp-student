const CourseModel = require('../models/course.model')
const TestModel = require('../models/test.model')
const UserModel = require('../models/user.model')
const ApiError = require('../exceptions/api.exception')
const UserDto = require('../dto/user.dto')

require('dotenv').config()

class CourseService {
	async findAll(isAdmin) {
		return await CourseModel.find(isAdmin ? {} : { title: { $ne: '' } })
	}

	async findOne(_id) {
		const course = await CourseModel.findById(_id)
		const tests = []
		for (let i = 0; i < course.tests.length; i++) {
			tests.push(await TestModel.findById(course.tests[i]))
		}
		return { ...course.toObject(), tests }
	}

	async findOneStatistic(_id) {
		const course = await CourseModel.findById(_id).populate('userCompleted')
		const userCompleted = []
		for (let i = 0; i < course.userCompleted.length; i++) {
			userCompleted.push(new UserDto(course.userCompleted[i]))
		}
		return { ...course.toObject(), userCompleted }
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

	async completeCourse(_id, userId) {
		await CourseModel.findByIdAndUpdate(_id, {
			$push: { userCompleted: userId },
		})
		await UserModel.findByIdAndUpdate(userId, {
			$push: { coursesCompleted: _id },
		})
	}

	async delete(_id) {
		await CourseModel.findByIdAndDelete(_id)
	}
}

module.exports = new CourseService()
