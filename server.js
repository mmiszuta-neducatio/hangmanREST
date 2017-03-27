'use strict';

const express     = require('express');
const app         = express();
const session     = require('express-session');
const RedisStore  = require('connect-redis')(session);
const Hangman     = require('./hangman');
const redis       = require('redis');
const animals     = require('animals');

app.listen(3000, function () {
  console.log('listening on port: ', 3000);
});

let client = redis.createClient('6379', 'redis');
client.on('error', function(err){
  console.error('error' + err);
});


app.use(session({
  store: new RedisStore({
    client: client
  }),
  secret: 'I have no memory of this place',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false }
}));

let activeGame;
let gameStats = {
   'won': 0,
  'lost': 0
};

client.exists('gameStats', function(err, reply){
  if (err) {
    console.error(err);
  }
  if (reply === 1){
    client.hget('gameStats', 'won', function(err, reply){
      if (err) {
        console.error(err);
      }
      gameStats.won = reply;
    });
  } else {
    client.hmset('gameStats', {
      'won': 0,
      'lost': 0
    });
  }
});


app.get('/game', function(req, res){

  if(req.session && req.session.game){
    loadGame(req.session.game);
    res.send({
      'guessedLetters': activeGame.guessedLetters,
      'attemptedLetters': activeGame.attemptedLetters,
      'remainingAttempts': activeGame.maxAttempts - activeGame.attempts
    });
  } else {
    newGame(req.session, function(guessedLetters){
      res.send({
        'guessedLetters': guessedLetters,
        'gameStats': gameStats
      });
    });
  }
});

app.get('/letter/:letter', function(req, res){
  if(req.session.game){
    loadGame(req.session.game);
    let json = activeGame.validateLetter(req.params.letter);
    req.session.game = activeGame;
    req.session.save();

    if(json.isGameOver){
      req.session.game = null;
      req.session.save();
      if(json.gameOverType === 'win'){
        gameStats.won++;
        client.hincrby('gameStats', 'won', 1);
      } else {
        gameStats.lost++;
        client.hincrby('gameStats', 'lost', 1);
      }
    }
    json.gameStats = gameStats;
    res.send(json);
  } else {
    res.status(412).end();
  }
});


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

module.exports = app; // for testing purposes
