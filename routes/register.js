var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  const roles = [
    {num: 1, name: 'スーパー'},
    {num: 2, name: '管理者'},
    {num: 3, name: 'ユーザー'}
  ];
  res.render('register', {
    title: '新規ユーザー登録',
    roles: roles
  });
});

router.post('/', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;
  console.log(username);
  console.log(password);
  console.log(role);
  // DBへの登録処理
});

module.exports = router;
