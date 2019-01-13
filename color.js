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
                .query(
                    'SELECT color FROM public.color WHERE fb_id=$1',
                    [userId],
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            callback('');
                        } else {
                            callback(result.rows[0]['color']);
                        };
                    });
            done();
        });
        pool.end();
    },

    updateUserColor: function (color, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }

            let sql1 = `SELECT color FROM color WHERE fb_id='${userId}' LIMIT 1`;
            client
                .query(sql1,
                    function (err, result) {
                        if (err) {
                            console.log('Query error: ' + err);
                        } else {
                            let sql;
                            if (result.rows.length === 0) {
                                sql = 'INSERT INTO public.color (color, fb_id) VALUES ($1, $2)';
                            } else {
                                sql = 'UPDATE public.color SET color=$1 WHERE fb_id=$2';
                            }
                            client.query(sql,
                                [
                                    color,
                                    userId
                                ]);
                        }
                    }
                );

            done();
        });
        pool.end();
    }


}
