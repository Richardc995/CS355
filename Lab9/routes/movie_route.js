var express = require('express');
var router = express.Router();
var movieDal   = require('../model/movie_dal');

router.get('/all', function(req, res) {
  movieDal.GetAll(function (err, result) {
          if (err) throw err;
		  //NOTE: res.send() will return plain text to the browser.
          //res.send(result);
		  
		  //res.render() will return render the template provided
          res.render('displayAllMovies.ejs', {rs: result});
        }
    );
});

router.get('/', function (req, res) {
  movieDal.GetByID(req.query.movie_id, function (err, result) {
          if (err) throw err;

          res.render('displayMovieInfo.ejs', {rs: result, account_id: req.query.account_id});
        }
    );
});

router.get('/create', function(req, res, next) {
    res.render('movieFormCreate.ejs');
});

router.get('/save', function(req, res, next) {

    movieDal.Insert(req.query, function (err, results) {
        if (err){
            res.send(err)
        }else{
            res.send('Successfully saved to database')
        }

    })
});

module.exports = router;
