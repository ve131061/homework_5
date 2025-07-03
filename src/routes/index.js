const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dialog/list', userController.getList);
router.post('/dialog/send', userController.postSend);
//router.get('/post/feed', userController.getPostFeed);
//router.post('/post/create', userController.postCreate);
//router.get('/user/search', userController.getUserSearch);
//router.post('/login', userController.loginUser);

module.exports = router;