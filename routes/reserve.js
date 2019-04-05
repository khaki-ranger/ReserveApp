'use strict';
const express = require('express');
const router = express.Router();
require('dotenv').config();
const MAIL_SMTP_HOST  = process.env.MAIL_SMTP_HOST;
const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER;
const MAIL_AUTH_PASSWORD = process.env.MAIL_AUTH_PASSWORD;
const nodemailer = require('nodemailer');
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');
const Periods = require('./periods');
const Office = require('../models/office');
const Space = require('../models/space');
const Reservation = require('../models/reservation');

const sendMail = ((params) => {

const messageBody = `${params.guestname} 様
予約確認メールのテストです。

【ご予約施設】
${params.officename}
${params.spacename}

【ご予約日時】
${params.year}年 ${params.month}月 ${params.day}日 (${params.dayofweekstring}) ${params.periodname}

`;

  const message = {
    from: 'ツモリンク <' + MAIL_AUTH_USER + '>',
    to: params.to,
    subject: '［予約サービス］ご予約完了のお知らせ',
    text: messageBody
  };
  const smtpConfig = {
    host: MAIL_SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: MAIL_AUTH_USER,
      pass: MAIL_AUTH_PASSWORD
    }
  };
  const transporter = nodemailer.createTransport(smtpConfig);
  transporter.sendMail(message, (error, response) => {
    if (error) {
      // 後でエラー処理をする
      console.log(error);
    } else {
      console.log(response);
    }
  });
});

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
    // 後でエラー処理をする
    res.json('エラー');
  } else {
    const date = new Date(req.body.year, req.body.month - 1, req.body.day);
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
          console.log(err);
        } else {
          response.guestname = r.guestname;
          response.to = r.mailaddress;
          response.createdAt = r.createdAt;
          sendMail(response); 
        }
      });
      res.redirect('/');
    }).catch((error) => {
      console.log(error);
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
        res.redirect('/mypage');
      });
    } else {
      // 後でエラー処理をする
      console.log('userIdが一致しません');
      res.redirect('/');
    }
  });
});

module.exports = router;
