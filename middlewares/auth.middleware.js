const ApiError = require('../exceptions/api.exception')
const UserService = require('../services/user.service')
const UserDto = require('../dto/user.dto')

module.exports = async function (req, res, next) {
	try {
		const token = req.headers.token

		if (!token) {
			return next(ApiError.UnauthorizedError())
		}

		const user = await UserService.validateToken(token)
		if (!user) {
			return next(ApiError.UnauthorizedError())
		}
		
		req.user = new UserDto(user)
		next()
	} catch (e) {
		return next(ApiError.UnauthorizedError())
	}
}
