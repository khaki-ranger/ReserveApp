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

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'SERVICE NAME';
  const currentDate = getCurrentDate(req.query);
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    loginUser(req.user, (result) => {
      res.render('index', {
        title: title,
        configVars: configVars,
        loginUser: result
      });
    });
  } else {
    res.render('index', {
      title: title,
      configVars: configVars,
      currentDate: currentDate
    });
  }
});

router.get('/dateOfCurrentDay', (req, res, next) => {
  // ログイン済かどうかで処理を分岐
  if (req.user) {
    // 日付取得
    const currentDate = getCurrentDate(req.query);
    // データ取得
    Office.findAll({
      where: {
        deleted: false
      },
      order: [['"createdAt"', 'ASC']]
    }).then((offices) => {
      Space.findAll({
        where: {
          deleted: false
        },
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
            date: currentDate.startDate
          }
        }).then((r) => {
          Close.findAll({
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
              closeObject[close.spaceId].push(close);
            });
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
              // スペースがお休みかどうかの判定
              space.flgClose = false;
              // お休み設定の情報を格納するための処理
              const closeArray = closeObject[space.spaceId];
              if (closeArray && closeArray.length > 0) {
                closeArray.forEach((closeData) => {
                  if(closeData.dayofweek){
                    // 曜日で設定
                    const dayOfWeekArray = closeData.dayofweek.split(',');
                    dayOfWeekArray.forEach((dayOfWeek) => {
                      if (Number(dayOfWeek) === currentDate.dayOfWeek) {
                        space.flgClose = true;
                      }
                    });
                  } else {
                    // 日付で設定
                    if(closeData.startdate.getTime() <= currentDate.startDate.getTime()) {
                      if (closeData.permanent) {
                        // 「以降ずっと」にチェックされた場合
                        space.flgClose = true;
                      } else {
                        if(closeData.enddate && closeData.enddate.getTime() >= currentDate.startDate.getTime()) {
                          space.flgClose = true;
                        }
                      }
                    }
                  }
                });
              }
              // お休みの場合は、予約情報に関する処理をスキップ
              if (!space.flgClose) {
                // 個々のスペースの予定を表現するインスタンスを作成
                const periods = new Periods();
                // 予約状況の情報を格納するための処理
                const reservations = reservationObject[space.spaceId];
                if (reservations && reservations.length > 0) {
                  reservations.forEach((reservation) => {
                    // 開始のコマから終了のコマまでを予約不可にするための処理
                    for (let j = reservation.startperiodnum; j <= reservation.endperiodnum; j++) {
                      periods[j].availability = false;
                      if(reservation.createdBy === req.user.userId){
                        const m = moment(reservation.date);
                        periods[j].isSelf = true;
                        periods[j].reservationId = reservation.reservationId;
                        periods[j].reservationStartTimeString = periods[reservation.startperiodnum].startTimeString;
                        periods[j].reservationEndTimeString = periods[reservation.endperiodnum].endTimeString;
                        periods[j].guestname = reservation.guestname;
                        periods[j].year = m.year();;
                        periods[j].month = m.month() + 1;
                        periods[j].day = m.date();
                        periods[j].dayofweek = ['日', '月', '火', '水', '木', '金', '土'][m.day()];
                      }
                    }
                  });
                }
                // コマ毎にデータを格納するための処理
                for (let key of Object.keys(periods)) {
                  periods[key].officename = space.office.officename;
                  periods[key].spacename = space.spacename;
                  periods[key].spaceId = space.spaceId;
                  // 予約が可能な範囲のデータを格納
                  // 以降のコマを予約可能にする
                  const reservablePeriods = [];
                  for (let i = key; i <= Object.keys(periods).length; i++) {
                    // 予約が重複しているかどうかの判定処理
                    if(periods[i].availability === false) {
                      break;
                    } else {
                      const reservablePeriodObject = {
                        num: periods[i].num,
                        endTimeString: periods[i].endTimeString
                      };
                      reservablePeriods.push(reservablePeriodObject);
                    }
                  }
                  periods[key].reservablePeriods = reservablePeriods;
                }
                if (currentDate.isToday) {
                  for (let key of Object.keys(periods)) {
                    const now  = moment().tz('Asia/Tokyo');
                    const hour  = now.hours();
                    if (hour >= periods[key].startTime) {
                      periods[key].availability = false;
                    }
                  }
                }
                space.dataValues['periods'] = periods;
              }
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
    });
  } else {
    res.json([]);
  }
});

module.exports = router;
