var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema(
  {
    name: String,
    quantity: Number,
    price: Number,
    likes: { type: Number, default: 0 },

    commentId: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    category: [String],
  },
  { timestamps: true }
);

// articleSchema.pre('save', function (next) {
//   let random = Math.floor(Math.random() * 10);
//   let str = this.title.split(' ').join('-').concat(random);
//   this.slug = str;
//   next();
// });
var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

// name of product
// quantity of product
// price of product
// image (optional)
// likes
