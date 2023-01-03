const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  { versionKey: false },
);
module.exports = mongoose.model('token', TokenSchema);
