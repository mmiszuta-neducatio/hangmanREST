'use strict';

let Hangman = function Hangman(word, attemptedLetters, guessedLetters, attempts) {
  this.word = word.toUpperCase();
  this.attemptedLetters = attemptedLetters || [];
  this.guessedLetters = guessedLetters || [];
  this.attempts = attempts || 0;
}

Hangman.prototype = {
  maxAttempts: 6,

  isGameOver: function() {
    if (this.attempts >= this.maxAttempts) {
      return { 'isGameOver': true, 'gameOverType': 'loss' };
    } 
    if (this.guessedLetters.join('') === this.word) {
      return { 'isGameOver': true, 'gameOverType': 'win' };
    }
    return { 'isGameOver': false }
  },

  validateLetter: function(letter) {
    let isValid = false;
    letter = letter.toUpperCase();

    if (!this.attemptedLetters.includes(letter)) {
      this.attemptedLetters.push(letter);

      for(let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          isValid = true;
          this.guessedLetters[i] = letter;
        }
      }
      this.attempts = this.attempts + 1;
    }
    return isValid;
  }
}

module.exports = Hangman;