const CourseModel = require('../models/course.model')
const TestModel = require('../models/test.model')
const UserModel = require('../models/user.model')
const ApiError = require('../exceptions/api.exception')
const UserDto = require('../dto/user.dto')

require('dotenv').config()

class CourseService {
	// Отсутствие флага isAdmin убирает из поиска курсы с незаполненными полями
	async findAll(isAdmin) {
		return await CourseModel.find(isAdmin ? {} : { title: { $ne: '' } })
	}

	async findOne(_id) {
		const course = await CourseModel.findById(_id)
		const tests = []

		// Получаем тесты данного курса
		for (let i = 0; i < course.tests.length; i++) {
			tests.push(await TestModel.findById(course.tests[i]))
		}
		return { ...course.toObject(), tests }
	}

	// Получение статистики по курсу
	async findOneStatistic(_id) {
		// Получаем данные курса и всех пользователей прошедших этот курс
		const course = await CourseModel.findById(_id).populate('userCompleted')
		const userCompleted = []
		for (let i = 0; i < course.userCompleted.length; i++) {
			// Получаем публичные поля пользователя
			userCompleted.push(new UserDto(course.userCompleted[i]))
		}

		// Приводим курс к object, т-к при попытке деструктуризации полученных с запроса к дб данных с mongoose после метода populate()
		// мы получим кучу лишней даты о документе модели
		return { ...course.toObject(), userCompleted }
	}

	// Создание курса
	async create() {
		// Не даем возможность создать новый курс в случае наличия курса с незаполненными полями
		const isEmptyCourse = await CourseModel.findOne({ title: 'Новый курс' })
		if (isEmptyCourse) {
			throw ApiError.BadRequest('Empty course already exists')
		}

		// Создаем новый курс по шаблону с пустыми полями
		const course = await CourseModel.create({
			title: 'Новый курс',
			text: '',
			tests: [],
		})
		return course
	}

	// Обновление курса
	async update(_id, dto) {
		const course = await CourseModel.findByIdAndUpdate(_id, dto, { new: true })
		return course
	}

	// Прохождение курса пользователем
	async completeCourse(_id, userId) {
		// Записываем пользователя в курс
		await CourseModel.findByIdAndUpdate(_id, {
			$push: { userCompleted: userId },
		})

		// Записываем пройденный курс пользователю
		await UserModel.findByIdAndUpdate(userId, {
			$push: { coursesCompleted: _id },
		})
	}

	// Удаление курса
	async delete(_id) {
		await UserModel.updateMany(
			{ coursesCompleted: { $in: _id } },
			{ $pull: { coursesCompleted: _id } },
			{
				new: true,
			}
		)

		await CourseModel.findByIdAndDelete(_id)
	}
}

module.exports = new CourseService()
