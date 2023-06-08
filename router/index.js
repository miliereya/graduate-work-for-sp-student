const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user.controller')
const courseController = require('../controllers/course.controller')
const testController = require('../controllers/test.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

router.get('/auth/refresh', authMiddleware, userController.refresh)
router.post('/auth/register', userController.registration)
router.post('/auth/login', userController.login)

router.get('/course/find', courseController.findAll)
router.get('/course/find-admin', adminMiddleware, courseController.findAllAdmin)
router.post('/course/create', adminMiddleware, courseController.create)
router.post('/course/update', adminMiddleware, courseController.update)
router.post('/course/complete', authMiddleware, courseController.completeCourse)
router.delete('/course/:_id', adminMiddleware, courseController.delete)
router.get('/course/:_id', courseController.findById)
router.get(
	'/course/statistics/:_id',
	adminMiddleware,
	courseController.findByIdStatistics
)

router.get('/test/find', testController.findAll)
router.get('/test/find-admin', adminMiddleware, testController.findAllAdmin)
router.post('/test/create', adminMiddleware, testController.create)
router.post('/test/update', adminMiddleware, testController.update)
router.post('/test/complete', authMiddleware, testController.complete)
router.delete('/test/:_id', adminMiddleware, testController.delete)
router.get('/test/:_id', testController.findById)
router.get(
	'/test/statistics/:_id',
	adminMiddleware,
	testController.findByIdStatistics
)

module.exports = router
