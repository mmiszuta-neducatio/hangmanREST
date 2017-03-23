'use strict';

const expect = require('chai').expect;
const Hangman = require('../hangman');

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
