const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuidv4 = require('uuid');

const Store = mongoose.model('Store');
const User = mongoose.model('User');

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
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();
  req.flash('success', `成功添加 ${store.name}`);
  res.redirect('/');
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'stores', stores });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const choice = tag || { $exists: true };
  const tagsPromise = Store.getTagList();
  const storesPromise = Store.find({ tags: choice });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.getStoreByUuid = async (req, res, next) => {
  const store = await Store.findOne({ uuid: req.params.uuid }).populate('author reviews');
  if (!store) return next();
  // res.json(store);
  res.render('store', { title: store.name, store });
};

exports.getEditStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  if (!store.author.equals(req.user._id)) {
    throw Error('你必须创建自己的餐厅');
  }
  res.render('editStore', { title: '修改餐厅', store });
};

exports.updateStore = async (req, res) => {
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true },
  ).exec();
  req.flash('success', `成功更新 ${store.name}`);
  res.redirect('/stores');
};

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { [operator]: { hearts: req.params.id } },
    { new: true },
  );
  res.json(user);
};

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts },
  });
  res.render('stores', { title: '收藏的餐厅', stores });
};
