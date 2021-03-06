var ConfigService = require('../services/config-service');

var Firebase = require('firebase');
var firebaseEndpoint = ConfigService.get('public.firebase.endpoint');
var firebaseRoot = new Firebase(firebaseEndpoint);
var firebaseSecret = ConfigService.get('private.firebase.secret');
var Utility = require('../extensions/utility');
var Q = require('q');

var authWithSecret = function (ref, persist) {
  var LogService = require('../services/log-service.js');
  var deferred = Q.defer();

  ref.authWithCustomToken(firebaseSecret, function (err, authData) {
    if (err) {
      var message = 'authWithCustomToken failed: ' + err.toString() + ': ' + ref.toString();
      LogService.log(message);
      LogService.email(message);
      deferred.reject(err);
    } else {
      deferred.resolve(ref);

      if (persist) {
        firebaseRoot.onAuth(function (authData) {
          if (!authData) {
            ref.authWithCustomToken(firebaseSecret, function (authData) {
              // console.log('logged back in', authData);
            });
          } else {
            // console.log('auth successful.');
          }

        });

      }
    }
  });

  return deferred.promise;
};
var deferred = Q.defer();

setTimeout(function () {
  authWithSecret(firebaseRoot, true).then(function (ref) {
    deferred.resolve(ref);
  }, deferred.reject);
});

module.exports = {
  firebaseRoot: firebaseRoot,

  authWithSecret: authWithSecret,

  chainFromRef: function (ref, path) {
    var refPath = ref.toString();
    var regexp = new RegExp(refPath);
    var parts = path.replace(regexp, '').split('/');
    var returnRef = ref;
    parts.forEach(function (part) {
      if (part && part.length) {
        returnRef = returnRef.child(part);
      }
    });
    return returnRef;
  },

  isAuthenticated: function () {
    return deferred.promise;
  },

  getValue: function (ref, cb) {
    var deferred = Utility.async(cb);

    ref.once('value', function (snap) {
      deferred.resolve(snap.val());
    });

    return deferred.promise
  },

  getWords: function () {
    return firebaseRoot.child('content').child('words');
  },

  getProducts: function () {
    return firebaseRoot.child('content').child('products');
  },

  getInstagram: function () {
    return firebaseRoot.child('content').child('social').child('instagram');
  },

  getFiles: function () {
    return firebaseRoot.child('content').child('files');
  },

  getHashtags: function () {
    return firebaseRoot.child('content').child('hashtags');
  },

  getUsers: function () {
    return firebaseRoot.child('users');
  },

  getUser: function (key) {
    return firebaseRoot.child('users').child(key);
  },

  getUsersByEmail: function (email) {
    return firebaseRoot.child('users').orderByChild('email').equalTo(email);
  },

  getAcl: function (key) {
    return firebaseRoot.child('acl').child(key);
  },

  getDiscounts: function () {
    return firebaseRoot.child('discounts');
  },

  getSettings: function () {
    return firebaseRoot.child('settings');
  },

  getTransaction: function (key) {
    return firebaseRoot.child('logs').child('transactions').child(key);
  },

  getTheme: function () {
    return firebaseRoot.child('theme');
  },

  getLogs: function () {
    return firebaseRoot.child('logs');
  },

  getResources: function () {
    return firebaseRoot.child('resources');
  },

  getResource: function (key) {
    return firebaseRoot.child('resources').child(key);
  },

  getMessages: function () {
    return firebaseRoot.child('logs').child('messages');
  },

  getUploads: function () {
    return firebaseRoot.child('logs').child('uploads');
  },

  getEmailQueue: function () {
    return firebaseRoot.child('queues').child('email');
  },

  getQueuedEmail: function (emailKey) {
    return firebaseRoot.child('queues').child('email').child(emailKey);
  },

  getShipments: function () {
    return firebaseRoot.child('logs').child('shipments');
  },

  getShipment: function (key) {
    return firebaseRoot.child('logs').child('shipments').child(key);
  },

  getAssignments: function () {
    return firebaseRoot.child('content').child('assignments');
  },

  getAssignment: function (key) {
    return firebaseRoot.child('content').child('assignments').child(key);
  },

  getReports: function () {
    return firebaseRoot.child('admin').child('reports');
  },

  getBackups: function () {
    return firebaseRoot.child('admin').child('backups');
  },

  getLandingPages: function () {
    return firebaseRoot.child('admin').child('landingPages');
  },

  /*
   * User Objects
   */
  getUserObjects: function () {
    return firebaseRoot.child('userObjects');
  },
  getUserTransactions: function (userId) {
    return firebaseRoot.child('userObjects').child('transactions').child(userId);
  },

  getUserTransaction: function (userId, key) {
    return firebaseRoot.child('userObjects').child('transactions').child(userId).child(key);
  },

  getUserSubscriptions: function (userId, key) {
    return firebaseRoot.child('userObjects').child('subscriptions').child(userId);
  },

  getUserSubscription: function (userId, key) {
    return firebaseRoot.child('userObjects').child('subscriptions').child(userId).child(key);
  },

  getUserGifts: function (userId) {
    return firebaseRoot.child('userObjects').child('gifts').child(userId);
  },

  getUserShipments: function (userId) {
    return firebaseRoot.child('userObjects').child('shipments').child(userId);
  },

  getUserDownloads: function (userId) {
    return firebaseRoot.child('userObjects').child('downloads').child(userId);
  },

  getUserAssignment: function (userId, assignmentKey) {
    return firebaseRoot.child('userObjects').child('assignments').child(userId).child('submitted').child(assignmentKey);
  },

  getUserAssignmentMessages: function (userId, assignmentKey) {
    return firebaseRoot.child('userObjects').child('assignments').child(userId).child('submitted').child(assignmentKey).child('messages');
  },

  getUserAssignmentUploads: function (userId, assignmentKey) {
    return firebaseRoot.child('userObjects').child('assignments').child(userId).child('submitted').child(assignmentKey).child('uploads');
  },

  getUserMessages: function (userId) {
    return firebaseRoot.child('userObjects').child('messages').child(userId);
  },

  getUserFiles: function (userId) {
    return firebaseRoot.child('userObjects').child('files').child(userId);
  },

  /*
   * Moderator
   */
  getModeratorMessages: function (assignmentId) {
    return firebaseRoot.child('moderator').child('messages').child(assignmentId);
  },

  getModeratorUploads: function (assignmentId) {
    return firebaseRoot.child('moderator').child('uploads').child(assignmentId);
  }

}