var express = require ('express'),
    bodyParser = require ('body-parser'),
    mongoose = require ('mongoose');

var Dishes = require('../models/dishes');

var Verify = require('./verify');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// dishRouter.route('/')
dishRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Dishes.find({})
  .populate('comments.postedBy')
  .exec(function (err, dish) {
    if (err) throw err;
    console.log("Listing all dishes.")
    res.json(dish);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Dishes.create(req.body, function (err, dish){
    if (err) throw err;
    console.log('Dish created!');
    var id = dish._id;

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the dish with id: '+id);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next){
  Dishes.remove({}, function (err, message){
    if (err) throw err;
    res.json(message);
  });
});

//dishRouter.route('/:dishId')
dishRouter.route('/:dishId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Dishes.findById(req.params.dishId)
  .populate('comments.postedBy')
  .exec(function (err, dish) {
    if (err) throw err;
    if (dish === null) return res.end('No such dish.');
    console.log("Search dish Id: "+req.params.dishId);
    res.json(dish)
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
  }, {
    new: true
  }, function (err, dish) {
    if (err) throw err;
    if (dish === null) return res.end('No such dish.');
    console.log("Update dishId: "+req.params.dishId);
    res.json(dish);
  })
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
    if (err) throw err;
    if (resp === null) return res.end('No such dish.');
    //show you the deleted dish.
    res.json(resp);
  })
});

//dishRouter.route('/:dishId/comments')
dishRouter.route('/:dishId/comments')
.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
  Dishes.findById(req.params.dishId)
  .populate('comments.postedBy')
  .exec(function (err, dish) {
    if (err) throw err;
    console.log("搜尋Id: "+req.params.dishId+ " 的所有comments");
    res.json(dish.comments);
  })
})

.post(function (req, res, next) {
  console.log('Target dish: '+req.params.dishId);
  Dishes.findById(req.params.dishId, function (err, dish) {
    if (err) throw err;
    // 新增{postedBy: 使用者id}到comment物件, 使用者id作為key連結兩個document
    req.body.postedBy = req.decoded._doc._id;
    dish.comments.push(req.body);
    dish.save(function (err, dish) {
      if (err) throw err;
      console.log('Add a comments!');
      res.json(dish);
    })
  });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
  Dishes.findById(req.params.dishId, function (err, dish) {
    if (err) throw err;
    for (var i = (dish.comments.length - 1); i >= 0; i--) {
      dish.comments.id(dish.comments[i]._id).remove();
    }
    dish.save(function (err, result) {
      if (err) throw err;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Deleted all comments!');
    });
  });
});

//dishRouter.route('/:dishId/comments/:commentId')
dishRouter.route('/:dishId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
  Dishes.findById(req.params.dishId)
  .populate('comments.postedBy')
  .exec(function (err, dish) {
    if (err) throw err;
    console.log("Show you commentId: "+req.params.commentId+'\nof dishId '+req.params.dishId);
    res.json(dish.comments.id(req.params.commentId));
  });
})

.put(function (req, res, next) {
  // delete the existing commment and insert the updated
  Dishes.findById(req.params.dishId, function (err, dish) {
    if (err) throw err;
    if (!dish.comments.id(req.params.commentId)) {
      var error = new Error ('No such comment.');
      error.status = 404;
      return next(error);
    }
    console.log('user._id: '+req.decoded._doc._id+'\n'+'comment postedBy: '+dish.comments.id(req.params.commentId).postedBy);
    if (req.decoded._doc._id === dish.comments.id(req.params.commentId).postedBy) {
      dish.comments.id(req.params.commentId).remove();
      req.body.postedBy = req.decoded._doc._id;
      dish.comments.push(req.body);
      dish.save(function (err, dish) {
        if (err) throw err;
        console.log('Updated as a new Comments!');
        res.json(dish);
      });
    } else {
      var error = new Error ('you are not allowed to edit this comment.');
      error.status = 405;
      return next(error);
    }
  });
})

.delete(function (req, res, next) {
  Dishes.findById(req.params.dishId, function (err, dish) {
    if(!dish.comments.id(req.params.commentId)) {
      var error = new Error ('No such comment.')
      error.status = 404;
      return next (error);
    }
    console.log('user._id: '+req.decoded._doc._id+'\n'+'comment postedBy: '+dish.comments.id(req.params.commentId).postedBy);

    if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
      var err = new Error('You are not authorized to delete this comment!');
      err.status = 403;
      return next (err);
    }
    dish.comments.id(req.params.commentId).remove();
    console.log('deleting a comments Id: '+req.params.commentId);
    dish.save(function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });
});

module.exports = dishRouter;
