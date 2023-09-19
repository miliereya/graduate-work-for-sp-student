const CourseModel = require('../models/course.model')
const TestModel = require('../models/test.model')
const UserModel = require('../models/user.model')
const ApiError = require('../exceptions/api.exception')
const UserDto = require('../dto/user.dto')

require('dotenv').config()

class CourseService {
	async findAll(isAdmin) {
		// Отсутствие флага isAdmin убирает из поиска тесты с незаполненными полями
		return await TestModel.find(isAdmin ? {} : { title: { $ne: 'Новый тест' } })
	}

	async findOne(_id) {
		return await TestModel.findById(_id)
	}

	// Получение статистики по тесту
	async findOneStatistic(_id) {
		const test = await TestModel.findById(_id)

		// Готовим массив результатов
		const results = []
		for (let i = 0; i < test.results.length; i++) {
			results.push({
				// Получаем публичные поля пользователя
				user: new UserDto(await UserModel.findById(test.results[i].user)),
				result: test.results[i].result,
				date: test.results[i].date,
			})
		}

		// Перезаписываем массив результатов после деструктуризации теста
		return { ...test.toObject(), results }
	}

	async create() {
		// Не даем возможность создать новый тест в случае наличия теста с незаполненными полями
		const IsEmptyTest = await TestModel.findOne({ title: 'Новый тест' })
		if (IsEmptyTest) {
			throw ApiError.BadRequest('Empty test already exists')
		}

		// Создаем пустой тест по шаблону
		const test = await TestModel.create({
			title: 'Новый тест',
			questions: [],
			results: [],
		})
		return test
	}

	// Обновление теста
	async update(_id, dto) {
		const test = await TestModel.findByIdAndUpdate(_id, dto, { new: true })
		return test
	}

	// Прохождение теста пользователем
	async complete(_id, userId, result) {
		// Записываем результат пользователя и его id в тест
		await TestModel.findByIdAndUpdate(_id, {
			$push: { results: { user: userId, result, date: new Date() } },
		})

		const user = await UserModel.findById(userId)

		// Проверяем проходил ли пользователь этот тест ранее
		if (!user.testsCompleted.includes(_id)) {
			// Добавляем данный тест пользователю
			user.testsCompleted.push(_id)
			await user.save()
		}
	}

	// Удаление теста
	async delete(_id) {
		await UserModel.updateMany(
			{ testsCompleted: { $in: _id } },
			{ $pull: { testsCompleted: _id } },
			{
				new: true,
			}
		)
		await TestModel.findByIdAndDelete(_id)
	}
}

module.exports = new CourseService()
