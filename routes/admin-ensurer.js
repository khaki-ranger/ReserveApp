'use strict';

function ensure(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role === 1 || req.user.role === 2) {
      return next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
}

module.exports = ensure;
