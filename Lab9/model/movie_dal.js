var mysql   = require('mysql');
var db  = require('./db_connections.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM movie;',
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

exports.GetByID = function(movie_id, callback) {
    console.log(movie_id);
    var query = 'SELECT * FROM movie_info_view WHERE movie_id=' + movie_id;
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

exports.Insert = function(movie_info, callback) {
    var dynamic_query = 'INSERT INTO movie (title, tagline) VALUES (' +
        '\'' + movie_info.title + '\', ' +
        '\'' + movie_info.tagline + '\' ' +
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
 
