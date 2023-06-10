const TestService = require('../services/test.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class TestController {
	// Получаем все готовые тесты
	async findAll(req, res, next) {
		try {
			const testData = await TestService.findAll()
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Получаем все тесты
	async findAllAdmin(req, res, next) {
		try {
			const testData = await TestService.findAll(true)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Получаем тест по id
	async findById(req, res, next) {
		try {
			const testData = await TestService.findOne(req.params._id)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Получаем статистику теста по id
	async findByIdStatistics(req, res, next) {
		try {
			const testData = await TestService.findOneStatistic(req.params._id)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Создание теста
	async create(req, res, next) {
		try {
			const testData = await TestService.create()
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Обновление теста
	async update(req, res, next) {
		try {
			const { _id, dto } = req.body
			const testData = await TestService.update(_id, dto)
			return res.json(testData)
		} catch (e) {
			next(e)
		}
	}

	// Прохождение теста пользователем
	async complete(req, res, next) {
		try {
			const { _id, result } = req.body
			await TestService.complete(_id, req.user._id, result)
			return res.status(200).json()
		} catch (e) {
			next(e)
		}
	}

	// Удаление теста
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
