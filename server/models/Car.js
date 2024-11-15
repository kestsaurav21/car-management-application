const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // Store image URLs
  tags: [{ type: String }]
});

module.exports = mongoose.model('Car', CarSchema);
