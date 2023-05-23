const express = require("express")
const cors = require('cors')
const {getNewUsers} = require('./searcher')
const app = express()
app.use(cors())

const PORT = process.env.PORT || 4000;

app.get('/api/newusers', async (request, response) => {
  try {
    const userData = {
      url: request.query.url,
      email: request.query.email,
      password: request.query.password,
      auth: request.query.auth
    }
    console.log(userData);

    const data = await getNewUsers(userData)

    response.status(200).json({data})
    
  } catch (error) {
      response.status(500).json('error')
      console.log(error);
  }
})

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!")
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});