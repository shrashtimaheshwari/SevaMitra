const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['user','authority','admin'], default: 'user' }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
