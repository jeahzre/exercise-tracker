const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

const logSchema = new Schema({
  description: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }, 
  duration: {
    type: Number,
    required: true,
    trim: true
  }, 
  date: {
    type: String, 
    default: new Date().toISOString()
  },
  createdBy: String
});

const Log = mongoose.model('Log', logSchema)

module.exports = {User, Log}