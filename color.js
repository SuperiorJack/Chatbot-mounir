'use strict';
const config = require('./config');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {
    readUserColor: function (callback, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query('SELECT color FROM colors WHERE fb_id=$1',
                    [userId],
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            callback('');
                        } else {
                            console.log("--------------- RESULT ---------------", result)
                            callback(result.rows[0]['color']);
                        };
                    });
        });
        pool.end();
    },

    updateUserColor: function (color, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query(`SELECT color FROM colors WHERE fb_id='${userId}' LIMIT 1`,
                function (err, result) {
                    console.log('Query result: ' + result);
                    if (err) {
                        console.log('Query error: ' + err);
                    } else {
                        let sql;
                        if (result.rows.length === 0) {
                            sql = 'INSERT INTO colors (color, fb_id) VALUES ($1, $2)';
                        } else {
                            sql = 'UPDATE colors SET color=$1 WHERE fb_id=$2';
                        }
                        client.query(sql,
                            [
                                color,
                                userId
                            ]);
                    }
                }
            );
        });
        pool.end();
    }
}
