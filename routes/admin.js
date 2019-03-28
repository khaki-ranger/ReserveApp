'use strict';
const express = require('express');
const router = express.Router();
const uuidV1 = require('uuid/v1');
const loginUser = require('./login-user');
const adminEnsurer = require('./admin-ensurer');
const User = require('../models/user');
const Office = require('../models/office');

const roles = [
  {num: 3, name: 'ユーザー'},
  {num: 2, name: '管理者'},
  {num: 1, name: '実装者'}
];

router.get('/', adminEnsurer, (req, res, next) => {
  const title = '管理者専用';
  loginUser(req.user, (result) => {
    res.render('admin/index', {
      title: title,
      loginUser: result
    });
  });
});

router.get('/user/register', adminEnsurer, (req, res, next) => {
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

router.post('/user/register', adminEnsurer, (req, res, next) => {
  const title = '新規ユーザー登録';
  const message = {};
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  // サーバー側でも値のチェック
  if (!username || !password || !role) {
    if (!username) {
      message.username = 'ユーザーネームが未入力です'
    }
    if (!password) {
      message.password = 'パスワードが未入力です'
    }
    loginUser(req.user, (result) => {
      res.render('admin/register', {
        title: title,
        loginUser: result,
        roles: roles,
        message: message
      });
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
        loginUser(req.user, (result) => {
          res.render('admin/register', {
            title: title,
            loginUser: result,
            roles: roles,
            message: message
          });
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

router.get('/office/create', adminEnsurer, (req, res, next) => {
  const title = '新規オフィス登録';
  const message = {};
  loginUser(req.user, (result) => {
    res.render('admin/officecreate', {
      title: title,
      loginUser: result,
      message: message
    });
  });
});

router.post('/office/create', adminEnsurer, (req, res, next) => {
  const title = '新規オフィス登録';
  const message = {};
  const dataObject = {
    officeId: uuidV1(),
    officename: req.body.officename,
    imgPath: req.body.imgpath,
    createdBy: req.user.userId
  }
  // サーバー側でも値のチェック
  if (!dataObject.officename || !dataObject.imgPath) {
    if (!dataObject.officename) {
      message.officename = 'オフィス名が未入力です'
    }
    if (!dataObject.imgPath) {
      message.imgpath = '画像パスが未入力です'
    }
    loginUser(req.user, (result) => {
      res.render('admin/officecreate', {
        title: title,
        loginUser: result,
        message: message
      });
    });
  } else {
    Office.findOne({
      where: {
        officename: dataObject.officename
      }
    }).then((office) => {
      // officename の重複をチェック
      if (office) {
        message.officename = 'すでに登録されているオフィス名です';
        loginUser(req.user, (result) => {
          res.render('admin/officename', {
            title: title,
            loginUser: result,
            message: message
          });
        });
      } else {
        // DBへの登録処理
        Office.create(dataObject).then(() => {
          res.redirect('/');
        });
      }
    });
  }
});

module.exports = router;
