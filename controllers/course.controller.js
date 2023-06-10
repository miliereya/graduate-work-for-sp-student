const CourseService = require('../services/course.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class CourseController {
	// Получаем все готовые курсы
	async findAll(req, res, next) {
		try {
			const courseData = await CourseService.findAll()
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Получаем все курсы
	async findAllAdmin(req, res, next) {
		try {
			const courseData = await CourseService.findAll(true)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Поиск курса по id
	async findById(req, res, next) {
		try {
			const courseData = await CourseService.findOne(req.params._id)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Получаем статистику курса по id
	async findByIdStatistics(req, res, next) {
		try {
			const courseData = await CourseService.findOneStatistic(req.params._id)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Создание курса
	async create(req, res, next) {
		try {
			const courseData = await CourseService.create()
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Обновление курса
	async update(req, res, next) {
		try {
			const { _id, dto } = req.body
			const courseData = await CourseService.update(_id, dto)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Прохождение курса пользователем
	async completeCourse(req, res, next) {
		try {
			const { _id } = req.body
			const courseData = await CourseService.completeCourse(_id, req.user._id)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	// Удаление курса
	async delete(req, res, next) {
		try {
			const courseData = await CourseService.delete(req.params._id)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new CourseController()
