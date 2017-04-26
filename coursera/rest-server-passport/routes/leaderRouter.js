var express = require ('express'),
    bodyParser = require ('body-parser'),
    mongoose = require ('mongoose');

var Leaders = require ('../models/leadership');

var Verify = require('./verify');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Leaders.find({}, function (err, leader){
    if (err) throw err;
    console.log("搜尋所有的leaders");
    res.json(leader);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Leaders.create(req.body, function (err, leader){
    if (err) throw err;
    console.log('leader created!');
    var id = leader._id;

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    res.end('Added the leader with id:'+id);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next){
  Leaders.remove({}, function (err, message){
    if (err) throw err;
    console.log('Deleting all leaders');
    console.log('訊息: '+message);
    res.json(message);
  });
});

leaderRouter.route('/:leaderId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Leaders.findById(req.params.leaderId, function (err, leader){
    if (err) throw err;
    console.log('Will send details of the leader: '+req.params.leaderId+' to you!');
    res.json(leader);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Leaders.findByIdAndUpdate(req.params.leaderId, {
    $set: req.body
  }, {
    new: true
  }, function (err, leader) {
    if (err) throw err;
    console.log('Updating the leader: '+req.params.leaderId+'\n');
    res.json(leader);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Leaders.findByIdAndRemove(req.params.leaderId, function (err, message) {
    if (err) throw err;
    console.log('Deleting leader: '+req.params.leaderId);
    console.log('訊息: '+message);
    res.json(message);
  })
});

module.exports = leaderRouter;
