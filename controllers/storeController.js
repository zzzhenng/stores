const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuidv4 = require('uuid');

const Store = mongoose.model('Store');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: '文件类型不被允许' }, false);
    }
  },
};

exports.homePage = (rq, res) => {
  res.render('stores', { title: 'stores' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: '新增' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuidv4()}.${extension}`;
  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `成功创建 ${store.name}`);
  res.redirect('/');
};
