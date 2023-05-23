const userRouter = require('express').Router();
const User = require('../models/user');
const {getNewUsers} = require('../utils/searcher')
const {sendContact} = require('../utils/sendContact')

userRouter.get('/newusers', async (request, response) => {
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

userRouter.post('/users/:id', async (request, response) => {
  const id = request.params.id;
  const auth = request.query.auth;
  const person = await User.findById(id);
  

  const newUserToAdd = {
    name: person.name,
    status: person.status,
    description: person.description,
    email: person.email,
    phone: person.phone || 0,
    linkedin: person.linkedin,
    twitter: person.twitter || "x",
    website: person.website || "x",
    role: person.role || "x",
    university: person.university,
    company: person.company,
    roleCategory: "x",
    imgUrl: person.imgUrl,
    isContact: true
  }

  console.log("person: ",person)
  console.log("new user to add: ",newUserToAdd);

  try {
    await sendContact(person, auth);
    await User.findByIdAndUpdate(request.params.id, {$set: newUserToAdd}, {new: true});
    response.status(200).json(newUserToAdd);
  }
  catch (error) {
    console.log(error)
   response.status(500).json({error});
  }
})

userRouter.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!")
});

module.exports = userRouter;