var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Item = require('../models/item');

router.get('/', (req, res, next) => {
  let userid = req.user._id;
  Cart.find({ owner: userid })
    .populate('items.itemId')
    .exec((err, carts) => {
      if (err) next(err);

      console.log(carts[0].items, 'updatedddddddddddddddddddddd', req.user);
      // res.render('userCart', { carts: carts[0].items });
      Cart.aggregate([
        {
          $lookup: {
            from: 'item',
            localField: 'carts',
            foreignField: '_id',
            as: 'cartObject',
          },
        },
        {
          $group: {
            _id: null,
            prices: {
              $sum: 'items.$price',
            },
          },
        },
      ]).exec((err, result) => {
        console.log(err, result, 'aaaaaaaaaaaaaaaaaaaaaaaaaaa');
      });
      // res.render('newCart', { carts: carts[0].items });
    });
});
// router.get('/:id/delete', (req, res, next) => {
//   let id = req.params.id;
//   let userid = req.user._id;
//   console.log(id, 'deleteeeeeeeeeeeeeee');
//   Cart.findByIdAndUpdate(
//     { owner: userid },
//     { $pull: { 'items._id': id } },
//     (err, cart) => {
//       console.log(cart, 'checkkkkkkkkkkkkkkkkkkkk');
//       if (err) next(err);

//       res.redirect('/carts');
//     }
//   );
// });

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  let userid = req.user._id;
  console.log(id, 'deleteeeeeeeeeeeeeee');
  Cart.findOneAndUpdate(
    { owner: userid },
    { $pull: { items: { _id: id } } },
    (err, cart) => {
      if (err) next(err);
      console.log(cart, 'checkkkkkkkkkkkkkkkkkkkk');
      res.redirect('/carts');
    }
  );
});

router.get('/:id/increment', (req, res, next) => {
  let id = req.params.id;
  let userid = req.user._id;
  Cart.updateOne(
    { owner: userid, 'items._id': id },
    { $inc: { 'items.$.quantity': 1 } },
    (err, carts) => {
      console.log(err);
      res.redirect('/carts');
    }
  );
});
router.get('/:id/decrement', (req, res, next) => {
  let id = req.params.id;
  let userid = req.user._id;
  Cart.updateOne(
    { owner: userid, 'items._id': id },
    { $inc: { 'items.$.quantity': -1 } },
    (err, carts) => {
      console.log(err);
      res.redirect('/carts');
    }
  );
});
module.exports = router;
