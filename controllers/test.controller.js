const TestService = require('../services/test.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class TestController {
	async findAll(req, res, next) {
		try {
			const testData = await TestService.findAll()
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async findAllAdmin(req, res, next) {
		try {
			const testData = await TestService.findAll(true)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async findById(req, res, next) {
		try {
			const testData = await TestService.findOne(req.params._id)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async findByIdStatistics(req, res, next) {
		try {
			const testData = await TestService.findOneStatistic(req.params._id)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async create(req, res, next) {
		try {
			const testData = await TestService.create()
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async update(req, res, next) {
		try {
			const { _id, dto } = req.body
			const testData = await TestService.update(_id, dto)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	async complete(req, res, next) {
		try {
			const { _id, result } = req.body
			await TestService.complete(_id, req.user._id, result)
			return res.status(200).json()
		} catch (e) {
			next(e)
		}
	}

	async delete(req, res, next) {
		try {
			const testData = await TestService.delete(req.params._id)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new TestController()
