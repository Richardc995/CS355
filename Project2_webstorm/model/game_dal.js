var mysql   = require('mysql');
var db  = require('../model/db_connections.js');
/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM game_info_view ORDER BY title;',
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


exports.GetByID = function(game_id, callback) {
     console.log(game_id);
     var query = 'SELECT * FROM game_info_view WHERE game_id=' + game_id;
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

exports.Insert = function(game_info, callback) {
    var dynamic_query = 'INSERT INTO video_game (title, genre, platform, release_date, publisher_id) VALUES (' +
        '\'' + game_info.title + '\', ' +
        '\'' + game_info.genre + '\', ' +
        '\'' + game_info.platform + '\', ' +
        '\'' + game_info.release_date + '\' , ' +
        'get_publisher_id( ' + '\'' + game_info.publisher + '\'' + '));';
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

}
