const animals     = require('animals');
const Hangman     = require('../hangman');
const stats = require('../server');

let activeGame;
let gameStats = {
   'won': 0,
  'lost': 0
};

function newGame(session, callback){
  let body = animals();
  body = body.replace(/(\r\n|\n|\r)/gm, '');
  let game = new Hangman(body);
  session.game = game;
  session.save();
  callback(session.game.guessedLetters);
}

function loadGame(gameSession){
  activeGame = new Hangman(gameSession.word, gameSession.attemptedLetters, gameSession.guessedLetters, gameSession.attempts);
};