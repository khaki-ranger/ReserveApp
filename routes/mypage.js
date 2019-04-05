'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

router.get('/', authenticationEnsurer, (req, res, next) => {
  const title = 'ご予約一覧 | SERVICE NAME';
  const periods = new Periods();
  Reservation.findAll({
    include: [
      {
        model: Space,
        attributes: ['spacename']
      }
    ],
    where: {
      canceled: false
    },
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
        res.render('mypage', {
          title: title,
          loginUser: result,
          reservations: r
        });
      });
    });
  });
});

module.exports = router;
