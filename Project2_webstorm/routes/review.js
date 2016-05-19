
var express = require('express');
var router = express.Router();
var review_dal   = require('../model/review_dal');
var game_dal   = require('../model/game_dal');

router.get('/all/', function(req, res) {
    review_dal.GetAll(function (err, result) {
            if (err) throw err;

            res.render('displayAllReviews.ejs', {rs: result});
        }
    );
});



router.get('/create', function (req, res) {

});

router.get('/', function (req, res) {
    review_dal.GetByID(req.query.game_id, function (err, result) {
            if (err) throw err;

            res.render('displayAllReviews.ejs', {rs: result, game_id: req.query.game_id});
        }
    );
});

router.get('/save', function(req, res, next) {
    review_dal.Insert(req.query, function (err, results) {
        if (err){
            res.send(err)
        }else{
            res.send('Successfully saved to database')
        }

    })
});

module.exports = router;