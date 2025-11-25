const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  imageUrl: { type: String },
  imageBase64: { type: String },
  status: { type: String, enum: ['open','in_progress','resolved','rejected'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Report', reportSchema);
