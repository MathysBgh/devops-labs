const { expect } = require('chai');
const userController = require('../src/controllers/user');
const db = require('../src/dbClient');

describe('User', () => {

  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
      userController.create(user, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.equal('OK');
        done();
      });
    });

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
      userController.create(user, (err, result) => {
        expect(err).to.not.be.null;
        expect(result).to.be.null;
        done();
      });
    });

    it('avoid creating an existing user', (done) => {
      const user = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      };

      // Check if the user already exists and handle it appropriately
      userController.create(user, (err, result) => {
        expect(err).to.not.be.null;
        expect(result).to.be.null;
        expect(err.message).to.equal('User already exists');
        done();
      });
    });
  });

  // TODO Create test for the get method
  describe('Get', () => {

    it('get a user by username', (done) => {
      const newUser = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
      userController.create(newUser, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.equal('OK');

        userController.get('jaishan', (getErr, getUser) => {
          expect(getErr).to.be.null;
          expect(getUser).to.deep.equal(newUser);
          done();
        });
      });
    });

    it('cannot get a user when it does not exist', (done) => {
      userController.get('nonexistentuser', (err, result) => {
        expect(err).to.not.be.null;
        expect(result).to.be.null;
        done();
      });
    });
  });
});
