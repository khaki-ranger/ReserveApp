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

module.exports = router;
