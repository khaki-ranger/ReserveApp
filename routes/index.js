'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

const getDayOfWeekString = ((dateObj) => {
  const dayOfWeekNum = dateObj.getDay();
  const dayOfWeekstring = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeekNum];
  return dayOfWeekstring;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'SERVICE NAME';
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    // ログイン済
    let currentDay = new Date();
    if (req.query.year && req.query.month && req.query.day) {
      currentDay = new Date(req.query.year, req.query.month - 1, req.query.day);
    }
    const currentDate = {
      year: currentDay.getFullYear(),
      month: currentDay.getMonth() + 1,
      day: currentDay.getDate(),
      dayOfWeekString: getDayOfWeekString(currentDay)
    }
    const startDate = new Date(currentDate.year, currentDate.month - 1, currentDate.day);
    console.log('Start : ' + startDate);
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
                  console.log(reservation);
                  periods[reservation.periodnum].isSelf = true;
                  periods[reservation.periodnum].reservationId = reservation.reservationId;
                }
              });
            }
            space['periods'] = periods;
          });
          loginUser(req.user, (result) => {
            res.render('index', {
              title: title,
              loginUser: result,
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
    });
  }
});

module.exports = router;
