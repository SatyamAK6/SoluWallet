import { Router } from 'express';
import { body } from 'express-validator';

import * as authController from '../controllers/auth';
import User from '../models/user';

import isAuth from '../middleware/is-auth';

const authRoutes = Router();

authRoutes.post('/api/signup',
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

authRoutes.post('/api/login', body('email')
  .isEmail()
  .withMessage('Please enter a valid email address.')
  .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .trim(), authController.postLogin);

authRoutes.post('/api/logout', isAuth, authController.postLogout);

authRoutes.get('/verify/:token', authController.verifyUser);

export default authRoutes;