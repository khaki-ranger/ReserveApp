'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');

describe('/login', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ userId: '86ef67f0-b036-11e9-926d-1338c82e144a', username: 'testUser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログイン時はユーザー名が表示される', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/testUser/)
      .expect(200, done);
  });

});

describe('/logout', () => {

  it('ログアウトした際には、/にリダイレクトされる', (done) => {
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done);
  });

});
