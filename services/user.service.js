const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dto/user.dto')
const ApiError = require('../exceptions/api.exception')
const jwt = require('jsonwebtoken')

require('dotenv').config()

class UserService {
	generateToken(payload) {
        const token = jwt.sign(payload, 'jwt-token')
		return token
	}

	async validateToken(token) {
		try {
			const _id = jwt.verify(token, 'jwt-token')
			const user = await UserModel.findById(_id)
			return user
		} catch (e) {
			return null
		}
	}

	async returnUser(user) {
		const userDto = new UserDto(user)
		const token = this.generateToken(String(userDto._id))
		return { token, user: userDto }
	}

	async registration(email, password) {
		const candidate = await UserModel.find({ email })
		if (candidate.length !== 0) {
			throw ApiError.BadRequest(
				`User with the specified email ${email} is already exist`
			)
		}

		const hashedPassword = await bcrypt.hash(password, 3)

		const user = await UserModel.create({
			email,
			password: hashedPassword,
		})
		const data = await this.returnUser(user)
		return data
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw ApiError.BadRequest(`No user was found with email ${email}`)
		}
		const isPassEquals = await bcrypt.compare(password, user.password)
		if (!isPassEquals) {
			throw ApiError.BadRequest('Wrong password')
		}
		const data = await this.returnUser(user)
		return data
	}
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)

		return token
	}
}

module.exports = new UserService()
