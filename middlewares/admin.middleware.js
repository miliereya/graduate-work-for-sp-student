const ApiError = require('../exceptions/api.exception')
const UserService = require('../services/user.service')
const UserDto = require('../dto/user.dto')

// Middleware для проверки админ прав пользователя
module.exports = async function (req, res, next) {
	try {
		// Получаем токен из запроса
		const token = req.headers.token

		if (!token) {
			return next(ApiError.UnauthorizedError())
		}

		// Валидируем токен и получаем пользователя по нему
		const user = await UserService.validateToken(token)
		if (!user) {
			return next(ApiError.UnauthorizedError())
		}
		
		// Проверка на наличие прав администратора
		if (user.isAdmin !== true) {
			return next(ApiError.NoAccessRequestError())
		}

		// Устанавливаем пользователя в запросе для удобной работы в контроллерах
		req.user = new UserDto(user)
		next()
	} catch (e) {
		return next(ApiError.UnauthorizedError())
	}
}
