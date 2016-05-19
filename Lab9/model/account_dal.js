var mysql   = require('mysql');
var db  = require('./db_connections.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetByID = function(account_id, callback) {
    console.log(account_id);
    var query = 'SELECT * FROM account_info_view WHERE account_id=' + account_id;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM account;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        }
    );
}

exports.Insert = function(user_info, callback) {
    var dynamic_query = 'INSERT INTO account (first_name, last_name, username) VALUES (' +
        '\'' + user_info.firstname + '\', ' +
        '\'' + user_info.lastname + '\', ' +
        '\'' + user_info.username + '\' ' +
        ');';
    console.log(dynamic_query);
    connection.query(dynamic_query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
};