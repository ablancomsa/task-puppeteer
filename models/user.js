const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const experiencieSchema = new mongoose.Schema({
    experiencie: [String]
})

const universitySchema = new mongoose.Schema({
  university: [String],
})

const userSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  description: String,
  email: String,
  phone: Number,
  linkedin: String,
  twitter: String,
  website: String,
  role: [experiencieSchema],
  university: [universitySchema],
  company: String,
  companySimpleText: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  roleCategory: String,
  imgUrl: String,
  isContact: Boolean,
  aceptedContact: Boolean,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)