var User = require('../models/user');

// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');
var config = require('../config.js');

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expireIn: 3600
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url parameter or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error ('Login before you start!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log('usersname: '+req.decoded._doc.username);
        next();
      }
    });
  } else {
    // if there is no token
    var err = new Error ('No token provided!');
    err.status = 403;
    return next(err);
  }
};
// You can use this to decide if the user is an administrator.
// The verifyAdmin() function will return Next(); if the user is an admin, otherwise it will return Next(err);
exports.verifyAdmin = function (req, res, next){
  if (req.decoded._doc.admin) {
    console.log('You are a admin.');
    next();
  } else {
    console.log('You are not a admin.');
    var err = new Error ('You are not authorized to perform this operation.');
    err.status = 403;
    return next(err);
  }
};
