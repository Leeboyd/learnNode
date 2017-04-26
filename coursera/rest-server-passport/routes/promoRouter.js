var express = require ('express'),
    bodyParser = require ('body-parser'),
    mongoose = require ('mongoose');

var Promos = require('../models/promotions');

var Verify = require('./verify');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Promos.find({}, function (err, promo){
    if (err) throw err;
    console.log('Will send all the promotions for you');
    res.json(promo);
  })
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Promos.create(req.body, function (err, promo){
    if (err) throw err;
    console.log('Promo created!');
    var id = promo._id;

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    res.end('Added the promo with id: '+id);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next){
  Promos.remove({}, function (err, message){
    if (err) throw err;
    console.log('Deleting all leaders');
    res.json(message);
  })
})

promoRouter.route('/:promoId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Promos.findById(req.params.promoId, function (err, promo){
    if (err) throw err;
    console.log('Will send details of the promotions: '+req.params.promoId+' to you!');
    res.json(promo);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Promos.findByIdAndUpdate(req.params.promoId, {
    $set: req.body
  }, {
    new: true
  }, function (err, promo) {
    if (err) throw err;
    console.log('Updating the promo: '+req.params.promoId+'\n');
    res.json(promo);
  })
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Promos.findByIdAndRemove(req.params.promoId, function (err, message) {
    if (err) throw err;
    console.log('Deleting promotions: '+req.params.promoId);
    res.json(message);
  })
});

module.exports = promoRouter;
