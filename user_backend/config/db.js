// config/db.js
const mongoose = require('mongoose');

async function connect(uri) {
  if (!uri) throw new Error('MONGO_URI not provided');
  // recommended options for modern Mongoose
  const opts = {
    // Mongoose 7 uses these defaults; explicit here for clarity
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000, // fail fast
    socketTimeoutMS: 45000,
    family: 4 // IPv4
  };

  try {
    await mongoose.connect(uri, opts);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // surface a slightly nicer error for common problems
    if (err.message && err.message.match(/ENOTFOUND|getaddrinfo/)) {
      console.error('DNS resolution failed for your MongoDB host. Check cluster host and network.');
    }
    throw err;
  }
}

module.exports = connect;
