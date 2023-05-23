const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  description: String,
  email: String,
  phone: Number,
  linkedin: String,
  twitter: String,
  website: String,
  role: String,
  university: String,
  company: String,
  companySimpleText: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  roleCategory: String,
  imgUrl: String,
  isContact: Boolean,
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