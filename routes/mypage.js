'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const configVars = require('./config-vars');
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

router.get('/', authenticationEnsurer, (req, res, next) => {
  const title = 'ご予約一覧 | SERVICE NAME';
  loginUser(req.user, (result) => {
    res.render('mypage', {
      title: title,
      configVars: configVars,
      loginUser: result
    });
  });
});

router.get('/myReservations', authenticationEnsurer, (req, res, next) => {
  const periods = new Periods();
  Reservation.findAll({
    include: [
      {
        model: Space,
        attributes: ['spacename']
      }
    ],
    where: {
      createdBy: req.user.userId
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
        reservation.dataValues.formattedDate = moment(reservation.date).tz('Asia/Tokyo').format('YYYY年MM月DD日');
        reservation.dataValues.periodname = periods[reservation.periodnum].periodname;
        reservation.dataValues.officename = spaceOfficeObject[reservation.spaceId].officename;
        reservation.dataValues.spacename = reservation.space.spacename;
      });
      res.json(r);
    });
  });
});

module.exports = router;
