const fs = require('fs');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// favicon icon
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// mement.js
exports.moment = require('moment');

// Google Static Map
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=800x150&markers=${lat},${lng}&scale=2&key=${process.env.MAP_KEY}`;

// site name
exports.siteName = `舌尖美食`;

exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
];