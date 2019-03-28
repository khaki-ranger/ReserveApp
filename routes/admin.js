'use strict';
const express = require('express');
const router = express.Router();
const uuidV1 = require('uuid/v1');
const loginUser = require('./login-user');
const adminEnsurer = require('./admin-ensurer');
const User = require('../models/user');

const roles = [
  {num: 3, name: 'ユーザー'},
  {num: 2, name: '管理者'},
  {num: 1, name: '実装者'}
];

router.get('/', adminEnsurer, function(req, res, next) {
  const title = '管理者専用';
  loginUser(req.user, (result) => {
    res.render('admin/index', {
      title: title,
      loginUser: result
    });
  });
});

router.get('/user/register', adminEnsurer, function(req, res, next) {
  const title = '新規ユーザー登録';
  const message = {};
  loginUser(req.user, (result) => {
    res.render('admin/register', {
      title: title,
      loginUser: result,
      roles: roles,
      message: message
    });
  });
});

router.post('/', adminEnsurer, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const message = {};
  // サーバー側でも値のチェック
  if (!username || !password || !role) {
    if (!username) {
      message.username = 'ユーザーネームが未入力です'
    }
    if (!password) {
      message.password = 'パスワードが未入力です'
    }
    res.render('register', {
      title: '新規ユーザー登録',
      roles: roles,
      message: message
    });
  } else {
    User.findOne({
      where: {
        username: username
      }
    }).then((user) => {
      // username の重複をチェック
      if (user) {
        message.username = 'すでに登録されているユーザーネームです';
        res.render('admin/register', {
          title: '新規ユーザー登録',
          roles: roles,
          message: message
        });
      } else {
        // DBへの登録処理
        User.upsert({
          userId: uuidV1(),
          username: username,
          password: password,
          role: role
        }).then(() => {
          res.redirect('/');
        });
      }
    });
  }
});


module.exports = router;
