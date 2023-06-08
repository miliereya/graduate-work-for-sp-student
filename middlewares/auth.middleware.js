const ApiError = require('../exceptions/api.exception')
const UserService = require('../services/user.service')

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
		req.user = user
		next()
	} catch (e) {
		return next(ApiError.UnauthorizedError())
	}
}
