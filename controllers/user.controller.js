const userService = require('../services/user.service')
const ApiError = require('../exceptions/api.exception')

require('dotenv').config()

class UserController {
	// Регистрация пользователя
	async registration(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await userService.registration(email, password)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	// Авторизация пользователя
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await userService.login(email, password)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	// Получение информации о пользователе по токену
	async refresh(req, res, next) {
		try {
			const user = req.user
			return res.json(user)
		} catch (e) {
			next(e)
		}
	}

	// Получение профиля (статистики) пользователя
	async profile(req, res, next) {
		try {
			const profileData = await userService.profile(req.user)
			return res.json(profileData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()
