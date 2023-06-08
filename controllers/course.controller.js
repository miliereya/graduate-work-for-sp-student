const CourseService = require('../services/course.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class CourseController {
	async findAll(req, res, next) {
		try {
			const courseData = await CourseService.findAll()
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	async findAllAdmin(req, res, next) {
		try {
			const courseData = await CourseService.findAll(true)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	async findById(req, res, next) {
		try {
			const courseData = await CourseService.findOne(req.params._id)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	async create(req, res, next) {
		try {
			const courseData = await CourseService.create()
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

	async update(req, res, next) {
		try {
			const { _id, dto } = req.body
			const courseData = await CourseService.update(_id, dto)
			return res.json(courseData)
		} catch (e) {
			next(e)
		}
	}

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
