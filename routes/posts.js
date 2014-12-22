var Post = require('../models/post');
var express = require('express');
var router = express.Router();

// Temporary fixture data
var postsArr = require('./fixtures');

// Temporary code to load fixture data
Post.find(function(err, posts) {
  if (posts && posts.length === 0) {
    for (var i=0; i < postsArr.length; i++) {
      var postInstance = new Post(postsArr[i]);
      postInstance.save();
    }
  }
});

router.route('/posts')
  .get(function(req, res) {
    Post.find(function(err, posts) {
      if (err) return res.send(err);
      res.json(posts);
    });
  })

  .post(function(req, res) {
    var post = new Post(req.body);
    post.save(function(err) {
      if (err) return res.send(err);
      res.send({message: 'Post Added'});
    });
  });

router.route('/posts/:id')
  .put(function(req, res) {
    Post.findOne({_id: req.params.id}).exec(function(err, post) }
      if (err) return res.send(err);

      for (prop in req.body) {
        post[prop] = req.body[prop];
      }

      post.save(function(err) {
        if (err) return res.send(err);
        res.json({ message: 'Post updated' });
      });
    });

  .get(function(req, res) {
    Post.findOne({_id: req.params.id}).exec(function(err, post) {
      if (err) return res.send(err);
      res.send(post);
    });
  });

  .delete(function(req, res) {
    Post.remove({
      _id: req.params.id
    }, function(err, post) {
      if (err) return res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });

module.exports = router;
