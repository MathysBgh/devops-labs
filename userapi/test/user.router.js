const app = require('../src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../src/dbClient');

chai.use(chaiHttp);

describe('User REST API', () => {

  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  after(() => {
    app.close();
    db.quit();
  });

  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal('success');
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('GET /user', () => {
    it('successfully get user', (done) => {
      const newUser = {
        username: 'jaishan',
        firstname: 'Jaishan',
        lastname: 'Burton'
      };
    
      chai.request(app)
        .post('/user')
        .send(newUser)
        .then((res) => {
          chai.expect(res).to.have.status(201);
    
          chai.request(app)
            .get('/user/jaishan')
            .then((getResponse) => {
              chai.expect(getResponse).to.have.status(200);
              chai.expect(getResponse.body.status).to.equal('success');
              chai.expect(getResponse).to.be.json;
              const retrievedUser = getResponse.body.data; // Obtenir les données de l'utilisateur depuis la réponse
    
           
              // Vérifier que les données correspondent aux données créées
              chai.expect(retrievedUser.username).to.equal(newUser.username);
              chai.expect(retrievedUser.firstname).to.equal(newUser.firstname);
              chai.expect(retrievedUser.lastname).to.equal(newUser.lastname);
    
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
    });
    
    it('cannot get a user when it does not exist', (done) => {
      chai.request(app)
        .get('/user/nonexistentuser')
        .then((getResponse) => {
          chai.expect(getResponse).to.have.status(404);
          chai.expect(getResponse.body.status).to.equal('error');
          chai.expect(getResponse).to.be.json;
          chai.expect(getResponse.body.message).to.equal("L'utilisateur n'existe pas");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
