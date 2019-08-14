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
const Close = require('../models/close');

const getCurrentDate = ((query) => {
  let current  = moment().tz('Asia/Tokyo');
  let isToday = true; // 日付が本日であるかどうかを示す値を格納する変数
  if (query.year && query.month && query.day) {
    const currentDateObject = new Date(query.year, query.month - 1, query.day);
    const currentDateMomentObject = moment(currentDateObject).tz('Asia/Tokyo');
    isToday = current.isSame(currentDateMomentObject, 'day');
    current = currentDateMomentObject;
  }
  const response = {
    year: current.year(),
    month: current.month() + 1,
    day: current.date(),
    dayOfWeek: current.day(),
    dayOfWeekString: ['日', '月', '火', '水', '木', '金', '土'][current.day()],
    startDate: new Date(current.year(), current.month(), current.date()),
    isToday: isToday
  }
  return response
});

router.get('/officespacelist', function(req, res, next) {
  Office.findAll({
    raw: true,
    where: {
      deleted: false
    },
    order: [['"createdAt"', 'ASC']]
  }).then((officeList) => {
    Space.findAll({
      raw: true,
      where: {
        deleted: false
      },
      order: [['"createdAt"', 'ASC']]
    }).then((spaceList) => {
      // officeに属するspaceの情報を配列で持つオブジェクトを作成
      // key = officeId, value = [スペース]
      const officeSpaceObject = {};
      spaceList.forEach((space) => {
        // オブジェクトの中にofficeIdのキーが無いかどうか
        let officeId = space.officeId;
        if (!officeSpaceObject[officeId]) {
          // 無ければ空の配列を作成
          officeSpaceObject[officeId] = [];
        }
        // 不要なメンバを削除
        delete space.officeId;
        delete space.createdBy;
        delete space.deleted;
        delete space.createdAt;
        delete space.updatedAt;
        officeSpaceObject[officeId].push(space);
      });
      // オフィスに所属するスペースの配列を格納 
      officeList.forEach((office) => {
        if (officeSpaceObject[office.officeId]) {
          office.spaceList = officeSpaceObject[office.officeId];
        }
      });
      res.json(officeList);
    });
  });
});

router.get('/periodDataOfCurrentDay', (req, res, next) => {
  // 日付取得
  const currentDate = getCurrentDate(req.query);
  Reservation.findAll({
    raw: true,
    where: {
      spaceId: req.query.spaceId,
      date: currentDate.startDate,
      canceled: false
    }
  }).then((reservations) => {
    // 個々のスペースの予定を表現するインスタンスを作成
    const periods = new Periods();
    // 予約状況の情報を格納するための処理
    reservations.forEach((reservation) => {
      // 開始のコマから終了のコマまでを予約不可にするための処理
      for (let j = reservation.startperiodnum; j <= reservation.endperiodnum; j++) {
        periods[j].availability = false;
      }
    });
    res.json(periods);
    console.log(periods);
  });
});

module.exports = router;
