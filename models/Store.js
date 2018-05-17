const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: '请输入餐厅名称',
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  uuid: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: '你必须提供坐标位置',
    }],
    address: {
      type: String,
      required: '你必须提供地理位置',
    },
  },
  photo: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    requried: '您必须选择一个用户',
  },
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
},
);

storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.uuid = uuidv4();
  next();
});

storeSchema.static('getTagList', function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: 1 } }
  ]);
});

storeSchema.static('getTopStores', function() {
  return this.aggregate([
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
    // filter。 只留下评论个数 >= 2个的store
    { $match: { 'reviews.1': { $exists: true } } },
    // 提取出需要的属性
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      averageRating: { $avg: '$reviews.rating' },
      uuid: '$$ROOT.uuid',
    } },
    // 排序
    { $sort: { averageRating: -1 } },
    // 列出前10名
    { $limit: 10 }
  ]);
});

// 找到 Store _id == Review store 的评论
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store',
});

module.exports = mongoose.model('Store', storeSchema);
