'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const configVars = require('./config-vars');
const loginUser = require('./login-user');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'SERVICE NAME';
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    loginUser(req.user, (result) => {
      res.render('index', {
        title: title,
        configVars: configVars,
        loginUser: result
      });
    });
  } else {
    res.render('index', {
      title: title,
      configVars: configVars
    });
  }
});

module.exports = router;
