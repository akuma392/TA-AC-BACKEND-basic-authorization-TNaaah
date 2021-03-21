var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

router.get('/:id/delete', (req, body) => {
  let id = req.params.id;
  //   Cart.findByIdAndUpdate(id,{ $pull: { itemId: item._id } });
  console.log(id, 'vvvvvvvvvvv', req.params);
});

module.exports = router;
