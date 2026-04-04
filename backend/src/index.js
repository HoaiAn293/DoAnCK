require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const preferencesRoutes = require('./routes/preferences');
const recommendationsRoutes = require('./routes/recommendations');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get server IP
app.get('/api/ip', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  let ip = '127.0.0.1';

  for (const name of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address;
        break;
      }
    }
  }

  res.json({ ip, port: PORT });
});

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to DoAnCK API', version: '1.0.0' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Recipe routes
app.use('/api/recipes', recipesRoutes);

// Preferences routes
app.use('/api/preferences', preferencesRoutes);

// Recommendations routes
app.use('/api/recommendations', recommendationsRoutes);

// Start server - listen on all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth: /api/auth`);
  console.log(`📋 Recipes: /api/recipes`);
  console.log(`⭐ Preferences: /api/preferences`);
  console.log(`💡 Recommendations: /api/recommendations`);
  console.log(`🌐 Available at: http://0.0.0.0:${PORT}`);
});
