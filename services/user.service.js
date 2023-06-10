const UserModel = require('../models/user.model')
const CourseModel = require('../models/course.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dto/user.dto')
const ApiError = require('../exceptions/api.exception')
const jwt = require('jsonwebtoken')
const TestModel = require('../models/test.model')

require('dotenv').config()

class UserService {
	// Генерация токена при помощи jsonwebtoken
	generateToken(payload) {
		const token = jwt.sign(payload, 'jwt-token')
		return token
	}

	// Валидация токена
	async validateToken(token) {
		try {
			const _id = jwt.verify(token, 'jwt-token')

			// Получение пользователя по _id из токена
			const user = await UserModel.findById(_id)
			return user
		} catch (e) {
			return null
		}
	}

	// Получение публичных полей пользователя с токеном
	async returnUser(user) {
		// Выкидываем приватные поля
		const userDto = new UserDto(user)
		const token = this.generateToken(String(userDto._id))
		return { token, user: userDto }
	}

	// Регистрация пользователя
	async registration(email, password) {
		// Проверка наличия пользователя по данному email
		const candidate = await UserModel.find({ email })
		if (candidate.length !== 0) {
			throw ApiError.BadRequest(
				`User with the specified email ${email} is already exist`
			)
		}

		// Шифровка пароля
		const hashedPassword = await bcrypt.hash(password, 3)

		const user = await UserModel.create({
			email,
			password: hashedPassword,
		})

		// Получаем нужные поля пользователя
		const data = await this.returnUser(user)
		return data
	}

	// Авторизация пользователя
	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw ApiError.BadRequest(`No user was found with email ${email}`)
		}
		// Сравниваем пароли
		const isPassEquals = await bcrypt.compare(password, user.password)
		if (!isPassEquals) {
			throw ApiError.BadRequest('Wrong password')
		}

		// Получаем нужные поля пользователя
		const data = await this.returnUser(user)
		return data
	}

	// Получение профиля (статистики) пользователя
	async profile(user) {
		// Получаем нужные данные о курсах пользователя
		const coursesCompleted = await CourseModel.find({
			_id: { $in: user.coursesCompleted },
		}).select('_id title')

		// Готовим массив для пройденных тестов
		const testsCompleted = []
		for (let i = 0; i < user.testsCompleted.length; i++) {
			const test = await TestModel.findById(user.testsCompleted[i])
			for (let j = 0; j < test.results.length; j++) {
				// Проверяем относится ли результат теста к нашем пользователю
				if (String(test.results[j].user) === String(user._id)) {
					// Добавляем результат в массив с нужными полями
					testsCompleted.push({
						_id: test._id,
						test: test.title,
						result: test.results[j].result,
						date: test.results[j].date,
					})
				}
			}
		}

		// Перезаписываем нужные поля после деструктуризации пользователя
		return {
			...user,
			coursesCompleted,
			testsCompleted,
		}
	}
}

module.exports = new UserService()
