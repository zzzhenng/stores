const fs = require('fs');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// logo
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// site name
exports.siteName = `舌尖美食`;

exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
];