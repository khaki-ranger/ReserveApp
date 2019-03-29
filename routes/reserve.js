'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');

router.get('/', authenticationEnsurer, (req, res, next) => {
  const title = '予約';
  const message = {};
  loginUser(req.user, (result) => {
    res.render('reserve', {
      title: title,
      loginUser: result,
      message: message
    });
  });
});

module.exports = router;
