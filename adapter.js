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
var firebase = require('./firebase');
var WaterlineErrors = require('waterline-errors').adapter;

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
var WaterlineFirebaseAdapter = function WaterlineFirebaseAdapter() {

  // Private var to track of all the datastores that use this adapter. In order
  // for your adapter to support advanced features like transactions and native
  // queries, you'll need to expose this var publicly as well.
  //
  // See the `registerDatastore` method for more info.
  var datastores = {};

  var definitions = {};

  // FIXME: WL should automatically copy the model methods after queries
  var methods = {};

  // The main adapter object.
  var adapter = {

    // Automatic define primary key in model.
    autoPK: true,

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

    // Default Firebase primary key must be string
    pkFormat: 'string',

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
      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var onCount = function onCount(number) {
        return number;
      };

      return firebase.count(connection, collection, query)
        .then(onCount)
        .catch(cb);
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
      var self = this;

      if (_.isArray(record)) {
        return self.createEach(connection, collection, record, cb);
      }

      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var onCreate = function onCreate(document) {
        var definition = definitions[connection][collection];
        return cb(null, self._deserialize(document, definition));
      };

      var document = self._serialize(record, definitions[connection][collection]);

      return firebase.create(connection, collection, document)
        .then(onCreate)
        .catch(cb);
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
      var self = this;

      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var serialize = function serialize(record) {
        return self._serialize(record, definitions[connection][collection]);
      };

      var deserialize = function deserialize(value) {
        var definition = definitions[connection][collection];
        return self._deserialize(value, definition);
      };

      var onCreate = function(documents) {
        return cb(null, _.map(documents, deserialize));
      };

      var documents = _.map(records, serialize);

      return firebase.createEach(connection, collection, documents)
        .then(onCreate)
        .catch(cb);
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

      var onDefine = function onDefine() {
        definitions[connection][collection] = definition;
        return cb(null, null);
      };

      return firebase.define(connection, collection, definition).then(onDefine).catch(cb);
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

      var onDestroy = function(report) {
        return cb(null, report);
      };

      return firebase.destroy(connection, collection, query)
        .then(onDestroy)
        .catch(cb);
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

      return firebase.drop(connection, collection, relations).then(cb).catch(cb);
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
      var self = this;

      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var deserialize = function deserialize(document) {
        var definition = definitions[connection][collection];
        return self._deserialize(document, definition, methods[connection][collection]);
      };

      var onFind = function onFind(documents) {
        return cb(null, _.map(documents, deserialize));
      };

      return firebase.find(connection, collection, query)
        .then(onFind)
        .catch(cb);
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
      var self = this;

      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var onFindOne = function onFindOne(document) {
        var definition = definitions[connection][collection];
        return cb(null, self._deserialize(document, definition, methods[connection][collection]));
      };

      return firebase.findOne(connection, collection, query)
        .then(onFindOne)
        .catch(cb);
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

      // FIXME: WATERLINE QUERY SHOULD NOT NEED THIS
      methods[config.identity] = _.mapValues(models, '_instanceMethods');

      definitions[config.identity] = _.extendWith({}, _.mapValues(models, 'definition'));

      var onRegisterConnection = function(database) {
        datastores[config.identity] = {
          config: config,
          dbConnection: database
        };

        return cb(null, null);
      };

      return firebase.registerApplication(config, models)
        .then(onRegisterConnection)
        .catch(cb);
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
      return firebase.tearDown(connection).then(cb).catch(cb);
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
      var self = this;

      if (!datastores[connection]) {
        return cb(new Error(WaterlineErrors.InvalidConnection), null);
      }

      var deserialize = function deserialize(value) {
        var definition = definitions[connection][collection];
        return self._deserialize(value, definition);
      };

      var onUpdate = function onUpdate(documents) {
        return cb(null, _.map(documents, deserialize));
      };

      return firebase.update(connection, collection, query, values)
        .then(onUpdate)
        .catch(cb);
    },

    /**
     * Serialize a Waterline record into a Firebase document
     *
     * @param   {Object}  record      One waterline model record
     * @param   {Object}  definition  Waterline model definition of record
     * @return  {Object}              Firebase document serialized from record
     *
     * @see  [Waterline ORM](http://sailsjs.com/documentation/concepts/models-and-orm/models)
     */
    _serialize: function _serialize(record, definition) {
      if (_.isEmpty(record)) {
        return record;
      }

      var document = _.cloneDeep(record);

      if (record.id) {
        document._id = record.id;
        delete document.id;
      }

      Object.keys(definition).forEach(function (key) {
        if (document[key] && (definition[key].type === 'datetime')) {
          return document[key] = document[key].toISOString();
        }

        if (document[key] && (definition[key].type === 'date')) {
          return document[key] = new Date(document[key].toISOString());
        }
      });

      return document;
    },

    /**
     * Deserialize a Firebase document into a Waterline record
     *
     * @param   {Object}  document    One Firebase document
     * @param   {Object}  definition  Waterline model definition of record
     * @param   {Object}  methods     Custom methods of model definition
     * @return  {Object}              Waterline model record deserialized from document
     *
     * @see  [Waterline ORM](http://sailsjs.com/documentation/concepts/models-and-orm/models)
     */
    _deserialize: function _deserialize(document, definition, methods) {
      if (_.isEmpty(document)) {
        return document;
      }

      document.id = document._id;
      delete document._id;

      document.createdAt = new Date(document.createdAt);
      document.updatedAt = new Date(document.updatedAt);

      Object.keys(definition).forEach(function (key) {
        if (document[key] && (key !== 'createdAt') && (key !== 'updatedAt') && (definition[key].type === 'datetime')) {
          return document[key] = new Date(document[key]);
        }

        if (document[key] && (key !== 'createdAt') && (key !== 'updatedAt') && (definition[key].type === 'date')) {
          return document[key] = new Date(document[key]);
        }

        if (document[key] && (definition[key].type === 'array')) {
          return document[key] = _.values(document[key]);
        }
      });

      return _.assignIn(_.cloneDeep(methods), document);
    }

  };

  return adapter;

};

module.exports = WaterlineFirebaseAdapter;
