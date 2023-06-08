const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./router/index')
const { json } = require('express')
const errorMiddleware = require('./middlewares/error.middleware')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
)
app.use(express.json())
app.use('/api', router)
app.use('/public', express.static('public'))
app.use(errorMiddleware)

const uri = process.env.MONGO_URI

const start = () => {
	try {
		mongoose.set('strictQuery', true)
		mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		app.listen(port, () => console.log(`Port  ${port}`))
	} catch (e) {
		console.log(e)
	}
}

start()
