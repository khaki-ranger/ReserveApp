'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');

// 仮データ
// 後にDBから取得する
const r = [
  {
    id: 1,
    userId: '48cb2540-5041-11e9-a06c-1d597b669eb2',
    spaceId: '182de6a0-5147-11e9-b2a3-87358e6d1f52',
    date: '2019-03-28 10:49:00.173+00',
    periodNum: 6,
    guestname: '寺島洋平',
    mailaddress: 'suzuki@mail.com',
    canceled: false
  },
  {
    id: 2,
    userId: '48cb2540-5041-11e9-a06c-1d597b669eb2',
    spaceId: 'dc275e50-514d-11e9-87ec-7dd538d6d6ff',
    date: '2019-03-28 10:49:00.173+00',
    periodNum: 2,
    guestname: '山田太郎',
    mailaddress: 'nakamura@mail.com',
    canceled: false
  },
  {
    id: 3,
    userId: '48cb2540-5041-11e9-a06c-1d597b669eb2',
    spaceId: 'dc275e50-514d-11e9-87ec-7dd538d6d6ff',
    date: '2019-03-28 10:49:00.173+00',
    periodNum: 7,
    guestname: 'ロナルド=レーガン',
    mailaddress: 'nakamura@mail.com',
    canceled: false
  },
];

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'SERVICE NAME';
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    // ログイン済
    Office.findAll({
      order: [['"createdAt"', 'ASC']]
    }).then((offices) => {
      Space.findAll({
        include: [
          {
            model: Office,
            attributes: ['officeId']
          }
        ],
        order: [['"createdAt"', 'ASC']]
      }).then((s) => {
        // Reservationsのデータが取得できることを想定
        // key = spaceId, value = [予約]
        const reservationObject = {};
        r.forEach((reservation) => {
          if(!reservationObject[reservation.spaceId]) {
            reservationObject[reservation.spaceId] = [];
          }
          reservationObject[reservation.spaceId].push(reservation);
        });
        // officeに属するspaceの情報を配列で持つオブジェクトを作成
        // key = officeId, value = [スペース]
        const officeSpaceObject = {};
        s.forEach((space) => {
          if (!officeSpaceObject[space.officeId]) {
            officeSpaceObject[space.officeId] = [];
          }
          officeSpaceObject[space.officeId].push(space);
          // 個々のオフィスの予定を表現するインスタンスを作成
          const periods = new Periods();
          const reservations = reservationObject[space.spaceId];
          if (reservations && reservations.length > 0) {
            reservations.forEach((reservation) => {
              periods[reservation.periodNum].availability = false;
            });
          }
          space['periods'] = periods;
        });
        loginUser(req.user, (result) => {
          res.render('index', {
            title: title,
            loginUser: result,
            offices: offices,
            officeSpaceObject: officeSpaceObject
          });
        });
      });
    });
  } else {
    // 未ログイン
    res.render('index', {
      title: title,
    });
  }
});

module.exports = router;
