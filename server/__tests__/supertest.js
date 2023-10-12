const request = require('supertest');

const server = 'http://localhost:3000';

describe('Route integration', () =>{
  describe('/', () => {
    describe('GET', () => {
      it(`responds with a 404 status and the string: Oops! This isn't the right page.`, () => {
        return request(server)
          .get('/unknown')
          .expect(404);
      })
    })
  });
});