'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const authenticationEnsurer = require('./authentication-ensurer');
const Office = require('../models/office');
const Space = require('../models/space');
const Periods = require('./periods');

router.get('/space/:spaceid/period/:periodnum/year/:year/month/:month/day/:day', authenticationEnsurer, (req, res, next) => {
  const title = '予約 | SERVICE NAME';
  const message = {};
  const periods = new Periods();
  const date = new Date(req.params.year, req.params.month, req.params.day);
  const dayofweeknum = date.getDay();
  const dayofweekstring = ['日', '月', '火', '水', '木', '金', '土'][dayofweeknum];
  Space.findOne({
    include: [
      {
        model: Office,
        attributes: ['officeId', 'officename']
      }
    ],
    where: {
      spaceId: req.params.spaceid
    }
  }).then((s) => {
    if(s) {
      const params = {
        officename: s.office.officename, 
        spaceId: req.params.spaceid,
        spacename: s.spacename,
        periodnum: req.params.periodnum,
        periodname: periods[req.params.periodnum].periodname,
        year: req.params.year,
        month: req.params.month,
        day: req.params.day,
        dayofweekstring: dayofweekstring
      };
      loginUser(req.user, (result) => {
        res.render('reserve', {
          title: title,
          loginUser: result,
          message: message,
          params: params
        });
      });
    } else {
      console.log('スペースが見つかりませんでした');
    }
  });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
