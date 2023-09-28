const { expect } = require('chai');
const userController = require('../src/controllers/user');
const db = require('../src/dbClient');

describe('User', () => {

  beforeEach((done) => {
    // Clean DB before each test
    db.flushdb((err) => {
      if (err) done(err);
      else done();
    });
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
      // Test that it's not possible to create a user with an existing username
      const existingUser = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      }

      // First, create an existing user
      userController.create(existingUser, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')

        // Now, try to create another user with the same username
        userController.create(existingUser, (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
  })
  // TODO Create test for the get method
describe('Get', () => {
  it('get a user by username', (done) => {
    // 1. First, create a user to make this unit test independent from the others
    const userToCreate = {
      username: 'jaishan',
      firstname: 'Jaishan',
      lastname: 'Burton'
    };

    userController.create(userToCreate, (err, result) => {
      expect(err).to.be.null;
      expect(result).to.equal('OK');

           // 2. Then, check if the result of the get method is correct
           userController.get('jaishan', (err, user) => {
            expect(err).to.be.null;
            
            // Vérifiez si l'utilisateur existe avec le nom d'utilisateur attendu
            if (user && user.username === 'jaishan') {
              expect(user.username).to.equal('jaishan');
              expect(user.firstname).to.equal('Jaishan');
              expect(user.lastname).to.equal('Burton');
            } else {
              // Si l'utilisateur n'existe pas ou a un nom d'utilisateur différent, vous pouvez générer une assertion d'échec.
              expect(user).to.exist;

            }    
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
