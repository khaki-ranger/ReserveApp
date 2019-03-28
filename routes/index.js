'use strict';
const express = require('express');
const router = express.Router();
const loginUser = require('./login-user');
const Office = require('../models/office');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = '予約サービス';
  Office.findAll({
    order: [['"updatedAt"', 'ASC']]
  }).then((offices) => {
    loginUser(req.user, (result) => {
      res.render('index', {
        title: title,
        loginUser: result,
        offices: offices
      });
    });
  });
});

module.exports = router;
