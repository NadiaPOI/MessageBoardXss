const request = require('supertest');

const app = require('./app');
const agent = request.agent(app);

describe('app', () => {
  describe('when authenticated', () => {
    beforeEach(async () => {
      await agent
        .post('/login')
        .send('username=randombrandon&password=randompassword');
    });

    describe('POST /messages', () => {
      describe('with non-empty content', () => {
        describe('with JavaScript code in personalWebsiteURL', () => {
          it('responds with error', async (done) => {
            const data =
              "content=&personalWebsiteURL=javascript:alert('hacked')";
            const response = await agent.post('/messages').send(data);
            expect(response.status).toBe(400);
            done();
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success', async (done) => {
            const data = 'content=google&personalWebsiteURL=http://google.com';
            const response = await agent.post('/messages').send(data);
            expect(response.status).toBe(201);
            done();
          });
        });
      });
    });
  });
});
