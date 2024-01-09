import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// App variables
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

module.exports = app