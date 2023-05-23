require('dotenv').config()
const http = require('http')
const app = require('./app')

const server = http.createServer(app)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})