var r = require('rethinkdb');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

var api = module.exports = {};

var rethinkHost = process.env.RETHINKDB_DRIVER_SERVICE_HOST || 'localhost';

var db = 'wayback';
var table = 'captures';
var options = {
  host: rethinkHost,
  db: 'wayback'
};
var conn;

api.getCaptures = function getCaptures(opts, callback) {
  r.table(table)
    .orderBy(r.desc('createdAt'))
    .limit(100)
    .run(conn, function(err, cursor) {
      if (err) {
        return callback(err);
      }
      cursor.toArray(function(err, result) {
        if (err) {
          return callback(err);
        }
        _.each(result, function(capture) {
          capture.fromNow = moment(capture.createdAt).fromNow();
        });
        return callback(null, result);
      });
    })
}

api.writeCapture = function writeCapture(data, callback) {
  console.log('about to create data record for ', data);
  r.table(table).insert(data).run(conn, callback);
}

api.init = function (callback) {
  async.waterfall([
    function(callback) {
      r.connect(options, function (err, c) {
        if (err) {
          console.log(err);
          return callback(err);
        }
        conn = c;
        return callback();
      });
    },
    function(callback) {
      r.dbList().contains(db)
        .do(function(databaseExists) {
          return r.branch(
            databaseExists,
            { dbs_created: 0 },
            r.dbCreate(db)
          );
        }).run(conn, function (err, res) {
          if (err) {
            return callback(err);
          }
          conn.use(db);
          console.log('using wayback db');
          return callback();
        });
    },
    function(callback) {
      r.tableList().contains(table)
        .do(function(tableExists) {
          return r.branch(
            tableExists,
            { tables_created: 0 },
            r.tableCreate(table)
          );
        }).run(conn, function (err, res) {
          if (err) {
            return callback(err);
          }
          console.log('captures table exists');
          return callback();
        });
    },
    function(callback) {
      r.table(table).indexList().contains('domain')
        .do(function(indexExists) {
          return r.branch(
            indexExists,
            { indexes_created: 0 },
            r.table(table).indexCreate('domain')
          );
        }).run(conn, function (err, res) {
          if (err) {
            return callback(err);
          }
          console.log('domain index exists');
          return callback();
        });
    },
    function(callback) {
      r.table(table).indexList().contains('createdAt')
        .do(function(indexExists) {
          return r.branch(
            indexExists,
            { indexes_created: 0 },
            r.table(table).indexCreate('createdAt')
          );
        }).run(conn, function (err, res) {
          if (err) {
            return callback(err);
          }
          console.log('createdAt index exists');
          return callback();
        });
    }
  ], function (err) {
    if (err) {
      return callback(err);
    }
    console.log('Database connection up and running');
    return callback();
  })
}
