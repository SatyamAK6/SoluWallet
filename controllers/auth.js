const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const User = require('../models/user');

sgMail.setApiKey('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');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    host: 'smtp.sendgrid.net',
    port:25,
    auth: {
      // api_user:'satyam@solulab.com',
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      return crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err);
          return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const user = new User({
          email: email,
          password: hashedPassword,
          isVerified: false,
          verificationToken : token
        });
        return user.save();
      });
    })
    .then(result => {
      console.log('user Added', JSON.stringify(result));
      res.redirect('/login');
      // return sgMail.send({
      //   to: email,
      //   from: 'verification@solulabwallet.com',
      //   subject: 'Solulab Wallet Verification',
      //   html: `<p>Welcome to SoluLab Wallet</p>
      //        <p>Click this <a href="http://localhost:3000/verify/">link</a> to Verify your Account.</p>`
      // }).then(() => {
      //   console.log('Email Sent');
      // }).catch((error) => {
      //   console.log('Mail Error', error);
      // })
      return transporter.sendMail({
          to: email,
          from: 'satyam@solulab.com',
          subject: 'SoluLab Wallet Verification',
          html: `
            <p>Welcome to SoluLab Wallet</p>
            <p>Click this <a href="http://localhost:3000/verify/">link</a> to Verify your Account.</p>
          `
        }, function(err, res) {
    if (err) { 
        console.log('Mail Error',err) 
    }
    console.log('Mail Res',res);
});
      // return transporter.sendMail({
      //   to: email,
      //   from: 'shop@node-complete.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};