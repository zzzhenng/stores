const express = require('express');
const sotreController = require('../controllers/storeController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('stores', { title: 'Stores' });
});

router.get('/add', sotreController.addStore);
router.post(
  '/add',
  sotreController.createStore,
);
module.exports = router;
