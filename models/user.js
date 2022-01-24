const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  verificationToken: String,
  mnemonics: String,
  address: String,
  privateKey: String,
  isVerified:{
      type:Boolean,
      required:true
  }
});

module.exports = mongoose.model('User', userSchema);