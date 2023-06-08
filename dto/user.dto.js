module.exports = class UserDto {
	email
	_id
	isAdmin
	coursesCompleted
	testsCompleted

	constructor(model) {
		this.email = model.email
		this._id = model._id
		this.isAdmin = model.isAdmin
		this.coursesCompleted = model.coursesCompleted
		this.testsCompleted = model.testsCompleted
	}
}
