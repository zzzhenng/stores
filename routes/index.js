const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.get('/', storeController.getStores);

router.get('/add', storeController.addStore);
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/store/:uuid', catchErrors(storeController.getStoreByUuid));
module.exports = router;
