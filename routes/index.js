'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const loginUser = require('./login-user');
const configVars = require('./config-vars');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'SERVICE NAME';
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    // ログイン済
    let current  = moment().tz('Asia/Tokyo');
    if (req.query.year && req.query.month && req.query.day) {
      current = moment({
        year: req.query.year,
        month: req.query.month - 1,
        day: req.query.day
      });
    }
    const currentDate = {
      year: current.year(),
      month: current.month() + 1,
      day: current.date(),
      dayOfWeekString: ['日', '月', '火', '水', '木', '金', '土'][current.day()]
    }
    Office.findAll({
      order: [['"createdAt"', 'ASC']]
    }).then((offices) => {
      Space.findAll({
        include: [
          {
            model: Office,
            attributes: ['officeId', 'officename']
          }
        ],
        order: [['"createdAt"', 'ASC']]
      }).then((s) => {
        Reservation.findAll({
          where: {
            canceled: false, 
            date: new Date(current.year(), current.month(), current.date())
          }
        }).then((r) => {
          // 各スペース毎の予約の情報を配列で持つオブジェクトを作成
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
                periods[reservation.periodnum].availability = false;
                if(reservation.createdBy === req.user.userId){
                  const m = moment(reservation.date);
                  periods[reservation.periodnum].isSelf = true;
                  periods[reservation.periodnum].reservationId = reservation.reservationId;
                  periods[reservation.periodnum].guestname = reservation.guestname;
                  periods[reservation.periodnum].officename = space.office.officename;
                  periods[reservation.periodnum].spacename = space.spacename;
                  periods[reservation.periodnum].year = m.year();;
                  periods[reservation.periodnum].month = m.month() + 1;
                  periods[reservation.periodnum].day = m.date();
                  periods[reservation.periodnum].dayofweek = ['日', '月', '火', '水', '木', '金', '土'][m.day()];
                }
              });
            }
            space['periods'] = periods;
          });
          loginUser(req.user, (result) => {
            res.render('index', {
              title: title,
              loginUser: result,
              configVars: configVars,
              currentDate: currentDate,
              offices: offices,
              officeSpaceObject: officeSpaceObject
            });
          });
        });
      });
    });
  } else {
    // 未ログイン
    res.render('index', {
      title: title,
      configVars: configVars
    });
  }
});

module.exports = router;
