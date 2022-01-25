import fs from 'fs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import { randomBytes } from 'crypto';
import _ from 'lodash';

import bip39 from 'bip39';
import { ethers } from "ethers";

const pass = fs.readFileSync(".mailAuth").toString().trim();
import User from '../models/user';
const jwtSecret = fs.readFileSync(".jwtSecret").toString().trim();
import { initialTransfer, transferETH } from '../interface/contract';

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    tls: { rejectUnauthorized: false },
    ssl: true,
    service: "Gmail",
    auth: {
        user: "info.solulabwallet@gmail.com",
        pass: pass
    }
});

export const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword =>  {
      const buffer = randomBytes(32);
      const token = buffer.toString('hex');
      const mnemonic = bip39.generateMnemonic();
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      const user = new User({
        email: email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: token,
        mnemonics: mnemonic,
        address: wallet.address,
        privateKey: wallet.privateKey
      });
      return user.save();
    })
    .then(async (result) => {
      var mailOptions = {
        to: result.email,
        subject: 'Verification of Solulab Wallet',
        //text: req.body.content,
        html:  `<p>Welcome to SoluLab Wallet</p>
              <p>Click this <a href="http://localhost:3000/verify/${result.verificationToken}">link</a> to Verify your Account.</p>`
      };
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            // res.send(error);
          console.log(error);
        }
        else {
            // res.send("sent");
          console.log('mail Sent Successfully');
          return res.send({
            email: result.email,
            publicKey: result.address,
            privateKey: result.privateKey
          });
        }
    });
      // const bal = await initialTransfer(result.address);
      // console.log('User Credited with ' + bal + ' SLT');
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

export const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('Email: ' + email + ' pass: ' + password);
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).send('Invalid E-Mail or Password');
      }
      bcrypt
        .compare(password, user.password)
        .then(async doMatch => {
          if (doMatch) {
            if (user.isVerified) {
              console.log('LOGIN ', user);
              var token = await jwt.sign({ email: user.email, address: user.address, pk: user.privateKey, access: user.isAdmin },
                jwtSecret, { expiresIn: 60 * 60 });
              console.log('Token : ', token);
              req.session.token = token;
              return res.status(200).send({ token });
            }
            return res.status(422).send('Please Verify your Account using Verification mail.');
          }
          return res.status(422).send('Invalid email or password.');
        })
        .catch(err => {
          res.send(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

export const postLogout = (req, res, next) => {
  delete req.session.token;

  var viewData = { success: req.session.success };
  delete req.session.success;

  return res.send('Logout Successfully');
};

export const verifyUser = (req, res, next) => {
  const _token = req.params.token;
  User.findOneAndUpdate({ verificationToken: _token }, { $set: { 'isVerified': true, 'verificationToken':null } }).then(async (user) => {
    if (!user) {
      res.send('Invalid Token');
    } else {
      await transferETH(user.address);
      await initialTransfer(user.address, user.email);
      res.send('Verified Succesfully');
    }
  });
};