'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Office = require('../models/office');
const Space = require('../models/space');

const period = [
  {
    periodId: 1,
    periodname: '9:00 - 10:00',
    availability: true
  },
  {
    periodId: 2,
    periodname: '10:00 - 11:00',
    availability: true
  },
  {
    periodId: 3,
    periodname: '11:00 - 12:00',
    availability: false
  },
  {
    periodId: 4,
    periodname: '12:00 - 13:00',
    availability: true
  },
  {
    periodId: 5,
    periodname: '13:00 - 14:00',
    availability: false
  },
  {
    periodId: 6,
    periodname: '14:00 - 15:00',
    availability: false
  },
  {
    periodId: 7,
    periodname: '15:00 - 16:00',
    availability: true
  },
  {
    periodId: 8,
    periodname: '16:00 - 17:30',
    availability: true
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = '予約サービス';
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
    }).then((spaces) => {
      offices.forEach((office) => {
        const officeId = office.officeId;
        const spacesArray = [];
        spaces.forEach((space) => {
          if(officeId === space.officeId) {
            space['periods'] = period;
            spacesArray.push(space);
          }
        });
        office['spaces'] = spacesArray;
      });
      loginUser(req.user, (result) => {
        res.render('index', {
          title: title,
          loginUser: result,
          offices: offices
        });
      });
    });
  });
});

module.exports = router;
