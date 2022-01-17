const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');
const { randomBytes } = require('crypto');
const _ = require('lodash');

const bip39 = require('bip39');
const { ethers } = require("ethers");

const User = require('../models/user');
const {getBalance, initialTransfer } = require('../interface/contract');


// sgMail.setApiKey('');
// const transporter = nodemailer.createTransport(
//   {
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'cathryn.gutkowski47@ethereal.email',
//         pass: 'xjAKzWh318GxRxtFFN'
//     }
// }
  // sendgridTransport({
  //   host: 'smtp.sendgrid.net',
  //   port:25,
  //   auth: {
  //     // api_user:'satyam@solulab.com',
  //     api_key:
  //       ''
  //   }
  // })
// );

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
    .then(hashedPassword =>  {
      const buffer = randomBytes(32);
      const token = buffer.toString('hex');
      const mnemonic = bip39.generateMnemonic();
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      // console.log("Wallet", JSON.stringify(wallet));
      const user = new User({
        email: email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: token,
        mnemonics: mnemonic,
        address:wallet.address
      });
      return user.save();
    })
    .then(async (result) => {
      console.log('user Added', JSON.stringify(result));
      const bal = await initialTransfer(result.address);
      console.log('User Credited with ' + bal + ' SLT');
      return res.redirect('/login');
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
//       return transporter.sendMail({
//           to: email,
//           from: 'satyam@solulab.com',
//           subject: 'SoluLab Wallet Verification',
//           html: `
//             <p>Welcome to SoluLab Wallet</p>
//             <p>Click this <a href="http://localhost:3000/verify/">link</a> to Verify your Account.</p>
//           `
//         }, function(err, res) {
//     if (err) { 
//         console.log('Mail Error',err) 
//     }
//     console.log('Mail Res',res);
// });
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

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            // const userData = _.omit(user, ["mnemonics", "verificationToken", "password"]);
            // console.log('userData', JSON.stringify(userData));
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/home');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
