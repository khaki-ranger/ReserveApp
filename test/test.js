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

describe('/reserve', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ userId: '86ef67f0-b036-11e9-926d-1338c82e144a', username: 'testUser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('予約が作成出来て、表示される', (done) => {
    request(app)
      .post('/reserve')
      .send({
        spaceId: 'e3e4d3b0-6ada-11e9-b8c5-99f2cd71083a',
        date: new Date(),
        startperiodnum: 1,
        endperiodnum: 2,
        guestname: 'testUser',
        mailaddress: 'testUser@test.com',
        createdBy: '86ef67f0-b036-11e9-926d-1338c82e144a',
        canceled: false
      })
      .expect('Location', '/')
      .expect(302, done);
  });

});
