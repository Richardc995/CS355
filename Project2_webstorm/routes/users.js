var express = require('express');
var router = express.Router();
var user_dal = require('../model/user_dal')
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/all', function(req, res, next) {
  user_dal.GetAll(function (err, result) {
        if (err) throw err;

        res.render('displayAllUsers.ejs', {rs: result});
      }
  );
});

router.get('/create', function(req, res, next) {
  res.render('userFormCreate.ejs');
});

router.get('/save', function(req, res, next) {
    console.log('First Name: ' + req.query.firstname);
    console.log('Last Name: ' + req.query.lastname);
    console.log('Email: ' + req.query.email);
    console.log('Password: ' + req.query.password);

    user_dal.Insert(req.query, function (err, results) {
        if (err){
            res.send(err)
        }else{
            res.send('Successfully saved to database')
        }

    })
});

module.exports = router;
