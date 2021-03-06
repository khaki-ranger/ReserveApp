'use strict';
const express = require('express');
const router = express.Router();
const uuidV1 = require('uuid/v1');
const moment = require('moment');
const configVars = require('./config-vars');
const loginUser = require('./login-user');
const adminEnsurer = require('./admin-ensurer');
const superEnsurer = require('./super-ensurer');
const upload = require('./upload');
const Periods = require('./periods');
const User = require('../models/user');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');
const Close = require('../models/close');

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
        reservation.startTimeString = periods[reservation.startperiodnum].startTimeString;
        reservation.endTimeString = periods[reservation.endperiodnum].endTimeString;
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

router.get('/user', superEnsurer, (req, res, next) => {
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

router.get('/user/register', superEnsurer, (req, res, next) => {
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

router.post('/user/register', superEnsurer, (req, res, next) => {
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

router.get('/office', adminEnsurer, (req, res, next) => {
  const title = 'オフィス一覧 | SERVICE NAME';
  Office.findAll({
    where: {
      deleted: false
    },
    order: [['"createdAt"', 'ASC']]
  }).then((o) => {
    o.forEach((office) => {
      office.formattedCreatedAt = moment(office.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
    });
    loginUser(req.user, (result) => {
      res.render('admin/officelist', {
        title: title,
        configVars: configVars,
        loginUser: result,
        offices: o
      });
    });
  });
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
  const singleUpload = upload.single('officeimage');
  singleUpload(req, res, (error) => {
    if (error) {
      res.json({'error': error.message});
    } else {
      const imgPath = process.env.CDN_DOMAIN + req.file.key;
      const dataObject = {
        officeId: uuidV1(),
        officename: req.body.officename,
        imgPath: imgPath,
        createdBy: req.user.userId,
        deleted: false
      }
      // DBへの登録処理
      Office.create(dataObject).then(() => {
        res.redirect('/admin');
      });
    }
  });
});

router.get('/office/update/:officeId', adminEnsurer, (req, res, next) => {
  const title = 'オフィス編集 | SERVICE NAME';
  const message = {};
  Office.findOne({
    where: {
      officeId: req.params.officeId
    }
  }).then((office) => {
    loginUser(req.user, (result) => {
      res.render('admin/officeupdate', {
        title: title,
        configVars: configVars,
        loginUser: result,
        message: message,
        office: office
      });
    });
  });
});

router.post('/office/update', adminEnsurer, (req, res, next) => {
  const singleUpload = upload.single('officeimage');
  singleUpload(req, res, (error) => {
    if (error) {
      res.json({'error': error.message});
    } else {
      const dataObject = {
        officename: req.body.officename
      }
      if (req.file) {
        dataObject.imgPath = process.env.CDN_DOMAIN + req.file.key;
      }
      const filter = {
        where: {
          officeId: req.body.officeId
        }
      }
      // DBの更新処理
      Office.update(dataObject, filter).then(() => {
        res.redirect('/admin/office');
      });
    }
  });
});

router.get('/office/delete/:officeId', adminEnsurer, (req, res, next) => {
  const dataObject = {
    deleted: true
  }
  const filter = {
    where: {
      officeId: req.params.officeId
    }
  }
  // DBの更新処理
  Office.update(dataObject, filter).then(() => {
    res.redirect('/admin/office');
  });
});

router.get('/space', adminEnsurer, (req, res, next) => {
  const title = 'スペース一覧 | SERVICE NAME';
  loginUser(req.user, (result) => {
    res.render('admin/spacelist', {
      title: title,
      configVars: configVars,
      loginUser: result
    });
  });
});

router.get('/space/list', adminEnsurer, (req, res, next) => {
  Space.findAll({
    raw: true,
    where: {
      deleted: false
    },
    include: [
      {
        model: Office,
        attributes: ['officename']
      }
    ],
    order: [['"createdAt"', 'ASC']]
  }).then((s) => {
    Close.findAll({
      raw: true,
      where: {
        valid: true
      }
    }).then((c) => {
      // 各スペース毎のお休みの情報を配列で持つオブジェクトを作成
      // key = spaceId, value = [お休み]
      const closeObject = {};
      c.forEach((close) => {
        if(!closeObject[close.spaceId]) {
          closeObject[close.spaceId] = [];
        }
        close.formattedStartdate = moment(close.startdate).tz('Asia/Tokyo').format('YYYY年MM月DD日');
        close.formattedEnddate = close.enddate ? moment(close.enddate).tz('Asia/Tokyo').format('YYYY年MM月DD日') : null;
        if(close.dayofweek){
          const dayOfWeekStringArray = [];
          const dayOfWeekArray = close.dayofweek.split(',');
          dayOfWeekArray.forEach((dayOfWeek) => {
            dayOfWeekStringArray.push(['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'][Number(dayOfWeek)]);
          });
          close.dayOfWeekString = dayOfWeekStringArray.join(', ');
        }
        closeObject[close.spaceId].push(close);
      });
      // スペースのデータにお休み情報を格納
      s.forEach((space) => {
        space.closeDataArray = closeObject[space.spaceId] ? closeObject[space.spaceId] : false;
      });
      res.json(s);
    });
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
    createdBy: req.user.userId,
    deleted: false
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
      res.redirect('/admin/space');
    });
  }
});

router.get('/space/update/:spaceId', adminEnsurer, (req, res, next) => {
  const title = 'スペース編集 | SERVICE NAME';
  const message = {};
  Space.findOne({
    where: {
      spaceId: req.params.spaceId
    }
  }).then((space) => {
    Office.findAll({
      order: [['"createdAt"', 'ASC']]
    }).then((offices) => {
      loginUser(req.user, (result) => {
        res.render('admin/spaceupdate', {
          title: title,
          configVars: configVars,
          loginUser: result,
          message: message,
          offices: offices,
          space: space
        });
      });
    });
  });
});

router.post('/space/update', adminEnsurer, (req, res, next) => {
  const dataObject = {
    spacename: req.body.spacename,
    capacity: req.body.capacity,
    officeId: req.body.officeId
  }
  const filter = {
    where: {
      spaceId: req.body.spaceId
    }
  }
  // DBの更新処理
  Space.update(dataObject, filter).then(() => {
    res.redirect('/admin');
  });
});

router.get('/space/delete/:spaceId', adminEnsurer, (req, res, next) => {
  const dataObject = {
    deleted: true
  }
  const filter = {
    where: {
      spaceId: req.params.spaceId
    }
  }
  // DBの更新処理
  Space.update(dataObject, filter).then(() => {
    res.redirect('/admin/space');
  });
});

router.post('/space/close', adminEnsurer, (req, res, next) => {
  const datePickerStart = req.body.datePickerStart;
  const datePickerEnd = req.body.datePickerEnd;
  const resultArrayStart = datePickerStart ? datePickerStart.match(/^(\d+)年(\d+)月(\d+)日/) : null;
  const resultArrayEnd = datePickerEnd ? datePickerEnd.match(/^(\d+)年(\d+)月(\d+)日/) : null;
  const dayofweekArray = req.body.dayofweek ? req.body.dayofweek : [];
  const dayofweekString = Array.isArray(dayofweekArray) ? dayofweekArray.join(',') : dayofweekArray; 
  const dataObject = {
    spaceId: req.body.spaceId,
    valid: true,
    startdate: resultArrayStart ? new Date(resultArrayStart[1], resultArrayStart[2] - 1, resultArrayStart[3]) : new Date(),
    enddate: resultArrayEnd ? new Date(resultArrayEnd[1], resultArrayEnd[2] - 1, resultArrayEnd[3]) : null,
    dayofweek: dayofweekString !== '' ? dayofweekString : null,
    permanent: req.body.permanent ? true : false,
    createdBy: req.user.userId
  }
  Close.create(dataObject).then((c) => {
    // お休み設定データの作成に成功
    res.redirect('/admin/space');
  }).catch((error) => {
    // お休み設定データの作成に失敗
    throw new Error(error);
  });
});

router.post('/space/close/cancel', adminEnsurer, (req, res, next) => {
  const dataObject = {
    valid: false
  }
  const filter = {
    where: {
      closeId: req.body.closeId
    }
  }
  // DBの更新処理
  Close.update(dataObject, filter).then(() => {
    res.redirect('/admin/space');
  });
});

module.exports = router;
