'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();
const MAIL_SMTP_HOST  = process.env.MAIL_SMTP_HOST;
const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER;
const MAIL_AUTH_PASSWORD = process.env.MAIL_AUTH_PASSWORD;

module.exports = class Sendmail {
  constructor(params) {

this.messageBody = `${params.guestname} 様
予約確認メールのテストです。

【ご予約施設】
${params.officename}
${params.spacename}

【ご予約日時】
${params.year}年 ${params.month}月 ${params.day}日 (${params.dayofweekstring}) ${params.periodname}

`;

    this.message = {
      from: 'ツモリンク <' + MAIL_AUTH_USER + '>',
      to: params.to,
      subject: '［予約サービス］ご予約完了のお知らせ',
      text: this.messageBody
    };
    this.smtpConfig = {
      host: MAIL_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: MAIL_AUTH_USER,
        pass: MAIL_AUTH_PASSWORD
      }
    };
    this.transporter = nodemailer.createTransport(this.smtpConfig);
  }

  send() {
    this.transporter.sendMail(this.message, (error, response) => {
      if (error) {
        // 後でエラー処理をする
        console.log(error);
      } else {
        console.log(response);
      }
    });
  }
  
}
