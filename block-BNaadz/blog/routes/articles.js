var express = require('express');
var router = express.Router();
var User = require('../models/user');

var Article = require('../models/article');
var Comment = require('../models/comment');
var auth = require('../middlewares/auth');

router.get('/', (req, res, next) => {
  console.log(req.user);
  var session = req.session.userId;
  Article.find({}, (err, articles, next) => {
    if (err) return next(err);
    User.findById(session, (err, user) => {
      if (err) return next(err);

      res.render('articles', {
        articles: articles,
        session: session,
        user: user,
      });
    });
  });
});

router.get('/new', auth.loggedInUser, (req, res, next) => {
  res.render('createArticle');
});

// router.get('/:id', (req, res, next) => {
//   let id = req.params.id;
//   Article.findById(id, (err, article) => {
//     if (err) return next(err);

//     // res.render('singleArticle', { article: article });
//     Comment.find({ articleId: id }, (err, comment) => {
//       if (err) next(err);
//       res.render('singleArticle', { article: article, comments: comment });
//     });
//   });
// });

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id)
    .populate('author', 'name email')
    .exec((err, article) => {
      if (err) return next(err);

      Comment.find({ articleId: id }, (err, comment) => {
        if (err) next(err);
        res.render('singleArticle', { article: article, comments: comment });
      });
    });
});

router.use(auth.loggedInUser);

// create articles

router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(' ');
  req.body.author = req.user._id;
  Article.create(req.body, (err, user) => {
    console.log(err, req.body);
    if (err) return next(err);
    res.redirect('/articles');
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err) => {
    if (err) next(err);
    // res.redirect('/articles');
    Comment.deleteMany({ articleId: id }, (err, info) => {
      if (err) next(err);
      res.redirect('/articles');
    });
  });
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) next(err);
    res.render('updateArticle', { article: article });
  });
});

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  Article.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
    (err, updatedArticle) => {
      if (err) next(err);
      res.redirect('/articles/' + id);
    }
  );
});

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  console.log(req);
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      // if (err) next(err);
      res.redirect('/articles/' + id);
    }
  );
});

// router.get('/:slug/dislike', (req, res, next) => {
//   let slug = req.params.slug;
//   console.log(req);
//   Article.findOneAndUpdate(
//     { slug },
//     { $inc: { likes: -1 } },
//     (err, updatedArticle) => {
//       // if (err) next(err);
//       res.redirect('/articles/' + slug);
//     }
//   );
// });

router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  console.log(req.body);
  console.log('hello comment');
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { commentId: comment._id } },
      (err, article) => {
        if (err) next(err);
        res.redirect('/articles/' + article._id);
      }
    );
  });
});
module.exports = router;
