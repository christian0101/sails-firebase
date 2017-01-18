/**
 * MIT License
 *
 * Copyright (c) 2017 Mike McNeil, Balderdash Design Co., & The Sails Company
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


var _ = require('lodash');
var async = require('async');
var WaterlineErrors = require('waterline-errors').adapter;

// var myDbDriver = require('nodejs-driver-for-some-awesome-db');

/**
 * @jpventura/sails-firebase
 *
 * Waterline/Sails.js adapter for Google Firebase 3
 *
 * THIS ADAPTER IS UNDER CONSTANT DEVELOPMENT AND MUST NOT BE USED ON
 * PRODUCTION ENVIRONMENTS.
 *
 * Only mandatory semantic interface methods were implemented
 *
 * @see [Firebase Admin]{https://firebase.google.com/docs/admin/setup}
 * @see [Waterline Query Language]{http://sailsjs.com/documentation/concepts/models-and-orm/query-language}
 */
var Adapter = function Adapter() {

  // Private var to track of all the datastores that use this adapter. In order
  // for your adapter to support advanced features like transactions and native
  // queries, you'll need to expose this var publicly as well.
  //
  // See the `registerDatastore` method for more info.
  var datastores = {};

  // The main adapter object.
  var adapter = {

    // The identity of this adapter, to be referenced by datastore
    // configurations in a Sails application.
    identity: 'sails-firebase',

    // Default configuration for connections
    defaults: {
      // For example, MySQLAdapter might set its default port and host.
      // port: 3306,
      // host: 'localhost',
      // schema: true,
      // ssl: false,
      // customThings: ['eh']
    },

    // This allows outside access to the datastores, for use in advanced ORM
    // methods like `.runTransaction()`.
    datastores: datastores,

    /**
     * Find out the average of the query.
     *
     * @param {String}     datastore The datastore name to perform the query.
     * @param {Dictionary} query     The stage-3 query to perform.
     * @param {Function}   cb        Callback
     */
    avg: function avg(datastore, query, cb) {
      if (!datastores[datastore]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[datastore].dbConnection.find(query, function(err, result) {
      //   if (err) {
      //     return cb(err);
      //   }
      //
      //   var sum = _.reduce(result, function(memo, row) {
      //     return memo + row[query.numericAttrName];
      //   }, 0);
      //
      //   var avg = sum / result.length;
      //   return cb(undefined, avg);
      // });

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: avg'));
    },

    /**
     * Count the number of records matching the query criteria
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    query       Query operation to be performed.
     * @param  {Function}  cb          Query result callback
     *
     * @see [Waterline Query Language]{http://sailsjs.com/documentation/concepts/models-and-orm/query-language}
     */
    count: function count(connection, collection, query, cb) {
      if (!datastores[datastore]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[datastore].dbConnection.count(query, function(err, result) {
      //     return err ? cb(err) : cb(result);
      //   });

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: count'));
    },

    /**
     * Create a record on the datastore
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    record      Array of records
     * @param  {Function}  cb          Query result callback
     */
    create: function create(connection, collection, record, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[connection].dbConnection
      //   .create(query, function(err, result) {
      //     return err ? cb(err) : cb(undefined, result);
      // });
      //
      // Note that depending on the value of `query.meta.fetch`,
      // you may be expected to return the array of documents
      // that were created as the second argument to the callback.

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: create'));
    },

    /**
     * Create a sequence of records on the datastore
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    records     Array of records
     * @param  {Function}  cb          Query result callback
     */
    createEach: function createEach(connection, collection, records, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[connection].dbConnection
      //   .createEach(query, function(err, result) {
      //     return err ? cb(err): cb(undefined, result);
      //   });
      //
      // Note that depending on the value of `query.meta.fetch`,
      // you may be expected to return the array of documents
      // that were created as the second argument to the callback.

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: createEach'));
    },

    /**
     * Define a collection on datastore
     *
     * @param {String}   connection  The datastore name define a model on
     * @param {String}   collection  The collection name to be define
     * @param {Object}   definition  A Waterline ORM model definition
     * @param {Function} cb          Define result callback
     *
     * @see [Waterline ORM]{http://sailsjs.com/documentation/concepts/models-and-orm/models}
     */
    define: function define(connection, collection, definition, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // create the table, e.g.:
      //
      // datastores[datastore].dbConnection
      //   .createTable(table, definition, function(err) {
      //     return err ? cb(err) : cb();
      //   });

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: define'));
    },

    /**
     * Destroy a sequence of records matching the query criteria
     *
     * @param  {String}    connection  The datastore name to query on.
     * @param  {String}    collection  The name of the table to remove.
     * @param  {Object}    query       Query operation to be performed
     * @param  {Function}  cb          Destroy result callback
     */
    destroy: function destroy(connection, collection, query, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[datastore].dbConnection
      //   .destroy(query, function(err, result) {
      //     return err ? return cb(err) : cb(undefined, result);
      //   });
      //
      // Note that depending on the value of `query.meta.fetch`,
      // you may be expected to return the array of documents
      // that were destroyed as the second argument to the callback.

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: destroy'));
    },

    /**
     * Drop an entire collection, including relations and definitions
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    relations   (not used)
     * @param  {Function}  cb          Drop callback result
     */
    drop: function drop(connection, collection, relations, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // drop the table, e.g.:
      //
      // datastores[connection].dbConnection
      //   .dropTable(collection, function(err) {
      //     return err ? cb(err) : cb();
      //   });

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: drop'));
    },

    /**
     * Find a sequence of records matching the query criteria
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    query       Query operation to be performed.
     * @param  {Function}  cb          Query result callback
     *
     * @see [Waterline Query Language]{http://sailsjs.com/documentation/concepts/models-and-orm/query-language}
     */
    find: function find(connection, collection, query, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[connection].dbConnection.find(query, function(err, result) {
      //   if (err) {return cb(err);}
      //   return cb(undefined, result);
      // });

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: find'));
    },

    /**
     * Find a single record matching the query criteria
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    query       Query operation to be performed.
     * @param  {Function}  cb          Find result callback
     */
    findOne: function findOne(connection, collection, query, cb) {
      return cb(new Error('Not implemented: findOne'));
    },

    /**
     * Register a new connection with this adapter. This often involves
     * creating a new connection to the underlying database layer (e.g. MySQL,
     * Mongo, or a local file).
     *
     * Waterline calls this method once for every datastore that is configured
     * to use this adapter. This method is optional but strongly recommended.
     *
     * @param  {Object}    config  Configuration options for this datastore.
     * @param  {Object}    models  Model schemas using this datastore.
     * @param  {Function}  cb      Register connection result callback
     *
     * @see [Waterline ORM](http://sailsjs.com/documentation/concepts/models-and-orm/models)
     */
    registerConnection: function registerConnection(config, models, cb) {
      if (!config.identity) {
        return cb(new Error(WaterlineErrors.IdentityMissing));
      }

      if (datastores[config.identity]) {
        return cb(new Error(WaterlineErrors.IdentityDuplicate));
      }

      // Do any custom connection logic here.
      // var dbConnectionInstance = myDbDriver.connect(config.url);
      //
      // Then save information about the datastore to the `datastores` dictionary.
      // The values in this dictionary are completely up to the adapter, but there
      // are a couple of reserved keys:
      //
      // `manager`: If provided, this should be a "connection manager" -- an object
      //            that the underlying driver can use to create new database connections.
      //            For example, in sails-postgresql, `manager` encapsulates a connection pool
      //            that the machinepack-postgresql driver uses.  The actual form of the manager
      //            object is completely dependent on the driver.
      //
      // `driver` : A reference to the underlying driver, for instance `machinepack-postgresql`
      //            for the `sails-postgresql` adapter.
      //
      // `config  : Configuration options for the datastore. Typically this will be derived
      //            (or copied directly) from the `datastoreConfig` argument to this method.
      datastores[identity] = {
        config: config,
        // dbConnection: dbConnectionInstance
      };

      // Wait one tick and return.
      setImmediate(function done() {
        return cb(new Error('Not implemented: registerConnection'));
      });
    },

    /**
     * Fired when a connection is unregistered, typically when the server is
     * killed. Useful for tearing down remaining open connections, etc.
     *
     * @param  {String}    connection  (optional) The connection to tear down. If not
     *                                 provided, all connection will be torn down.
     * @param  {Function}  cb          Tear down result callback
     */
    teardown: function teardown(connection, cb) {
      return cb(new Error('Not implemented: teardown'));

      // If no specific identity was sent, teardown all the datastores
      if (!identity || identity === null) {
        datastoreIdentities = datastoreIdentities.concat(_.keys(datastores));
      } else {
        datastoreIdentities.push(identity);
      }

      // Teardown each datastore, and call the callback when finished.
      async.eachSeries();
      async.eachSeries(datastoreIdentities, function teardownDatastore(datastoreIdentity, next) {
        delete datastores[datastoreIdentity];
        return next();
      }, function doneTearingDown(err) {
        return err ? cb(err) : cb();
      });
    },

    /**
     * Update one or more models in the table
     *
     * @param  {String}    connection  Connection name of datastore query on.
     * @param  {String}    collection  Collection name to query on.
     * @param  {Object}    query       Query operation to be performed.
     * @param  {Object}    values      Values to be send to datastore.
     * @param  {Function}  cb          Query result callback
     *
     * @see [Waterline Query Language]{http://sailsjs.com/documentation/concepts/models-and-orm/query-language}
     */
    update: function update(connection, collection, query, values, cb) {
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      // When implementing this method, this is where you'll
      // perform the query and return the result, e.g.:
      //
      // datastores[connection].dbConnection.update(query, function(err, result) {
      //   return cb(err) : return cb(undefined, result);
      // });
      //
      // Note that depending on the value of `query.meta.fetch`,
      // you may be expected to return the array of documents
      // that were updated as the second argument to the callback.

      // But for now, this method is just a no-op.
      return cb(new Error('Not implemented: update'));
    }

  };

  return adapter;

};

module.exports = Adapter;
