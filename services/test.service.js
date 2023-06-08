const CourseModel = require('../models/course.model')
const TestModel = require('../models/test.model')
const UserModel = require('../models/user.model')
const ApiError = require('../exceptions/api.exception')
const UserDto = require('../dto/user.dto')

require('dotenv').config()

class CourseService {
	async findAll(isAdmin) {
		return await TestModel.find(isAdmin ? {} : { title: { $ne: '' } })
	}

	async findOne(_id) {
		return await TestModel.findById(_id)
	}

	async findOneStatistic(_id) {
		const test = await TestModel.findById(_id)
		const results = []
		for (let i = 0; i < test.results.length; i++) {
			results.push({
				user: new UserDto(await UserModel.findById(test.results[i].user)),
				result: test.results[i].result,
			})
		}
		return { ...test.toObject(), results }
	}

	async create() {
		const IsEmptyTest = await TestModel.findOne({ title: '' })
		if (IsEmptyTest) {
			throw ApiError.BadRequest('Empty test already exists')
		}

		const test = await TestModel.create({
			title: '',
			questions: [],
			results: [],
		})
		return test
	}

	async update(_id, dto) {
		const test = await TestModel.findByIdAndUpdate(_id, dto, { new: true })
		return test
	}

	async complete(_id, userId, result) {
		await TestModel.findByIdAndUpdate(_id, {
			$push: { results: { user: userId, result } },
		})
		await UserModel.findByIdAndUpdate(userId, {
			$push: { testsCompleted: _id },
		})
	}

	async delete(_id) {
		await TestModel.findByIdAndDelete(_id)
	}
}

module.exports = new CourseService()
