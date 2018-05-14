const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

exports.getRegister = (req, res) => {
  res.render('register', { title: '注册' });
};

/*
  POST Register
  1. Validate form content.
  2. Register new user to database.
  3. Login
*/
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', '你必须提供一个名称').notEmpty();
  req.checkBody('email', '邮箱地址无效').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', '密码不能为空').notEmpty();
  req.checkBody('password-confirm', '确认密码不能为空').notEmpty();
  req.checkBody('password-confirm', '您输入的密码不相同').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: '注册', body: req.body, flashes: req.flash() });
  }
  next();
};
exports.postRegister = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: '登录失败',
  successRedirect: '/',
  successFlash: '登录成功，欢迎！',
});
