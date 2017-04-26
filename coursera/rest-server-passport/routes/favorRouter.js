// When the user does a GET operation on '/favorites', you will populate the user information and the dishes information before returning the favorites to the user.
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Favorites = require('../models/favorites');

var Verify = require('./verify');

var favorRouter = express.Router();
favorRouter.use(bodyParser.json());


// favorRouter.route('/')
favorRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next){
  Favorites.find({'postedBy': req.decoded._doc._id})
  .populate('postedBy')
  .populate('dishes')
  .exec(function (err, favor){
    if (err) throw err;
    var list = favor ? favor[0] : null;
    if (list) {
      console.log("Listing your favorites");
      res.json(list);
    } else {
      res.send('Does not exists, your favorites.')
    }
  });
})

.post(function (req, res, next){
  Favorites.findOne({'postedBy': req.decoded._doc._id})
  .exec(function (err, doc){
    if (doc){
      function callback (index){
        return index == req.body._id
      }
      if (doc.dishes.find(callback)){
        res.send('dishId: '+req.body._id+' already exists in your favorites.')
      } else {
        doc.dishes.push(req.body._id);
        doc.save(function (err, favor){
          if (err) return next(err);
          console.log('Add a dish!');
          res.json(favor);
        });
      }
    } else {
      Favorites.create({'postedBy': req.decoded._doc._id}, function (err, favor){
        if (err) return next(err);
        favor.dishes.push(req.body._id);
        favor.save(function (err, favor) {
          if (err) return next(err);
          console.log('Add a dish!');
          res.json(favor);
        })
      })
    }
  })
})

.delete(function (req, res, next){
  Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, message){
    if (err) throw err;
    console.log('Deleting your favorites list')
    res.json(message);
  });
});

favorRouter.route('/:dishId')
.all(Verify.verifyOrdinaryUser)
.delete(function (req, res, next) {
  Favorites.findOne({'postedBy': req.decoded._doc._id})
  .exec(function (err, favor){
    var list = favor ? favor : null;
    if (list){
      var index = favor.dishes.indexOf(req.params.dishId);
      if (index < 0) {
        res.send('dishId: '+req.params.dishId+' does not exists in your favorites.')
      } else {
        favor.dishes.splice(index, 1);
        favor.save(function (err, resp) {
          if (err) return next(err);
          res.json(favor);
        })
      }
    } else {
      res.send('Does not exists, your favorites.');
    }
  })
})

module.exports = favorRouter;
