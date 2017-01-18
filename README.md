[![](https://camo.githubusercontent.com/9e49073459ed4e0e2687b80eaf515d87b0da4a6b/687474703a2f2f62616c64657264617368792e6769746875622e696f2f7361696c732f696d616765732f6c6f676f2e706e67)](http://sailsjs.com)

# sails-firebase

[Sails.js](http://sailsjs.com/)/[Waterline](http://waterlinejs.org/) adapter for [Google Firebase 3](https://firebase.google.com/).

[![Build Status](https://travis-ci.org/jpventura/sails-firebase.svg?branch=master)](https://travis-ci.org/jpventura/sails-firebase)
[![npm version](https://badge.fury.io/js/sails-firebase.svg)](https://badge.fury.io/js/sails-firebase)

Warning
-------
**This adapter is still under active development and in no manner is advised using it in a production environment.**

**Check the project [issues board](https://github.com/jpventura/sails-firebase/issues) for announcements, bug reports, upcoming features and discussions.**

Only mandatory *semantic* interface methods were implemented. The next steps is bringing *queryable* and *associations* to life *asap*.

Introduction
------------

#### Overview
The Firebase Realtime Database synchronized in realtime to every connected client.

It allows you build cross-platform apps with our iOS and Android, all of your clients share one Realtime Database instance and automatically receive updates with the newest data.

However the current Firebase architecture force the developers to implement a lof of business logic as part of the mobile applications, leading to some side-effects:

   - Business logic code duplication among Android, iOS, Windows and all mobile platforms
   - Due version fragmentation, business logic is affected by apps being (not) updated.

#### Sails.js and Waterline as Mobile Orchestrator
This Waterline Firebase Adapter provides missing piece to Sails.js become a mobile orchestrator. The server application read and writes directly into Firebase, which updates all mobile devices connected to it in realtime; just like a [message passing distributed system](https://en.wikipedia.org/wiki/Message_passing).

Configure and Install
---------------------
#### Dependencies
At your Sails.js project, install the adapter library:

    $ npm install sails-firebase --save

#### Configure

Create an application at [Firebase admin console](https://console.firebase.google.com), then access the project settings menu:

    https://console.firebase.google.com/project/<YOUR PROJECT NAME>/settings/general/

Go to the _account services_ menu and create download a server private key, then download the produced JSON file:

```JavaScript
{
    credential: {
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "client_email": "<YOUR EMAIL CLIENT>",
        "client_id": "<YOUR CLIENT ID>",
        "client_x509_cert_url": "<YOUR CLIENT X509 CERTIFICATE>",
        "private_key": "<YOUR PRIVATE KEY>",
        "private_key_id": "<YOUR PRIVATE KEY ID>",
        "project_id": "<YOUR PROJECT ID>",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "type": "service_account",
    },

    databaseURL: "https://<YOUR PROJECT NAME>.firebaseio.com"
}
```

After installing this adapter as a dependency of your Sails app, make this particular Firebase database your default datastore by adding the following settings to the files in your config folder:

```JavaScript
// ./config/connections.js
module.exports.connections = {

  firebase: {
    adapter: 'sails-firebase',

    credential: {
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "client_email": "<YOUR EMAIL CLIENT>",
      "client_id": "<YOUR CLIENT ID>",
      "client_x509_cert_url": "<YOUR CLIENT X509 CERTIFICATE>",
      "private_key": "<YOUR PRIVATE KEY>",
      "private_key_id": "<YOUR PRIVATE KEY ID>",
      "project_id": "<YOUR PROJECT ID>",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "type": "service_account",
    },

    databaseURL: "https://<YOUR PROJECT NAME>.firebaseio.com",
  }

};
```

```JavaScript
// ./config/models.js
module.exports.models = {
   'connection': 'firebase'
};
```

Check [Sails documentation](http://sailsjs.com/documentation/reference/configuration/sails-config-connections) for more information about how to configure connections.

  - Be polite :-)
  - Observe the guideline and conventions laid out in [Sails contribution guide](http://sailsjs.com/documentation/contributing).
  - Read [Udacity Git Commit Style Guide](https://udacity.github.io/git-styleguide/)
  - Use [Commit using message emmojis](https://github.com/dannyfritz/commit-message-emoji) and a modification indicator

Contributing
------------
If you wish to contribute to [`Waterline Firebase Adapter`](https://github.com/jpventura/sails-firebase), first we would like to thank you for dedicating your time on this project.

Before create a pull request, keep some things in mind:

  - Be polite with other community developers.
  - Run the integration tests locally and be sure they pass.
  - Keep the code style. 
  - Create awesome commit messages (use [emmojis](https://github.com/dannyfritz/commit-message-emoji) and read [Udacity Git Style Guide](https://udacity.github.io/git-styleguide/))

The adapter currently provides only [semantic](https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md) inteface. If you are submitting other interfaces, add it to the [`package.json`](https://github.com/jpventura/sails-firebase/blob/firebase/package.json) file:

```JavaScript
{
  "waterlineAdapter": {
    "type": "sails-firebase",
    "interfaces": [
      "semantic"
    ],
    "waterlineVersion": "~0.12.1"
  }
}
```


