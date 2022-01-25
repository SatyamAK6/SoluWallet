import fs from 'fs';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
import expressJwt from 'express-jwt';

import config from './config.json';
// const jwtSecret = fs.readFileSync(".jwtSecret").toString().trim();

// const MONGODB_URI = fs.readFileSync('.mongodb').toString().trim();
 
const app = express();
const store = new MongoDBStore({
uri: config.mongodbUrl,
collection: 'sessions'
});

import mainRoutes from './routes/main';
import authRoutes from './routes/auth';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: false,
    store: store
})
);

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', expressJwt({ secret: config.jwtSecret, algorithms: ['HS256'] }).unless({ path: ['/api/login', '/api/signup'] }));

app.use(mainRoutes);
app.use(authRoutes);

mongoose
.connect(config.mongodbUrl)
.then(result => {
app.listen(3000);
})
.catch(err => {
console.log(err);
});