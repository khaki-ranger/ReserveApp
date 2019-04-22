'use strict';
const express = require('express');
const router = express.Router();
const uuidV1 = require('uuid/v1');
const moment = require('moment');
const configVars = require('./config-vars');
const loginUser = require('./login-user');
const adminEnsurer = require('./admin-ensurer');
const upload = require('./upload');
const Periods = require('./periods');
const User = require('../models/user');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

const roles = [
  {num: 3, name: 'ユーザー'},
  {num: 2, name: '管理者'},
  {num: 1, name: '開発者'}
];

router.get('/', adminEnsurer, (req, res, next) => {
  const title = '管理者トップ | SERVICE NAME';
  loginUser(req.user, (result) => {
    res.render('admin/index', {
      title: title,
      configVars: configVars,
      loginUser: result
    });
  });
});

router.get('/reservation', adminEnsurer, (req, res, next) => {
  const title = '予約一覧 | SERVICE NAME';
  const periods = new Periods();
  Reservation.findAll({
    include: [
      {
        model: Space,
        attributes: ['spacename']
      }
    ],
    order: [['"date"', 'DESC']]
  }).then((r) => {
    Space.findAll({
      include: [
        {
          model: Office,
          attributes: ['officeId', 'officename']
        }
      ]
    }).then((s) => {
      // 各spaceが所属するofficeの情報をオブジェクトで持つオブジェクトを作成
      // key = spaceId:String, value = office:Object
      const spaceOfficeObject = {};
      s.forEach((space) => {
        if (!spaceOfficeObject[space.spaceId]) {
          spaceOfficeObject[space.spaceId] = {};
        }
        spaceOfficeObject[space.spaceId] = space.office;
      });
      r.forEach((reservation) => {
        reservation.formattedDate = moment(reservation.date).tz('Asia/Tokyo').format('YYYY年MM月DD日');
        reservation.formattedCreatedAt = moment(reservation.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
        reservation.periodname = periods[reservation.periodnum].periodname;
        reservation.officename = spaceOfficeObject[reservation.spaceId].officename;
      });
      loginUser(req.user, (result) => {
        res.render('admin/reservationlist', {
          title: title,
          configVars: configVars,
          loginUser: result,
          reservations: r
        });
      });
    });
  });
});

router.get('/user', adminEnsurer, (req, res, next) => {
  const title = 'ユーザー一覧 | SERVICE NAME';
  User.findAll({
    order: [['"createdAt"', 'ASC']]
  }).then((u) => {
    u.forEach((user) => {
      user.formattedCreatedAt = moment(user.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
    });
    loginUser(req.user, (result) => {
      res.render('admin/userlist', {
        title: title,
        configVars: configVars,
        loginUser: result,
        users: u
      });
    });
  });
});

router.get('/user/register', adminEnsurer, (req, res, next) => {
  const title = '新規ユーザー登録 | SERVICE NAME';
  const message = {};
  loginUser(req.user, (result) => {
    res.render('admin/register', {
      title: title,
      configVars: configVars,
      loginUser: result,
      roles: roles,
      message: message
    });
  });
});

router.post('/user/register', adminEnsurer, (req, res, next) => {
  const title = '新規ユーザー登録 | SERVICE NAME';
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
        configVars: configVars,
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
            configVars: configVars,
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
  const title = '新規オフィス登録 | SERVICE NAME';
  const message = {};
  loginUser(req.user, (result) => {
    res.render('admin/officecreate', {
      title: title,
      configVars: configVars,
      loginUser: result,
      message: message
    });
  });
});

router.post('/office/create', adminEnsurer, (req, res, next) => {
  const title = '新規オフィス登録 | SERVICE NAME';
  const message = {};
  const singleUpload = upload.single('officeimage');
  singleUpload(req, res, (error) => {
    if (error) {
      res.json({'error': error.message});
    } else {
      console.log({'imageUrl': req.file.location});
      const imgPath = process.env.CDN_DOMAIN + req.file.key;
      const dataObject = {
        officeId: uuidV1(),
        officename: req.body.officename,
        imgPath: imgPath,
        createdBy: req.user.userId
      }
      console.log(dataObject);
      // DBへの登録処理
      Office.create(dataObject).then(() => {
        res.redirect('/admin');
      });
    }
  });
});

router.get('/space/create', adminEnsurer, (req, res, next) => {
  const title = '新規スペース登録 | SERVICE NAME';
  const message = {};
  Office.findAll({
    order: [['"createdAt"', 'ASC']]
  }).then((offices) => {
    loginUser(req.user, (result) => {
      res.render('admin/spacecreate', {
        title: title,
        configVars: configVars,
        loginUser: result,
        offices: offices,
        message: message
      });
    });
  });
});

router.post('/space/create', adminEnsurer, (req, res, next) => {
  const title = '新規スペース登録 | SERVICE NAME';
  const message = {};
  const dataObject = {
    spaceId: uuidV1(),
    spacename: req.body.spacename,
    capacity: req.body.capacity,
    officeId: req.body.officeid,
    createdBy: req.user.userId
  }
  // サーバー側でも値のチェック
  if (!dataObject.spacename || !dataObject.capacity) {
    if (!dataObject.spacename) {
      message.spacename = 'スペース名が未入力です'
    }
    if (!dataObject.capacity) {
      message.capacity = '最大収容人数が未入力です'
    }
    Office.findAll({
      order: [['"createdAt"', 'ASC']]
    }).then((offices) => {
      loginUser(req.user, (result) => {
        res.render('admin/spacecreate', {
          title: title,
          configVars: configVars,
          loginUser: result,
          offices: offices,
          message: message
        });
      });
    });
  } else {
    // スペース名の重複は良しとする
    // DBへの登録処理
    Space.create(dataObject).then(() => {
      res.redirect('/');
    });
  }
});

module.exports = router;
