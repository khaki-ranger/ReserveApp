'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Office = require('../models/office');
const Space = require('../models/space');

// ピリオド（コマ）を表現するクラスを定義
class Periods {
  constructor() {
    const periods = {
      1: {
        num: 1,
        periodname: '9:00 - 10:00',
        availability: true
      },
      2: {
        num: 2,
        periodname: '10:00 - 11:00',
        availability: true
      },
      3: {
        num: 3,
        periodname: '11:00 - 12:00',
        availability: true
      },
      4: {
        num: 4,
        periodname: '12:00 - 13:00',
        availability: true
      },
      5: {
        num: 5,
        periodname: '13:00 - 14:00',
        availability: true
      },
      6: {
        num: 6,
        periodname: '14:00 - 15:00',
        availability: true
      },
      7: {
        num: 7,
        periodname: '15:00 - 16:00',
        availability: true
      },
      8: {
        num: 8,
        periodname: '16:00 - 17:30',
        availability: true
      }
    };
    return periods;
  }
}

// 仮データ
// 後にDBから取得する
const reservations = [
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
  }
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
      }).then((spaces) => {
        offices.forEach((office) => {
          const spacesArray = [];
          spaces.forEach((space) => {
            if(office.officeId === space.officeId) {
              // 個々のオフィスの予定を表現するインスタンスを作成
              const periods = new Periods();
              reservations.forEach((reservation) => {
                if(space.spaceId === reservation.spaceId) {
                  periods[reservation.periodNum].availability = false;
                }
              });
              space['periods'] = periods;
              spacesArray.push(space);
            }
          });
          office['spaces'] = spacesArray;
        });
        loginUser(req.user, (result) => {
          res.render('index', {
            title: title,
            loginUser: result,
            offices: offices
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
