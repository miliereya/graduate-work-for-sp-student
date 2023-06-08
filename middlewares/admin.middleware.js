const ApiError = require('../exceptions/api.exception')
const UserService = require('../services/user.service')

module.exports = function (req, res, next) {
	try {
		const token = req.headers.token

		if (!token) {
			return next(ApiError.UnauthorizedError())
		}

		const user = UserService.validateToken(token)
		if (!user) {
			return next(ApiError.UnauthorizedError())
		}
		if (!user.isAdmin) {
			return next(ApiError.NoAccessRequestError())
		}
		req.user = user
		next()
	} catch (e) {
		return next(ApiError.UnauthorizedError())
	}
}
