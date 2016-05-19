var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');

/* GET users listing. */
router.get('/', function(req, res, next) {
  account_dal.GetByID(req.query.account_id, function (err, result) {
        if (err) throw err;

        res.render('displayAccountInfo.ejs', {rs: result, account_id: req.query.account_id});
      }
  );
});

router.get('/all', function(req, res) {
    account_dal.GetAll(function (err, result) {
            if (err) throw err;
            //NOTE: res.send() will return plain text to the browser.
            //res.send(result);

            //res.render() will return render the template provided
            res.render('displayAllAccounts.ejs', {rs: result});
        }
    );
});

router.get('/create', function(req, res, next) {
    res.render('accountFormCreate.ejs');
});

router.get('/save', function(req, res, next) {
    console.log('First Name: ' + req.query.firstname);
    console.log('Last Name: ' + req.query.lastname);
    console.log('username: ' + req.query.email);

    account_dal.Insert(req.query, function (err, results) {
        if (err){
            res.send(err)
        }else{
            res.send('Successfully saved to database')
        }

    })
});
module.exports = router;
