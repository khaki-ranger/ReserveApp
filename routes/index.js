'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = '予約サービス';
  loginUser(req.user, (result) => {
    res.render('index', {
      title: title,
      loginUser: result
    });
  });
});

module.exports = router;
