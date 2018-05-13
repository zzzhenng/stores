const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.get('/', storeController.homePage);

router.get('/add', storeController.addStore);
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);
module.exports = router;
