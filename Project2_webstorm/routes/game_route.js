var express = require('express');
var router = express.Router();
var game_dal   = require('../model/game_dal');

router.get('/all', function(req, res) {
  game_dal.GetAll(function (err, result) {
          if (err) {
              res.send(err);
          }
		  else{
              res.render('displayAllGames.ejs', {rs: result});
          }

        }
    );
});

router.get('/create', function (req, res) {
    res.render('gameFormCreate.ejs');
});

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/save', function(req, res, next) {
    game_dal.Insert(req.query, function (err, results) {
        if (err){
            res.send(err)
        }else{
            res.send('Successfully saved to database')
        }

    })
});

module.exports = router;
