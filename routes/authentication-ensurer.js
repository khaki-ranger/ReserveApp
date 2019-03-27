'use strict';

function ensure(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  // ログインしていない場合はトップページにリダイレクトする
  res.redirect('/');
}

module.exports = ensure;
