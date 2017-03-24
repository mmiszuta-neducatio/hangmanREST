'use strict';

const chai   = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const Hangman = require('../hangman');
const server = require('../server');

describe('Hangman', function () {
  it('game should end if the word has been guessed (should return true if the game is over)', function () {
    let hangman = new Hangman('war', ['D', 'M', 'W', 'A'], ['W', 'A'], 4);
    expect(hangman.validateLetter('r').isGameOver).to.be.equal(true);
  });
  it('should continue the game if attempts did not meet max or the word hasn\'t been guessed (should return false if the game is NOT over)', function () {
    let hangman = new Hangman('war', ['D', 'M', 'W'], ['W'], 3);
    expect(hangman.validateLetter('g').isGameOver).to.be.equal(false);
  });
  it('should have gameOverType: win, if the game is won', function () {
    let hangman = new Hangman('war', ['D', 'M', 'W', 'A'], ['W', 'A'], 4);
    expect(hangman.validateLetter('r').gameOverType).to.be.equal('win');
  });
  it('should have gameOverType: loss, if the game is lost', function () {
    let hangman = new Hangman('war', ['D', 'M', 'W', 'A', 'S'], ['W', 'A'], 5);
    expect(hangman.validateLetter('g').gameOverType).to.be.equal('loss');
  });
});

chai.use(chaiHttp);
describe('Server', function () {
  it('/game should GET a new game or an existing one if it was created earlier', function () {
    chai.request(server)
    .get('/game')
    .end(function(err, res) {
      if (err) {
        console.error(err);
      }
      res.should.have.status(200);
      res.body.should.be.a('object');
      expect(body).to.have.property('guessedLetters');
      expect(body).to.have.property('gameStats');
    });
  });
  it('/letter/a should GET a response object', function () {
  chai.request(server)
    .get('/game')
    .end(function (err) {
      if (err) {
        throw (err);
      }
      chai.request(server)
        .get('/letter/a')
        .end(function (err, res) {
          if (err) {
            throw (err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(body).to.have.property('isGameOver');
          expect(body).to.have.property('isValid');
          expect(body).to.have.property('guessedLetters');
          expect(body).to.have.property('attemptedLetters');
          expect(body).to.have.property('remainingAttempts');
          expect(body).to.have.property('gameStats');
        });
      });
    });
  });
