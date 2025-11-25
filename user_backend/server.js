// server.js (defensive loader)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connect = require('./config/db');

// require route modules defensively (support CJS and ESM default)
function loadRoute(p) {
  const mod = require(p);
  // if module exported as { default: router } (ESM interop)
  if (mod && (typeof mod === 'object') && mod.default) return mod.default;
  return mod;
}

let authRoutes, reportRoutes, phonebookRoutes;
try {
  authRoutes = loadRoute('./routes/auth');
  reportRoutes = loadRoute('./routes/reports');
  phonebookRoutes = loadRoute('./routes/phonebook');
} catch (err) {
  console.error('Failed to load routes:', err);
  process.exit(1);
}

// sanity checks - ensure these are functions (Express Router is a function)
if (typeof authRoutes !== 'function' && typeof authRoutes !== 'object') {
  console.error('authRoutes is not a valid router. typeof=', typeof authRoutes);
  process.exit(1);
}
if (typeof reportRoutes !== 'function' && typeof reportRoutes !== 'object') {
  console.error('reportRoutes is not a valid router. typeof=', typeof reportRoutes);
  process.exit(1);
}
if (typeof phonebookRoutes !== 'function' && typeof phonebookRoutes !== 'object') {
  console.error('phonebookRoutes is not a valid router. typeof=', typeof phonebookRoutes);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mount routers
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/phonebook', phonebookRoutes);

const PORT = process.env.PORT || 4000;
connect(process.env.MONGO_URI).then(()=>{
  app.listen(PORT, ()=> console.log('Backend-user running on', PORT));
}).catch(err=>{ console.error('DB connect error', err); process.exit(1); });
