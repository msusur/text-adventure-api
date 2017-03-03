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
  });
});