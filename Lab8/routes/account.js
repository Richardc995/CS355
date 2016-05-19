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
module.exports = router;
