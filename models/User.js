const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: '你必须提供一个名称',
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '无效的邮箱地址'],
    required: '你必须提供一个邮箱',
  },

});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);