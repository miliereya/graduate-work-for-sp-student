const userService = require('../services/user.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class UserController {
	async registration(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await userService.registration(email, password)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await userService.login(email, password)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async refresh(req, res, next) {
		try {
			const user = req.user
			return res.json(user)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()
