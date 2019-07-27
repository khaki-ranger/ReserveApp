'use strict';
const request = require('supertest');
const app = require('../app');

describe('/login', () => {

  it('ログインのためのフォームが含まれる', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<form action="\/login" method="post".*>/)
      .expect(200, done);
  });

});
