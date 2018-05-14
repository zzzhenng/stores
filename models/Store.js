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
});

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

module.exports = mongoose.model('Store', storeSchema);