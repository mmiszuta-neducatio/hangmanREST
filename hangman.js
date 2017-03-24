'use strict';

let Hangman = function Hangman(word, attemptedLetters, guessedLetters, attempts) {
  word = word.toUpperCase();
  word.split('');
  this.word = word;
  this.attemptedLetters = attemptedLetters || [];
  this.guessedLetters = guessedLetters || new Array(word.length);
  if (word.indexOf('-') !== -1) {
    this.guessedLetters[word.indexOf('-')] = '-';
  }
  this.attempts = attempts || 0;
};

Hangman.prototype = {
  maxAttempts: 6,

  isWordGuessed: function(guessed, word) {
    for(let i = guessed.length; i--;) {
      if(guessed[i] !== word[i]){
        return false;
      }
    }
    return true;
  },

  isGameOver: function() {
    if (this.attempts >= this.maxAttempts) {
      return { 'isGameOver': true, 'gameOverType': 'loss' };
    }
    if (this.isWordGuessed(this.guessedLetters, this.word)) {
      return { 'isGameOver': true, 'gameOverType': 'win' };
    }
    return { 'isGameOver': false };
  },

  validateLetter: function(letter) {
    let isValid = false;
    letter = letter.toUpperCase();

    if (this.attemptedLetters.indexOf(letter) === -1) {
      this.attemptedLetters.push(letter);

      for(let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          isValid = true;
          this.guessedLetters[i] = letter;
        }
      }
      if (!isValid) {
        this.attempts = this.attempts + 1;
      }
    }
    let response = this.isGameOver();
    response.isValid = isValid;
    response.guessedLetters = this.guessedLetters;
    response.attemptedLetters = this.attemptedLetters;
    response.remainingAttempts = this.maxAttempts - this.attempts;
    return response;
  }
};

module.exports = Hangman;
