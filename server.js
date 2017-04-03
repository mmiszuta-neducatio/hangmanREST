'use strict';

const express     = require('express');
const app         = express();
const session     = require('express-session');
const RedisStore  = require('connect-redis')(session);
const Hangman     = require('./hangman');
const redis       = require('redis');
const animals     = require('animals');
const hangmanRoutes = require('./helpers/routes');

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

app.use(hangmanRoutes);
module.exports = app; // for testing purposes
