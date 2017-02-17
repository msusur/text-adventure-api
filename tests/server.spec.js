const chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  server = require('../bin/server'),
  request = require('supertest');

chai.should();
chai.use(sinonChai);

describe('server', () => {
  describe('constructor', () => {
    it('should create an express application', () => {
      // Act
      var svr = new server.Server();

      // Assert
      expect(svr.app).not.toBeNull();
    });

    describe('routes', () => {
      it('should register a route', () => {
        // Arrange
        var svr = new server.Server();

        var fooRoute = {
          register: (p, router) => {
            router.get(p, (req, res) => {
              res.end('bar');
            });
          }
        };

        // Act
        svr.routes('/foo', fooRoute);

        // Assert
        request(svr.app)
          .get('/foo')
          .expect('bar').end((err, res) => {
            if (err) {
              throw err;
            }
          })
      });
    });
  });
});