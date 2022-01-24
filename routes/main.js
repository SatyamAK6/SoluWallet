const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', mainController.getIndex);

router.get('/home', isAuth, mainController.getHome);

router.post('/sendToken', isAuth, mainController.transferToken);

module.exports = router;