const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,

  }
})

const User = mongoose.model('User', userSchema)

const logSchema = new Schema({
  description: String, 
  duration: Number, 
  date: {
    type: String, 
    default: new Date().toISOString()
  },
  createdBy: String
});

const Log = mongoose.model('Log', logSchema)

module.exports = {User, Log}