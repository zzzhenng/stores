const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const md5 = require('md5');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: '请提供一个用户名称',
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '无效的邮箱地址'],
    required: '您必须提供一个邮箱',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hearts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  ],
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://s.gravatar.com/avatar/${hash}?s=100`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', userSchema);

