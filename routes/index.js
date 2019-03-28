'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Office = require('../models/office');
const Space = require('../models/space');

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
