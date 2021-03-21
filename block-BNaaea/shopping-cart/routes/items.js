var express = require('express');
var router = express.Router();
var User = require('../models/user');

var Item = require('../models/item');
var Cart = require('../models/cart');

router.get('/', (req, res, next) => {
  console.log(req.session.userId, 'from items......');
  var session = req.session.userId;
  Item.find({}, (err, items, next) => {
    if (err) return next(err);
    User.findById(session, (err, user) => {
      if (err) return next(err);
      console.log(user, '000000000000000000000000000000000000000');
      res.render('item', {
        items: items,
        session: session || {},
        user: user || {},
      });
    });
  });
});
router.get('/new', (req, res, next) => {
  res.render('createItem');
});

router.post('/', (req, res, next) => {
  var id = req.session.userId;
  req.body.authorId = id;
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
    User.findById(session, (err, user) => {
      if (err) return next(err);

      res.render('singleItem', { item: item, session: session, user: user });
    });
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
//         { $push: { itemId: item._id } },
//         (err, cart) => {
//           if (err) next(err);
//           res.render('userCart', { cart: cart, user: user });
//         }
//       );
//     });
//   });
// });

router.get('/:id/cart', (req, res, next) => {
  let id = req.params.id;
  let session = req.session.userId;
  Item.findById(id, (err, item) => {
    if (err) next(err);

    User.findById(session, (err, user) => {
      if (err) next(err);
      Cart.findOneAndUpdate(
        { authorId: user._id },
        { $push: { itemId: item._id } }
      )
        .populate('itemId')
        .exec((err, cart) => {
          console.log(cart.itemId[0]);
          if (err) next(err);
          res.render('userCart', {
            carts: cart.itemId,
            user: user,
            cartId: cart._id,
          });
        });
    });
  });
});

module.exports = router;
