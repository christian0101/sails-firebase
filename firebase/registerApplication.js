/**
 * MIT License
 *
 * Copyright (c) 2017 Joao Paulo Fernandes Ventura
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
var admin = require('firebase-admin');
var Promise = require('bluebird');
var WaterlineErrors = require('waterline-errors').adapter;

/**
 * Register an existent Firebase Application.
 *
 * Waterline calls this method once for every datastore that is configured
 * to use this adapter. This method is optional but strongly recommended.
 *
 * @param  {Object} configuration Configuration options for this datastore.
 * @param  {Object} definitions   Model schemas using this datastore.
 * @return {Promise}              Promise
 */
var RegisterApplication = function RegisterApplication(configuration, definitions) {
  var config = _.cloneDeep(configuration);

  if (!config.identity) {
    return Promise.reject(new Error(WaterlineErrors.IdentityMissing));
  }

  try {
    config.credential = admin.credential.cert(config.credential);
    var database = admin.initializeApp(config, config.identity).database();

    var reference = database.ref('definitions');
    var promises = [];

    _.forIn(_.mapValues(definitions, 'definition'), function(definition, pathname) {
      promises.push(reference.child(pathname).set(definition));
    });

    return Promise.all(promises).then(function() {
      return database;
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = RegisterApplication;
