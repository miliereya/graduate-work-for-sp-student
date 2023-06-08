const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/auth/register', userController.registration)
router.post('/auth/login', userController.login)

router.get('/auth/refresh', authMiddleware, userController.refresh)


module.exports = router
