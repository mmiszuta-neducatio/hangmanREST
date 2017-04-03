const express = require('express');
const router = express.Router();
const animals = require('animals');
const Hangman = require('../hangman');


let activeGame;
let gameStats = {
    'won': 0,
    'lost': 0
};

function newGame(session, callback) {
    let body = animals();
    body = body.replace(/(\r\n|\n|\r)/gm, '');
    let game = new Hangman(body);
    session.game = game;
    session.save();
    callback(session.game.guessedLetters);
}

function loadGame(gameSession) {
    activeGame = new Hangman(gameSession.word, gameSession.attemptedLetters, gameSession.guessedLetters, gameSession.attempts);
};
router.get('/game', function (req, res) {
    if (req.session && req.session.game) {
        loadGame(req.session.game);
        res.send({
            'guessedLetters': activeGame.guessedLetters,
            'attemptedLetters': activeGame.attemptedLetters,
            'remainingAttempts': activeGame.maxAttempts - activeGame.attempts
        });
    } else {
        newGame(req.session, function (guessedLetters) {
            res.send({
                'guessedLetters': guessedLetters,
                'gameStats': gameStats
            });
        });
    }
});

router.get('/letter/:letter', function (req, res) {
    if (req.session.game) {
        loadGame(req.session.game);
        let json = activeGame.validateLetter(req.params.letter);
        req.session.game = activeGame;
        req.session.save();

        if (json.isGameOver) {
            req.session.game = null;
            req.session.save();
            if (json.gameOverType === 'win') {
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

module.exports = router;