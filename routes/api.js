'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const configVars = require('./config-vars');
const loginUser = require('./login-user');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

router.get('/', (req, res, next) => {
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    // 日付取得
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
    const startDate = new Date(current.year(), current.month(), current.date());
    // データ取得
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
            date: startDate
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
            space.dataValues['periods'] = periods;
            if (!officeSpaceObject[space.officeId]) {
              officeSpaceObject[space.officeId] = [];
            }
            officeSpaceObject[space.officeId].push(space);
          });
          const responseData = {
            currentDate: currentDate,
            offices: offices,
            officeSpaceObject: officeSpaceObject
          };
          res.json(responseData);
        });
      });

    });
  } else {
    res.json([]);
  }
});

module.exports = router;