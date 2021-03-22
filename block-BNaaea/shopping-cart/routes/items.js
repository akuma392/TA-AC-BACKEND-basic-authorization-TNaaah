var express = require('express');
var router = express.Router();
var User = require('../models/user');

var Item = require('../models/item');
var Cart = require('../models/cart');
var auth = require('../middlewares/auth');

// router.get('/', (req, res, next) => {
//   Item.find({}, (err, items) => {
//     if (err) next(err);

//     console.log(items, req.user);
//     res.render('item', { items: items });
//   });
// });
router.get('/', (req, res, next) => {
  Item.find({}, (err, items) => {
    if (err) next(err);

    Item.distinct('category', (err, categories) => {
      if (err) next(err);
      console.log(categories);
      res.render('item', { items: items, categories: categories });
    });
  });
});

router.use(auth.loggedInUser);

router.get('/new', auth.adminUser, (req, res, next) => {
  res.render('createItem');
});

router.get('/category/:id', (req, res, next) => {
  console.log(req.params);
  let id = req.params.id;

  Item.find({ category: id }, (err, items) => {
    if (err) return next(err);

    Item.distinct('category', (err, categories) => {
      if (err) next(err);

      res.render('item', { items: items, categories: categories });
    });
  });
});
router.post('/', (req, res, next) => {
  var id = req.session.userId;
  req.body.authorId = id;
  req.body.category = req.body.category.split(' ');
  Item.create(req.body, (err, item) => {
    console.log(err, req.body);
    if (err) return next(err);
    User.findByIdAndUpdate(id, { itemId: item._id }, (err, user) => {
      res.redirect('/items');
    });
  });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  let session = req.session.userId;
  Item.findById(id, (err, item) => {
    if (err) return next(err);
    console.log(item);
    res.render('singleItem', { item: item });
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Item.findByIdAndDelete(id, (err, deletedItem) => {
    if (err) next(err);
    res.redirect('/items');
  });
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Item.findById(id, (err, item) => {
    if (err) next(err);
    res.render('updateItem', { item: item });
  });
});

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  req.body.category = req.body.category.split(' ');
  console.log(req.body);
  Item.findByIdAndUpdate(id, req.body, { new: true }, (err, updatedItem) => {
    if (err) next(err);
    res.redirect('/items/' + id);
  });
});

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  console.log(req);
  Item.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatedArticle) => {
    // if (err) next(err);
    res.redirect('/items/' + id);
  });
});

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  console.log(req);
  Item.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, updatedArticle) => {
    // if (err) next(err);
    res.redirect('/items/' + id);
  });
});

// router.get('/:id/cart', (req, res, next) => {
//   let id = req.params.id;
//   let session = req.session.userId;
//   Item.findById(id, (err, item) => {
//     if (err) next(err);

//     User.findById(session, (err, user) => {
//       if (err) next(err);
//       Cart.findOneAndUpdate(
//         { authorId: user._id },
//         { $push: { itemId: item._id } }
//       )
//         .populate('itemId')
//         .exec((err, cart) => {
//           console.log(cart.itemId[0]);
//           if (err) next(err);
//           res.render('userCart', {
//             carts: cart.itemId,
//             user: user,
//             cartId: cart._id,
//           });
//         });
//     });
//   });
// });

router.get('/:id/cart', (req, res, next) => {
  let id = req.params.id;
  let userid = req.user._id;
  console.log(id, userid);

  // Cart.findOneAndUpdate({ authorId: userid }, { $push: { itemId: id } })
  //   .populate('itemId')
  //   .exec((err, cart) => {
  //     console.log(cart);
  //     if (err) next(err);
  //     res.render('usercart', { carts: cart });
  //   });
  Cart.findOneAndUpdate(
    { authorId: userid },
    { $push: { itemId: id } },
    (err, cart) => {
      if (err) next(err);
      res.redirect('/carts');
    }
  );
});

module.exports = router;
