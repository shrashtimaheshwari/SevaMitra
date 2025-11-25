// models/Report.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    address: String
  },
  { _id: false }
);


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
  imageMime: { type: String },     // e.g. 'image/png'
  imageData: { type: Buffer },     // binary
  status: { type: String, enum: ['open','in_progress','resolved','rejected'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
