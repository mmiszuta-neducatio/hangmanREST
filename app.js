'use strict'

var express     = require("express"),
app         = express(),
session     = require("express-session"),
redisStore  = require("connect-redis")(session),
http        = require("http"),
Hangman     = require("./hangman"),
path        = require("path"),
redis       = require("redis"),
animals     = require("animals");

var client = redis.createClient();

client.on("error", function(err){
  console.log("error" + err);
});


app.use(session({
  store: new redisStore({
    client: client
  }),
  secret: "I have no memory of this place",
  resave: false,
  saveUninitialized: true,
}))

var activeGame;
var gameStats {
  'won': 0,
  'lost':0
};

client.exists('gameStats', function(err, reply){
  if (reply === 1){
    console.log("it is there");
    client.hget('gameStats', 'won', function(err, reply){
      console.log(reply);
      gameStats.won = reply;
    });
  } else {
    client.hmset('gameStats', {
      'won': 0,
      'lost': 0
    });
  }
});


app.get("/game", function(req, res){
  if(req.session && req.session.gameOverType){
    loadGame(req.session.game);
    res.send({
      'guessedLetters': activeGame.guessedLetters,
      'attemptedLetters': activeGame.attemptedLetters,
      'remainingAttempts': activeGame.maxAttempts - activeGame.attempts;
    })
  } else {
    newGame(req.session, function(guessedLetters){
      res.send({
        'guessedLetters': guessedLetters,
        'gameStats': gameStats
      });
    });
  }
});
app.post('/letter/:letter', function(req, res){
  if(req.session.game){
    loadGame(req.session.game);
    var json = activeGame.validateLetter(req.params.letter);
    req.session.game = activeGame;
    req.session.save();

    if(json.isGameOver){
      req.session.game = null;
      req.session.save();
        if(json.gameOverType === win){
          gameStats.won++;
          client.hinsbry('gameStats', 'won', 1);
        } else {
          gameStats.lost++;
          client.hinsbry('gameStats', 'lost', 1);
        }
    }
    json.gameStats = gameStats;
    res.send(json);
  } else {
    res.status(412).end();
  }
})


animals();








var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "localhost";
var server    = app.listen(port, ipaddress);
