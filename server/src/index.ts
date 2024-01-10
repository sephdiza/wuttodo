import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// App variables
dotenv.config()

const PORT = process.env.PORT || 5001

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT, async () => {
  console.log(`Listening on port:${PORT}`)
})

module.exports = app