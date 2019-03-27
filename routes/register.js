'use strict';
const express = require('express');
const router = express.Router();
const uuidV1 = require('uuid/v1');
const User = require('../models/user');
const roles = [
  {num: 3, name: 'ユーザー'},
  {num: 2, name: '管理者'},
  {num: 1, name: '実装者'}
];

router.get('/', (req, res, next) => {
  res.render('register', {
    title: '新規ユーザー登録',
    roles: roles
  });
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  User.findOne({
    where: {
      username: username
    }
  }).then((user) => {
    // username の重複をチェック
    if (user) {
      const message = 'すでに登録されているユーザーネームです';
      res.render('register', {
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
});

module.exports = router;
