'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();
const MAIL_SMTP_HOST  = process.env.MAIL_SMTP_HOST;
const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER;
const MAIL_AUTH_PASSWORD = process.env.MAIL_AUTH_PASSWORD;

module.exports = class Sendmail {
  constructor(params) {

    if(!params.canceled) {
      this.subject = '［予約サービス］ご予約完了のお知らせ';
      this.bodyText = '予約完了メールのテストです。';
    } else {
      this.subject = '［予約サービス］ご予約キャンセルのお知らせ';
      this.bodyText = '予約キャンセルメールのテストです。';
    }

this.messageBody = `${params.guestname} 様
${this.bodyText}

【ご予約施設】
${params.officename}
${params.spacename}

【ご予約日時】
${params.year}年 ${params.month}月 ${params.day}日 (${params.dayofweekstring}) ${params.startiimestring}-${params.endtimestring}

`;

    this.message = {
      from: 'ツモリンク <' + MAIL_AUTH_USER + '>',
      to: params.to,
      subject: this.subject,
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
