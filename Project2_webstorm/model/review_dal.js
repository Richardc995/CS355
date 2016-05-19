/**
 * Created by richa_000 on 5/16/2016.
 */
var mysql   = require('mysql');
var db  = require('../model/db_connections.js');
/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM rating_view;',
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


exports.GetByID = function(game_id, callback) {
    console.log(game_id);
    var query = 'SELECT * FROM rating_view WHERE game_id=' + game_id + ';';
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

exports.Insert = function(review_info, callback) {
    var dynamic_query = 'INSERT INTO rating(user_id, game_id, rating, comment) VALUES ( get_user_id( ' + '\'' + review_info.user + '\'' +
        '), get_game_id( ' + '\'' + review_info.title + '\'), ' + '\'' + review_info.rating + '\', ' + '\'' + review_info.textarea + '\');';
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
