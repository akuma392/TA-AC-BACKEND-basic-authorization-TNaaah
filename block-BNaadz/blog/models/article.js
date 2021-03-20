var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Comment = require('./comment');

var articleSchema = new Schema(
  {
    title: String,
    description: String,
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },

    commentId: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

// articleSchema.pre('save', function (next) {
//   let random = Math.floor(Math.random() * 10);
//   let str = this.title.split(' ').join('-').concat(random);
//   this.slug = str;
//   next();
// });
var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
