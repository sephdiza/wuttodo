require('dotenv').config()
const app = require('.')

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`Listening on port:${PORT}`)
})