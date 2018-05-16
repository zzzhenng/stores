const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('../handlers/mail');

const User = mongoose.model('User');


/*
  GET /
  POST Register
  1. Validate form content.
  2. Register new user to database.
*/

exports.getRegister = (req, res) => {
  res.render('register', { title: '注册' });
};

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

  // Express-Validator Flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: '注册', body: req.body, flashes: req.flash() });
  }
  return next();
};
exports.postRegister = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

/*
  Login / Logout
*/
exports.getLogin = (req, res) => {
  res.render('login', { title: '登录' });
};

exports.postLogin = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: '登录失败',
  successRedirect: '/',
  successFlash: '登录成功，欢迎！',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', '登出成功');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', '你必须登录后才能操作');
  res.redirect('/login');
};

/*
  Reset Password

  1. send a email with token and expire to user
  2. user reset password
  3. update password to database
*/
exports.forgotPass = async (req, res) => {
  // 1. 查看用户是否存在
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', '邮箱地址没有注册');
    return res.redirect('/login');
  }
  // 2. 在数据库中给这个用户添加 token 与 expiry
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expires
  await user.save();
  // 3. 发送附带 token 的email
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'password reset',
    resetURL,
  });
  req.flash('success', '重置密码邮件已经发送');
  // 4. redirect
  res.redirect('/login');
}
exports.resetPass = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', '链接已经过期或没有找到用户');
    return res.redirect('/login');
  }
  return res.render('reset', { title: '重置密码' });
};
exports.confirmedPass = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    return next();
  }
  req.flash('error', '您输入的密码不相同');
  return res.redirect('back');
};
exports.updatePass = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', '密码设置无效或链接已经过期');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  const updateUser = await user.save();
  await req.login(updateUser);
  req.flash('success', '密码重置成功');
  res.redirect('/');
};

/*
  Update user account
*/
exports.getAccount = (req, res) => {
  res.render('account', { title: 'Edit Account' });
};
exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' },
  );
  req.flash('success', '更新成功');
  res.redirect('back');
};
