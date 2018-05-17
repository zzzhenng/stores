const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();


router.get('/', storeController.getStores);
// 显示所有餐厅
router.get('/stores', catchErrors(storeController.getStores));
// 单个餐厅显示
router.get('/store/:uuid', catchErrors(storeController.getStoreByUuid));
// 评论
router.post(
  '/reviews/:id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview),
);
// 修改餐厅
router.get('/stores/:id/edit', catchErrors(storeController.getEditStore));
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore),
);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get(
  '/add',
  authController.isLoggedIn,
  storeController.addStore,
);
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);


router.get('/register', authController.getRegister);
router.post(
  '/register',
  authController.validateRegister,
  catchErrors(authController.postRegister),
  authController.postLogin,
);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);
module.exports = router;

// 更改用户资料
router.get(
  '/account',
  authController.isLoggedIn,
  authController.getAccount,
);
router.post('/account', catchErrors(authController.updateAccount));

// 更改密码
router.post('/account/forgot', catchErrors(authController.forgotPass));
router.get('/account/reset/:token', catchErrors(authController.resetPass));
router.post(
  '/account/reset/:token',
  authController.confirmedPass,
  catchErrors(authController.updatePass),
);

router.get(
  '/hearts',
  catchErrors(storeController.getHearts),
);

/**
 *  API
*/
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));
