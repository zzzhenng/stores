const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('stores', { title: 'Stores' });
});

module.exports = router;
