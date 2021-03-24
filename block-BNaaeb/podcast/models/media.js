var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mediaSchema = new Schema(
  {
    title: { type: String, required: true },

    likes: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    //   enum: ['free', 'vip', 'premium'],
    types: { type: String, default: 'free', enum: ['free', 'vip', 'premium'] },
    file: { type: String },
  },
  { timestamps: true }
);

var Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
