// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const reportRoutes = require('./routes/reportRoutes');

const app = express();

// connect DB
connectDB();

// middlewares
app.use(cors()); // dev: allow all origins. tighten in prod.
app.use(express.json({ limit: '25mb' })); // allow large base64 images
app.use(morgan('dev'));

// simple health
app.get('/', (req, res) => {
  res.send('SevaMitra Authority Backend Running ✅');
});

// routes
app.use('/api/reports', reportRoutes);

// start server
const PORT = process.env.PORT || 5000;
// bind to 0.0.0.0 so external tunnels/forwarders can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`~🚔 Authority backend running on port ${PORT}`);
});