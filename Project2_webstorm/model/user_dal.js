var mysql   = require('mysql');
var db  = require('../model/db_connections.js');
/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM user_info_view ORDER BY first_name;',
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
};


exports.GetByID = function(user_id, callback) {
    console.log(user_id);
    var query = 'SELECT * FROM user_info_view WHERE user_id=' + user_id;
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
};

exports.Insert = function(user_info, callback) {
    var dynamic_query = 'INSERT INTO user (first_name, last_name, email, passkey) VALUES (' +
        '\'' + user_info.firstname + '\', ' +
        '\'' + user_info.lastname + '\', ' +
        '\'' + user_info.email + '\', ' +
        '\'' + user_info.password + '\'' +
        ');';

    // console.log("test");
    // console.log(dynamic_query);

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

