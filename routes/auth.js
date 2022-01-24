const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
            }
            return true;
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  , authController.postSignup);

router.post('/login', body('email')
  .isEmail()
  .withMessage('Please enter a valid email address.')
  .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .trim(), authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/verify/:token', authController.verifyUser);

module.exports = router;