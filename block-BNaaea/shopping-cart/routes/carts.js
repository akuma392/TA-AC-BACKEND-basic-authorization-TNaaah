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

      console.log(carts, 'updatedddddddddddddddddddddd', req.user);

      Cart.aggregate([
        {
          $unwind: '$items',
        },
        {
          $lookup: {
            from: 'items', // or products collection, whatever you have
            localField: 'items.itemId',
            foreignField: '_id',
            as: 'item_details',
          },
        },
        {
          $unwind: '$item_details',
        },
        {
          $project: {
            total: { $multiply: ['$item_details.price', '$items.quantity'] },
          },
        },
        {
          $group: {
            _id: '',
            totalValue: { $sum: '$total' },
          },
        },
      ]).exec((err, result) => {
        console.log(err, result, 'tttttttttyyyyyyy');
        if (err) return next(err);
        res.render('newCart', { carts: carts[0].items, result: result });
      });
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
