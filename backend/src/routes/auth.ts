import express from 'express';
const router = express.Router();
const passport = require('passport');
const { createUser, loginUser,checkAuth,logoutUser } = require('../controller/Auth');

router.post('/signup', createUser)
.post('/login',passport.authenticate('local'), loginUser)
.get('/check',passport.authenticate('jwt'), checkAuth)
.get('/logout',passport.authenticate('jwt'),logoutUser)

exports.router = router;