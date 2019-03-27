var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

// データモデルの読み込みと定義
var User = require('./models/user');
User.sync();

// セッションの利用
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// ユーザーID/パスワードを利用した認証ストラテジーの設定
passport.use(new LocalStrategy(
  function(username, password, done) {
    // username と password を確認して結果を返す
    User.findOne({
       where: {
         username: username
       }
    }).then((user) => {
      if (!user) {
        const message = 'ユーザーIDが正しくありません。';
        console.log(message);
        return done(null, false, { message: message });
      }
      if (user.password !== password) {
        const message = 'パスワードが正しくありません。';
        console.log(message);
        return done(null, false, { message: message });
      }
      return done(null, user);
    }).catch((err) => {
      if (err) {
         return done(err);
      }
    });
  }
));

// ルーターの読み込み
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ユーザー認証を行うための処理
app.use(session({
  secret: '66a23507e8f2',
  resave: false,
  saveUninitialized: false,
  cookie:{_expires : 86400000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/register',
                                   failureFlash: true })
);

// ルーターの定義
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
