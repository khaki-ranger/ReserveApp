'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');
const Periods = require('./periods');
const Sendmail = require('./sendmail');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

const getParams = ((params, callback) => {
  const periods = new Periods();
  const date = new Date(params.year, params.month - 1 , params.day);
  const dayOfWeekNum = date.getDay();
  const dayofweekstring = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeekNum];
  Space.findOne({
    include: [
      {
        model: Office,
        attributes: ['officeId', 'officename']
      }
    ],
    where: {
      spaceId: params.spaceId
    }
  }).then((s) => {
    if(s) {
      const result = {
        officename: s.office.officename, 
        spaceId: params.spaceId,
        spacename: s.spacename,
        periodnum: params.periodnum,
        periodname: periods[params.periodnum].periodname,
        year: params.year,
        month: params.month,
        day: params.day,
        dayofweekstring: dayofweekstring
      }
      callback(null, result);
    } else {
      callbakc('スペースがありません');
    }
  });
});

router.get('/space/:spaceId/period/:periodnum/year/:year/month/:month/day/:day', authenticationEnsurer, (req, res, next) => {
  const title = '予約 | SERVICE NAME';
  const message = {};
  getParams(req.params, (err, params) => {
    if (err) {
      console.log(err);
    } else {
      loginUser(req.user, (result) => {
        res.render('reserve', {
          title: title,
          loginUser: result,
          message: message,
          params: params
        });
      });
    }
  });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const title = '予約 | SERVICE NAME';
  const message = {};
  const guestname = req.body.guestname;
  const mailaddress = req.body.mailaddress;
  // サーバー側でも値のチェック
  if (!guestname || !mailaddress) {
    if (!guestname ) {
      console.log('お名前が未入力です');
    }
    if (!mailaddress) {
      console.log('メールアドレスが未入力です');
    }
    throw new Error('お名前とメールアドレスを入力してください。');
  } else {
    const date = new Date(req.body.year, req.body.month - 1, req.body.day);
    Reservation.findOne({
      where: {
        spaceId: req.body.spaceId,
        date: date,
        periodnum: req.body.periodnum,
        canceled: false
      }
    }).then((already) => {
      if(already) {
        throw new Error('既に重複する予約があるため予約ができません。');
      } else {
        Reservation.create({
          spaceId: req.body.spaceId,
          date: date,
          periodnum: req.body.periodnum,
          guestname: guestname,
          mailaddress: mailaddress,
          createdBy: req.user.userId,
          canceled: false
        }).then((r) => {
          console.log('create reservation');
          const params = {
            spaceId: r.spaceId,
            periodnum: r.periodnum,
            year: req.body.year,
            month: req.body.month - 1,
            day: req.body.day
          };
          getParams(params, (error, response) => {
            if (error) {
              throw new Error(error);
            } else {
              response.canceled = false;
              response.guestname = r.guestname;
              response.to = r.mailaddress;
              response.createdAt = r.createdAt;
              const sendmail = new Sendmail(response);
              sendmail.send();
            }
          });
          res.redirect('/reserve/complete');
        }).catch((error) => {
          throw new Error(error);
        });
      }
    });
  }
});

router.get('/cancel/:reservationId', authenticationEnsurer, (req, res, next) => {
  Reservation.findOne({
    where: {
      reservationId: req.params.reservationId
    }
  }).then((r) => {
    if (req.user.userId === r.createdBy) {
      const param = {
        canceled: true
      };
      const filter = {
        where: {
          reservationId: req.params.reservationId
        }
      };
      Reservation.update(param, filter).then(() => {
        console.log('cancel reservation');
        const params = {
          spaceId: r.spaceId,
          periodnum: r.periodnum,
          year: r.date.getFullYear(),
          month: r.date.getMonth() + 1,
          day: r.date.getDate()
        };
        getParams(params, (error, response) => {
          if (error) {
            // 後でエラー処理をする
            console.log(error);
          } else {
            response.canceled = true;
            response.guestname = r.guestname;
            response.to = r.mailaddress;
            response.createdAt = r.createdAt;
            const sendmail = new Sendmail(response);
            sendmail.send();
          }
        });
        res.redirect('/reserve/complete/cancel');
      });
    } else {
      // 後でエラー処理をする
      console.log('userIdが一致しません');
      res.redirect('/');
    }
  });
});

router.get('/complete', authenticationEnsurer, (req, res, next) => { 
  const title = '予約完了 | SERVICE NAME';
  const message = {
    title: '予約を完了しました',
    body: 'メールを送信しました。'
  };
  loginUser(req.user, (result) => {
    res.render('complete', {
      title: title,
      loginUser: result,
      message: message
    });
  });
});

router.get('/complete/cancel', authenticationEnsurer, (req, res, next) => { 
  const title = '予約キャンセル完了 | SERVICE NAME';
  const message = {
    title: '予約のキャンセルを完了しました',
    body: 'メールを送信しました。'
  };
  loginUser(req.user, (result) => {
    res.render('complete', {
      title: title,
      loginUser: result,
      message: message
    });
  });
});

module.exports = router;
