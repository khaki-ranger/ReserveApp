'use strict';

function ensure(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role === 1) {
      return next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
}

module.exports = ensure;
