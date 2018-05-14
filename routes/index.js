const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');

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

router.get('/register', authController.getRegister);
router.post(
  '/register',
  authController.validateRegister,
  catchErrors(authController.postRegister),
  authController.login,
);
module.exports = router;
