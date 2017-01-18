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

/**
 * Fired when a model is unregistered, typically when the server
 * is killed. Useful for tearing down remaining open applications,
 * etc.
 *
 * @param  {String}  application (optional) The datastore to tear down. If not
 *                               provided, all applications will be torn down.
 * @return {Promise}             [description]
 */
var TearDown = function TearDown(application) {
  try {
    var apps = application ? [ application ] : _.values(_.mapValues(admin.apps, 'name_'));
    var promises = [];

    var onTearDown = function onTearDown() {
      return null;
    };

    apps.forEach(function(identity) {
      promises.push(admin.app(identity).delete());
    });

    return Promise.all(promises).then(onTearDown);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = TearDown;
