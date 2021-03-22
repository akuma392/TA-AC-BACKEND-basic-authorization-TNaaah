var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

router.get('/', (req, res, next) => {
  let userid = req.user._id;
  Cart.find({ authorId: userid })
    .populate('itemId')
    .exec((err, carts) => {
      if (err) next(err);

      res.render('userCart', { carts: carts[0].itemId });
    });
});
router.get('/:id/delete', (req, body) => {
  let id = req.params.id;
  console.log(id, 'deleteeeeeeeeeeeeeee');
  Cart.findByIdAndUpdate(id, { $pull: { itemId: item._id } }, (err, cart) => {
    console.log(cart, 'checkkkkkkkkkkkkkkkkkkkk');
    if (err) next(err);

    res.redirect('/carts');
  });
});

module.exports = router;
