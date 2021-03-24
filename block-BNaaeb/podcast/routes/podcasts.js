var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Media = require('../models/media');
var UserMedia = require('../models/usermedia');

var upload = require('../utils/multer');

// router.get('/', (req, res, next) => {
//   console.log(req.user.avtar);
//   Media.find({}, (err, podcasts) => {
//     if (err) next(err);
//     Media.distinct('types', (err, categories) => {
//       if (err) next(err);
//       console.log(categories);
//       res.render('podcast', { podcasts: podcasts, categories: categories });
//     });
//   });
// });

router.get('/', (req, res, next) => {
  console.log(req.user, 'abhssss');
  let membership = req.user.category;
  if (membership == 'free') {
    Media.find({ types: membership }, (err, podcasts) => {
      if (err) next(err);
      Media.distinct('types', (err, categories) => {
        if (err) next(err);

        res.render('podcast', { podcasts: podcasts, categories: categories });
      });
    });
  } else if (membership == 'vip') {
    Media.find({ types: { $in: ['free', 'vip'] } }, (err, podcasts) => {
      if (err) next(err);
      Media.distinct('types', (err, categories) => {
        if (err) next(err);

        res.render('podcast', { podcasts: podcasts, categories: categories });
      });
    });
  } else {
    Media.find({}, (err, podcasts) => {
      if (err) next(err);
      Media.distinct('types', (err, categories) => {
        if (err) next(err);

        res.render('podcast', { podcasts: podcasts, categories: categories });
      });
    });
  }
});

router.use(auth.loggedInUser);

// upload podcast for admin
router.get('/new', auth.adminUser, (req, res, next) => {
  res.render('createPodcast');
});

router.post('/', upload.single('file'), (req, res, next) => {
  req.body.owner = req.user._id;
  req.body.file = req.file.filename;
  console.log(req.body, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  Media.create(req.body, (err, podcasts) => {
    if (err) next(err);
    res.redirect('/podcasts');
  });
});
// router.post('/', (req, res, next) => {
//   console.log(req.body, req.file);
//   //   req.body.file = req.file.filename;
//   req.body.owner = req.user._id;
//   console.log(req.body, 'gggggggggggggggggggg');
//   Media.create(req.body, (err, podcast) => {
//     console.log(podcast, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhh');
//     if (err) next(err);
//     res.redirect('/podcasts');
//   });
// });

// upload podcast for users

router.get('/user/new', (req, res, next) => {
  res.render('userpodcast');
});

router.post('/users', upload.single('file'), (req, res, next) => {
  req.body.file = req.file.filename;
  req.body.types = req.user.category;
  console.log(req.body, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  UserMedia.create(req.body, (err, podcasts) => {
    if (err) next(err);
    console.log('user podcast');
    res.redirect('/podcasts');
  });
});

// categories for admin
router.get('/podcast/:id', (req, res, next) => {
  console.log(req.params);
  let id = req.params.id;

  Media.find({ types: id }, (err, podcasts) => {
    if (err) return next(err);

    Media.distinct('types', (err, categories) => {
      if (err) next(err);

      res.render('podcast', { podcasts: podcasts, categories: categories });
    });
  });
});

// single podcast for admin
router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  Media.findById(id, (err, item) => {
    if (err) return next(err);
    console.log(item);
    res.render('singlepodcast', { item: item });
  });
});

// delete podcast
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Media.findByIdAndDelete(id, (err, deletedItem) => {
    if (err) next(err);
    res.redirect('/podcasts');
  });
});

// update podcast
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Media.findById(id, (err, item) => {
    if (err) next(err);
    res.render('updatePodcast', { item: item });
  });
});

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  Media.findByIdAndUpdate(id, req.body, { new: true }, (err, updatedItem) => {
    if (err) next(err);
    res.redirect('/podcasts/' + id);
  });
});
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;

  Media.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatedArticle) => {
    // if (err) next(err);
    res.redirect('/podcasts/' + id);
  });
});

// approve the podcast uploaded by user
router.get('/approve/:id', (req, res, next) => {
  let id = req.params.id;
  UserMedia.findById(id, (err, podcast) => {
    if (err) next(err);

    Media.create(podcast, (err, newpodcast) => {
      if (err) next(err);
      UserMedia.findByIdAndDelete(id, (err, deletedPodcast) => {
        if (err) next(err);
        res.redirect('/podcasts');
      });
    });
  });
});

// reject podcast uploaded by user
router.get('/reject/:id', (req, res, next) => {
  let id = req.params.id;
  console.log(id, 'delete podcast');
  UserMedia.findByIdAndDelete(id, (err, deletedPodcast) => {
    if (err) next(err);
    res.redirect('/podcasts');
  });
});

// admin profile

router.post('/avtar', upload.single('file'), (req, res, next) => {
  req.body.avtar = req.file.filename;
  let id = req.user._id;
  console.log(req.body, 'test');
  User.findByIdAndUpdate(id, req.body, (err, user) => {
    if (err) next(err);
    console.log('after update');
    res.redirect('/podcast');
  });
});

module.exports = router;
