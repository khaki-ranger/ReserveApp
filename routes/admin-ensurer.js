'use strict';
require('dotenv').config();

function ensure(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.username === process.env.SUPER_USERNAME) {
      return next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
}

module.exports = ensure;
