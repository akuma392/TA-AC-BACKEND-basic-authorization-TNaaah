var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

router.get('/:id/edit', (req, res, next) => {
  console.log('Comment page');
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) next(err);
    res.render('updateComment', { comment });
  });
});

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) next(err);
    res.redirect('/articles/' + updatedComment.articleId);
  });
});

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) next(err);
    res.redirect('/articles/' + comment.articleId);
  });
});

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  console.log(req);
  Comment.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedComment) => {
      // if (err) next(err);
      res.redirect('/articles/' + updatedComment.articleId);
    }
  );
});

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    (err, updatedComment) => {
      if (err) next(err);
      res.redirect('/articles/' + updatedComment.articleId);
    }
  );
});

module.exports = router;
